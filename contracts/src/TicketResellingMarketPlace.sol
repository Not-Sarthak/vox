// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
// Enable optimization with low runs value to prioritize deployment size over execution cost
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PaginationLib.sol";
import "./TicketDataLib.sol";

contract TicketResellingMarketPlace is Ownable {
    using SafeERC20 for IERC20;
    using PaginationLib for uint256[];
    using TicketDataLib for TicketDataLib.Ticket;
    using TicketDataLib for TicketDataLib.Auction;

    event TicketListed(
        uint256 indexed ticketId,
        address indexed seller,
        uint256 price,
        uint256 quantity,
        address paymentToken
    );
    event TicketUnlisted(uint256 indexed ticketId, address indexed seller);
    event TicketPurchased(
        uint256 indexed ticketId,
        address indexed buyer,
        address indexed seller,
        uint256 quantity,
        uint256 totalPrice,
        address paymentToken
    );
    event BidPlaced(
        uint256 indexed ticketId,
        address indexed bidder,
        uint256 bidAmount,
        address paymentToken
    );
    event BidAccepted(
        uint256 indexed ticketId,
        address indexed winner,
        uint256 winningBid,
        address paymentToken
    );
    event BidRefunded(
        uint256 indexed ticketId,
        address indexed bidder,
        uint256 bidAmount,
        address paymentToken
    );
    event BidWithdrawn(
        uint256 indexed ticketId,
        address indexed bidder,
        uint256 bidAmount,
        address paymentToken
    );
    event PlatformFeeCollected(
        uint256 indexed ticketId,
        uint256 feeAmount,
        address paymentToken
    );
    event TokenWhitelisted(address indexed token, bool status);

    error InvalidValue();
    error InvalidTime();
    error TicketAlreadyExists();
    error EventDoesNotExist();
    error AuctionTooLong();
    error NotTicketOwner();
    error TicketNotFound();
    error TicketAlreadySold();
    error InsufficientFunds();
    error InvalidQuantity();
    error NotAnAuction();
    error AuctionNotActive();
    error BidTooLow();
    error AuctionEnded();
    error AuctionNotEnded();
    error NoBidsPlaced();
    error TransferFailed();
    error NoBidToWithdraw();
    error HighestBidderCannotWithdraw();
    error TokenNotWhitelisted();
    error InvalidPaymentMethod();
    error TokenTransferFailed();

    enum TicketStatus {
        Inactive,
        Active,
        Sold
    }
    enum AuctionStatus {
        Inactive,
        Active,
        Ended
    }
    
    struct EventDetails {
        string name;
        string description;
        string location;
        string imageURL;
        uint256 date;
    }

    struct Ticket {
        uint256 id;
        address owner;
        address seller;
        uint256 price;
        uint256 quantity;
        uint256 sold;
        TicketStatus status;
        EventDetails eventDetails;
        address paymentToken;
    }

    struct Auction {
        bool isAuction;
        uint256 startTime;
        uint256 endTime;
        uint256 highestBid;
        address highestBidder;
        AuctionStatus status;
        address paymentToken;
    }

    struct Bid {
        uint256 amount;
        address paymentToken;
    }

    address public constant ETH_ADDRESS = address(0);

    uint256 public constant PLATFORM_FEE_PERCENTAGE = 2;
    uint256 public platformFeeBalance;

    uint256 public nextTicketId = 1;

    mapping(address => uint256) public tokenFeeBalances;
    mapping(address => bool) public whitelistedTokens;
    mapping(uint256 => TicketDataLib.Ticket) public tickets;
    mapping(uint256 => TicketDataLib.Auction) public auctions;
    mapping(uint256 => address) public ticketOwners;
    mapping(address => uint256[]) public ownedTickets;
    mapping(uint256 => bool) public eventExists;
    mapping(uint256 => mapping(address => TicketDataLib.Bid)) public bids;

    constructor() Ownable(msg.sender) {
        whitelistedTokens[ETH_ADDRESS] = true;
        emit TokenWhitelisted(ETH_ADDRESS, true);
    }

    /**
     * @notice Add or remove a token from the whitelist
     * @param _token The token address to whitelist
     * @param _status Whether to whitelist (true) or de-whitelist (false)
     */
    function setTokenWhitelisted(address _token, bool _status) external onlyOwner {
        whitelistedTokens[_token] = _status;
        emit TokenWhitelisted(_token, _status);
    }

    /**
     * @notice Calculate platform fee for a given amount
     * @param _amount The amount to calculate fee for
     * @return The fee amount
     */
    function calculatePlatformFee(uint256 _amount) public pure returns (uint256) {
        return TicketDataLib.calculatePlatformFee(_amount, PLATFORM_FEE_PERCENTAGE);
    }

    /**
     * @notice Withdraw platform fees for ETH, only callable by platform owner
     */
    function withdrawPlatformFees() external onlyOwner {
        uint256 amount = platformFeeBalance;
        platformFeeBalance = 0;

        (bool success, ) = owner().call{value: amount}("");
        if (!success) {
            revert TransferFailed();
        }
    }

    /**
     * @notice Withdraw platform fees for a specific token, only callable by platform owner
     * @param _token The token address to withdraw fees for
     */
    function withdrawTokenFees(address _token) external onlyOwner {
        if (_token == ETH_ADDRESS) {
            revert InvalidPaymentMethod();
        }

        uint256 amount = tokenFeeBalances[_token];
        tokenFeeBalances[_token] = 0;

        IERC20(_token).safeTransfer(owner(), amount);
    }

    /**
     * @notice Lists a new ticket for sale with event details
     * @param _price The price of each ticket
     * @param _quantity The number of tickets available
     * @param _eventName The name of the event
     * @param _eventDescription The description of the event
     * @param _eventLocation The location of the event
     * @param _eventDate The date of the event (as timestamp)
     * @param _paymentToken The token address to accept as payment (address(0) for ETH)
     * @param _isAuction Whether this is an auction
     * @param _auctionStartTime Start time for auction (0 if not an auction)
     * @param _auctionEndTime End time for auction (0 if not an auction)
     */
    function listTicket(
        uint256 _price,
        uint256 _quantity,
        string memory _eventName,
        string memory _eventDescription,
        string memory _eventLocation,
        string memory _eventImageURL,
        uint256 _eventDate,
        address _paymentToken,
        bool _isAuction,
        uint256 _auctionStartTime,
        uint256 _auctionEndTime
    ) external returns (uint256) {
        if (_price == 0 || _quantity == 0) {
            revert InvalidValue();
        }

        if (_eventDate < block.timestamp) {
            revert InvalidTime();
        }

        if (!whitelistedTokens[_paymentToken]) {
            revert TokenNotWhitelisted();
        }

        if (_isAuction) {
            if (_auctionStartTime < block.timestamp) {
                revert InvalidTime();
            }

            if (_auctionEndTime <= _auctionStartTime) {
                revert InvalidTime();
            }

            if (_auctionEndTime > block.timestamp + 30 days) {
                revert AuctionTooLong();
            }

            if (_auctionEndTime > _eventDate) {
                revert InvalidTime();
            }
        }

        uint256 ticketId = nextTicketId++;

        tickets[ticketId] = TicketDataLib.Ticket({
            id: ticketId,
            owner: msg.sender,
            seller: msg.sender,
            price: _price,
            quantity: _quantity,
            sold: 0,
            status: TicketDataLib.TicketStatus.Active,
            eventDetails: TicketDataLib.EventDetails({
                name: _eventName,
                description: _eventDescription,
                imageURL: _eventImageURL,
                location: _eventLocation,
                date: _eventDate
            }),
            paymentToken: _paymentToken
        });

        if (_isAuction) {
            auctions[ticketId] = TicketDataLib.Auction({
                isAuction: true,
                startTime: _auctionStartTime,
                endTime: _auctionEndTime,
                highestBid: 0,
                highestBidder: address(0),
                status: TicketDataLib.AuctionStatus.Inactive,
                paymentToken: _paymentToken
            });
        }

        ticketOwners[ticketId] = msg.sender;
        ownedTickets[msg.sender].push(ticketId);

        emit TicketListed(ticketId, msg.sender, _price, _quantity, _paymentToken);

        return ticketId;
    }

    /**
     * @notice Unlists a ticket from sale, can only be called by the ticket owner
     * @param _ticketId The ID of the ticket to unlist
     */
    function unlistTicket(uint256 _ticketId) external {
        if (_ticketId >= nextTicketId) {
            revert TicketNotFound();
        }

        TicketDataLib.Ticket storage ticket = tickets[_ticketId];

        if (ticket.owner != msg.sender) {
            revert NotTicketOwner();
        }

        if (ticket.status != TicketDataLib.TicketStatus.Active) {
            revert TicketNotFound();
        }

        if (ticket.sold > 0) {
            revert TicketAlreadySold();
        }

        ticket.status = TicketDataLib.TicketStatus.Inactive;

        if (auctions[_ticketId].isAuction) {
            if (auctions[_ticketId].highestBid > 0) {
                revert TicketAlreadySold();
            }

            auctions[_ticketId].status = TicketDataLib.AuctionStatus.Ended;
        }

        uint256[] storage ownerTickets = ownedTickets[msg.sender];
        for (uint256 i = 0; i < ownerTickets.length; i++) {
            if (ownerTickets[i] == _ticketId) {
                ownerTickets[i] = ownerTickets[ownerTickets.length - 1];
                ownerTickets.pop();
                break;
            }
        }

        delete ticketOwners[_ticketId];

        emit TicketUnlisted(_ticketId, msg.sender);
    }

    /**
     * @notice Buy tickets directly with ETH (non-auction)
     * @param _ticketId The ID of the ticket to buy
     * @param _quantity The number of tickets to buy
     */
    function buyTicket(uint256 _ticketId, uint256 _quantity) external payable {
        TicketDataLib.Ticket storage ticket = tickets[_ticketId];
        
        if (_ticketId >= nextTicketId || ticket.status != TicketDataLib.TicketStatus.Active) {
            revert TicketNotFound();
        }
        
        if (auctions[_ticketId].isAuction) {
            revert NotAnAuction();
        }
        
        if (ticket.paymentToken != ETH_ADDRESS) {
            revert InvalidPaymentMethod();
        }
        
        if (_quantity == 0 || _quantity > ticket.quantity - ticket.sold) {
            revert InvalidQuantity();
        }
        
        uint256 totalPrice = ticket.price * _quantity;
        
        if (msg.value < totalPrice) {
            revert InsufficientFunds();
        }
        
        _processPurchase(ticket, _ticketId, _quantity, totalPrice);
        
        uint256 excess = msg.value - totalPrice;
        if (excess > 0) {
            (bool refundSuccess, ) = msg.sender.call{value: excess}("");
            if (!refundSuccess) {
                revert TransferFailed();
            }
        }
    }

    /**
     * @notice Buy tickets with ERC20 tokens (non-auction)
     * @param _ticketId The ID of the ticket to buy
     * @param _quantity The number of tickets to buy
     */
    function buyTicketWithToken(uint256 _ticketId, uint256 _quantity) external {
        TicketDataLib.Ticket storage ticket = tickets[_ticketId];
        
        if (_ticketId >= nextTicketId || ticket.status != TicketDataLib.TicketStatus.Active) {
            revert TicketNotFound();
        }
        
        if (auctions[_ticketId].isAuction) {
            revert NotAnAuction();
        }
        
        if (ticket.paymentToken == ETH_ADDRESS) {
            revert InvalidPaymentMethod();
        }
        
        if (_quantity == 0 || _quantity > ticket.quantity - ticket.sold) {
            revert InvalidQuantity();
        }
        
        uint256 totalPrice = ticket.price * _quantity;
        
        IERC20 token = IERC20(ticket.paymentToken);
        
        if (token.allowance(msg.sender, address(this)) < totalPrice || 
            token.balanceOf(msg.sender) < totalPrice) {
            revert InsufficientFunds();
        }
        
        _processPurchase(ticket, _ticketId, _quantity, totalPrice);
        
        token.safeTransferFrom(msg.sender, address(this), totalPrice);
    }
    
    /**
     * @notice Internal function to process a ticket purchase
     */
    function _processPurchase(
        TicketDataLib.Ticket storage _ticket, 
        uint256 _ticketId, 
        uint256 _quantity, 
        uint256 _totalPrice
    ) internal {
        _ticket.sold += _quantity;
        
        if (_ticket.sold == _ticket.quantity) {
            _ticket.status = TicketDataLib.TicketStatus.Sold;
        }
        
        uint256 platformFee = calculatePlatformFee(_totalPrice);
        uint256 sellerAmount = _totalPrice - platformFee;
        
        if (_ticket.paymentToken == ETH_ADDRESS) {
            platformFeeBalance += platformFee;

            (bool success, ) = _ticket.seller.call{value: sellerAmount}("");
            if (!success) {
                revert TransferFailed();
            }
        } else {
            tokenFeeBalances[_ticket.paymentToken] += platformFee;
            
            IERC20 token = IERC20(_ticket.paymentToken);
            token.safeTransfer(_ticket.seller, sellerAmount);
        }
        
        bool alreadyOwns = false;
        for (uint256 i = 0; i < ownedTickets[msg.sender].length; i++) {
            if (ownedTickets[msg.sender][i] == _ticketId) {
                alreadyOwns = true;
                break;
            }
        }
        
        if (!alreadyOwns) {
            ownedTickets[msg.sender].push(_ticketId);
        }
        
        emit TicketPurchased(_ticketId, msg.sender, _ticket.seller, _quantity, _totalPrice, _ticket.paymentToken);
        emit PlatformFeeCollected(_ticketId, platformFee, _ticket.paymentToken);
    }
    
    /**
     * @notice Place a bid on an auction ticket with ETH
     * @param _ticketId The ID of the ticket to bid on
     */
    function placeBid(uint256 _ticketId) external payable {
        TicketDataLib.Ticket storage ticket = tickets[_ticketId];
        TicketDataLib.Auction storage auction = auctions[_ticketId];
        
        if (_ticketId >= nextTicketId || ticket.status != TicketDataLib.TicketStatus.Active) {
            revert TicketNotFound();
        }
        
        if (!auction.isAuction) {
            revert NotAnAuction();
        }
        
        if (auction.paymentToken != ETH_ADDRESS) {
            revert InvalidPaymentMethod();
        }
        
        _processBid(ticket, auction, _ticketId, msg.value);
    }
    
    /**
     * @notice Place a bid on an auction ticket with ERC20 tokens
     * @param _ticketId The ID of the ticket to bid on
     * @param _bidAmount The amount to bid
     */
    function placeBidWithToken(uint256 _ticketId, uint256 _bidAmount) external {
        TicketDataLib.Ticket storage ticket = tickets[_ticketId];
        TicketDataLib.Auction storage auction = auctions[_ticketId];
        
        if (_ticketId >= nextTicketId || ticket.status != TicketDataLib.TicketStatus.Active) {
            revert TicketNotFound();
        }
        
        if (!auction.isAuction) {
            revert NotAnAuction();
        }
        
        if (auction.paymentToken == ETH_ADDRESS) {
            revert InvalidPaymentMethod();
        }
        
        IERC20 token = IERC20(auction.paymentToken);
        if (token.allowance(msg.sender, address(this)) < _bidAmount || 
            token.balanceOf(msg.sender) < _bidAmount) {
            revert InsufficientFunds();
        }
        
        _processBid(ticket, auction, _ticketId, _bidAmount);
        
        token.safeTransferFrom(msg.sender, address(this), _bidAmount);
    }
    
    /**
     * @notice Internal function to process a bid
     */
    function _processBid(
        TicketDataLib.Ticket storage _ticket,
        TicketDataLib.Auction storage _auction,
        uint256 _ticketId,
        uint256 _bidAmount
    ) internal {
        if (block.timestamp < _auction.startTime) {
            revert AuctionNotActive();
        }
        
        if (block.timestamp > _auction.endTime) {
            revert AuctionEnded();
        }
        
        if (_auction.status == TicketDataLib.AuctionStatus.Inactive) {
            _auction.status = TicketDataLib.AuctionStatus.Active;
        }
        
        if (_bidAmount <= _auction.highestBid) {
            revert BidTooLow();
        }
        
        address previousBidder = _auction.highestBidder;
        uint256 previousBid = _auction.highestBid;
        
        bids[_ticketId][msg.sender] = TicketDataLib.Bid({
            amount: _bidAmount,
            paymentToken: _auction.paymentToken
        });
        
        _auction.highestBid = _bidAmount;
        _auction.highestBidder = msg.sender;
        
        if (previousBidder != address(0) && previousBid > 0) {
            if (_auction.paymentToken == ETH_ADDRESS) {
                (bool success, ) = previousBidder.call{value: previousBid}("");
                if (!success) {
                    revert TransferFailed();
                }
            } else {
                IERC20 token = IERC20(_auction.paymentToken);
                token.safeTransfer(previousBidder, previousBid);
            }
            
            emit BidRefunded(_ticketId, previousBidder, previousBid, _auction.paymentToken);
        }
        
        emit BidPlaced(_ticketId, msg.sender, _bidAmount, _auction.paymentToken);
    }
    
    /**
     * @notice Withdraw a bid from an auction
     * @param _ticketId The ID of the ticket to withdraw bid from
     */
    function withdrawBid(uint256 _ticketId) external {
        if (_ticketId >= nextTicketId) {
            revert TicketNotFound();
        }
        
        TicketDataLib.Auction storage auction = auctions[_ticketId];
        
        if (!auction.isAuction) {
            revert NotAnAuction();
        }
        
        if (block.timestamp > auction.endTime) {
            revert AuctionEnded();
        }
        
        TicketDataLib.Bid storage bid = bids[_ticketId][msg.sender];
        if (bid.amount == 0) {
            revert NoBidToWithdraw();
        }
        
        if (msg.sender == auction.highestBidder) {
            revert HighestBidderCannotWithdraw();
        }
        
        uint256 bidAmount = bid.amount;
        address paymentToken = bid.paymentToken;
        
        delete bids[_ticketId][msg.sender];
        
        if (paymentToken == ETH_ADDRESS) {
            (bool success, ) = msg.sender.call{value: bidAmount}("");
            if (!success) {
                revert TransferFailed();
            }
        } else {
            IERC20 token = IERC20(paymentToken);
            token.safeTransfer(msg.sender, bidAmount);
        }
        
        emit BidWithdrawn(_ticketId, msg.sender, bidAmount, paymentToken);
    }
    
    /**
     * @notice Accept the highest bid and transfer ticket ownership
     * @param _ticketId The ID of the ticket to accept bid for
     */
    function acceptHighestBid(uint256 _ticketId) external {
        if (_ticketId >= nextTicketId) {
            revert TicketNotFound();
        }
        
        TicketDataLib.Ticket storage ticket = tickets[_ticketId];
        TicketDataLib.Auction storage auction = auctions[_ticketId];
        
        if (ticket.owner != msg.sender) {
            revert NotTicketOwner();
        }

        if (!auction.isAuction) {
            revert NotAnAuction();
        }
        
        if (block.timestamp < auction.endTime) {
            revert AuctionNotEnded();
        }
        
        if (auction.highestBidder == address(0)) {
            revert NoBidsPlaced();
        }

        ticket.status = TicketDataLib.TicketStatus.Sold;
        ticket.sold = ticket.quantity;
        
        auction.status = TicketDataLib.AuctionStatus.Ended;
        
        address previousOwner = ticket.owner;
        ticket.owner = auction.highestBidder;
        
        ticketOwners[_ticketId] = auction.highestBidder;
        
        uint256[] storage previousOwnerTickets = ownedTickets[previousOwner];
        for (uint256 i = 0; i < previousOwnerTickets.length; i++) {
            if (previousOwnerTickets[i] == _ticketId) {
                previousOwnerTickets[i] = previousOwnerTickets[previousOwnerTickets.length - 1];
                previousOwnerTickets.pop();
                break;
            }
        }
        
        ownedTickets[auction.highestBidder].push(_ticketId);
        
        uint256 platformFee = calculatePlatformFee(auction.highestBid);
        uint256 sellerAmount = auction.highestBid - platformFee;
        
        if (auction.paymentToken == ETH_ADDRESS) {
            platformFeeBalance += platformFee;

            (bool success, ) = msg.sender.call{value: sellerAmount}("");
            if (!success) {
                revert TransferFailed();
            }
        } else {
            tokenFeeBalances[auction.paymentToken] += platformFee;
            
            IERC20 token = IERC20(auction.paymentToken);
            token.safeTransfer(msg.sender, sellerAmount);
        }
        
        emit BidAccepted(_ticketId, auction.highestBidder, auction.highestBid, auction.paymentToken);
        emit PlatformFeeCollected(_ticketId, platformFee, auction.paymentToken);
    }

    /**
     * @notice Receive function to accept ETH
     */
    receive() external payable {}

    /**
     * @notice Set token fee balance for testing purposes
     * @param token The token address to set fee balance for
     * @param amount The amount to set
     */
    function setTokenFeeBalance(address token, uint256 amount) external onlyOwner {
        tokenFeeBalances[token] = amount;
    }
    
    /**
     * @notice Update ticket for testing purposes
     * @param ticketId The ID of the ticket to update
     * @param quantity The quantity to add to sold
     */
    function updateTicketForTest(uint256 ticketId, uint256 quantity) external onlyOwner {
        TicketDataLib.Ticket storage ticket = tickets[ticketId];
        ticket.sold += quantity;
        
        if (ticket.sold == ticket.quantity) {
            ticket.status = TicketDataLib.TicketStatus.Sold;
        }
    }

    // ==================== GETTER FUNCTIONS ====================

    /**
     * @notice Get the total number of tickets created
     * @return The next ticket ID minus 1
     */
    function getTotalTickets() external view returns (uint256) {
        return nextTicketId - 1;
    }

    /**
     * @notice Get all tickets owned by an address
     * @param owner The address to check
     * @return An array of ticket IDs owned by the address
     */
    function getTicketsByOwner(address owner) external view returns (uint256[] memory) {
        return ownedTickets[owner];
    }

    /**
     * @notice Get basic information about a ticket
     * @param ticketId The ID of the ticket
     * @return id The ticket ID
     * @return owner The ticket owner
     * @return seller The ticket seller
     * @return price The ticket price
     * @return quantity The total quantity
     * @return sold The number sold
     * @return status The ticket status
     */
    function getTicketBasicInfo(uint256 ticketId) external view returns (
        uint256 id,
        address owner,
        address seller,
        uint256 price,
        uint256 quantity,
        uint256 sold,
        TicketDataLib.TicketStatus status
    ) {
        TicketDataLib.Ticket storage ticket = tickets[ticketId];
        return (
            ticket.id,
            ticket.owner,
            ticket.seller,
            ticket.price,
            ticket.quantity,
            ticket.sold,
            ticket.status
        );
    }

    /**
     * @notice Get event details for a ticket
     * @param ticketId The ID of the ticket
     * @return eventName The event name
     * @return eventDescription The event description
     * @return eventLocation The event location
     * @return eventImageURL The event image URL
     * @return eventDate The event date
     * @return paymentToken The payment token address
     */
    function getTicketEventDetails(uint256 ticketId) external view returns (
        string memory eventName,
        string memory eventDescription,
        string memory eventLocation,
        string memory eventImageURL,
        uint256 eventDate,
        address paymentToken
    ) {
        TicketDataLib.Ticket storage ticket = tickets[ticketId];
        return (
            ticket.eventDetails.name,
            ticket.eventDetails.description,
            ticket.eventDetails.location,
            ticket.eventDetails.imageURL,
            ticket.eventDetails.date,
            ticket.paymentToken
        );
    }

    /**
     * @notice Get detailed information about an auction
     * @param ticketId The ID of the ticket with the auction
     * @return isAuction Whether it's an auction
     * @return startTime The auction start time
     * @return endTime The auction end time
     * @return highestBid The highest bid amount
     * @return highestBidder The highest bidder address
     * @return status The auction status
     * @return paymentToken The payment token address
     */
    function getAuctionDetails(uint256 ticketId) external view returns (
        bool isAuction,
        uint256 startTime,
        uint256 endTime,
        uint256 highestBid,
        address highestBidder,
        TicketDataLib.AuctionStatus status,
        address paymentToken
    ) {
        TicketDataLib.Auction storage auction = auctions[ticketId];
        return (
            auction.isAuction,
            auction.startTime,
            auction.endTime,
            auction.highestBid,
            auction.highestBidder,
            auction.status,
            auction.paymentToken
        );
    }

    /**
     * @notice Get bid information for a user on a ticket
     * @param ticketId The ID of the ticket
     * @param bidder The address of the bidder
     * @return amount The bid amount
     * @return paymentToken The payment token address
     */
    function getBidDetails(uint256 ticketId, address bidder) external view returns (
        uint256 amount,
        address paymentToken
    ) {
        TicketDataLib.Bid storage bid = bids[ticketId][bidder];
        return (
            bid.amount,
            bid.paymentToken
        );
    }

    /**
     * @notice Check if a token is whitelisted
     * @param token The token address to check
     * @return Whether the token is whitelisted
     */
    function isTokenWhitelisted(address token) external view returns (bool) {
        return whitelistedTokens[token];
    }

    /**
     * @notice Get the token fee balance for a specific token
     * @param token The token address to check
     * @return The fee balance for the token
     */
    function getTokenFeeBalance(address token) external view returns (uint256) {
        return tokenFeeBalances[token];
    }

    /**
     * @notice Get all active tickets (paginated)
     * @param offset The starting index
     * @param limit The maximum number of tickets to return
     * @return An array of ticket IDs that are active
     */
    function getActiveTickets(uint256 offset, uint256 limit) external view returns (uint256[] memory) {
        (uint256 resultSize, uint256[] memory result) = PaginationLib.preparePagination(nextTicketId - 1, offset, limit);
        if (resultSize == 0) return result;

        uint256 count = 0;
        uint256 totalTickets = nextTicketId - 1;

        for (uint256 i = offset + 1; i <= totalTickets && count < limit; i++) {
            if (tickets[i].status == TicketDataLib.TicketStatus.Active) {
                result[count++] = i;
            }
        }

        return count < resultSize ? PaginationLib.resizeArray(result, count) : result;
    }

    /**
     * @notice Get all active auctions (paginated)
     * @param offset The starting index
     * @param limit The maximum number of auctions to return
     * @return An array of ticket IDs with active auctions
     */
    function getActiveAuctions(uint256 offset, uint256 limit) external view returns (uint256[] memory) {
        (uint256 resultSize, uint256[] memory result) = PaginationLib.preparePagination(nextTicketId - 1, offset, limit);
        if (resultSize == 0) return result;

        uint256 count = 0;
        uint256 totalTickets = nextTicketId - 1;

        for (uint256 i = offset + 1; i <= totalTickets && count < limit; i++) {
            if (auctions[i].isAuction && auctions[i].status == TicketDataLib.AuctionStatus.Active) {
                result[count++] = i;
            }
        }

        return count < resultSize ? PaginationLib.resizeArray(result, count) : result;
    }

    /**
     * @notice Get all tickets by a specific seller (paginated)
     * @param seller The address of the seller
     * @param offset The starting index
     * @param limit The maximum number of tickets to return
     * @return An array of ticket IDs listed by the seller
     */
    function getTicketsBySeller(address seller, uint256 offset, uint256 limit) external view returns (uint256[] memory) {
        (uint256 resultSize, uint256[] memory result) = PaginationLib.preparePagination(nextTicketId - 1, offset, limit);
        if (resultSize == 0) return result;

        uint256 count = 0;
        uint256 totalTickets = nextTicketId - 1;

        for (uint256 i = offset + 1; i <= totalTickets && count < limit; i++) {
            if (tickets[i].seller == seller) {
                result[count++] = i;
            }
        }

        return count < resultSize ? PaginationLib.resizeArray(result, count) : result;
    }

    /**
     * @notice Get all tickets for a specific event (paginated)
     * @param eventName The name of the event
     * @param offset The starting index
     * @param limit The maximum number of tickets to return
     * @return An array of ticket IDs for the event
     */
    function getTicketsByEvent(string memory eventName, uint256 offset, uint256 limit) external view returns (uint256[] memory) {
        (uint256 resultSize, uint256[] memory result) = PaginationLib.preparePagination(nextTicketId - 1, offset, limit);
        if (resultSize == 0) return result;

        uint256 count = 0;
        uint256 totalTickets = nextTicketId - 1;
        bytes32 nameHash = keccak256(bytes(eventName));

        for (uint256 i = offset + 1; i <= totalTickets && count < limit; i++) {
            if (keccak256(bytes(tickets[i].eventDetails.name)) == nameHash) {
                result[count++] = i;
            }
        }

        return count < resultSize ? PaginationLib.resizeArray(result, count) : result;
    }

    /**
     * @notice Get all tickets with a specific payment token (paginated)
     * @param paymentToken The address of the payment token
     * @param offset The starting index
     * @param limit The maximum number of tickets to return
     * @return An array of ticket IDs with the specified payment token
     */
    function getTicketsByPaymentToken(address paymentToken, uint256 offset, uint256 limit) external view returns (uint256[] memory) {
        (uint256 resultSize, uint256[] memory result) = PaginationLib.preparePagination(nextTicketId - 1, offset, limit);
        if (resultSize == 0) return result;

        uint256 count = 0;
        uint256 totalTickets = nextTicketId - 1;

        for (uint256 i = offset + 1; i <= totalTickets && count < limit; i++) {
            if (tickets[i].paymentToken == paymentToken) {
                result[count++] = i;
            }
        }

        return count < resultSize ? PaginationLib.resizeArray(result, count) : result;
    }

    /**
     * @notice Get all tickets with a price below a certain threshold (paginated)
     * @param maxPrice The maximum price threshold
     * @param paymentToken The token to filter by (address(0) for ETH)
     * @param offset The starting index
     * @param limit The maximum number of tickets to return
     * @return An array of ticket IDs with prices below the threshold
     */
    function getTicketsByMaxPrice(uint256 maxPrice, address paymentToken, uint256 offset, uint256 limit) external view returns (uint256[] memory) {
        (uint256 resultSize, uint256[] memory result) = PaginationLib.preparePagination(nextTicketId - 1, offset, limit);
        if (resultSize == 0) return result;

        uint256 count = 0;
        uint256 totalTickets = nextTicketId - 1;

        for (uint256 i = offset + 1; i <= totalTickets && count < limit; i++) {
            if (tickets[i].paymentToken == paymentToken && 
                tickets[i].price <= maxPrice && 
                tickets[i].status == TicketDataLib.TicketStatus.Active) {
                result[count++] = i;
            }
        }

        return count < resultSize ? PaginationLib.resizeArray(result, count) : result;
    }

    /**
     * @notice Get all auctions ending soon (paginated)
     * @param timeThreshold The time threshold in seconds (e.g., 24 hours)
     * @param offset The starting index
     * @param limit The maximum number of auctions to return
     * @return An array of ticket IDs with auctions ending within the threshold
     */
    function getAuctionsEndingSoon(uint256 timeThreshold, uint256 offset, uint256 limit) external view returns (uint256[] memory) {
        (uint256 resultSize, uint256[] memory result) = PaginationLib.preparePagination(nextTicketId - 1, offset, limit);
        if (resultSize == 0) return result;

        uint256 count = 0;
        uint256 totalTickets = nextTicketId - 1;
        uint256 thresholdTime = block.timestamp + timeThreshold;

        for (uint256 i = offset + 1; i <= totalTickets && count < limit; i++) {
            if (auctions[i].isAuction && 
                auctions[i].status == TicketDataLib.AuctionStatus.Active && 
                auctions[i].endTime <= thresholdTime && 
                auctions[i].endTime > block.timestamp) {
                result[count++] = i;
            }
        }

        return count < resultSize ? PaginationLib.resizeArray(result, count) : result;
    }
}