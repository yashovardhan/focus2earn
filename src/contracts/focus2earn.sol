// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FocusTokenEx is ERC20 {
    constructor() ERC20("Focus Token", "FTX") {
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Mint 1,000,000 tokens to the deployer
    }
}

contract Focus2Earn {
    FocusTokenEx public rewardToken; // ERC20 token used for rewards
    uint256 public initialReward = 100 * 10 ** 18; // Initial reward (100 tokens)
    uint256 public rewardRatePerSecond = 1 * 10 ** 18; // Reward rate in tokens per second
    uint256 public totalRewardsClaimed = 0; // Total rewards claimed by all users

    mapping(address => bool) public hasClaimed; // Tracks if a user has claimed their initial reward

    struct User {
        uint256 deposit; // current deposit
        uint256 startTime; // start time
        uint256 unclaimedRewards; // rewards left to be claimed
        uint256 totalClaimedRewards; // rewards already claimed
        uint256 minimumTimeToFocus;  // Minimum time user must spend focusing
    }

    mapping(address => User) public users;

    constructor(FocusTokenEx _rewardToken) {
        rewardToken = _rewardToken;
    }

    // Allow users to claim initial tokens (only once)
    function claimInitialReward() external {
        require(!hasClaimed[msg.sender], "Initial reward already claimed");
        rewardToken.transfer(msg.sender, initialReward);
        hasClaimed[msg.sender] = true;
    }

    // Start focusing by staking tokens (after claiming the reward)
    function startFocus(uint256 depositAmount, uint256 minimumTime) external {
        require(depositAmount > 0, "Deposit must be greater than 0");
        require(minimumTime > 0, "Minimum focus time must be greater than 0"); 

        // Transfer tokens from user to the contract
        rewardToken.transferFrom(msg.sender, address(this), depositAmount);

        // Start the focus session
        users[msg.sender].deposit = depositAmount;
        users[msg.sender].startTime = block.timestamp;
        users[msg.sender].minimumTimeToFocus = minimumTime;
    }

    // Stop focusing and calculate unclaimed rewards based on focus time
    function stopFocus() external {
        User storage user = users[msg.sender];
        require(user.deposit > 0, "No active focus session");

        // Calculate focus time in seconds
        uint256 focusTime = block.timestamp - user.startTime;
        require(focusTime > 0, "Focus time should be greater than 0");

        if (focusTime >= user.minimumTimeToFocus) {
            // Accumulate rewards based on focus time
            uint256 rewards = focusTime * rewardRatePerSecond;
            user.unclaimedRewards += rewards;
        } else {
            // Penalize the user by not granting rewards or returning their deposit
            user.unclaimedRewards = 0;  // No rewards
        }

        // Reset user deposit and focus time
        user.deposit = 0;
        user.startTime = 0;
        user.minimumTimeToFocus = 0;
    }

    // Function to claim rewards
    function claimRewards() external {
        User storage user = users[msg.sender];
        require(user.unclaimedRewards > 0, "No rewards to claim");

        // Transfer unclaimed rewards to the user
        rewardToken.transfer(msg.sender, user.unclaimedRewards);

        // Update user's total claimed rewards
        user.totalClaimedRewards += user.unclaimedRewards;
        totalRewardsClaimed += user.unclaimedRewards;

        // Reset unclaimed rewards
        user.unclaimedRewards = 0;
    }
}