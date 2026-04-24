
export interface Challenge {
    id: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
    type: 'Algorithm' | 'Debugging' | 'Refactor';
    xp: number;
    tags: string[];
    language: string;
    initialCode: string;
    testCases: { input: string; expected: string }[];
    timeLimit?: number; // in minutes
    solution?: string;
}

export const challenges: Challenge[] = [
    // --- Easy Algorithms (1-10) ---
    {
        id: '1',
        title: 'Two Sum',
        description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 50,
        tags: ['DSA', 'Arrays', 'Hash Map'],
        language: 'javascript',
        initialCode: `function twoSum(nums, target) {
  // Your code here
}`,
        solution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
        testCases: [
            { input: 'twoSum([2,7,11,15], 9)', expected: '[0, 1]' },
            { input: 'twoSum([3,2,4], 6)', expected: '[1, 2]' },
            { input: 'twoSum([3,3], 6)', expected: '[0, 1]' }
        ]
    },
    {
        id: '2',
        title: 'Reverse String',
        description: 'Write a function that reverses a string. The input string is given as an array of characters `s`.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['DSA', 'Strings', 'Two Pointers'],
        language: 'javascript',
        initialCode: `function reverseString(s) {
  // Your code here
  return s.reverse();
}`,
        testCases: [
            { input: 'reverseString(["h","e","l","l","o"])', expected: '["o","l","l","e","h"]' },
            { input: 'reverseString(["H","a","n","n","a","h"])', expected: '["h","a","n","n","a","H"]' }
        ]
    },
    {
        id: '3',
        title: 'Palindrome Number',
        description: 'Given an integer `x`, return `true` if `x` is palindrome integer. An integer is a palindrome when it reads the same backward as forward.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['DSA', 'Math'],
        language: 'javascript',
        initialCode: `function isPalindrome(x) {
  // Your code here
}`,
        testCases: [
            { input: 'isPalindrome(121)', expected: 'true' },
            { input: 'isPalindrome(-121)', expected: 'false' },
            { input: 'isPalindrome(10)', expected: 'false' }
        ]
    },
    {
        id: '4',
        title: 'Length of Last Word',
        description: 'Given a string `s` consisting of words and spaces, return the length of the last word in the string.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['DSA', 'Strings'],
        language: 'javascript',
        initialCode: `function lengthOfLastWord(s) {
  // Your code here
}`,
        testCases: [
            { input: 'lengthOfLastWord("Hello World")', expected: '5' },
            { input: 'lengthOfLastWord("   fly me   to   the moon  ")', expected: '4' },
            { input: 'lengthOfLastWord("luffy is still joyboy")', expected: '6' }
        ]
    },
    {
        id: '5',
        title: 'Plus One',
        description: 'You are given a large integer represented as an integer array `digits`, where each `digits[i]` is the ith digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading 0\'s. Increment the large integer by one and return the resulting array of digits.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 45,
        tags: ['DSA', 'Arrays', 'Math'],
        language: 'javascript',
        initialCode: `function plusOne(digits) {
  // Your code here
}`,
        testCases: [
            { input: 'plusOne([1,2,3])', expected: '[1,2,4]' },
            { input: 'plusOne([4,3,2,1])', expected: '[4,3,2,2]' },
            { input: 'plusOne([9])', expected: '[1,0]' }
        ]
    },
    {
        id: '6',
        title: 'Valid Parentheses',
        description: 'Given a string `s` containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 55,
        tags: ['DSA', 'Stack', 'Strings'],
        language: 'javascript',
        initialCode: `function isValid(s) {
  // Your code here
}`,
        testCases: [
            { input: 'isValid("()")', expected: 'true' },
            { input: 'isValid("()[]{}")', expected: 'true' },
            { input: 'isValid("(]")', expected: 'false' }
        ]
    },
    {
        id: '7',
        title: 'Merge Sorted Array',
        description: 'You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively. Merge `nums1` and `nums2` into a single array sorted in non-decreasing order.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 50,
        tags: ['DSA', 'Arrays', 'Two Pointers'],
        language: 'javascript',
        initialCode: `function merge(nums1, m, nums2, n) {
  // Your code here
}`,
        testCases: [
            { input: 'merge([1,2,3,0,0,0], 3, [2,5,6], 3)', expected: '[1,2,2,3,5,6]' },
            { input: 'merge([1], 1, [], 0)', expected: '[1]' }
        ]
    },
    {
        id: '8',
        title: 'Climbing Stairs',
        description: 'You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 45,
        tags: ['DSA', 'DP', 'Math'],
        language: 'javascript',
        initialCode: `function climbStairs(n) {
  // Your code here
}`,
        testCases: [
            { input: 'climbStairs(2)', expected: '2' },
            { input: 'climbStairs(3)', expected: '3' }
        ]
    },
    {
        id: '9',
        title: 'Remove Duplicates from Sorted List',
        description: 'Given the head of a sorted linked list, delete all duplicates such that each element appears only once. Return the linked list sorted as well.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 50,
        tags: ['DSA', 'Linked List'],
        language: 'javascript',
        initialCode: `function deleteDuplicates(head) {
  // Your code here
}`,
        testCases: [
            { input: 'deleteDuplicates([1,1,2])', expected: '[1,2]' }, // Simplified representation
            { input: 'deleteDuplicates([1,1,1])', expected: '[1]' }
        ]
    },
    {
        id: '10',
        title: 'Square Root',
        description: 'Given a non-negative integer `x`, return the square root of `x` rounded down to the nearest integer. The returned integer should be non-negative as well.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['DSA', 'Math', 'Binary Search'],
        language: 'javascript',
        initialCode: `function mySqrt(x) {
  // Your code here
}`,
        testCases: [
            { input: 'mySqrt(4)', expected: '2' },
            { input: 'mySqrt(8)', expected: '2' }
        ]
    },

    // --- Medium Algorithms (11-20) ---
    {
        id: '11',
        title: 'Add Two Numbers',
        description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['DSA', 'Linked List', 'Math'],
        language: 'javascript',
        initialCode: `function addTwoNumbers(l1, l2) {
  // Your code here
}`,
        testCases: []
    },
    {
        id: '12',
        title: 'Longest Substring Without Repeating Characters',
        description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['DSA', 'Strings', 'Sliding Window'],
        language: 'javascript',
        initialCode: `function lengthOfLongestSubstring(s) {
  // Your code here
}`,
        testCases: [
            { input: 'lengthOfLongestSubstring("abcabcbb")', expected: '3' },
            { input: 'lengthOfLongestSubstring("bbbbb")', expected: '1' }
        ]
    },
    {
        id: '13',
        title: 'Container With Most Water',
        description: 'You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the ith line are `(i, 0)` and `(i, height[i])`. Find two lines that together with the x-axis form a container, such that the container contains the most water.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['DSA', 'Arrays', 'Two Pointers'],
        language: 'javascript',
        initialCode: `function maxArea(height) {
  // Your code here
}`,
        testCases: [
            { input: 'maxArea([1,8,6,2,5,4,8,3,7])', expected: '49' },
            { input: 'maxArea([1,1])', expected: '1' }
        ]
    },
    {
        id: '14',
        title: '3Sum',
        description: 'Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 130,
        tags: ['DSA', 'Arrays', 'Two Pointers'],
        language: 'javascript',
        initialCode: `function threeSum(nums) {
  // Your code here
}`,
        testCases: [
            { input: 'threeSum([-1,0,1,2,-1,-4])', expected: '[[-1,-1,2],[-1,0,1]]' }
        ]
    },
    {
        id: '15',
        title: 'Group Anagrams',
        description: 'Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['DSA', 'Strings', 'Hash Map'],
        language: 'javascript',
        initialCode: `function groupAnagrams(strs) {
  // Your code here
}`,
        testCases: [
            { input: 'groupAnagrams(["eat","tea","tan","ate","nat","bat"])', expected: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }
        ]
    },
    {
        id: '16',
        title: 'Rotate Image',
        description: 'You are given an `n x n` 2D matrix representing an image, rotate the image by 90 degrees (clockwise).',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['DSA', 'Matrix', 'Math'],
        language: 'javascript',
        initialCode: `function rotate(matrix) {
  // Your code here
}`,
        testCases: [
            { input: 'rotate([[1,2,3],[4,5,6],[7,8,9]])', expected: '[[7,4,1],[8,5,2],[9,6,3]]' }
        ]
    },
    {
        id: '17',
        title: 'Jump Game',
        description: 'You are given an integer array `nums`. You are initially positioned at the array\'s first index, and each element in the array represents your maximum jump length at that position. Return `true` if you can reach the last index, or `false` otherwise.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 115,
        tags: ['DSA', 'Dynamic Programming', 'Greedy'],
        language: 'javascript',
        initialCode: `function canJump(nums) {
  // Your code here
}`,
        testCases: [
            { input: 'canJump([2,3,1,1,4])', expected: 'true' },
            { input: 'canJump([3,2,1,0,4])', expected: 'false' }
        ]
    },
    {
        id: '18',
        title: 'Merge Intervals',
        description: 'Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 125,
        tags: ['DSA', 'Arrays', 'Sorting'],
        language: 'javascript',
        initialCode: `function merge(intervals) {
  // Your code here
}`,
        testCases: [
            { input: 'merge([[1,3],[2,6],[8,10],[15,18]])', expected: '[[1,6],[8,10],[15,18]]' }
        ]
    },
    {
        id: '19',
        title: 'Unique Paths',
        description: 'There is a robot on an `m x n` grid. The robot is initially located at the top-left corner (i.e., `grid[0][0]`). The robot tries to move to the bottom-right corner (i.e., `grid[m - 1][n - 1]`). The robot can only move either down or right at any point in time. Given the two integers `m` and `n`, return the number of unique paths that the robot can take to reach the bottom-right corner.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['DSA', 'DP', 'Math'],
        language: 'javascript',
        initialCode: `function uniquePaths(m, n) {
  // Your code here
}`,
        testCases: [
            { input: 'uniquePaths(3, 7)', expected: '28' },
            { input: 'uniquePaths(3, 2)', expected: '3' }
        ]
    },
    {
        id: '20',
        title: 'Set Matrix Zeroes',
        description: 'Given an `m x n` integer matrix `matrix`, if an element is 0, set its entire row and column to 0\'s.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['DSA', 'Matrix'],
        language: 'javascript',
        initialCode: `function setZeroes(matrix) {
  // Your code here
}`,
        testCases: [
            { input: 'setZeroes([[1,1,1],[1,0,1],[1,1,1]])', expected: '[[1,0,1],[0,0,0],[1,0,1]]' }
        ]
    },

    // --- Hard/Expert Algorithms (21-30) ---
    {
        id: '21',
        title: 'Merge k Sorted Lists',
        description: 'You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
        difficulty: 'Expert',
        type: 'Algorithm',
        xp: 500,
        tags: ['DSA', 'Linked List', 'Heap'],
        language: 'javascript',
        initialCode: `function mergeKLists(lists) {
  // Your code here
}`,
        testCases: []
    },
    {
        id: '22',
        title: 'Sudoku Solver',
        description: 'Write a program to solve a Sudoku puzzle by filling the empty cells.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 350,
        tags: ['DSA', 'Backtracking'],
        language: 'javascript',
        initialCode: `function solveSudoku(board) {
  // Your code here
}`,
        testCases: []
    },
    {
        id: '23',
        title: 'Trapping Rain Water',
        description: 'Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 300,
        tags: ['DSA', 'Two Pointers', 'DP', 'Stack'],
        language: 'javascript',
        initialCode: `function trap(height) {
  // Your code here
}`,
        testCases: [
            { input: 'trap([0,1,0,2,1,0,1,3,2,1,2,1])', expected: '6' }
        ]
    },
    {
        id: '24',
        title: 'Edit Distance',
        description: 'Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 280,
        tags: ['DSA', 'DP', 'Strings'],
        language: 'javascript',
        initialCode: `function minDistance(word1, word2) {
  // Your code here
}`,
        testCases: [
            { input: 'minDistance("horse", "ros")', expected: '3' }
        ]
    },
    {
        id: '25',
        title: 'Largest Rectangle in Histogram',
        description: 'Given an array of integers `heights` representing the histogram\'s bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 320,
        tags: ['DSA', 'Stack', 'Array'],
        language: 'javascript',
        initialCode: `function largestRectangleArea(heights) {
  // Your code here
}`,
        testCases: [
            { input: 'largestRectangleArea([2,1,5,6,2,3])', expected: '10' }
        ]
    },
    // --- React/Debugging Challenges (31-40) ---
    {
        id: '31',
        title: 'Fix the Infinite Loop',
        description: 'This React component causes the browser to crash due to an infinite loop in the `useEffect` hook. Fix it so it only runs once on mount.',
        difficulty: 'Medium',
        type: 'Debugging',
        xp: 120,
        tags: ['React', 'Hooks'],
        language: 'javascript',
        initialCode: `function UserProfile({ userId }) {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    fetch('/api/user/' + userId)
      .then(res => res.json())
      .then(data => setUser(data));
  }); // <--- Bug is here

  if (!user) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}`,
        testCases: []
    },
    {
        id: '32',
        title: 'Optimize API Call',
        description: 'Refactor this function to reduce redundant network requests. It currently calls the API `n` times for `n` items, but the API supports batch fetching.',
        difficulty: 'Hard',
        type: 'Refactor',
        xp: 250,
        tags: ['Performance', 'Async'],
        language: 'javascript',
        initialCode: `async function fetchItems(ids) {
  const results = [];
  for (const id of ids) {
    const item = await fetch('/api/items/' + id).then(r => r.json());
    results.push(item);
  }
  return results;
}
// API supports: /api/items?ids=1,2,3
`,
        testCases: []
    },
    {
        id: '33',
        title: 'Counter Component',
        description: 'Build a simple counter component in React with Increment, Decrement, and Reset buttons.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 60,
        tags: ['React'],
        language: 'javascript',
        initialCode: `function Counter() {
    // Your code here
    return (
        <div>
            <h1>0</h1>
            <button>Increment</button>
            <button>Decrement</button>
        </div>
    )
}`,
        testCases: []
    },
    {
        id: '34',
        title: 'Fix React State Mutation',
        description: 'The following code mutates state directly, which is a bug in React. Fix it to use immutable state updates.',
        difficulty: 'Easy',
        type: 'Debugging',
        xp: 70,
        tags: ['React', 'State'],
        language: 'javascript',
        initialCode: `function TodoList() {
  const [todos, setTodos] = React.useState([{text: 'Learn React', done: false}]);

  const toggleTodo = (index) => {
    // BUG: Mutating state directly
    todos[index].done = !todos[index].done;
    setTodos(todos); 
  };

  return (/*...*/);
}`,
        testCases: []
    },
    {
        id: '35',
        title: 'Implement debounce',
        description: 'Implement a debounce function that limits the rate at which a function can fire.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 90,
        tags: ['Functional Programming', 'Async'],
        language: 'javascript',
        initialCode: `function debounce(func, wait) {
  // Your code here
}`,
        testCases: []
    },
    {
        id: '36',
        title: 'Implement Promise.all',
        description: 'Write a function that polyfills Promise.all.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 200,
        tags: ['Async', 'Promise'],
        language: 'javascript',
        initialCode: `function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    // Your code here
  });
}`,
        testCases: []
    },
    {
        id: '37',
        title: 'Deep Clone',
        description: 'Write a function to deep clone an object (without using JSON.parse/stringify).',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['Objects', 'Recursion'],
        language: 'javascript',
        initialCode: `function deepClone(obj) {
  // Your code here
}`,
        testCases: []
    },
    {
        id: '38',
        title: 'Flatten Array',
        description: 'Write a function that flattens a nested array of any depth.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 90,
        tags: ['DSA', 'Arrays', 'Recursion'],
        language: 'javascript',
        initialCode: `function flatten(arr) {
  // Your code here
}`,
        testCases: []
    },
    {
        id: '39',
        title: 'Event Emitter',
        description: 'Implement a simple Event Emitter class with `on`, `emit`, and `off` methods.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 150,
        tags: ['Design Pattern', 'Classes'],
        language: 'javascript',
        initialCode: `class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, listener) {
    // Your code
  }
  
  emit(event, ...args) {
    // Your code
  }
  
  off(event, listener) {
    // Your code
  }
}`,
        testCases: []
    },
    {
        id: '40',
        title: 'Remove Duplicates from Sorted Array',
        description: 'Given an integer array `nums` sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same. Return the number of unique elements.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['DSA', 'Arrays', 'Two Pointers'],
        language: 'javascript',
        initialCode: `function removeDuplicates(nums) {
  // Your code here
}`,
        testCases: [
            { input: 'removeDuplicates([1,1,2])', expected: '2' },
            { input: 'removeDuplicates([0,0,1,1,1,2,2,3,3,4])', expected: '5' }
        ]
    },
    {
        id: '41',
        title: 'Best Time to Buy and Sell Stock',
        description: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 50,
        tags: ['DSA', 'Arrays', 'Dynamic Programming'],
        language: 'javascript',
        initialCode: `function maxProfit(prices) {
  // Your code here
}`,
        testCases: [
            { input: 'maxProfit([7,1,5,3,6,4])', expected: '5' },
            { input: 'maxProfit([7,6,4,3,1])', expected: '0' }
        ]
    },
    {
        id: '42',
        title: 'Rotate Array',
        description: 'Given an integer array `nums`, rotate the array to the right by `k` steps, where `k` is non-negative.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['DSA', 'Arrays', 'Two Pointers'],
        language: 'javascript',
        initialCode: `function rotate(nums, k) {
  // Your code here
}`,
        testCases: [
            { input: '(() => { let n = [1,2,3,4,5,6,7]; rotate(n, 3); return n; })()', expected: '[5,6,7,1,2,3,4]' },
            { input: '(() => { let n = [-1,-100,3,99]; rotate(n, 2); return n; })()', expected: '[3,99,-1,-100]' }
        ]
    },
    {
        id: '43',
        title: 'Contains Duplicate',
        description: 'Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['DSA', 'Arrays', 'Hash Map'],
        language: 'javascript',
        initialCode: `function containsDuplicate(nums) {
  // Your code here
}`,
        testCases: [
            { input: 'containsDuplicate([1,2,3,1])', expected: 'true' },
            { input: 'containsDuplicate([1,2,3,4])', expected: 'false' }
        ]
    },
    {
        id: '44',
        title: 'Single Number',
        description: 'Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['DSA', 'Arrays', 'Bit Manipulation'],
        language: 'javascript',
        initialCode: `function singleNumber(nums) {
  // Your code here
}`,
        testCases: [
            { input: 'singleNumber([2,2,1])', expected: '1' },
            { input: 'singleNumber([4,1,2,1,2])', expected: '4' }
        ]
    },
    {
        id: '45',
        title: 'Intersection of Two Arrays II',
        description: 'Given two integer arrays `nums1` and `nums2`, return an array of their intersection. Each element in the result must appear as many times as it shows in both arrays.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 45,
        tags: ['DSA', 'Arrays', 'Hash Map'],
        language: 'javascript',
        initialCode: `function intersect(nums1, nums2) {
  // Your code here
}`,
        testCases: [
            { input: 'intersect([1,2,2,1], [2,2])', expected: '[2,2]' },
            { input: 'intersect([4,9,5], [9,4,9,8,4])', expected: '[4,9]' }
        ]
    },
    {
        id: '46',
        title: 'Move Zeroes',
        description: 'Given an integer array `nums`, move all 0\'s to the end of it while maintaining the relative order of the non-zero elements.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 35,
        tags: ['DSA', 'Arrays', 'Two Pointers'],
        language: 'javascript',
        initialCode: `function moveZeroes(nums) {
  // Your code here
}`,
        testCases: [
            { input: '(() => { let n = [0,1,0,3,12]; moveZeroes(n); return n; })()', expected: '[1,3,12,0,0]' },
            { input: '(() => { let n = [0]; moveZeroes(n); return n; })()', expected: '[0]' }
        ]
    },
    {
        id: '47',
        title: 'Valid Anagram',
        description: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['DSA', 'Strings', 'Hash Map'],
        language: 'javascript',
        initialCode: `function isAnagram(s, t) {
  // Your code here
}`,
        testCases: [
            { input: 'isAnagram("anagram", "nagaram")', expected: 'true' },
            { input: 'isAnagram("rat", "car")', expected: 'false' }
        ]
    },
    {
        id: '48',
        title: 'First Unique Character in a String',
        description: 'Given a string `s`, find the first non-repeating character in it and return its index. If it does not exist, return -1.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 35,
        tags: ['DSA', 'Strings', 'Hash Map'],
        language: 'javascript',
        initialCode: `function firstUniqChar(s) {
  // Your code here
}`,
        testCases: [
            { input: 'firstUniqChar("leetcode")', expected: '0' },
            { input: 'firstUniqChar("loveleetcode")', expected: '2' },
            { input: 'firstUniqChar("aabb")', expected: '-1' }
        ]
    },
    {
        id: '49',
        title: 'String to Integer (atoi)',
        description: 'Implement the `myAtoi(string s)` function, which converts a string to a 32-bit signed integer.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['DSA', 'Strings'],
        language: 'javascript',
        initialCode: `function myAtoi(s) {
  // Your code here
}`,
        testCases: [
            { input: 'myAtoi("42")', expected: '42' },
            { input: 'myAtoi("   -42")', expected: '-42' },
            { input: 'myAtoi("4193 with words")', expected: '4193' }
        ]
    },
    {
        id: '50',
        title: 'Implement strStr()',
        description: 'Given two strings `needle` and `haystack`, return the index of the first occurrence of `needle` in `haystack`, or -1 if `needle` is not part of `haystack`.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['DSA', 'Strings', 'Two Pointers'],
        language: 'javascript',
        initialCode: `function strStr(haystack, needle) {
  // Your code here
}`,
        testCases: [
            { input: 'strStr("sadbutsad", "sad")', expected: '0' },
            { input: 'strStr("leetcode", "leeto")', expected: '-1' }
        ]
    },
    {
        id: '51',
        title: 'Longest Common Prefix',
        description: 'Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['DSA', 'Strings'],
        language: 'javascript',
        initialCode: `function longestCommonPrefix(strs) {
  // Your code here
}`,
        testCases: [
            { input: 'longestCommonPrefix(["flower","flow","flight"])', expected: '"fl"' },
            { input: 'longestCommonPrefix(["dog","racecar","car"])', expected: '""' }
        ]
    },
    {
        id: '52',
        title: 'Valid Palindrome',
        description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 35,
        tags: ['DSA', 'Strings', 'Two Pointers'],
        language: 'javascript',
        initialCode: `function isPalindrome(s) {
  // Your code here
}`,
        testCases: [
            { input: 'isPalindrome("A man, a plan, a canal: Panama")', expected: 'true' },
            { input: 'isPalindrome("race a car")', expected: 'false' },
            { input: 'isPalindrome(" ")', expected: 'true' }
        ]
    },
    {
        id: '53',
        title: 'Subarray Sum Equals K',
        description: 'Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['DSA', 'Arrays', 'Hash Map'],
        language: 'javascript',
        initialCode: `function subarraySum(nums, k) {
  // Your code here
}`,
        testCases: [
            { input: 'subarraySum([1,1,1], 2)', expected: '2' },
            { input: 'subarraySum([1,2,3], 3)', expected: '2' }
        ]
    },
    {
        id: '54',
        title: 'Product of Array Except Self',
        description: 'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. You must write an algorithm that runs in O(n) time and without using the division operation.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 130,
        tags: ['DSA', 'Arrays'],
        language: 'javascript',
        initialCode: `function productExceptSelf(nums) {
  // Your code here
}`,
        testCases: [
            { input: 'productExceptSelf([1,2,3,4])', expected: '[24,12,8,6]' },
            { input: 'productExceptSelf([-1,1,0,-3,3])', expected: '[0,0,9,0,0]' }
        ]
    },
    {
        id: '55',
        title: 'Increasing Triplet Subsequence',
        description: 'Given an integer array `nums`, return `true` if there exists a triple of indices `(i, j, k)` such that `i < j < k` and `nums[i] < nums[j] < nums[k]`. If no such indices exists, return `false`.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['DSA', 'Arrays'],
        language: 'javascript',
        initialCode: `function increasingTriplet(nums) {
  // Your code here
}`,
        testCases: [
            { input: 'increasingTriplet([1,2,3,4,5])', expected: 'true' },
            { input: 'increasingTriplet([5,4,3,2,1])', expected: 'false' },
            { input: 'increasingTriplet([2,1,5,0,4,6])', expected: 'true' }
        ]
    },
    {
        id: '56',
        title: 'String Compression',
        description: 'Given an array of characters `chars`, compress it using the following algorithm: Begin with an empty string `s`. For each group of consecutive repeating characters in `chars`: If the group\'s length is 1, append the character to `s`. Otherwise, append the character followed by the group\'s length.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['DSA', 'Arrays', 'Two Pointers'],
        language: 'javascript',
        initialCode: `function compress(chars) {
  // Your code here
}`,
        testCases: [
            { input: 'compress(["a","a","b","b","c","c","c"])', expected: '6' },
            { input: 'compress(["a"])', expected: '1' },
            { input: 'compress(["a","b","b","b","b","b","b","b","b","b","b","b","b"])', expected: '4' }
        ]
    },
    {
        id: '57',
        title: 'Max Consecutive Ones III',
        description: 'Given a binary array `nums` and an integer `k`, return the maximum number of consecutive 1\'s in the array if you can flip at most `k` 0\'s.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['DSA', 'Arrays', 'Sliding Window', 'Two Pointers'],
        language: 'javascript',
        initialCode: `function longestOnes(nums, k) {
  // Your code here
}`,
        testCases: [
            { input: 'longestOnes([1,1,1,0,0,0,1,1,1,1,0], 2)', expected: '6' },
            { input: 'longestOnes([0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], 3)', expected: '10' }
        ]
    },
    {
        id: '58',
        title: 'Longest Subarray of 1\'s After Deleting One Element',
        description: 'Given a binary array `nums`, you should delete one element from it. Return the size of the longest subarray containing only 1\'s in the resulting array. Return 0 if there is no such subarray.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['DSA', 'Arrays', 'Sliding Window'],
        language: 'javascript',
        initialCode: `function longestSubarray(nums) {
  // Your code here
}`,
        testCases: [
            { input: 'longestSubarray([1,1,0,1])', expected: '3' },
            { input: 'longestSubarray([0,1,1,1,0,1,1,0])', expected: '5' },
            { input: 'longestSubarray([1,1,1])', expected: '2' }
        ]
    },
    {
        id: '59',
        title: 'Find the Highest Altitude',
        description: 'There is a biker going on a road trip. The road trip consists of `n + 1` points at different altitudes. The biker starts his trip on point 0 with altitude 0. You are given an integer array `gain` of length `n` where `gain[i]` is the net gain in altitude between points `i` and `i + 1` for all `(0 <= i < n)`. Return the highest altitude of a point.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['DSA', 'Arrays'],
        language: 'javascript',
        initialCode: `function largestAltitude(gain) {
  // Your code here
}`,
        testCases: [
            { input: 'largestAltitude([-5,1,5,0,-7])', expected: '1' },
            { input: 'largestAltitude([-4,-3,-2,-1,4,3,2])', expected: '0' }
        ]
    },
    {
        id: '60',
        title: 'Middle of the Linked List',
        description: 'Given the `head` of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the second middle node.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['DSA', 'Linked List', 'Two Pointers'],
        language: 'javascript',
        initialCode: `function middleNode(head) {
  // Your code here
}`,
        testCases: [
            { input: 'middleNode([1,2,3,4,5])', expected: '[3,4,5]' },
            { input: 'middleNode([1,2,3,4,5,6])', expected: '[4,5,6]' }
        ]
    },
    {
        id: '61',
        title: 'Linked List Cycle',
        description: 'Given `head`, the head of a linked list, determine if the linked list has a cycle in it.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 50,
        tags: ['DSA', 'Linked List', 'Two Pointers', 'Hash Table'],
        language: 'javascript',
        initialCode: `function hasCycle(head) {
  // Your code here
}`,
        testCases: [
            { input: 'hasCycle([3,2,0,-4])', expected: 'true' }, // pos = 1 (cycle)
            { input: 'hasCycle([1,2])', expected: 'false' }
        ]
    },
    {
        id: '62',
        title: 'Palindrome Linked List',
        description: 'Given the `head` of a singly linked list, return `true` if it is a palindrome or `false` otherwise.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 50,
        tags: ['DSA', 'Linked List', 'Two Pointers', 'Stack', 'Recursion'],
        language: 'javascript',
        initialCode: `function isPalindrome(head) {
  // Your code here
}`,
        testCases: [
            { input: 'isPalindrome([1,2,2,1])', expected: 'true' },
            { input: 'isPalindrome([1,2])', expected: 'false' }
        ]
    },
    {
        id: '63',
        title: 'Delete Node in a Linked List',
        description: 'There is a singly-linked list `head` and we want to delete a node `node` in it. You are given the node to be deleted `node`. You will not be given access to the first node of `head`.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 80,
        tags: ['DSA', 'Linked List'],
        language: 'javascript',
        initialCode: `function deleteNode(node) {
  // Your code here
}`,
        testCases: [
            { input: '(() => { let n = [4,5,1,9]; deleteNode(n[1]); return n; })()', expected: '[4,1,9]' }
        ]
    },
    {
        id: '64',
        title: 'Intersection of Two Linked Lists',
        description: 'Given the heads of two singly linked-lists `headA` and `headB`, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return null.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 60,
        tags: ['DSA', 'Linked List', 'Two Pointers', 'Hash Table'],
        language: 'javascript',
        initialCode: `function getIntersectionNode(headA, headB) {
  // Your code here
}`,
        testCases: []
    },
    {
        id: '65',
        title: 'Reverse Linked List',
        description: 'Given the `head` of a singly linked list, reverse the list, and return the reversed list.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 45,
        tags: ['DSA', 'Linked List', 'Recursion'],
        language: 'javascript',
        initialCode: `function reverseList(head) {
  // Your code here
}`,
        testCases: [
            { input: 'reverseList([1,2,3,4,5])', expected: '[5,4,3,2,1]' }
        ]
    },
    {
        id: '66',
        title: 'Implement Queue using Stacks',
        description: 'Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (`push`, `peek`, `pop`, and `empty`).',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 60,
        tags: ['DSA', 'Stack', 'Design', 'Queue'],
        language: 'javascript',
        initialCode: `class MyQueue {
  constructor() {
    this.s1 = [];
    this.s2 = [];
  }
  push(x) {}
  pop() {}
  peek() {}
  empty() {}
}`,
        testCases: []
    },
    {
        id: '67',
        title: 'Min Stack',
        description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 90,
        tags: ['DSA', 'Stack', 'Design'],
        language: 'javascript',
        initialCode: `class MinStack {
  constructor() {
    this.stack = [];
  }
  push(val) {}
  pop() {}
  top() {}
  getMin() {}
}`,
        testCases: []
    },
    {
        id: '68',
        title: 'Binary Tree Inorder Traversal',
        description: 'Given the `root` of a binary tree, return the inorder traversal of its nodes\' values.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['DSA', 'Stack', 'Tree', 'Depth-First Search', 'Binary Tree'],
        language: 'javascript',
        initialCode: `function inorderTraversal(root) {
  // Your code here
}`,
        testCases: [
            { input: 'inorderTraversal([1,null,2,3])', expected: '[1,3,2]' }
        ]
    },
    {
        id: '69',
        title: 'Maximum Depth of Binary Tree',
        description: 'Given the `root` of a binary tree, return its maximum depth. A binary tree\'s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
        language: 'javascript',
        initialCode: `function maxDepth(root) {
  // Your code here
}`,
        testCases: [
            { input: 'maxDepth([3,9,20,null,null,15,7])', expected: '3' },
            { input: 'maxDepth([1,null,2])', expected: '2' }
        ]
    },
    {
        id: '70',
        title: 'Symmetric Tree',
        description: 'Given the `root` of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 45,
        tags: ['DSA', 'Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
        language: 'javascript',
        initialCode: `function isSymmetric(root) {
  // Your code here
}`,
        testCases: [
            { input: 'isSymmetric([1,2,2,3,4,4,3])', expected: 'true' },
            { input: 'isSymmetric([1,2,2,null,3,null,3])', expected: 'false' }
        ]
    },
    {
        id: '71',
        title: 'Path Sum',
        description: 'Given the `root` of a binary tree and an integer `targetSum`, return `true` if the tree has a root-to-leaf path such that adding up all the values along the path equals `targetSum`.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['DSA', 'Tree', 'Depth-First Search', 'Binary Tree'],
        language: 'javascript',
        initialCode: `function hasPathSum(root, targetSum) {
  // Your code here
}`,
        testCases: [
            { input: 'hasPathSum([5,4,8,11,null,13,4,7,2,null,null,null,1], 22)', expected: 'true' },
            { input: 'hasPathSum([1,2,3], 5)', expected: 'false' }
        ]
    },
    {
        id: '72',
        title: 'Search in a Binary Search Tree',
        description: 'You are given the `root` of a binary search tree (BST) and an integer `val`. Find the node in the BST that the node\'s value equals `val` and return the subtree rooted with that node.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 35,
        tags: ['DSA', 'Tree', 'Binary Search Tree', 'Binary Tree'],
        language: 'javascript',
        initialCode: `function searchBST(root, val) {
  // Your code here
}`,
        testCases: [
            { input: 'searchBST([4,2,7,1,3], 2)', expected: '[2,1,3]' }
        ]
    },
    {
        id: '73',
        title: 'Lowest Common Ancestor of a Binary Search Tree',
        description: 'Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['DSA', 'Tree', 'Binary Search Tree', 'Binary Tree'],
        language: 'javascript',
        initialCode: `function lowestCommonAncestor(root, p, q) {
  // Your code here
}`,
        testCases: [
            { input: 'lowestCommonAncestor([6,2,8,0,4,7,9,null,null,3,5], 2, 8)', expected: '6' }
        ]
    },
    {
        id: '74',
        title: 'Merge Two Binary Trees',
        description: 'You are given two binary trees `root1` and `root2`. Imagine that when you put one of them to cover the other, some nodes of the two trees are overlapped while the others are not. Merging rule is that if two nodes overlap, then sum node values up as the new value of the merged node.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['DSA', 'Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
        language: 'javascript',
        initialCode: `function mergeTrees(root1, root2) {
  // Your code here
}`,
        testCases: [
            { input: 'mergeTrees([1,3,2,5], [2,1,3,null,4,null,7])', expected: '[3,4,5,5,4,null,7]' }
        ]
    },
    {
        id: '75',
        title: 'Invert Binary Tree',
        description: 'Given the `root` of a binary tree, invert the tree, and return its root.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['DSA', 'Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
        language: 'javascript',
        initialCode: `function invertTree(root) {
  // Your code here
}`,
        testCases: [
            { input: 'invertTree([4,2,7,1,3,6,9])', expected: '[4,7,2,9,6,3,1]' }
        ]
    },
    {
        id: '76',
        title: 'Binary Search',
        description: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return -1.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['DSA', 'Arrays', 'Binary Search'],
        language: 'javascript',
        initialCode: `function search(nums, target) {
  // Your code here
}`,
        testCases: [
            { input: 'search([-1,0,3,5,9,12], 9)', expected: '4' },
            { input: 'search([-1,0,3,5,9,12], 2)', expected: '-1' }
        ]
    },
    {
        id: '77',
        title: 'First Bad Version',
        description: 'You are a product manager and currently leading a team to develop a new product. Unfortunately, the latest version of your product fails the quality check. Implement a function to find the first bad version which causes all the following ones to be bad.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 35,
        tags: ['DSA', 'Binary Search', 'Interactive'],
        language: 'javascript',
        initialCode: `/**
 * @param {function} isBadVersion()
 * @return {function}
 */
var solution = function(isBadVersion) {
    return function(n) {
        // Your code here
    };
};`,
        testCases: []
    },
    {
        id: '78',
        title: 'Search Insert Position',
        description: 'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['DSA', 'Arrays', 'Binary Search'],
        language: 'javascript',
        initialCode: `function searchInsert(nums, target) {
  // Your code here
}`,
        testCases: [
            { input: 'searchInsert([1,3,5,6], 5)', expected: '2' },
            { input: 'searchInsert([1,3,5,6], 2)', expected: '1' },
            { input: 'searchInsert([1,3,5,6], 7)', expected: '4' }
        ]
    },
    {
        id: '79',
        title: 'Find Smallest Letter Greater Than Target',
        description: 'Given a characters array `letters` that is sorted in non-decreasing order, and a character `target`, return the smallest character in `letters` that is lexicographically greater than `target`.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['DSA', 'Arrays', 'Binary Search'],
        language: 'javascript',
        initialCode: `function nextGreatestLetter(letters, target) {
  // Your code here
}`,
        testCases: [
            { input: 'nextGreatestLetter(["c","f","j"], "a")', expected: '"c"' },
            { input: 'nextGreatestLetter(["c","f","j"], "c")', expected: '"f"' },
            { input: 'nextGreatestLetter(["x","x","y","y"], "z")', expected: '"x"' }
        ]
    },
    {
        id: '80',
        title: 'Fibonacci Number',
        description: 'The Fibonacci numbers, commonly denoted `F(n)` form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['DSA', 'Math', 'Dynamic Programming', 'Recursion', 'Memoization'],
        language: 'javascript',
        initialCode: `function fib(n) {
  // Your code here
}`,
        testCases: [
            { input: 'fib(2)', expected: '1' },
            { input: 'fib(3)', expected: '2' },
            { input: 'fib(4)', expected: '3' }
        ]
    },
    {
        id: '81',
        title: 'Min Cost Climbing Stairs',
        description: 'You are given an integer array `cost` where `cost[i]` is the cost of ith step on a staircase. Once you pay the cost, you can either climb one or two steps. Return the minimum cost to reach the top of the floor.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 45,
        tags: ['DSA', 'Arrays', 'Dynamic Programming'],
        language: 'javascript',
        initialCode: `function minCostClimbingStairs(cost) {
  // Your code here
}`,
        testCases: [
            { input: 'minCostClimbingStairs([10,15,20])', expected: '15' },
            { input: 'minCostClimbingStairs([1,100,1,1,1,100,1,1,100,1])', expected: '6' }
        ]
    },
    {
        id: '82',
        title: 'House Robber',
        description: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['DSA', 'Arrays', 'Dynamic Programming'],
        language: 'javascript',
        initialCode: `function rob(nums) {
  // Your code here
}`,
        testCases: [
            { input: 'rob([1,2,3,1])', expected: '4' },
            { input: 'rob([2,7,9,3,1])', expected: '12' }
        ]
    },
    {
        id: '83',
        title: 'Coin Change',
        description: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['DSA', 'Arrays', 'Dynamic Programming', 'Breadth-First Search'],
        language: 'javascript',
        initialCode: `function coinChange(coins, amount) {
  // Your code here
}`,
        testCases: [
            { input: 'coinChange([1,2,5], 11)', expected: '3' },
            { input: 'coinChange([2], 3)', expected: '-1' },
            { input: 'coinChange([1], 0)', expected: '0' }
        ]
    },
    {
        id: '84',
        title: 'Longest Increasing Subsequence',
        description: 'Given an integer array `nums`, return the length of the longest strictly increasing subsequence.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['DSA', 'Arrays', 'Binary Search', 'Dynamic Programming'],
        language: 'javascript',
        initialCode: `function lengthOfLIS(nums) {
  // Your code here
}`,
        testCases: [
            { input: 'lengthOfLIS([10,9,2,5,3,7,101,18])', expected: '4' },
            { input: 'lengthOfLIS([0,1,0,3,2,3])', expected: '4' },
            { input: 'lengthOfLIS([7,7,7,7,7,7,7])', expected: '1' }
        ]
    },
    {
        id: '85',
        title: 'Longest Common Subsequence',
        description: 'Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return 0.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 115,
        tags: ['DSA', 'Strings', 'Dynamic Programming'],
        language: 'javascript',
        initialCode: `function longestCommonSubsequence(text1, text2) {
  // Your code here
}`,
        testCases: [
            { input: 'longestCommonSubsequence("abcde", "ace")', expected: '3' },
            { input: 'longestCommonSubsequence("abc", "abc")', expected: '3' },
            { input: 'longestCommonSubsequence("abc", "def")', expected: '0' }
        ]
    },
    {
        id: '86',
        title: 'Edit Distance',
        description: 'Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`. You have the following three operations permitted on a word: Insert a character, Delete a character, Replace a character.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 250,
        tags: ['DSA', 'Strings', 'Dynamic Programming'],
        language: 'javascript',
        initialCode: `function minDistance(word1, word2) {
  // Your code here
}`,
        testCases: [
            { input: 'minDistance("horse", "ros")', expected: '3' },
            { input: 'minDistance("intention", "execution")', expected: '5' }
        ]
    },
    {
        id: '87',
        title: 'Unique Paths II',
        description: 'You are given an `m x n` integer array `obstacleGrid`. There is a robot on an `m x n` grid. The robot is initially located at the top-left corner. The robot tries to move to the bottom-right corner. The robot can only move either down or right at any point in time. An obstacle and space are marked as 1 and 0 respectively in `obstacleGrid`.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['DSA', 'Arrays', 'Dynamic Programming', 'Matrix'],
        language: 'javascript',
        initialCode: `function uniquePathsWithObstacles(obstacleGrid) {
  // Your code here
}`,
        testCases: [
            { input: 'uniquePathsWithObstacles([[0,0,0],[0,1,0],[0,0,0]])', expected: '2' },
            { input: 'uniquePathsWithObstacles([[0,1],[0,0]])', expected: '1' }
        ]
    },
    {
        id: '88',
        title: 'Minimum Path Sum',
        description: 'Given a `m x n` `grid` filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path. You can only move either down or right at any point in time.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['DSA', 'Arrays', 'Dynamic Programming', 'Matrix'],
        language: 'javascript',
        initialCode: `function minPathSum(grid) {
  // Your code here
}`,
        testCases: [
            { input: 'minPathSum([[1,3,1],[1,5,1],[4,2,1]])', expected: '7' },
            { input: 'minPathSum([[1,2,3],[4,5,6]])', expected: '12' }
        ]
    },
    {
        id: '89',
        title: 'Word Break',
        description: 'Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 130,
        tags: ['DSA', 'Hash Table', 'Strings', 'Dynamic Programming', 'Memoization'],
        language: 'javascript',
        initialCode: `function wordBreak(s, wordDict) {
  // Your code here
}`,
        testCases: [
            { input: 'wordBreak("leetcode", ["leet","code"])', expected: 'true' },
            { input: 'wordBreak("applepenapple", ["apple","pen"])', expected: 'true' },
            { input: 'wordBreak("catsandog", ["cats","dog","sand","and","cat"])', expected: 'false' }
        ]
    },
    {
        id: '90',
        title: 'Combination Sum',
        description: 'Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of `candidates` where the chosen numbers sum to `target`. You may return the combinations in any order.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['DSA', 'Arrays', 'Backtracking'],
        language: 'javascript',
        initialCode: `function combinationSum(candidates, target) {
  // Your code here
}`,
        testCases: [
            { input: 'combinationSum([2,3,6,7], 7)', expected: '[[2,2,3],[7]]' },
            { input: 'combinationSum([2,3,5], 8)', expected: '[[2,2,2,2],[2,3,3],[3,5]]' }
        ]
    },
    {
        id: '91',
        title: 'Subsets',
        description: 'Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['DSA', 'Arrays', 'Backtracking', 'Bit Manipulation'],
        language: 'javascript',
        initialCode: `function subsets(nums) {
  // Your code here
}`,
        testCases: [
            { input: 'subsets([1,2,3])', expected: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' }
        ]
    },
    {
        id: '92',
        title: 'Permutations',
        description: 'Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['DSA', 'Arrays', 'Backtracking'],
        language: 'javascript',
        initialCode: `function permute(nums) {
  // Your code here
}`,
        testCases: [
            { input: 'permute([1,2,3])', expected: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' }
        ]
    },
    {
        id: '93',
        title: 'Letter Combinations of a Phone Number',
        description: 'Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order. A mapping of digits to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['DSA', 'Hash Table', 'Strings', 'Backtracking'],
        language: 'javascript',
        initialCode: `function letterCombinations(digits) {
  // Your code here
}`,
        testCases: [
            { input: 'letterCombinations("23")', expected: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' },
            { input: 'letterCombinations("")', expected: '[]' }
        ]
    },
    {
        id: '94',
        title: 'Palindrome Partitioning',
        description: 'Given a string `s`, partition `s` such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of `s`.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 125,
        tags: ['DSA', 'Strings', 'Dynamic Programming', 'Backtracking'],
        language: 'javascript',
        initialCode: `function partition(s) {
  // Your code here
}`,
        testCases: [
            { input: 'partition("aab")', expected: '[["a","a","b"],["aa","b"]]' },
            { input: 'partition("a")', expected: '[["a"]]' }
        ]
    },
    {
        id: '95',
        title: 'Course Schedule',
        description: 'There are a total of `numCourses` courses you have to take, labeled from 0 to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` before taking course `ai`. Return `true` if you can finish all courses. Otherwise, return `false`.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 140,
        tags: ['DSA', 'Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'],
        language: 'javascript',
        initialCode: `function canFinish(numCourses, prerequisites) {
  // Your code here
}`,
        testCases: [
            { input: 'canFinish(2, [[1,0]])', expected: 'true' },
            { input: 'canFinish(2, [[1,0],[0,1]])', expected: 'false' }
        ]
    },
    {
        id: '96',
        title: 'Number of Islands',
        description: 'Given an `m x n` 2D binary grid `grid` which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 130,
        tags: ['DSA', 'Arrays', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'],
        language: 'javascript',
        initialCode: `function numIslands(grid) {
  // Your code here
}`,
        testCases: [
            { input: 'numIslands([["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]])', expected: '1' },
            { input: 'numIslands([["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]])', expected: '3' }
        ]
    },
    {
        id: '97',
        title: 'Clone Graph',
        description: 'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node in the graph contains a value (int) and a list (List[Node]) of its neighbors.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 135,
        tags: ['DSA', 'Hash Table', 'Depth-First Search', 'Breadth-First Search', 'Graph'],
        language: 'javascript',
        initialCode: `function cloneGraph(node) {
  // Your code here
}`,
        testCases: []
    },
    {
        id: '98',
        title: 'Pacific Atlantic Water Flow',
        description: 'There is an `m x n` rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The island is partitioned into a grid of unit cells. You are given an `m x n` integer matrix `heights` where `heights[r][c]` represents the height above sea level of the cell at coordinate `(r, c)`.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 145,
        tags: ['DSA', 'Arrays', 'Depth-First Search', 'Breadth-First Search', 'Matrix'],
        language: 'javascript',
        initialCode: `function pacificAtlantic(heights) {
  // Your code here
}`,
        testCases: []
    },
    {
        id: '99',
        title: 'Word Search',
        description: 'Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 125,
        tags: ['DSA', 'Arrays', 'Backtracking', 'Matrix'],
        language: 'javascript',
        initialCode: `function exist(board, word) {
  // Your code here
}`,
        testCases: [
            { input: 'exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED")', expected: 'true' },
            { input: 'exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "SEE")', expected: 'true' },
            { input: 'exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB")', expected: 'false' }
        ]
    },
    {
        id: '100',
        title: 'Number of Connected Components in an Undirected Graph',
        description: 'You have a graph of `n` nodes. You are given an integer `n` and an array `edges` where `edges[i] = [ai, bi]` indicates that there is an edge between `ai` and `bi` in the graph. Return the number of connected components in the graph.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 130,
        tags: ['DSA', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Graph'],
        language: 'javascript',
        initialCode: `function countComponents(n, edges) {
  // Your code here
}`,
        testCases: [
            { input: 'countComponents(5, [[0,1],[1,2],[3,4]])', expected: '2' },
            { input: 'countComponents(5, [[0,1],[1,2],[2,3],[3,4]])', expected: '1' }
        ]
    },
    {
        id: '101',
        title: 'Graph Valid Tree',
        description: 'You have a graph of `n` nodes labeled from `0` to `n - 1`. You are given an integer n and a list of `edges` where `edges[i] = [ai, bi]` indicates that there is an undirected edge between nodes `ai` and `bi`. Return `true` if the edges of the given graph make up a valid tree, and `false` otherwise.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['DSA', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Graph'],
        language: 'javascript',
        initialCode: `function validTree(n, edges) {
  // Your code here
}`,
        testCases: [
            { input: 'validTree(5, [[0,1],[0,2],[0,3],[1,4]])', expected: 'true' },
            { input: 'validTree(5, [[0,1],[1,2],[2,3],[1,3],[1,4]])', expected: 'false' }
        ]
    },
    {
        id: '102',
        title: 'Reverse Bits',
        description: 'Reverse bits of a given 32 bits unsigned integer.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['DSA', 'Divide and Conquer', 'Bit Manipulation'],
        language: 'javascript',
        initialCode: `function reverseBits(n) {
  // Your code here
}`,
        testCases: []
    },
    {
        id: '103',
        title: 'Number of 1 Bits',
        description: 'Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (also known as the Hamming weight).',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['DSA', 'Divide and Conquer', 'Bit Manipulation'],
        language: 'javascript',
        initialCode: `function hammingWeight(n) {
  // Your code here
}`,
        testCases: [
            { input: 'hammingWeight(11)', expected: '3' },
            { input: 'hammingWeight(128)', expected: '1' }
        ]
    },
    {
        id: '104',
        title: 'Counting Bits',
        description: 'Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (`0 <= i <= n`), `ans[i]` is the number of 1\'s in the binary representation of `i`.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 45,
        tags: ['DSA', 'Dynamic Programming', 'Bit Manipulation'],
        language: 'javascript',
        initialCode: `function countBits(n) {
  // Your code here
}`,
        testCases: [
            { input: 'countBits(2)', expected: '[0,1,1]' },
            { input: 'countBits(5)', expected: '[0,1,1,2,1,2]' }
        ]
    },
    {
        id: '105',
        title: 'Missing Number',
        description: 'Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 35,
        tags: ['DSA', 'Arrays', 'Hash Table', 'Math', 'Binary Search', 'Bit Manipulation'],
        language: 'javascript',
        initialCode: `function missingNumber(nums) {
  // Your code here
}`,
        testCases: [
            { input: 'missingNumber([3,0,1])', expected: '2' },
            { input: 'missingNumber([9,6,4,2,3,5,7,0,1])', expected: '8' }
        ]
    },
    {
        id: '106',
        title: 'Sum of Two Integers',
        description: 'Given two integers `a` and `b`, return the sum of the two integers without using the operators `+` and `-`.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['DSA', 'Math', 'Bit Manipulation'],
        language: 'javascript',
        initialCode: `function getSum(a, b) {
  // Your code here
}`,
        testCases: [
            { input: 'getSum(1, 2)', expected: '3' },
            { input: 'getSum(2, 3)', expected: '5' }
        ]
    },
    {
        id: '107',
        title: 'Maximum Subarray',
        description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['DSA', 'Arrays', 'Divide and Conquer', 'Dynamic Programming'],
        language: 'javascript',
        initialCode: `function maxSubArray(nums) {
  // Your code here
}`,
        testCases: [
            { input: 'maxSubArray([-2,1,-3,4,-1,2,1,-5,4])', expected: '6' },
            { input: 'maxSubArray([1])', expected: '1' },
            { input: 'maxSubArray([5,4,-1,7,8])', expected: '23' }
        ]
    },
    {
        id: '108',
        title: 'Best Time to Buy and Sell Stock II',
        description: 'You are given an integer array `prices` where `prices[i]` is the price of a given stock on the ith day. On each day, you may decide to buy and/or sell the stock. You can only hold at most one share of the stock at any time. However, you can buy it then immediately sell it on the same day.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 90,
        tags: ['DSA', 'Arrays', 'Dynamic Programming', 'Greedy'],
        language: 'javascript',
        initialCode: `function maxProfit(prices) {
  // Your code here
}`,
        testCases: [
            { input: 'maxProfit([7,1,5,3,6,4])', expected: '7' },
            { input: 'maxProfit([1,2,3,4,5])', expected: '4' },
            { input: 'maxProfit([7,6,4,3,1])', expected: '0' }
        ]
    },
    {
        id: '109',
        title: 'Gas Station',
        description: 'There are `n` gas stations along a circular route, where the amount of gas at the ith station is `gas[i]`. You have a car with an unlimited gas tank and it costs `cost[i]` of gas to travel from the ith station to its next (i + 1)th station. You begin the journey with an empty tank at one of the gas stations.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['DSA', 'Arrays', 'Greedy'],
        language: 'javascript',
        initialCode: `function canCompleteCircuit(gas, cost) {
  // Your code here
}`,
        testCases: [
            { input: 'canCompleteCircuit([1,2,3,4,5], [3,4,5,1,2])', expected: '3' },
            { input: 'canCompleteCircuit([2,3,4], [3,4,3])', expected: '-1' }
        ]
    },
    {
        id: '110',
        title: 'Assign Cookies',
        description: 'Assume you are an awesome parent and want to give your children some cookies. But, you should give each child at most one cookie. Each child `i` has a greed factor `g[i]`, which is the minimum size of a cookie that the child will be content with.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['DSA', 'Arrays', 'Greedy', 'Sorting'],
        language: 'javascript',
        initialCode: `function findContentChildren(g, s) {
  // Your code here
}`,
        testCases: [
            { input: 'findContentChildren([1,2,3], [1,1])', expected: '1' },
            { input: 'findContentChildren([1,2], [1,2,3])', expected: '2' }
        ]
    },
    {
        id: '111',
        title: 'Partition Labels',
        description: 'You are given a string `s`. We want to partition the string into as many parts as possible so that each letter appears in at most one part. Note that the partition is done so that after concatenating all the parts in order, the resultant string is `s`.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['DSA', 'Hash Table', 'Two Pointers', 'Strings', 'Greedy'],
        language: 'javascript',
        initialCode: `function partitionLabels(s) {
  // Your code here
}`,
        testCases: [
            { input: 'partitionLabels("ababcbacadefegdehijhklij")', expected: '[9,7,8]' },
            { input: 'partitionLabels("eccbbbbdec")', expected: '[10]' }
        ]
    },
    {
        id: '112',
        title: 'Non-overlapping Intervals',
        description: 'Given an array of `intervals` where `intervals[i] = [starti, endi]`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 125,
        tags: ['DSA', 'Arrays', 'Dynamic Programming', 'Greedy', 'Sorting'],
        language: 'javascript',
        initialCode: `function eraseOverlapIntervals(intervals) {
  // Your code here
}`,
        testCases: [
            { input: 'eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]])', expected: '1' },
            { input: 'eraseOverlapIntervals([[1,2],[1,2],[1,2]])', expected: '2' },
            { input: 'eraseOverlapIntervals([[1,2],[2,3]])', expected: '0' }
        ]
    },
    {
        id: '113',
        title: 'Binary Tree Level Order Traversal',
        description: 'Given the `root` of a binary tree, return the level order traversal of its nodes\' values. (i.e., from left to right, level by level).',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['DSA', 'Tree', 'Breadth-First Search', 'Binary Tree'],
        language: 'javascript',
        initialCode: `function levelOrder(root) {
  // Your code here
}`,
        testCases: [
            { input: 'levelOrder([3,9,20,null,null,15,7])', expected: '[[3],[9,20],[15,7]]' }
        ]
    },
    {
        id: '114',
        title: 'Binary Tree Zigzag Level Order Traversal',
        description: 'Given the `root` of a binary tree, return the zigzag level order traversal of its nodes\' values. (i.e., from left to right, then right to left for the next level and alternate between).',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['DSA', 'Tree', 'Breadth-First Search', 'Binary Tree'],
        language: 'javascript',
        initialCode: `function zigzagLevelOrder(root) {
  // Your code here
}`,
        testCases: [
            { input: 'zigzagLevelOrder([3,9,20,null,null,15,7])', expected: '[[3],[20,9],[15,7]]' }
        ]
    },
    {
        id: '115',
        title: 'Populating Next Right Pointers in Each Node',
        description: 'You are given a perfect binary tree where all leaves are on the same level, and every parent has two children. Populate each next pointer to point to its next right node.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['DSA', 'Linked List', 'Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
        language: 'javascript',
        initialCode: `function connect(root) {
  // Your code here
}`,
        testCases: []
    },
    {
        id: '116',
        title: 'Construct Binary Tree from Preorder and Inorder Traversal',
        description: 'Given two integer arrays `preorder` and `inorder` where `preorder` is the preorder traversal of a binary tree and `inorder` is the inorder traversal of the same tree, construct and return the binary tree.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 130,
        tags: ['DSA', 'Arrays', 'Hash Table', 'Divide and Conquer', 'Tree', 'Binary Tree'],
        language: 'javascript',
        initialCode: `function buildTree(preorder, inorder) {
  // Your code here
}`,
        testCases: [
            { input: 'buildTree([3,9,20,15,7], [9,3,15,20,7])', expected: '[3,9,20,null,null,15,7]' }
        ]
    },
    {
        id: '117',
        title: 'Binary Tree Right Side View',
        description: 'Given the `root` of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['DSA', 'Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
        language: 'javascript',
        initialCode: `function rightSideView(root) {
  // Your code here
}`,
        testCases: [
            { input: 'rightSideView([1,2,3,null,5,null,4])', expected: '[1,3,4]' }
        ]
    },
    {
        id: '118',
        title: 'Kth Smallest Element in a BST',
        description: 'Given the `root` of a binary search tree, and an integer `k`, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['DSA', 'Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
        language: 'javascript',
        initialCode: `function kthSmallest(root, k) {
  // Your code here
}`,
        testCases: [
            { input: 'kthSmallest([3,1,4,null,2], 1)', expected: '1' },
            { input: 'kthSmallest([5,3,6,2,4,null,null,1], 3)', expected: '3' }
        ]
    },
    {
        id: '119',
        title: 'Validate Binary Search Tree',
        description: 'Given the `root` of a binary tree, determine if it is a valid binary search tree (BST).',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['DSA', 'Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
        language: 'javascript',
        initialCode: `function isValidBST(root) {
  // Your code here
}`,
        testCases: [
            { input: 'isValidBST([2,1,3])', expected: 'true' },
            { input: 'isValidBST([5,1,4,null,null,3,6])', expected: 'false' }
        ]
    },
    {
        id: '120',
        title: 'Top K Frequent Elements',
        description: 'Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['DSA', 'Arrays', 'Hash Table', 'Divide and Conquer', 'Sorting', 'Heap', 'Bucket Sort', 'Quickselect'],
        language: 'javascript',
        initialCode: `function topKFrequent(nums, k) {
  // Your code here
}`,
        testCases: [
            { input: 'topKFrequent([1,1,1,2,2,3], 2)', expected: '[1,2]' },
            { input: 'topKFrequent([1], 1)', expected: '[1]' }
        ]
    },
    {
        id: '121',
        title: 'Kth Largest Element in an Array',
        description: 'Given an integer array `nums` and an integer `k`, return the kth largest element in the array.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['DSA', 'Arrays', 'Divide and Conquer', 'Sorting', 'Heap', 'Quickselect'],
        language: 'javascript',
        initialCode: `function findKthLargest(nums, k) {
  // Your code here
}`,
        testCases: [
            { input: 'findKthLargest([3,2,1,5,6,4], 2)', expected: '5' },
            { input: 'findKthLargest([3,2,3,1,2,4,5,5,6], 4)', expected: '4' }
        ]
    },
    {
        id: '122',
        title: 'Find Median from Data Stream',
        description: 'The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value and the median is the mean of the two middle values.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 300,
        tags: ['DSA', 'Two Pointers', 'Design', 'Sorting', 'Heap', 'Data Stream'],
        language: 'javascript',
        initialCode: `class MedianFinder {
  constructor() {}
  addNum(num) {}
  findMedian() {}
}`,
        testCases: []
    },
    {
        id: '123',
        title: 'Longest Consecutive Sequence',
        description: 'Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 130,
        tags: ['DSA', 'Arrays', 'Hash Table', 'Union Find'],
        language: 'javascript',
        initialCode: `function longestConsecutive(nums) {
  // Your code here
}`,
        testCases: [
            { input: 'longestConsecutive([100,4,200,1,3,2])', expected: '4' },
            { input: 'longestConsecutive([0,3,7,2,5,8,4,6,0,1])', expected: '9' }
        ]
    },
    {
        id: '124',
        title: 'Search in Rotated Sorted Array',
        description: 'There is an integer array `nums` sorted in ascending order (with distinct values). Prior to being passed to your function, `nums` is possibly rotated at an unknown pivot index `k`.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['DSA', 'Arrays', 'Binary Search'],
        language: 'javascript',
        initialCode: `function search(nums, target) {
  // Your code here
}`,
        testCases: [
            { input: 'search([4,5,6,7,0,1,2], 0)', expected: '4' },
            { input: 'search([4,5,6,7,0,1,2], 3)', expected: '-1' },
            { input: 'search([1], 0)', expected: '-1' }
        ]
    },
    {
        id: '125',
        title: 'Find Minimum in Rotated Sorted Array',
        description: 'Suppose an array of length `n` sorted in ascending order is rotated between 1 and `n` times. For example, the array `nums = [0,1,2,4,5,6,7]` might become `[4,5,6,7,0,1,2]`. Return the minimum element of this array.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['DSA', 'Arrays', 'Binary Search'],
        language: 'javascript',
        initialCode: `function findMin(nums) {
  // Your code here
}`,
        testCases: [
            { input: 'findMin([3,4,5,1,2])', expected: '1' },
            { input: 'findMin([4,5,6,7,0,1,2])', expected: '0' },
            { input: 'findMin([11,13,15,17])', expected: '11' }
        ]
    },
    {
        id: '126',
        title: 'Maximum Product Subarray',
        description: 'Given an integer array `nums`, find a subarray that has the largest product, and return the product.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['DSA', 'Arrays', 'Dynamic Programming'],
        language: 'javascript',
        initialCode: `function maxProduct(nums) {
  // Your code here
}`,
        testCases: [
            { input: 'maxProduct([2,3,-2,4])', expected: '6' },
            { input: 'maxProduct([-2,0,-1])', expected: '0' }
        ]
    },
    {
        id: '127',
        title: '4Sum',
        description: 'Given an array `nums` of `n` integers, return an array of all the unique quadruplets `[nums[a], nums[b], nums[c], nums[d]]` such that `0 <= a, b, c, d < n` and `nums[a] + nums[b] + nums[c] + nums[d] == target`.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 140,
        tags: ['DSA', 'Arrays', 'Two Pointers'],
        language: 'javascript',
        initialCode: `function fourSum(nums, target) {
  // Your code here
}`,
        testCases: [
            { input: 'fourSum([1,0,-1,0,-2,2], 0)', expected: '[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]' }
        ]
    },
    {
        id: '128',
        title: 'Longest Palindromic Substring',
        description: 'Given a string `s`, return the longest palindromic substring in `s`.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['DSA', 'Strings', 'Dynamic Programming'],
        language: 'javascript',
        initialCode: `function longestPalindrome(s) {
  // Your code here
}`,
        testCases: [
            { input: 'longestPalindrome("babad")', expected: '"bab"' },
            { input: 'longestPalindrome("cbbd")', expected: '"bb"' }
        ]
    },
    {
        id: '129',
        title: 'Palindromic Substrings',
        description: 'Given a string `s`, return the number of palindromic substrings in it.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['DSA', 'Strings', 'Dynamic Programming'],
        language: 'javascript',
        initialCode: `function countSubstrings(s) {
  // Your code here
}`,
        testCases: [
            { input: 'countSubstrings("abc")', expected: '3' },
            { input: 'countSubstrings("aaa")', expected: '6' }
        ]
    },
    {
        id: '130',
        title: 'Decode Ways',
        description: 'A message containing letters from A-Z can be encoded into numbers using the mapping \'A\' -> "1", \'B\' -> "2", ..., \'Z\' -> "26". Given a string `s` containing only digits, return the number of ways to decode it.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['DSA', 'Strings', 'Dynamic Programming'],
        language: 'javascript',
        initialCode: `function numDecodings(s) {
  // Your code here
}`,
        testCases: [
            { input: 'numDecodings("12")', expected: '2' },
            { input: 'numDecodings("226")', expected: '3' },
            { input: 'numDecodings("06")', expected: '0' }
        ]
    },
    {
        id: '131',
        title: 'Coin Change II',
        description: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the number of combinations that make up that amount.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['DSA', 'Arrays', 'Dynamic Programming'],
        language: 'javascript',
        initialCode: `function change(amount, coins) {
  // Your code here
}`,
        testCases: [
            { input: 'change(5, [1,2,5])', expected: '4' },
            { input: 'change(3, [2])', expected: '0' },
            { input: 'change(10, [10])', expected: '1' }
        ]
    },
    {
        id: '132',
        title: 'Target Sum',
        description: 'You are given an integer array `nums` and an integer `target`. You want to build an expression out of nums by adding one of the symbols \'+\' and \'-\' before each integer in nums and then concatenate all the integers.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 125,
        tags: ['DSA', 'Arrays', 'Dynamic Programming', 'Backtracking'],
        language: 'javascript',
        initialCode: `function findTargetSumWays(nums, target) {
  // Your code here
}`,
        testCases: [
            { input: 'findTargetSumWays([1,1,1,1,1], 3)', expected: '5' },
            { input: 'findTargetSumWays([1], 1)', expected: '1' }
        ]
    },
    {
        id: '133',
        title: 'Longest Common Substring',
        description: 'Given two strings `S1` and `S2`, find the length of the longest common substring.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['DSA', 'Strings', 'Dynamic Programming'],
        language: 'javascript',
        initialCode: `function longestCommonSubstring(s1, s2) {
  // Your code here
}`,
        testCases: [
            { input: 'longestCommonSubstring("abcde", "abfce")', expected: '2' }
        ]
    },
    {
        id: '134',
        title: 'Interleaving String',
        description: 'Given strings `s1`, `s2`, and `s3`, find whether `s3` is formed by an interleaving of `s1` and `s2`.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 130,
        tags: ['DSA', 'Strings', 'Dynamic Programming'],
        language: 'javascript',
        initialCode: `function isInterleave(s1, s2, s3) {
  // Your code here
}`,
        testCases: [
            { input: 'isInterleave("aabcc", "dbbca", "aadbbcbcac")', expected: 'true' },
            { input: 'isInterleave("aabcc", "dbbca", "aadbbbaccc")', expected: 'false' }
        ]
    },
    {
        id: '135',
        title: 'Regular Expression Matching',
        description: 'Given an input string `s` and a pattern `p`, implement regular expression matching with support for \'.\' and \'*\' where \'.\' Matches any single character and \'*\' Matches zero or more of the preceding element.',
        difficulty: 'Expert',
        type: 'Algorithm',
        xp: 450,
        tags: ['DSA', 'Strings', 'Dynamic Programming', 'Recursion'],
        language: 'javascript',
        initialCode: `function isMatch(s, p) {
  // Your code here
}`,
        testCases: [
            { input: 'isMatch("aa", "a")', expected: 'false' },
            { input: 'isMatch("aa", "a*")', expected: 'true' },
            { input: 'isMatch("ab", ".*")', expected: 'true' }
        ]
    },
    {
        id: '136',
        title: 'Wildcard Matching',
        description: 'Given an input string `s` and a pattern `p`, implement wildcard pattern matching with support for \'?\' and \'*\' where \'?\' Matches any single character and \'*\' Matches any sequence of characters (including the empty sequence).',
        difficulty: 'Expert',
        type: 'Algorithm',
        xp: 400,
        tags: ['DSA', 'Strings', 'Dynamic Programming', 'Greedy', 'Recursion'],
        language: 'javascript',
        initialCode: `function isMatch(s, p) {
  // Your code here
}`,
        testCases: [
            { input: 'isMatch("aa", "a")', expected: 'false' },
            { input: 'isMatch("aa", "*")', expected: 'true' },
            { input: 'isMatch("cb", "?a")', expected: 'false' }
        ]
    },
    {
        id: '137',
        title: 'N-Queens',
        description: 'The n-queens puzzle is the problem of placing n queens on an `n x n` chessboard such that no two queens attack each other.',
        difficulty: 'Expert',
        type: 'Algorithm',
        xp: 500,
        tags: ['DSA', 'Arrays', 'Backtracking'],
        language: 'javascript',
        initialCode: `function solveNQueens(n) {
  // Your code here
}`,
        testCases: [
            { input: 'solveNQueens(4)', expected: '[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]' }
        ]
    },
    {
        id: '138',
        title: 'Word Ladder',
        description: 'A transformation sequence from word `beginWord` to word `endWord` using a dictionary `wordList` is a sequence of words `beginWord -> s1 -> s2 -> ... -> sk` such that: Every adjacent pair of words differs by a single letter.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 350,
        tags: ['DSA', 'Hash Table', 'Strings', 'Breadth-First Search'],
        language: 'javascript',
        initialCode: `function ladderLength(beginWord, endWord, wordList) {
  // Your code here
}`,
        testCases: [
            { input: 'ladderLength("hit", "cog", ["hot","dot","dog","lot","log","cog"])', expected: '5' },
            { input: 'ladderLength("hit", "cog", ["hot","dot","dog","lot","log"])', expected: '0' }
        ]
    },
    {
        id: '139',
        title: 'Minimum Window Substring',
        description: 'Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string "".',
        difficulty: 'Expert',
        type: 'Algorithm',
        xp: 400,
        tags: ['DSA', 'Hash Table', 'Strings', 'Sliding Window'],
        language: 'javascript',
        initialCode: `function minWindow(s, t) {
  // Your code here
}`,
        testCases: [
            { input: 'minWindow("ADOBECODEBANC", "ABC")', expected: '"BANC"' },
            { input: 'minWindow("a", "a")', expected: '"a"' },
            { input: 'minWindow("a", "aa")', expected: '""' }
        ]
    },
    {
        id: '200',
        title: 'Python List Comprehension',
        description: 'Given a list of integers, use a list comprehension to create a new list containing only the even numbers.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['Python', 'Basics'],
        language: 'python',
        initialCode: `def get_evens(nums):
    # Your code here
    pass`,
        testCases: [
            { input: 'get_evens([1, 2, 3, 4, 5, 6])', expected: '[2, 4, 6]' }
        ]
    },
    {
        id: '201',
        title: 'Dictionary Merging',
        description: 'Write a function to merge two Python dictionaries. If a key exists in both, the value from the second dictionary should overwrite the first.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 35,
        tags: ['Python', 'Basics'],
        language: 'python',
        initialCode: `def merge_dicts(d1, d2):
    # Your code here
    pass`,
        testCases: [
            { input: 'merge_dicts({"a": 1}, {"b": 2})', expected: '{"a": 1, "b": 2}' }
        ]
    },
    {
        id: '202',
        title: 'Reverse Words in String (Python)',
        description: 'Given a string, reverse the order of words. For example, "hello world" becomes "world hello".',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['Python', 'Strings'],
        language: 'python',
        initialCode: `def reverse_words(s):
    # Your code here
    pass`,
        testCases: [
            { input: 'reverse_words("the sky is blue")', expected: '"blue is sky the"' }
        ]
    },
    {
        id: '203',
        title: 'Fibonacci Generator',
        description: 'Implement a generator function that yields the first `n` numbers in the Fibonacci sequence.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 90,
        tags: ['Python', 'Generators'],
        language: 'python',
        initialCode: `def fib_gen(n):
    # Your code here
    pass`,
        testCases: []
    },
    {
        id: '204',
        title: 'Sort List of Tuples',
        description: 'Given a list of tuples representing (name, age), sort the list by age in ascending order.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 45,
        tags: ['Python', 'Basics'],
        language: 'python',
        initialCode: `def sort_by_age(data):
    # Your code here
    pass`,
        testCases: [
            { input: 'sort_by_age([("Alice", 25), ("Bob", 20)])', expected: '[("Bob", 20), ("Alice", 25)]' }
        ]
    },
    {
        id: '205',
        title: 'Frequency of Elements',
        description: 'Return a dictionary containing the frequency of each element in a list.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['Python', 'Basics'],
        language: 'python',
        initialCode: `def get_frequency(nums):
    # Your code here
    pass`,
        testCases: [
            { input: 'get_frequency([1, 1, 2, 3, 2])', expected: '{1: 2, 2: 2, 3: 1}' }
        ]
    },
    {
        id: '206',
        title: 'Palindrome Check (Pythonic)',
        description: 'Check if a string is a palindrome using Python slicing.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['Python', 'Strings'],
        language: 'python',
        initialCode: `def is_palindrome(s):
    # Your code here
    pass`,
        testCases: [
            { input: 'is_palindrome("racecar")', expected: 'True' }
        ]
    },
    {
        id: '207',
        title: 'Unique Elements in List',
        description: 'Given a list with duplicates, return a new list with only unique elements, preserving order if possible.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 35,
        tags: ['Python', 'Basics'],
        language: 'python',
        initialCode: `def get_unique(nums):
    # Your code here
    pass`,
        testCases: [
            { input: 'get_unique([1, 2, 2, 3, 1])', expected: '[1, 2, 3]' }
        ]
    },
    {
        id: '208',
        title: 'Flatten Nested List (Py)',
        description: 'Flatten a 2D list into a 1D list.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['Python', 'Basics'],
        language: 'python',
        initialCode: `def flatten_list(nested):
    # Your code here
    pass`,
        testCases: [
            { input: 'flatten_list([[1, 2], [3, 4]])', expected: '[1, 2, 3, 4]' }
        ]
    },
    {
        id: '209',
        title: 'Check Anagram (Python)',
        description: 'Use Python Collections to check if two strings are anagrams.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['Python', 'Basics'],
        language: 'python',
        initialCode: `from collections import Counter
def are_anagrams(s1, s2):
    # Your code here
    pass`,
        testCases: [
            { input: 'are_anagrams("listen", "silent")', expected: 'True' }
        ]
    },
    {
        id: '210',
        title: 'Find Longest Word',
        description: 'Return the longest word in a list of words. If multiple, return the first one.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 35,
        tags: ['Python', 'Strings'],
        language: 'python',
        initialCode: `def longest_word(words):
    # Your code here
    pass`,
        testCases: [
            { input: 'longest_word(["apple", "banana", "cherry"])', expected: '"banana"' }
        ]
    },
    {
        id: '211',
        title: 'Sum of Digits (Python)',
        description: 'Given an integer, return the sum of its digits.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['Python', 'Math'],
        language: 'python',
        initialCode: `def sum_digits(n):
    # Your code here
    pass`,
        testCases: [
            { input: 'sum_digits(123)', expected: '6' }
        ]
    },
    {
        id: '212',
        title: 'Merge Sorted Lists (Py)',
        description: 'Merge two already sorted lists into one sorted list.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 45,
        tags: ['Python', 'Basics'],
        language: 'python',
        initialCode: `def merge_sorted(l1, l2):
    # Your code here
    pass`,
        testCases: [
            { input: 'merge_sorted([1, 3], [2, 4])', expected: '[1, 2, 3, 4]' }
        ]
    },
    {
        id: '213',
        title: 'Power of Two (Python)',
        description: 'Check if a number is a power of 2 using bitwise operations.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['Python', 'Bitwise'],
        language: 'python',
        initialCode: `def is_power_of_two(n):
    # Your code here
    pass`,
        testCases: [
            { input: 'is_power_of_two(16)', expected: 'True' },
            { input: 'is_power_of_two(10)', expected: 'False' }
        ]
    },
    {
        id: '214',
        title: 'Prime Number Check',
        description: 'Write a basic prime number checker.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['Python', 'Math'],
        language: 'python',
        initialCode: `def is_prime(n):
    # Your code here
    pass`,
        testCases: [
            { input: 'is_prime(7)', expected: 'True' },
            { input: 'is_prime(4)', expected: 'False' }
        ]
    },
    {
        id: '215',
        title: 'Longest Substring without repeating (Python)',
        description: 'Sliding window approach in Python.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['Python', 'Sliding Window'],
        language: 'python',
        initialCode: `def length_of_longest_substring(s):
    # Your code here
    pass`,
        testCases: [
            { input: 'length_of_longest_substring("abcabcbb")', expected: '3' }
        ]
    },
    {
        id: '216',
        title: 'Binary Search (Python)',
        description: 'Implement binary search recursively or iteratively.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['Python', 'Searching'],
        language: 'python',
        initialCode: `def binary_search(nums, target):
    # Your code here
    pass`,
        testCases: [
            { input: 'binary_search([1, 2, 3, 4, 5], 3)', expected: '2' }
        ]
    },
    {
        id: '217',
        title: 'Decorator for Timing',
        description: 'Create a decorator that calculates the execution time of a function.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 130,
        tags: ['Python', 'Decorators'],
        language: 'python',
        initialCode: `import time
def time_it(func):
    # Your code here
    pass`,
        testCases: []
    },
    {
        id: '218',
        title: 'Context Manager (File)',
        description: 'Write a custom context manager using `@contextmanager` to handle file opening.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['Python', 'Context Managers'],
        language: 'python',
        initialCode: `from contextlib import contextmanager
@contextmanager
def open_file(name):
    # Your code here
    pass`,
        testCases: []
    },
    {
        id: '219',
        title: 'Find Missing Number (Python)',
        description: 'In an array of 1 to n, one number is missing. Find it.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['Python', 'Math'],
        language: 'python',
        initialCode: `def find_missing(nums, n):
    # Your code here
    pass`,
        testCases: [
            { input: 'find_missing([1, 2, 4, 5], 5)', expected: '3' }
        ]
    },
    {
        id: '220',
        title: 'Validate Subsequence (Python)',
        description: 'Given two arrays, determine if the second one is a subsequence of the first.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['Python', 'Arrays'],
        language: 'python',
        initialCode: `def is_subsequence(array, sequence):
    # Your code here
    pass`,
        testCases: [
            { input: 'is_subsequence([5, 1, 22, 25, 6, -1, 8, 10], [1, 6, -1, 10])', expected: 'True' }
        ]
    },
    {
        id: '221',
        title: 'Check Subtree of Another Tree',
        description: 'Binary Tree problem in Python.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 140,
        tags: ['Python', 'Trees'],
        language: 'python',
        initialCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_subtree(root, subRoot):
    # Your code here
    pass`,
        testCases: []
    },
    {
        id: '222',
        title: 'Group Anagrams (Python)',
        description: 'Using DefaultDict to group anagrams.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['Python', 'Hash Map'],
        language: 'python',
        initialCode: `from collections import defaultdict
def group_anagrams(strs):
    # Your code here
    pass`,
        testCases: []
    },
    {
        id: '223',
        title: 'Longest Palindromic Substring (Python)',
        description: 'Medium difficulty string problem.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 130,
        tags: ['Python', 'Dynamic Programming'],
        language: 'python',
        initialCode: `def longest_palindrome(s):
    # Your code here
    pass`,
        testCases: [
            { input: 'longest_palindrome("babad")', expected: '"bab"' }
        ]
    },
    {
        id: '224',
        title: 'Minimum Path Sum (Python)',
        description: '2D DP problem.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 130,
        tags: ['Python', 'Dynamic Programming'],
        language: 'python',
        initialCode: `def min_path_sum(grid):
    # Your code here
    pass`,
        testCases: []
    },
    {
        id: '225',
        title: 'Python Class Inheritance',
        description: 'Create a `Animal` parent class and a `Dog` child class. The `Dog` should override a method `speak`.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['Python', 'OOP'],
        language: 'python',
        initialCode: `class Animal:
    def speak(self):
        return "..."

class Dog(Animal):
    # Your code
    pass`,
        testCases: []
    },
    {
        id: '226',
        title: 'Static Methods (Python)',
        description: 'Implement a class with a static method that adds two numbers.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 35,
        tags: ['Python', 'OOP'],
        language: 'python',
        initialCode: `class MathUtils:
    @staticmethod
    def add(a, b):
        # Your code here
        pass`,
        testCases: []
    },
    {
        id: '227',
        title: 'Property Decorator',
        description: 'Use the `@property` decorator to create a getter and setter for a private attribute.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['Python', 'OOP'],
        language: 'python',
        initialCode: `class Circle:
    def __init__(self, radius):
        self._radius = radius
    
    # Add property here`,
        testCases: []
    },
    {
        id: '228',
        title: 'Python Argparse Basics',
        description: 'Simulate parsing a `--name` argument from a list of strings.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 90,
        tags: ['Python', 'CLI'],
        language: 'python',
        initialCode: `import argparse
def parse_name(args_list):
    # Your code
    pass`,
        testCases: []
    },
    {
        id: '229',
        title: 'Regular Expressions (Python)',
        description: 'Extract all email addresses from a given text using `re`.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['Python', 'Regex'],
        language: 'python',
        initialCode: `import re
def extract_emails(text):
    # Your code
    pass`,
        testCases: []
    },
    {
        id: '230',
        title: 'Multiprocessing Basics',
        description: 'Run a simple function using Python\'s `multiprocessing` pool.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 140,
        tags: ['Python', 'Parallelism'],
        language: 'python',
        initialCode: `import multiprocessing
def square(n):
    return n * n

def parallel_squares(nums):
    # Your code
    pass`,
        testCases: []
    },
    {
        id: '231',
        title: 'Asyncio Gather',
        description: 'Use `asyncio.gather` to run multiple coroutines concurrently.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 150,
        tags: ['Python', 'Asyncio'],
        language: 'python',
        initialCode: `import asyncio
async def task(n):
    await asyncio.sleep(0.1)
    return n

async def run_parallel():
    # Your code
    pass`,
        testCases: []
    },
    {
        id: '232',
        title: 'JSON Parsing (Python)',
        description: 'Load a JSON string and extract a specific nested value.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['Python', 'JSON'],
        language: 'python',
        initialCode: `import json
def get_val(j_str, key):
    # Your code
    pass`,
        testCases: []
    },
    {
        id: '233',
        title: 'Custom Exception (Python)',
        description: 'Define and raise a custom exception named `ValueTooSmallError`.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 35,
        tags: ['Python', 'Exceptions'],
        language: 'python',
        initialCode: `# Define here
def check_value(n):
    if n < 10:
        # Raise here
        pass`,
        testCases: []
    },
    {
        id: '234',
        title: 'Lambda Functions (Python)',
        description: 'Use lambda with `filter` to get all numbers greater than 10.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['Python', 'Functional'],
        language: 'python',
        initialCode: `def filter_nums(nums):
    # Your code
    pass`,
        testCases: [
            { input: 'filter_nums([5, 12, 8, 20])', expected: '[12, 20]' }
        ]
    },
    {
        id: '235',
        title: 'Sorting with Lambda',
        description: 'Sort a list of dictionaries by a specific key using a lambda function.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['Python', 'Basics'],
        language: 'python',
        initialCode: `def sort_dicts(data, key):
    # Your code
    pass`,
        testCases: []
    },
    {
        id: '236',
        title: 'Any and All (Python)',
        description: 'Determine if all elements in a list are positive, or if any element is even.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 35,
        tags: ['Python', 'Basics'],
        language: 'python',
        initialCode: `def check_list(nums):
    # return (all_positive, any_even)
    pass`,
        testCases: []
    },
    {
        id: '237',
        title: 'Zip and Enumerate',
        description: 'Combine two lists into a dictionary where the first list is keys and second is values.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 35,
        tags: ['Python', 'Basics'],
        language: 'python',
        initialCode: `def list_to_dict(keys, values):
    # Your code
    pass`,
        testCases: []
    },
    {
        id: '238',
        title: 'NamedTuples Basics',
        description: 'Create a NamedTuple for a `Point` and return its distance from origin.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 50,
        tags: ['Python', 'Data Structures'],
        language: 'python',
        initialCode: `from collections import namedtuple
def get_distance(x, y):
    # Your code
    pass`,
        testCases: []
    },
    {
        id: '239',
        title: 'DataClasses Basics',
        description: 'Define a simple `@dataclass` for a `Product` with name and price.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['Python', 'OOP'],
        language: 'python',
        initialCode: `from dataclasses import dataclass
# Your code here`,
        testCases: []
    },
    {
        id: '240',
        title: 'LRU Cache (Python)',
        description: 'Use `functools.lru_cache` to optimize a recursive function.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['Python', 'Performance'],
        language: 'python',
        initialCode: `from functools import lru_cache
def fib(n):
    # Add decorator and implementation
    pass`,
        testCases: []
    },
    {
        id: '241',
        title: 'Memoization (Manual)',
        description: 'Implement a memoization decorator manually.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 220,
        tags: ['Python', 'Functional'],
        language: 'python',
        initialCode: `def memoize(func):
    # Your code
    pass`,
        testCases: []
    },
    {
        id: '242',
        title: 'Metaclass Basics',
        description: 'Create a simple metaclass that adds a property to every class it creates.',
        difficulty: 'Expert',
        type: 'Algorithm',
        xp: 400,
        tags: ['Python', 'Advanced'],
        language: 'python',
        initialCode: `class MyMeta(type):
    # Your code
    pass`,
        testCases: []
    },
    {
        id: '243',
        title: 'Graph DFS (Python)',
        description: 'Implement DFS for a graph adjacency list.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 250,
        tags: ['Python', 'Graphs'],
        language: 'python',
        initialCode: `def dfs(graph, start, visited=None):
    # Your code
    pass`,
        testCases: []
    },
    {
        id: '244',
        title: 'Trie Implementation (Python)',
        description: 'Implement insert and search for a Trie.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 280,
        tags: ['Python', 'Trees'],
        language: 'python',
        initialCode: `class TrieNode:
    # Your code
    pass`,
        testCases: []
    },
    {
        id: '245',
        title: 'Knapsack Problem (Python)',
        description: 'Classic 0/1 Knapsack problem.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 300,
        tags: ['Python', 'Dynamic Programming'],
        language: 'python',
        initialCode: `def knapsack(weights, values, capacity):
    # Your code
    pass`,
        testCases: []
    },
    {
        id: '246',
        title: 'Segment Tree (Python)',
        description: 'Implement a segment tree for range sum queries.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 320,
        tags: ['Python', 'Advanced DS'],
        language: 'python',
        initialCode: `class SegmentTree:
    # Your code
    pass`,
        testCases: []
    },
    {
        id: '247',
        title: 'Traveling Salesman (Python)',
        description: 'Find minimum path cost for TSP using dynamic programming.',
        difficulty: 'Expert',
        type: 'Algorithm',
        xp: 500,
        tags: ['Python', 'Algorithms'],
        language: 'python',
        initialCode: `def tsp(dist_matrix):
    # Your code
    pass`,
        testCases: []
    },
    {
        id: '248',
        title: 'Sudoku Solver (Python)',
        description: 'Python implementation of Sudoku solver.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 350,
        tags: ['Python', 'Backtracking'],
        language: 'python',
        initialCode: `def solve_sudoku(board):
    # Your code
    pass`,
        testCases: []
    },
    {
        id: '249',
        title: 'A* Pathfinding (Python)',
        description: 'Implement A* algorithm on a grid.',
        difficulty: 'Expert',
        type: 'Algorithm',
        xp: 450,
        tags: ['Python', 'Algorithms'],
        language: 'python',
        initialCode: `def a_star(grid, start, end):
    # Your code
    pass`,
        testCases: []
    },
    {
        id: '250',
        title: 'Go Hello World (Function)',
        description: 'Return the string "Hello, Go!" from the function.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 20,
        tags: ['Go', 'Basics'],
        language: 'go',
        initialCode: `func helloGo() string {
    // Your code here
    return ""
}`,
        testCases: [
            { input: 'helloGo()', expected: '"Hello, Go!"' }
        ]
    },
    {
        id: '251',
        title: 'Go Variable Declaration',
        description: 'Declare variables of types int, float64, and string and return them as a tuple.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 25,
        tags: ['Go', 'Basics'],
        language: 'go',
        initialCode: `func declareVars() (int, float64, string) {
    // Your code
    return 0, 0.0, ""
}`,
        testCases: []
    },
    {
        id: '252',
        title: 'Go Struct Definition',
        description: 'Define a Person struct with Name (string) and Age (int).',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['Go', 'Basics'],
        language: 'go',
        initialCode: `type Person struct {
    // Your code
}`,
        testCases: []
    },
    {
        id: '253',
        title: 'Go Methods (Struct)',
        description: 'Implement a Greet() method for the Person struct that returns "Hello, I am [Name]".',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 35,
        tags: ['Go', 'Basics'],
        language: 'go',
        initialCode: `func (p Person) Greet() string {
    // Your code
    return ""
}`,
        testCases: []
    },
    {
        id: '254',
        title: 'Go Pointers Basics',
        description: 'Write a function that takes a pointer to an int and increments the value.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['Go', 'Pointers'],
        language: 'go',
        initialCode: `func increment(n *int) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '255',
        title: 'Go Slices Basics',
        description: 'Create a slice of ints, append a value, and return the slice.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['Go', 'Slices'],
        language: 'go',
        initialCode: `func appendToSlice(s []int, v int) []int {
    // Your code
    return nil
}`,
        testCases: []
    },
    {
        id: '256',
        title: 'Go Maps Basics',
        description: 'Create a map where keys are strings and values are ints. Set a value and return the map.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['Go', 'Maps'],
        language: 'go',
        initialCode: `func createMap() map[string]int {
    // Your code
    return nil
}`,
        testCases: []
    },
    {
        id: '257',
        title: 'Go For Loop (Range)',
        description: 'Iterate over a slice and return the sum of all elements.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['Go', 'Loops'],
        language: 'go',
        initialCode: `func sumSlice(nums []int) int {
    // Your code
    return 0
}`,
        testCases: []
    },
    {
        id: '258',
        title: 'Go Switch Statement',
        description: 'Use a switch statement to return the day name based on an int (1-7).',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 35,
        tags: ['Go', 'Control Flow'],
        language: 'go',
        initialCode: `func getDay(n int) string {
    // Your code
    return ""
}`,
        testCases: []
    },
    {
        id: '259',
        title: 'Go Error Handling (Multiple Returns)',
        description: 'Return a result and an error. If divisor is 0, return custom error.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 45,
        tags: ['Go', 'Errors'],
        language: 'go',
        initialCode: `import "errors"
func divide(a, b int) (int, error) {
    // Your code
    return 0, nil
}`,
        testCases: []
    },
    {
        id: '260',
        title: 'Go Interfaces (Shapes)',
        description: 'Define a Shape interface with an Area() method. Implement it for Rect struct.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['Go', 'Interfaces'],
        language: 'go',
        initialCode: `type Shape interface {
    Area() float64
}

type Rect struct {
    Width, Height float64
}
// Implement Area() for Rect`,
        testCases: []
    },
    {
        id: '261',
        title: 'Go Goroutines Basics',
        description: 'Launch a goroutine that prints "Done". (Conceptual code).',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['Go', 'Concurrency'],
        language: 'go',
        initialCode: `func runAsync() {
    // Launch goroutine
}`,
        testCases: []
    },
    {
        id: '262',
        title: 'Go Channels (Simple Send/Recv)',
        description: 'Send an int to a channel and receive it back.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['Go', 'Concurrency'],
        language: 'go',
        initialCode: `func comm() int {
    ch := make(chan int)
    // Send and Receive
    return 0
}`,
        testCases: []
    },
    {
        id: '263',
        title: 'Go Buffered Channels',
        description: 'Create a buffered channel with capacity 2 and send two values.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 130,
        tags: ['Go', 'Concurrency'],
        language: 'go',
        initialCode: `func buffered() {
    // Your code
}`,
        testCases: []
    },
    {
        id: '264',
        title: 'Go Channel Closing',
        description: 'Send multiple values and close the channel. Range over it in another function.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 140,
        tags: ['Go', 'Concurrency'],
        language: 'go',
        initialCode: `func sendAndClose(ch chan int) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '265',
        title: 'Go Select Statement',
        description: 'Use `select` to handle multiple channel operations.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 150,
        tags: ['Go', 'Concurrency'],
        language: 'go',
        initialCode: `func handleMultiple(c1, c2 chan string) string {
    // select here
    return ""
}`,
        testCases: []
    },
    {
        id: '266',
        title: 'Go WaitGroups',
        description: 'Use `sync.WaitGroup` to wait for goroutines to finish.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 160,
        tags: ['Go', 'Concurrency'],
        language: 'go',
        initialCode: `import "sync"
func waitTasks() {
    var wg sync.WaitGroup
    // Your code
}`,
        testCases: []
    },
    {
        id: '267',
        title: 'Go Mutex Basics',
        description: 'Use `sync.Mutex` to protect a shared variable.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 150,
        tags: ['Go', 'Concurrency'],
        language: 'go',
        initialCode: `import "sync"
type SafeCounter struct {
    v   map[string]int
    mux sync.Mutex
}
// Implement Inc method`,
        testCases: []
    },
    {
        id: '268',
        title: 'Go Defer Statement',
        description: 'Use `defer` to ensure a file is closed (conceptual).',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['Go', 'Basics'],
        language: 'go',
        initialCode: `func processFile() {
    // Sim open
    // defer close
}`,
        testCases: []
    },
    {
        id: '269',
        title: 'Go Type Assertion',
        description: 'Check if an interface{} holds a specific type.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 90,
        tags: ['Go', 'Interfaces'],
        language: 'go',
        initialCode: `func checkType(i interface{}) (string, bool) {
    // Type assertion
    return "", false
}`,
        testCases: []
    },
    {
        id: '270',
        title: 'Go Variadic Functions',
        description: 'Write a function that takes variable number of ints and returns their sum.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 35,
        tags: ['Go', 'Basics'],
        language: 'go',
        initialCode: `func sum(nums ...int) int {
    // Your code
    return 0
}`,
        testCases: []
    },
    {
        id: '271',
        title: 'Go Closures (Generator)',
        description: 'Implement a function that returns a closure that returns incrementing ints.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['Go', 'Functions'],
        language: 'go',
        initialCode: `func intSeq() func() int {
    // Your code
    return nil
}`,
        testCases: []
    },
    {
        id: '272',
        title: 'Go Array Basics',
        description: 'Declare an array of size 5 and set the first element.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 20,
        tags: ['Go', 'Basics'],
        language: 'go',
        initialCode: `func arrays() [5]int {
    // Your code
    var a [5]int
    return a
}`,
        testCases: []
    },
    {
        id: '273',
        title: 'Go String Conversion (strconv)',
        description: 'Convert an int to a string and vice-versa.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['Go', 'Basics'],
        language: 'go',
        initialCode: `import "strconv"
func convert(n int) string {
    // Your code
    return ""
}`,
        testCases: []
    },
    {
        id: '274',
        title: 'Go JSON Marshalling',
        description: 'Convert a struct to a JSON string.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['Go', 'Basics'],
        language: 'go',
        initialCode: `import "encoding/json"
func toJSON(p Person) string {
    // Your code
    return ""
}`,
        testCases: []
    },
    {
        id: '275',
        title: 'Go HTTP Client (Get)',
        description: 'Use `net/http` to make a simple GET request and return the status code.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['Go', 'Networking'],
        language: 'go',
        initialCode: `import "net/http"
func getStatus(url string) (int, error) {
    // Your code
    return 0, nil
}`,
        testCases: []
    },
    {
        id: '276',
        title: 'Go Context Timeout',
        description: 'Create a context with a 100ms timeout and wait for it to expire.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 200,
        tags: ['Go', 'Context'],
        language: 'go',
        initialCode: `import (
    "context"
    "time"
)
func waitTimeout() {
    // Your code
}`,
        testCases: []
    },
    {
        id: '277',
        title: 'Go Init Function',
        description: 'Demonstrate with a comment where the `init()` function should be placed.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 20,
        tags: ['Go', 'Basics'],
        language: 'go',
        initialCode: `// Define init function here`,
        testCases: []
    },
    {
        id: '278',
        title: 'Go Pointer Receivers',
        description: 'Why use pointer receivers? Implement a method that modifies the struct state.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 90,
        tags: ['Go', 'Pointers'],
        language: 'go',
        initialCode: `type Counter struct { val int }
func (c *Counter) Add() {
    // Your code
}`,
        testCases: []
    },
    {
        id: '279',
        title: 'Go Embedding (Composition)',
        description: 'Embed the `Person` struct into an `Employee` struct.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 50,
        tags: ['Go', 'Basics'],
        language: 'go',
        initialCode: `type Employee struct {
    // Embed Person
    ID int
}`,
        testCases: []
    },
    {
        id: '280',
        title: 'Go Testing (Unit Test)',
        description: 'Write a basic test function signature for a `Sum` function.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['Go', 'Testing'],
        language: 'go',
        initialCode: `import "testing"
func TestSum(t *testing.T) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '281',
        title: 'Go Table Driven Tests',
        description: 'Implement a table-driven test for a `Square` function.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 130,
        tags: ['Go', 'Testing'],
        language: 'go',
        initialCode: `func TestSquare(t *testing.T) {
    tests := []struct {
        input, want int
    }{
        {2, 4},
        {3, 9},
    }
    // Loop and check
}`,
        testCases: []
    },
    {
        id: '282',
        title: 'Go Reflections Basics',
        description: 'Use `reflect` to find the type of a variable at runtime.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 250,
        tags: ['Go', 'Reflection'],
        language: 'go',
        initialCode: `import "reflect"
func getType(v interface{}) string {
    // Your code
    return ""
}`,
        testCases: []
    },
    {
        id: '283',
        title: 'Go Function Types',
        description: 'Declare a function type `Op` that takes two ints and returns an int.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 80,
        tags: ['Go', 'Functions'],
        language: 'go',
        initialCode: `type Op func(int, int) int`,
        testCases: []
    },
    {
        id: '284',
        title: 'Go Slices Capacity',
        description: 'Explain the difference between length and capacity with a code example.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 90,
        tags: ['Go', 'Slices'],
        language: 'go',
        initialCode: `func sliceCap() {
    s := make([]int, 3, 5)
    // Print len and cap
}`,
        testCases: []
    },
    {
        id: '285',
        title: 'Go Worker Pool',
        description: 'Implement a worker pool with 3 workers consuming from one channel.',
        difficulty: 'Expert',
        type: 'Algorithm',
        xp: 400,
        tags: ['Go', 'Concurrency'],
        language: 'go',
        initialCode: `func worker(id int, jobs <-chan int, results chan<- int) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '286',
        title: 'Go Fan-In pattern',
        description: 'Merge two channels into one.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 300,
        tags: ['Go', 'Concurrency'],
        language: 'go',
        initialCode: `func fanIn(c1, c2 <-chan string) <-chan string {
    // Your code
    return nil
}`,
        testCases: []
    },
    {
        id: '287',
        title: 'Go Rate Limiting',
        description: 'Use `time.Tick` to implement a simple rate limiter.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 280,
        tags: ['Go', 'Loops'],
        language: 'go',
        initialCode: `import "time"
func limit() {
    requests := make(chan int, 5)
    limiter := time.Tick(200 * time.Millisecond)
    // Your code
}`,
        testCases: []
    },
    {
        id: '288',
        title: 'Go Binary Tree (Go Style)',
        description: 'Implement a binary tree search function in Go.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 140,
        tags: ['Go', 'Data Structures'],
        language: 'go',
        initialCode: `type Node struct {
    Val   int
    Left  *Node
    Right *Node
}
func search(root *Node, target int) bool {
    // Your code
    return false
}`,
        testCases: []
    },
    {
        id: '289',
        title: 'Go Linked List Reverse',
        description: 'Reverse a singly linked list in Go.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 130,
        tags: ['Go', 'Data Structures'],
        language: 'go',
        initialCode: `type ListNode struct {
    Val  int
    Next *ListNode
}
func reverse(head *ListNode) *ListNode {
    // Your code
    return nil
}`,
        testCases: []
    },
    {
        id: '290',
        title: 'Go Heap (Container/Heap)',
        description: 'Implement the `heap.Interface` for an IntHeap.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 320,
        tags: ['Go', 'Data Structures'],
        language: 'go',
        initialCode: `import "container/heap"
type IntHeap []int
// Implement Len, Less, Swap, Push, Pop`,
        testCases: []
    },
    {
        id: '291',
        title: 'Go Sorting (Custom)',
        description: 'Sort a slice of Persons by age using `sort.Slice`.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['Go', 'Sorting'],
        language: 'go',
        initialCode: `import "sort"
func sortPeople(people []Person) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '292',
        title: 'Go Environment Variables',
        description: 'Read an environment variable using `os.Getenv`.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['Go', 'Basics'],
        language: 'go',
        initialCode: `import "os"
func getEnv(key string) string {
    // Your code
    return ""
}`,
        testCases: []
    },
    {
        id: '293',
        title: 'Go File Write',
        description: 'Write a string to a file using `os.WriteFile`.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 45,
        tags: ['Go', 'Basics'],
        language: 'go',
        initialCode: `import "os"
func writeFile(path, content string) error {
    // Your code
    return nil
}`,
        testCases: []
    },
    {
        id: '294',
        title: 'Go Command Line Flags',
        description: 'Define a boolean flag `-v` using the `flag` package.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['Go', 'CLI'],
        language: 'go',
        initialCode: `import "flag"
func defineFlag() {
    // Your code
}`,
        testCases: []
    },
    {
        id: '295',
        title: 'Go Regexp Matches',
        description: 'Find the first match of a pattern in a string.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 90,
        tags: ['Go', 'Strings'],
        language: 'go',
        initialCode: `import "regexp"
func firstMatch(pat, text string) string {
    // Your code
    return ""
}`,
        testCases: []
    },
    {
        id: '296',
        title: 'Go Atomic Operations',
        description: 'Increment a counter safely using `sync/atomic`.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 150,
        tags: ['Go', 'Concurrency'],
        language: 'go',
        initialCode: `import "sync/atomic"
func atomicInc(c *uint64) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '297',
        title: 'Go Pipeline Pattern',
        description: 'Implement a simple pipeline: Generator -> Square -> Print.',
        difficulty: 'Expert',
        type: 'Algorithm',
        xp: 450,
        tags: ['Go', 'Concurrency'],
        language: 'go',
        initialCode: `func gen(nums ...int) <-chan int {
    // Your code
    return nil
}`,
        testCases: []
    },
    {
        id: '298',
        title: 'Go Once (sync.Once)',
        description: 'Use `sync.Once` to ensure a function runs only once.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['Go', 'Concurrency'],
        language: 'go',
        initialCode: `import "sync"
var once sync.Once
func setup() {
    // Your code
}`,
        testCases: []
    },
    {
        id: '299',
        title: 'Go Cgo Basics',
        description: 'Show how to import "C" and call a C function (conceptual).',
        difficulty: 'Expert',
        type: 'Algorithm',
        xp: 500,
        tags: ['Go', 'Advanced'],
        language: 'go',
        initialCode: `/*
#include <stdio.h>
void hello() { printf("Hello from C\\n"); }
*/
import "C"
// Your code`,
        testCases: []
    },
    {
        id: '300',
        title: 'SQL Select All',
        description: 'Query all columns for all American cities in the CITY table with populations larger than 100,000. The CountryCode for America is USA.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 20,
        tags: ['SQL', 'Select'],
        language: 'sql',
        initialCode: `-- Your SQL here
SELECT * FROM CITY`,
        testCases: []
    },
    {
        id: '301',
        title: 'SQL Distinct Values',
        description: 'Query a list of CITY names from STATION for cities that have an even ID number. Exclude duplicates.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 25,
        tags: ['SQL', 'Select'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '302',
        title: 'SQL Count Entries',
        description: 'Find the difference between the total number of CITY entries in the table and the number of distinct CITY entries.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['SQL', 'Aggregation'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '303',
        title: 'SQL Shortest Longest City',
        description: 'Query the two cities in STATION with the shortest and longest CITY names, as well as their respective lengths.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['SQL', 'Sorting'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '304',
        title: 'SQL Starts With Vowel',
        description: 'Query the list of CITY names starting with vowels (a, e, i, o, u) from STATION. Your result cannot contain duplicates.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 35,
        tags: ['SQL', 'Regex'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '305',
        title: 'SQL Ends With Vowel',
        description: 'Query the list of CITY names ending with vowels (a, e, i, o, u) from STATION. Your result cannot contain duplicates.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 35,
        tags: ['SQL', 'Regex'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '306',
        title: 'SQL Higher Than 75 Marks',
        description: 'Query the Name of any student in STUDENTS who scored higher than 75 Marks. Order by the last three characters of each name.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['SQL', 'Sorting'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '307',
        title: 'SQL Employees Earning More',
        description: 'Write a query that prints a list of employee names having a salary greater than $2000 per month who have been employees for less than 10 months.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['SQL', 'Filtering'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '308',
        title: 'SQL Type of Triangle',
        description: 'Write a query identifying the type of each record in the TRIANGLES table using its three side lengths (Equilateral, Isosceles, Scalene, or Not A Triangle).',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['SQL', 'Logic'],
        language: 'sql',
        initialCode: `-- Your SQL here
SELECT CASE ... END FROM TRIANGLES`,
        testCases: []
    },
    {
        id: '309',
        title: 'SQL The PADS',
        description: 'Query an alphabetically ordered list of all names in OCCUPATIONS, immediately followed by the first letter of each profession as a parenthetical.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['SQL', 'String Manipulation'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '310',
        title: 'SQL Occupations Pivot',
        description: 'Pivot the Occupation column in OCCUPATIONS so that each Name is sorted alphabetically and displayed underneath its corresponding Occupation.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 300,
        tags: ['SQL', 'Pivoting'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '311',
        title: 'SQL Binary Tree Nodes',
        description: 'Write a query to find the node type of Binary Tree ordered by the value of the node. (Root, Leaf, Inner).',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 130,
        tags: ['SQL', 'Logic'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '312',
        title: 'SQL New Companies',
        description: 'Given the table schemas, write a query to print the company_code, founder name, total number of lead managers, total number of senior managers, etc.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 140,
        tags: ['SQL', 'Joins'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '313',
        title: 'SQL Population Census',
        description: 'Given the CITY and COUNTRY tables, query the sum of the populations of all cities where the CONTINENT is \'Asia\'.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 50,
        tags: ['SQL', 'Aggregation', 'Joins'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '314',
        title: 'SQL African Cities',
        description: 'Given the CITY and COUNTRY tables, query the names of all cities where the CONTINENT is \'Africa\'.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 50,
        tags: ['SQL', 'Joins'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '315',
        title: 'SQL Average Population of Each Continent',
        description: 'Query the names of all continents and their respective average city populations rounded down to the nearest integer.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 50,
        tags: ['SQL', 'Aggregation', 'Joins'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '316',
        title: 'SQL The Report',
        description: 'Generate a report containing three columns: Name, Grade and Mark. Names of students with grade < 8 should be replaced by NULL.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['SQL', 'Joins'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '317',
        title: 'SQL Top Competitors',
        description: 'Write a query to print the id and name of hackers who achieved full scores for more than one challenge.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 150,
        tags: ['SQL', 'Joins', 'Aggregation'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '318',
        title: 'SQL Ollivander\'s Inventory',
        description: 'Wand selection problem: find the minimum number of gold galleons needed to buy each non-evil wand of high power and age.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 160,
        tags: ['SQL', 'Subqueries', 'Joins'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '319',
        title: 'SQL Challenges',
        description: 'Write a query to print the hacker_id, name, and the total number of challenges created by each student.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 170,
        tags: ['SQL', 'Aggregation', 'Having'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '320',
        title: 'SQL Contest Leaderboard',
        description: 'The total score of a hacker is the sum of their maximum scores for all of the challenges. Query the hacker_id, name, and total_score.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 180,
        tags: ['SQL', 'Aggregation', 'Subqueries'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '321',
        title: 'SQL Placements',
        description: 'Write a query to output the names of those students whose best friends got offered a higher salary than them.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 190,
        tags: ['SQL', 'Joins'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '322',
        title: 'SQL Symmetric Pairs',
        description: 'Write a query to output all symmetric pairs (X1, Y1) such that X1 <= Y1.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 200,
        tags: ['SQL', 'Joins'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '323',
        title: 'SQL Intervieus',
        description: 'Write a query to print the contest_id, hacker_id, name, and the sums of total_submissions, etc. for each contest.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 350,
        tags: ['SQL', 'Joins', 'Aggregation'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '324',
        title: 'SQL 15 Days of Learning SQL',
        description: 'Complex query: for each day of the contest, find the total number of unique hackers and the max submissions hacker.',
        difficulty: 'Expert',
        type: 'Algorithm',
        xp: 500,
        tags: ['SQL', 'Advanced'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '325',
        title: 'SQL Population Density Difference',
        description: 'Query the difference between the maximum and minimum populations in CITY.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 20,
        tags: ['SQL', 'Aggregation'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '326',
        title: 'SQL The Blunder',
        description: 'Samantha was tasked with calculating the average monthly salaries for all employees in the EMPLOYEES table, but her keyboard\'s \'0\' key was broken.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['SQL', 'String Manipulation', 'Aggregation'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '327',
        title: 'SQL Top Earners',
        description: 'We define an employee\'s total earnings to be their monthly salary x months worked, and the maximum total earnings to be the maximum total earnings for any employee in the EMPLOYEES table.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['SQL', 'Aggregation'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '328',
        title: 'SQL Weather Station 13',
        description: 'Query the sum of Northern Latitudes (LAT_N) from STATION having values greater than 38.7880 and less than 137.2345. Truncate your answer to 4 decimal places.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 25,
        tags: ['SQL', 'Aggregation'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '329',
        title: 'SQL Weather Station 14',
        description: 'Query the greatest value of the Northern Latitudes (LAT_N) from STATION that is less than 137.2345. Truncate your answer to 4 decimal places.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 25,
        tags: ['SQL', 'Aggregation'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '330',
        title: 'SQL Weather Station 15',
        description: 'Query the Western Longitude (LONG_W) for the largest Northern Latitude (LAT_N) in STATION that is less than 137.2345. Round your answer to 4 decimal places.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['SQL', 'Aggregation'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '331',
        title: 'SQL Weather Station 16',
        description: 'Query the smallest Northern Latitude (LAT_N) from STATION that is greater than 38.7780. Round your answer to 4 decimal places.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 25,
        tags: ['SQL', 'Aggregation'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '332',
        title: 'SQL Weather Station 17',
        description: 'Query the Western Longitude (LONG_W)where the smallest Northern Latitude (LAT_N) in STATION is greater than 38.7780. Round your answer to 4 decimal places.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['SQL', 'Aggregation'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '333',
        title: 'SQL Weather Station 18',
        description: 'Consider P1(a, b) and P2(c, d) to be two points on a 2D plane. Query the Manhattan Distance between points P1 and P2 and round it to a scale of 4 decimal places.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['SQL', 'Math'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '334',
        title: 'SQL Weather Station 19',
        description: 'Consider P1(a, c) and P2(b, d) to be two points on a 2D plane. Query the Euclidean Distance between points P1 and P2 and format your answer to display 4 decimal digits.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['SQL', 'Math'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '335',
        title: 'SQL Weather Station 20',
        description: 'A median is defined as a number separating the higher half of a data set from the lower half. Query the median of the Northern Latitudes (LAT_N) from STATION and round your answer to 4 decimal places.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 250,
        tags: ['SQL', 'Advanced Aggregation'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '336',
        title: 'SQL Asian Population',
        description: 'Given the CITY and COUNTRY tables, query the sum of the populations of all cities where the CONTINENT is \'Asia\'.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['SQL', 'Joins'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '337',
        title: 'SQL African Cities',
        description: 'Names of all cities where the CONTINENT is \'Africa\'.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['SQL', 'Joins'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '338',
        title: 'SQL Draw Triangle 1',
        description: 'P(R) represents a pattern drawn by Julia in R rows. Write a query to print the pattern P(20).',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['SQL', 'Logic'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '339',
        title: 'SQL Draw Triangle 2',
        description: 'Write a query to print the pattern P(20) (Increasing stars).',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['SQL', 'Logic'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '340',
        title: 'SQL Print Prime Numbers',
        description: 'Write a query to print all prime numbers less than or equal to 1000. Print your output on a single line, and use the ampersand (&) character as your separator.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 300,
        tags: ['SQL', 'Advanced'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '341',
        title: 'SQL Projects',
        description: 'Write a query to output the start and end dates of projects listed by the number of days it took to complete the project in ascending order.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 150,
        tags: ['SQL', 'Advanced Joins'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '342',
        title: 'SQL User Purchases',
        description: 'Find users who purchased the same product on two or more consecutive days.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 140,
        tags: ['SQL', 'Window Functions'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '343',
        title: 'SQL Department Highest Salary',
        description: 'Find employees who have the highest salary in each of the departments.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['SQL', 'Joins', 'Aggregation'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '344',
        title: 'SQL Consecutive Numbers',
        description: 'Find all numbers that appear at least three times consecutively.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 130,
        tags: ['SQL', 'Logic'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '345',
        title: 'SQL Rank Scores',
        description: 'Write a SQL query to rank scores. If there is a tie between two scores, both should have the same ranking.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['SQL', 'Window Functions'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '346',
        title: 'SQL Tree Node',
        description: 'Each node in the tree can be one of three types: Leaf, Root, Inner.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['SQL', 'Logic'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '347',
        title: 'SQL Top 3 Salaries by Dept',
        description: 'Find the top three employees who are high earners in each of the departments.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 280,
        tags: ['SQL', 'Window Functions'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '348',
        title: 'SQL Delete Duplicate Emails',
        description: 'Write a SQL query to delete all duplicate email entries in a table named Person, keeping only unique emails based on its smallest Id.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['SQL', 'DML'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '349',
        title: 'SQL Human Traffic of Stadium',
        description: 'Write a query to display the records with three or more rows with consecutive id\'s, and the number of people is greater than or equal to 100.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 350,
        tags: ['SQL', 'Advanced'],
        language: 'sql',
        initialCode: `-- Your SQL here`,
        testCases: []
    },
    {
        id: '350',
        title: 'JS Closures - Counter',
        description: 'Implement a function `createCounter` that returns an object with `increment` and `decrement` methods, sharing a private count variable.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['JavaScript', 'Closures'],
        language: 'javascript',
        initialCode: `function createCounter() {
    // Your code here
}`,
        testCases: []
    },
    {
        id: '351',
        title: 'JS Prototype Inheritance',
        description: 'Given a `Shape` function, add a `getArea` method to its prototype. Then create a `Square` that inherits from `Shape`.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 50,
        tags: ['JavaScript', 'Prototypes'],
        language: 'javascript',
        initialCode: `function Shape() {}
// Your code here`,
        testCases: []
    },
    {
        id: '352',
        title: 'JS Event Delegation',
        description: 'Write a function that attaches a single click event listener to a parent element and alerts the text of the child `<li>` that was clicked.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 90,
        tags: ['JavaScript', 'DOM'],
        language: 'javascript',
        initialCode: `function setupDelegation(parentElement) {
    // Your code here
}`,
        testCases: []
    },
    {
        id: '353',
        title: 'JS Proxy for Validation',
        description: 'Create a Proxy for a user object that throws an error if a property other than "name" or "age" is set, or if age is not a number.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['JavaScript', 'Advanced'],
        language: 'javascript',
        initialCode: `function createValidatedUser(target) {
    // Your code here
}`,
        testCases: []
    },
    {
        id: '354',
        title: 'JS Custom Promise',
        description: 'Implement a skeletal version of a Promise (only `then` and `resolve`) to understand its internal state machine.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 250,
        tags: ['JavaScript', 'Promises'],
        language: 'javascript',
        initialCode: `class MyPromise {
    // Your code here
}`,
        testCases: []
    },
    {
        id: '355',
        title: 'JS Object Getters/Setters',
        description: 'Define an object `temperature` with a private `_celsius` property. Use getters/setters for `celsius` and `fahrenheit`.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 35,
        tags: ['JavaScript', 'Basics'],
        language: 'javascript',
        initialCode: `const temperature = {
    _celsius: 0
    // Your code
};`,
        testCases: []
    },
    {
        id: '356',
        title: 'JS Intersection Observer',
        description: 'Write a snippet to lazy-load images using `IntersectionObserver`. Change `data-src` to `src` when visible.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['JavaScript', 'DOM'],
        language: 'javascript',
        initialCode: `function lazyLoad(images) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '357',
        title: 'JS Web Worker Calculation',
        description: 'Create a simple Web Worker script that calculates prime numbers in the background.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['JavaScript', 'Web Workers'],
        language: 'javascript',
        initialCode: `// worker.js logic here`,
        testCases: []
    },
    {
        id: '358',
        title: 'JS Array flatMap Polyfill',
        description: 'Implement a polyfill for `Array.prototype.flatMap`.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 80,
        tags: ['JavaScript', 'Arrays'],
        language: 'javascript',
        initialCode: `if (!Array.prototype.myFlatMap) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '359',
        title: 'JS Symbol for Private Keys',
        description: 'Use a `Symbol` to create a truly private property on an object that cannot be accessed via `Object.keys()`.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['JavaScript', 'Advanced'],
        language: 'javascript',
        initialCode: `const privateKey = Symbol('id');
const obj = {
    // Your code
};`,
        testCases: []
    },
    {
        id: '360',
        title: 'JS Generator for IDs',
        description: 'Create a generator function that yields unique auto-incrementing IDs starting from 1.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['JavaScript', 'Generators'],
        language: 'javascript',
        initialCode: `function* idGenerator() {
    // Your code
}`,
        testCases: []
    },
    {
        id: '361',
        title: 'JS Currying Function',
        description: 'Write a `curry` function that converts a function `f(a, b, c)` into `f(a)(b)(c)`.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['JavaScript', 'Functional'],
        language: 'javascript',
        initialCode: `function curry(func) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '362',
        title: 'JS Deep Merge Objects',
        description: 'Write a function to deep merge two nested objects without losing properties.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 220,
        tags: ['JavaScript', 'Objects'],
        language: 'javascript',
        initialCode: `function deepMerge(target, source) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '363',
        title: 'JS Throttling Function',
        description: 'Implement a `throttle` function that ensures a function is called at most once in a specified time window.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 130,
        tags: ['JavaScript', 'Async'],
        language: 'javascript',
        initialCode: `function throttle(func, limit) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '364',
        title: 'JS Fetch with Retry',
        description: 'Implement a `fetchWithRetry` function that retries a request `n` times before failing.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 140,
        tags: ['JavaScript', 'Async'],
        language: 'javascript',
        initialCode: `async function fetchWithRetry(url, retries) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '365',
        title: 'JS LocalStorage Wrapper',
        description: 'Create a wrapper for `localStorage` that automatically handles JSON stringify/parse and expiration.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['JavaScript', 'Web API'],
        language: 'javascript',
        initialCode: `const storage = {
    // Your code
};`,
        testCases: []
    },
    {
        id: '366',
        title: 'JS Custom Element (Web Component)',
        description: 'Define a custom HTML element `<user-card>` that displays a name and bio.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['JavaScript', 'Web Components'],
        language: 'javascript',
        initialCode: `class UserCard extends HTMLElement {
    // Your code
}`,
        testCases: []
    },
    {
        id: '367',
        title: 'JS Shadow DOM encapsulation',
        description: 'Attach a shadow root to an element and inject some styles that don\'t leak to the main document.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['JavaScript', 'DOM'],
        language: 'javascript',
        initialCode: `function attachShadow(el) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '368',
        title: 'JS Iterators (Custom)',
        description: 'Implement a custom iterator for a collection object so it can be used in a `for...of` loop.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 90,
        tags: ['JavaScript', 'Advanced'],
        language: 'javascript',
        initialCode: `const myCollection = {
    data: [1, 2, 3],
    [Symbol.iterator]() {
        // Your code
    }
};`,
        testCases: []
    },
    {
        id: '369',
        title: 'JS WeakMap for Cache',
        description: 'Explain why `WeakMap` is better than `Map` for storing metadata about DOM elements to prevent memory leaks.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['JavaScript', 'Basics'],
        language: 'javascript',
        initialCode: `const elementMeta = new WeakMap();
// Code example here`,
        testCases: []
    },
    {
        id: '370',
        title: 'JS Intl DateTimeFormat',
        description: 'Format a date string according to the user\'s locale using the `Intl` API.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 25,
        tags: ['JavaScript', 'Web API'],
        language: 'javascript',
        initialCode: `function formatDate(date, locale) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '371',
        title: 'JS Resize Observer',
        description: 'Use `ResizeObserver` to change the background color of an element when its width exceeds 500px.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['JavaScript', 'DOM'],
        language: 'javascript',
        initialCode: `function observeResize(el) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '372',
        title: 'JS Map vs Object Performance',
        description: 'Perform a small benchmark to compare Map insertion speed vs Object property setting.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 80,
        tags: ['JavaScript', 'Performance'],
        language: 'javascript',
        initialCode: `function benchmark() {
    // Your code
}`,
        testCases: []
    },
    {
        id: '373',
        title: 'JS Broadcast Channel API',
        description: 'Implement a way for two different tabs of the same origin to communicate using `BroadcastChannel`.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['JavaScript', 'Web API'],
        language: 'javascript',
        initialCode: `const bc = new BroadcastChannel('test_channel');
// Your code`,
        testCases: []
    },
    {
        id: '374',
        title: 'JS MessageChannel API',
        description: 'Use `MessageChannel` to communicate between a main script and an iframe.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 220,
        tags: ['JavaScript', 'Web API'],
        language: 'javascript',
        initialCode: `const channel = new MessageChannel();
// Your code`,
        testCases: []
    },
    {
        id: '375',
        title: 'JS Promise.allSettled Utility',
        description: 'Implement a function that mimics `Promise.allSettled`, returning an array of objects describing the outcome of each promise.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['JavaScript', 'Promises'],
        language: 'javascript',
        initialCode: `function myAllSettled(promises) {
    // Your code here
}`,
        testCases: []
    },
    {
        id: '376',
        title: 'JS AbortController for Fetch',
        description: 'Write a function `fetchWithTimeout` that uses `AbortController` to cancel a fetch request if it stays pending longer than 5 seconds.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 130,
        tags: ['JavaScript', 'Async'],
        language: 'javascript',
        initialCode: `function fetchWithTimeout(url, timeout) {
    // Your code here
}`,
        testCases: []
    },
    {
        id: '377',
        title: 'JS Deep Clone with Proxy',
        description: 'Create a deep clone function that uses a `Proxy` to handle circular references (conceptual challenge).',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 300,
        tags: ['JavaScript', 'Advanced'],
        language: 'javascript',
        initialCode: `function deepClone(obj) {
    // Your code here
}`,
        testCases: []
    },
    {
        id: '378',
        title: 'JS Event Loop - microtasks vs macrotasks',
        description: 'Predict the output of a snippet containing `setTimeout`, `Promise.resolve`, and `process.nextTick`.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 200,
        tags: ['JavaScript', 'Under the Hood'],
        language: 'javascript',
        initialCode: `// What is the log order?
setTimeout(() => console.log('1'), 0);
Promise.resolve().then(() => console.log('2'));
console.log('3');`,
        testCases: []
    },
    {
        id: '379',
        title: 'JS Function Composition (Pipe)',
        description: 'Implement a `pipe` function that takes multiple functions and returns a function that applies them from left to right.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['JavaScript', 'Functional'],
        language: 'javascript',
        initialCode: `const pipe = (...funcs) => (val) => {
    // Your code
};`,
        testCases: []
    },
    {
        id: '380',
        title: 'JS Memoization (Advanced)',
        description: 'Implement a `memoize` function that works for functions with any number of arguments using a key generator.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 120,
        tags: ['JavaScript', 'Performance'],
        language: 'javascript',
        initialCode: `function memoize(fn) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '381',
        title: 'JS Flatten Nested Object',
        description: 'Write a function that flattens a deeply nested object into a single-level object with dot-notated keys.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 180,
        tags: ['JavaScript', 'Objects'],
        language: 'javascript',
        initialCode: `function flattenObject(obj) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '382',
        title: 'JS Custom Event Emitter',
        description: 'Implement a simple `EventEmitter` class with `on`, `off`, and `emit` methods.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 150,
        tags: ['JavaScript', 'Design Patterns'],
        language: 'javascript',
        initialCode: `class EventEmitter {
    // Your code
}`,
        testCases: []
    },
    {
        id: '383',
        title: 'JS Reactive Variable (Proxy)',
        description: 'Create a function `reactive(obj, callback)` that returns a Proxy which calls the callback whenever any property is changed.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 160,
        tags: ['JavaScript', 'Advanced'],
        language: 'javascript',
        initialCode: `function reactive(obj, onUpdate) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '384',
        title: 'JS Partial Application',
        description: 'Write a `partial` function that takes a function and some arguments, and returns a new function with those arguments pre-applied.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 90,
        tags: ['JavaScript', 'Functional'],
        language: 'javascript',
        initialCode: `function partial(fn, ...args) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '385',
        title: 'JS Polyfill for filter',
        description: 'Implement `Array.prototype.myFilter`.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['JavaScript', 'Basics'],
        language: 'javascript',
        initialCode: `Array.prototype.myFilter = function(callback) {
    // Your code
};`,
        testCases: []
    },
    {
        id: '386',
        title: 'JS Object.create Polyfill',
        description: 'Write a polyfill for `Object.create(proto)`.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 50,
        tags: ['JavaScript', 'Under the Hood'],
        language: 'javascript',
        initialCode: `function myCreate(proto) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '387',
        title: 'JS Async Parallel Execution',
        description: 'Write a function that executes an array of async functions in parallel, but limits the concurrency to `maxParallel` tasks.',
        difficulty: 'Expert',
        type: 'Algorithm',
        xp: 450,
        tags: ['JavaScript', 'Async'],
        language: 'javascript',
        initialCode: `async function parallelLimit(tasks, limit) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '388',
        title: 'JS Detect Memory Leaks',
        description: 'Describe common patterns that lead to memory leaks in JS and how to avoid them (e.g. uncleared intervals).',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 80,
        tags: ['JavaScript', 'Performance'],
        language: 'javascript',
        initialCode: `// Example of memory leak and fix`,
        testCases: []
    },
    {
        id: '389',
        title: 'JS Web Crypto API - Hashing',
        description: 'Use the `crypto.subtle` API to generate a SHA-256 hash of a string.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 280,
        tags: ['JavaScript', 'Web API'],
        language: 'javascript',
        initialCode: `async function generateHash(message) {
    // Your code
}`,
        testCases: []
    },
    {
        id: '390',
        title: 'JS Streams API basics',
        description: 'Use `ReadableStream` to process a large text file chunk by chunk.',
        difficulty: 'Hard',
        type: 'Algorithm',
        xp: 320,
        tags: ['JavaScript', 'Web API'],
        language: 'javascript',
        initialCode: `const stream = new ReadableStream({
    // Your code
});`,
        testCases: []
    },
    {
        id: '391',
        title: 'JS View Transitions API',
        description: 'Write a simple code block demonstrating how to use `document.startViewTransition`.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 100,
        tags: ['JavaScript', 'DOM'],
        language: 'javascript',
        initialCode: `function updateLayout() {
    // Your code
}`,
        testCases: []
    },
    {
        id: '392',
        title: 'JS Performance Mark/Measure',
        description: 'Use `performance.mark` and `performance.measure` to profile a slow loop.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 45,
        tags: ['JavaScript', 'Performance'],
        language: 'javascript',
        initialCode: `function profileMe() {
    // Your code
}`,
        testCases: []
    },
    {
        id: '393',
        title: 'JS Sanitizer API (Conceptual)',
        description: 'Show how you would use a hypothetical (or experimental) Sanitize API to clean HTML strings.',
        difficulty: 'Medium',
        type: 'Algorithm',
        xp: 110,
        tags: ['JavaScript', 'Security'],
        language: 'javascript',
        initialCode: `// Conceptual usage`,
        testCases: []
    },
    {
        id: '394',
        title: 'JS Reflect.apply usage',
        description: 'Use `Reflect.apply` to call a function with a specific `this` context and arguments array.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 35,
        tags: ['JavaScript', 'Advanced'],
        language: 'javascript',
        initialCode: `function greet(prefix) { return prefix + this.name; }
const user = { name: 'Bob' };
// Your code`,
        testCases: []
    },
    {
        id: '395',
        title: 'JS BigInt operations',
        description: 'Demonstrate calculation with `BigInt` for numbers exceeding `Number.MAX_SAFE_INTEGER`.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['JavaScript', 'Basics'],
        language: 'javascript',
        initialCode: `// Your code`,
        testCases: []
    },
    {
        id: '396',
        title: 'JS Private Class Fields (#)',
        description: 'Define a class `Bank` with a private field `#balance` and a public method to deposit money.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 50,
        tags: ['JavaScript', 'OOP'],
        language: 'javascript',
        initialCode: `class Bank {
    // Your code
}`,
        testCases: []
    },
    {
        id: '397',
        title: 'JS Logical Assignment Operators',
        description: 'Use `||=`, `&&=`, and `??=` in a practical example.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 40,
        tags: ['JavaScript', 'Basics'],
        language: 'javascript',
        initialCode: `const settings = { theme: null };
// Your code`,
        testCases: []
    },
    {
        id: '398',
        title: 'JS Top-level Await',
        description: 'Explain when and where top-level `await` can be used (Modules). Show an example.',
        difficulty: 'Easy',
        type: 'Algorithm',
        xp: 30,
        tags: ['JavaScript', 'Async'],
        language: 'javascript',
        initialCode: `// Assume module script
const data = await fetch('...');`,
        testCases: []
    },
    {
        id: '399',
        title: 'JS FinalizationRegistry',
        description: 'Use `FinalizationRegistry` to log a message when an object is garbage collected.',
        difficulty: 'Expert',
        type: 'Algorithm',
        xp: 500,
        tags: ['JavaScript', 'Advanced'],
        language: 'javascript',
        initialCode: `const registry = new FinalizationRegistry((heldValue) => {
    console.log(heldValue);
});
// Your code`,
        testCases: []
    }
];
