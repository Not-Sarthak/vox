// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @title TicketDataLib
 * @notice Library for ticket data structures and related functions
 */
library TicketDataLib {
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
    
    /**
     * @notice Calculate platform fee for a given amount
     * @param _amount The amount to calculate fee for
     * @param _feePercentage The fee percentage (e.g., 2 for 2%)
     * @return The fee amount
     */
    function calculatePlatformFee(uint256 _amount, uint256 _feePercentage) internal pure returns (uint256) {
        return (_amount * _feePercentage) / 100;
    }
    
    /**
     * @notice Check if an auction is active
     * @param auction The auction to check
     * @param currentTime The current timestamp
     * @return Whether the auction is active
     */
    function isAuctionActive(Auction storage auction, uint256 currentTime) internal view returns (bool) {
        return auction.isAuction && 
               auction.status == AuctionStatus.Active && 
               currentTime >= auction.startTime && 
               currentTime <= auction.endTime;
    }
    
    /**
     * @notice Check if an auction has ended
     * @param auction The auction to check
     * @param currentTime The current timestamp
     * @return Whether the auction has ended
     */
    function hasAuctionEnded(Auction storage auction, uint256 currentTime) internal view returns (bool) {
        return auction.isAuction && currentTime > auction.endTime;
    }
} 