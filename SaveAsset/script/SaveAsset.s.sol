// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {SaveAsset} from "../src/SaveAsset.sol";

contract SaveAssetScript is Script {
    SaveAsset public saveAsset;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        saveAsset = new SaveAsset(address(0xf63Fb360FaCdB3eB9A228a56E767d06Cac8FC25e));

        vm.stopBroadcast();
    }
}
