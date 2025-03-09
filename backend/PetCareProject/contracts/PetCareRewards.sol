// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract PetCareRewards {
    IERC20 public dummyToken;
    address public reserveWallet;
    uint256 public rewardAmount = 5e16; // 0.05 ETN (with 18 decimals)

    event RewardIssued(address indexed user, uint256 amount);

    constructor(address _dummyToken, address _reserveWallet) {
        dummyToken = IERC20(_dummyToken);
        reserveWallet = _reserveWallet;
    }

    function rewardUser(address user) external {
        // The reserve wallet must approve this contract for token spending
        require(dummyToken.transferFrom(reserveWallet, user, rewardAmount), "Token transfer failed");
        emit RewardIssued(user, rewardAmount);
    }
}
