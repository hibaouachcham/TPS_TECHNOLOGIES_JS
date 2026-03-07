
// 1. Print out "Program Started" at the start of your code
console.log("Program Started");

// 2. Create a Promise that resolve after 3 seconds
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Program complete");
  }, 3000);
});

// 3. Log out the promise while it's pending
console.log(myPromise); // Promise { <pending> }

// 4. Print out "Program in progress..." as well
console.log("Program in progress...");

// 5. Print out "Program complete" when the promise completes after 3 seconds
myPromise.then((message) => {
  console.log(message); // "Program complete"
});