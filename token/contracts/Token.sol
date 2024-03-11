// contracts/Token.sol
// Advanced Secure Token contract for testing purposes

// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Token is ERC20, Pausable, ReentrancyGuard {
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event TokensPaused(bool paused);
    event DividendPaid(address indexed to, uint256 amount);
    event VestingScheduled(address indexed beneficiary, uint256 amount, uint256 start, uint256 cliff, uint256 duration);

    mapping(address => uint256) private dividends;
    mapping(address => VestingSchedule) private vestingSchedules;

    struct VestingSchedule {
        uint256 start;
        uint256 cliff;
        uint256 duration;
        uint256 released;
        bool active;
    }

    constructor() ERC20("tokentea", "TEAtest") {
        _mint(msg.sender, 1000000 * (10 ** 18));
    }

    function mint(address to, uint256 amount) external onlyOwner whenNotPaused nonReentrant {
        require(to != address(0), "Token: mint to the zero address");
        require(amount > 0, "Token: mint amount must be greater than zero");

        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    function burn(uint256 amount) external onlyOwner whenNotPaused nonReentrant {
        require(amount > 0, "Token: burn amount must be greater than zero");

        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    function pauseToken() external onlyOwner {
        _pause();
        emit TokensPaused(true);
    }

    function unpauseToken() external onlyOwner {
        _unpause();
        emit TokensPaused(false);
    }

    function payDividend(address to, uint256 amount) external onlyOwner whenNotPaused nonReentrant {
        require(to != address(0), "Token: dividend to the zero address");
        require(amount > 0, "Token: dividend amount must be greater than zero");

        dividends[to] += amount;
        emit DividendPaid(to, amount);
    }

    function scheduleVesting(address beneficiary, uint256 amount, uint256 start, uint256 cliff, uint256 duration) external onlyOwner {
        require(beneficiary != address(0), "Token: vesting to the zero address");
        require(amount > 0, "Token: vesting amount must be greater than zero");
        require(duration > 0, "Token: vesting duration must be greater than zero");
        require(start.add(duration) > block.timestamp, "Token: vesting end must be in the future");

        VestingSchedule storage schedule = vestingSchedules[beneficiary];
        require(!schedule.active, "Token: vesting schedule already active");

        schedule.start = start;
        schedule.cliff = cliff;
        schedule.duration = duration;
        schedule.released = 0;
        schedule.active = true;

        _mint(address(this), amount);
        _transfer(address(this), beneficiary, amount);
        emit VestingScheduled(beneficiary, amount, start, cliff, duration);
    }

    function releaseVestedTokens() external {
        VestingSchedule storage schedule = vestingSchedules[msg.sender];
        require(schedule.active, "Token: no active vesting schedule");
        require(block.timestamp >= schedule.start, "Token: vesting has not started");
        require(schedule.released == 0, "Token: vested tokens already released");

        if (block.timestamp < schedule.start.add(schedule.cliff)) {
            // Tokens are still in cliff period
            return;
        }

        uint256 elapsedTime = block.timestamp.sub(schedule.start.sub(schedule.cliff));
        uint256 vestedTokens = elapsedTime.mul(schedule.released).div(schedule.duration);

        if (vestedTokens > balanceOf(address(this))) {
            vestedTokens = balanceOf(address(this));
        }

        schedule.released = vestedTokens;

        _transfer(address(this), msg.sender, vestedTokens);
    }

    function getDividendBalance(address account) external view returns (uint256) {
        return dividends[account];
    }

    function getVestingSchedule(address beneficiary) external view returns (uint256 start, uint256 cliff, uint256 duration, uint256 released, bool active) {
        VestingSchedule storage schedule = vestingSchedules[beneficiary];
        return (schedule.start, schedule.cliff, schedule.duration, schedule.released, schedule.active);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
