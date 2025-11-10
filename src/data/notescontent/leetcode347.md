# LeetCode 347 - Top K Frequent Elements

### 🧩 Problem
Given an integer array `nums` and an integer `k`, return the `k` most frequent elements.  
You may return the answer in any order.

---

### 💡 Examples

**Example 1**

```js
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]

```
**Example 2**

```js
Input: nums = [1], k = 1
Output: [1]

```
**Example 3**

```js
Input: nums = [1,2,1,2,1,2,3,1,3,2], k = 2
Output: [1,2]

```

Thought Process

-Use a Map to count how many times each number appears.

-Convert that map into an array of [num, frequency] pairs.

-Sort this array in descending order by frequency.

-Return the first k numbers from the sorted result.

## My Solution

```js 
  const topKFrequent = function(nums, k) {
  const map = new Map();

  // 1️⃣ Count the frequency of each number
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    if (map.has(num)) {
      // if exists, increase frequency
      map.set(num, map.get(num) + 1);
    } else {
      // if doesn't exist, add it with frequency 1
      map.set(num, 1);
    }
  }

  // 2️⃣ Convert the Map into an array
  const entries = Array.from(map.entries()); 

  // 3️⃣ Sort by frequency (descending)
  entries.sort((a, b) => b[1] - a[1]);

  // 4️⃣ Take the first k elements
  const result = [];
  for (let i = 0; i < k; i++) {
    result.push(entries[i][0]); // [num, freq] -> num
  }

  return result;
};
```

### Optimal Solution (Shorter Version)

```js

var topKFrequentOpt = function(nums, k) {
  const map = new Map();

  // count frequencies
  for (const num of nums) {
    map.set(num, (map.get(num) || 0) + 1);
  }

  // sort by frequency
  const sorted = [...map.keys()].sort((a, b) => map.get(b) - map.get(a));

  // take top k
  return sorted.slice(0, k);
};

```

### Notes

A truly O(n) version can be achieved using a bucket sort approach.

For most cases, this Map + sort solution is perfectly acceptable and easy to read.

Key insight: using a Map lets you count efficiently and avoid converting types (like in plain objects).
