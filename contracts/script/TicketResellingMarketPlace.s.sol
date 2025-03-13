// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import "../src/TicketResellingMarketPlace.sol";

contract TicketResellingMarketPlaceScript is Script {
    TicketResellingMarketPlace public ticketResellingMarketPlace;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        ticketResellingMarketPlace = new TicketResellingMarketPlace();

        vm.stopBroadcast();
    }
}
