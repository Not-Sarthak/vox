// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @title PaginationLib
 * @notice Library for handling pagination in array results
 */
library PaginationLib {
    /**
     * @notice Resize an array to a new size
     * @param array The original array
     * @param newSize The new size
     * @return The resized array
     */
    function resizeArray(uint256[] memory array, uint256 newSize) internal pure returns (uint256[] memory) {
        if (newSize == array.length) return array;
        
        uint256[] memory resized = new uint256[](newSize);
        for (uint256 i = 0; i < newSize; i++) {
            resized[i] = array[i];
        }
        return resized;
    }

    /**
     * @notice Prepare pagination parameters
     * @param totalItems Total number of items
     * @param offset The starting index
     * @param limit The maximum number of items to return
     * @return resultSize The size of the result array
     * @return result The initialized result array
     */
    function preparePagination(uint256 totalItems, uint256 offset, uint256 limit) 
        internal 
        pure 
        returns (uint256, uint256[] memory) 
    {
        if (offset >= totalItems) {
            return (0, new uint256[](0));
        }

        uint256 remaining = totalItems - offset;
        uint256 resultSize = remaining < limit ? remaining : limit;
        return (resultSize, new uint256[](resultSize));
    }
} 