// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RewardToken is ERC20 {
    uint256 public INITIAL_SUPPLY = 10000000 * (10 ** 18); // Set 18 decimals directly

    constructor() public {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
