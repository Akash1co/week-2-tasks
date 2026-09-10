/**
 * Week 2 Day 3: JavaScript ES6+ Fundamentals & Asynchronous Patterns
 * File: js_fundamentals.js
 */

// ==========================================
// Part 1: 10 ES6+ Functions
// ==========================================

// 1. Basic Arrow Function with Default Parameter
const greetUser = (name = "Guest") => `Hello, ${name}! Welcome to the platform.`;

// 2. Arrow Function with Implicit Return & Arithmetic
const calculateTax = (amount, rate = 0.18) => amount + amount * rate;

// 3. Rest Operator (...args) to sum an arbitrary number of values
const sumNumbers = (...numbers) =>
  numbers.reduce((acc, current) => acc + current, 0);

// 4. Spread Operator with Arrays to merge and deduplicate
const mergeUniqueTags = (tags1 = [], tags2 = []) => [...new Set([...tags1, ...tags2])];

// 5. Rest Operator with Destructuring (extract head and rest of array)
const extractFirstAndTail = ([head = null, ...tail]) => ({ head, tail });

// 6. Object Cloning and Updating using Spread Operator
const updateUserProfile = (profile = {}, updates = {}) => ({
  ...profile,
  ...updates,
  updatedAt: new Date().toISOString(),
});

// 7. Higher-Order Array Processing with Arrow Syntax
const formatProductList = (products = []) =>
  products.map(({ id, name, price = 0 }) => `[#${id}] ${name.toUpperCase()} - $${price.toFixed(2)}`);

// 8. Dynamic Filter using Rest Parameters as criteria
const filterByRole = (users = [], ...allowedRoles) =>
  users.filter((user) => allowedRoles.includes(user.role));

// 9. Object Destructuring with Renaming and Defaults
const summarizePost = ({ title = "Untitled", body = "", id = 0 } = {}) => ({
  id,
  headline: title.length > 30 ? `${title.slice(0, 30)}...` : title,
  wordCount: body.trim().split(/\s+/).length,
});

// 10. Curried Arrow Function with Default Fallback
const buildUrl = (baseUrl = "https://jsonplaceholder.typicode.com") => (endpoint = "") =>
  `${baseUrl.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;


// ==========================================
// Part 2: Asynchronous Flow (Promises & fetch)
// ==========================================

const API_BASE = "https://jsonplaceholder.typicode.com";

/**
 * Task: Fetch using standard Promise .then() / .catch() flow
 */
const fetchUserWithPromises = (userId = 1) => {
  console.log(`\n--- [Promise Flow] Fetching User ${userId} ---`);

  return fetch(`${API_BASE}/users/${userId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((user) => {
      console.log("[Promise Flow] User fetched successfully:");
      console.log({
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company?.name,
      });
      return user;
    })
    .catch((error) => {
      console.error("[Promise Flow] Error fetching user:", error.message);
    });
};

/**
 * Task: Fetch using async / await with try / catch block
 */
const fetchPostsByAsyncAwait = async (limit = 3) => {
  console.log(`\n--- [Async/Await Flow] Fetching First ${limit} Posts ---`);

  try {
    const response = await fetch(`${API_BASE}/posts?_limit=${limit}`);

    if (!response.ok) {
      throw new Error(`Failed to load posts (Status: ${response.status})`);
    }

    const posts = await response.json();

    console.log(`[Async/Await] Retrieved ${posts.length} posts:`);
    posts.forEach((post) => {
      console.log(`• [Post #${post.id}] ${post.title}`);
    });

    return posts;
  } catch (error) {
    console.error("[Async/Await] Error fetching posts:", error.message);
    return null;
  }
};

/**
 * Task: Handle deliberate error gracefully with try / catch
 */
const handleInvalidEndpoint = async () => {
  console.log("\n--- [Error Handling Flow] Calling non-existent endpoint ---");
  try {
    const response = await fetch(`${API_BASE}/invalid-endpoint-xyz`);
    if (!response.ok) {
      throw new Error(`Resource not found (Status code: ${response.status})`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[Graceful Error Caught]:", error.message);
  }
};

// ==========================================
// Execution Runner
// ==========================================
const runAll = async () => {
  // Test Part 1 Functions
  console.log("=== Testing 10 Functions ===");
  console.log("1. Greet:", greetUser("Alex"));
  console.log("2. Tax:", calculateTax(100));
  console.log("3. Sum:", sumNumbers(2, 4, 6, 8, 10));
  console.log("4. Merged Tags:", mergeUniqueTags(["js", "es6"], ["react", "js"]));
  console.log("5. Tail:", extractFirstAndTail([10, 20, 30, 40]));
  console.log("6. Update Profile:", updateUserProfile({ id: 1, role: "user" }, { role: "admin" }));
  console.log(
    "7. Format Products:",
    formatProductList([
      { id: 101, name: "Keyboard", price: 45 },
      { id: 102, name: "Mouse" },
    ])
  );
  console.log(
    "8. Filter Roles:",
    filterByRole(
      [
        { name: "Sam", role: "admin" },
        { name: "Lee", role: "editor" },
        { name: "Kim", role: "viewer" },
      ],
      "admin",
      "editor"
    )
  );
  console.log(
    "9. Summarize Post:",
    summarizePost({
      id: 1,
      title: "Mastering Asynchronous JavaScript with Modern Standards",
      body: "JavaScript is a single-threaded non-blocking runtime language.",
    })
  );
  const getEndpoint = buildUrl();
  console.log("10. Built URL:", getEndpoint("todos/1"));

  // Test Part 2 Async Operations
  await fetchUserWithPromises(1);
  await fetchPostsByAsyncAwait(3);
  await handleInvalidEndpoint();
};

runAll();