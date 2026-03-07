// 1. Print out "Program started" at the start of your code
console.log("Program started");

// 2. Create a Promise that resolves after 3 seconds
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Step 1 complete");
  }, 3000);
});

// 3. Log out the promise while it's pending
console.log(myPromise); // Promise { <pending> }

// 4. Print out "Program in progress..." as well
console.log("Program in progress...");

myPromise
  .then((message) => {
    // 5. Print out "Step 1 complete" when the first promise fulfills
    console.log(message); // "Step 1 complete"
    
    // 6. Return another new Promise that will fulfill after 3 seconds
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("Step 2 complete");
      }, 3000);
    });
  })
  .then((message) => {
    console.log(message); // "Step 2 complete"
  });