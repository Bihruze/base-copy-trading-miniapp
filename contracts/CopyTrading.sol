// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CopyTrading is ReentrancyGuard, Pausable, Ownable {
    struct Trader {
        address traderAddress;
        bool isActive;
        uint256 totalFollowers;
        uint256 totalVolume;
        uint256 totalPnl;
        uint256 winRate;
        uint256 maxDrawdown;
        uint256 lastTradeTime;
    }

    struct CopyPosition {
        address follower;
        address trader;
        address token;
        uint256 amount;
        uint256 entryPrice;
        uint256 stopLoss;
        uint256 takeProfit;
        bool isActive;
        uint256 timestamp;
    }

    struct Trade {
        address trader;
        address token;
        bool isBuy;
        uint256 amount;
        uint256 price;
        uint256 timestamp;
    }

    mapping(address => Trader) public traders;
    mapping(address => mapping(address => CopyPosition)) public copyPositions;
    mapping(address => Trade[]) public traderTrades;
    mapping(address => address[]) public followers;
    mapping(address => address[]) public following;

    uint256 public constant FEE_PERCENTAGE = 25; // 0.25%
    uint256 public constant MAX_POSITION_SIZE = 1000 ether;
    uint256 public constant MIN_POSITION_SIZE = 0.001 ether;

    event TraderRegistered(address indexed trader);
    event TraderUpdated(address indexed trader, uint256 winRate, uint256 totalPnl);
    event CopyPositionOpened(
        address indexed follower,
        address indexed trader,
        address indexed token,
        uint256 amount,
        uint256 entryPrice
    );
    event CopyPositionClosed(
        address indexed follower,
        address indexed trader,
        address indexed token,
        uint256 pnl
    );
    event TradeExecuted(
        address indexed trader,
        address indexed token,
        bool isBuy,
        uint256 amount,
        uint256 price
    );

    modifier onlyTrader() {
        require(traders[msg.sender].isActive, "Not a registered trader");
        _;
    }

    modifier validAmount(uint256 amount) {
        require(amount >= MIN_POSITION_SIZE, "Amount too small");
        require(amount <= MAX_POSITION_SIZE, "Amount too large");
        _;
    }

    function registerTrader() external {
        require(!traders[msg.sender].isActive, "Already registered");
        
        traders[msg.sender] = Trader({
            traderAddress: msg.sender,
            isActive: true,
            totalFollowers: 0,
            totalVolume: 0,
            totalPnl: 0,
            winRate: 0,
            maxDrawdown: 0,
            lastTradeTime: 0
        });

        emit TraderRegistered(msg.sender);
    }

    function executeTrade(
        address token,
        bool isBuy,
        uint256 amount,
        uint256 price
    ) external onlyTrader validAmount(amount) {
        require(price > 0, "Invalid price");
        
        Trade memory newTrade = Trade({
            trader: msg.sender,
            token: token,
            isBuy: isBuy,
            amount: amount,
            price: price,
            timestamp: block.timestamp
        });

        traderTrades[msg.sender].push(newTrade);
        traders[msg.sender].lastTradeTime = block.timestamp;
        traders[msg.sender].totalVolume += amount;

        emit TradeExecuted(msg.sender, token, isBuy, amount, price);

        // Execute copy trades for all followers
        _executeCopyTrades(msg.sender, token, isBuy, amount, price);
    }

    function startCopying(
        address trader,
        address token,
        uint256 amount,
        uint256 stopLoss,
        uint256 takeProfit
    ) external validAmount(amount) {
        require(traders[trader].isActive, "Trader not active");
        require(copyPositions[msg.sender][trader].amount == 0, "Already copying this trader");
        
        // Add to following list
        following[msg.sender].push(trader);
        followers[trader].push(msg.sender);
        traders[trader].totalFollowers++;

        CopyPosition memory newPosition = CopyPosition({
            follower: msg.sender,
            trader: trader,
            token: token,
            amount: amount,
            entryPrice: 0, // Will be set when first trade is executed
            stopLoss: stopLoss,
            takeProfit: takeProfit,
            isActive: true,
            timestamp: block.timestamp
        });

        copyPositions[msg.sender][trader] = newPosition;

        emit CopyPositionOpened(msg.sender, trader, token, amount, 0);
    }

    function stopCopying(address trader) external {
        CopyPosition storage position = copyPositions[msg.sender][trader];
        require(position.isActive, "Not copying this trader");

        position.isActive = false;
        traders[trader].totalFollowers--;

        // Remove from following/followers lists
        _removeFromArray(following[msg.sender], trader);
        _removeFromArray(followers[trader], msg.sender);

        emit CopyPositionClosed(msg.sender, trader, position.token, 0);
    }

    function _executeCopyTrades(
        address trader,
        address token,
        bool isBuy,
        uint256 amount,
        uint256 price
    ) internal {
        address[] memory traderFollowers = followers[trader];
        
        for (uint256 i = 0; i < traderFollowers.length; i++) {
            address follower = traderFollowers[i];
            CopyPosition storage position = copyPositions[follower][trader];
            
            if (position.isActive && position.token == token) {
                if (position.entryPrice == 0) {
                    position.entryPrice = price;
                }
                
                // Calculate proportional amount based on follower's position size
                uint256 copyAmount = (amount * position.amount) / (10**18); // Simplified calculation
                
                // Execute the copy trade (simplified - in real implementation, this would interact with DEX)
                _executeCopyTrade(follower, trader, token, copyAmount, price, isBuy);
            }
        }
    }

    function _executeCopyTrade(
        address follower,
        address trader,
        address token,
        uint256 amount,
        uint256 price,
        bool isBuy
    ) internal {
        // This is a simplified implementation
        // In a real scenario, this would interact with a DEX like Uniswap
        // For now, we just emit an event
        emit TradeExecuted(follower, token, isBuy, amount, price);
    }

    function _removeFromArray(address[] storage array, address target) internal {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == target) {
                array[i] = array[array.length - 1];
                array.pop();
                break;
            }
        }
    }

    function updateTraderStats(
        uint256 winRate,
        uint256 totalPnl,
        uint256 maxDrawdown
    ) external onlyTrader {
        traders[msg.sender].winRate = winRate;
        traders[msg.sender].totalPnl = totalPnl;
        traders[msg.sender].maxDrawdown = maxDrawdown;

        emit TraderUpdated(msg.sender, winRate, totalPnl);
    }

    function getTraderStats(address trader) external view returns (Trader memory) {
        return traders[trader];
    }

    function getTraderTrades(address trader) external view returns (Trade[] memory) {
        return traderTrades[trader];
    }

    function getFollowers(address trader) external view returns (address[] memory) {
        return followers[trader];
    }

    function getFollowing(address follower) external view returns (address[] memory) {
        return following[follower];
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
