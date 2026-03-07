
// 1. Print out "Program started" at the start of your code
console.log("Program started"); 

// 2. Create a Promise that resolves after 3 seconds and rejects after 2 seconds
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("Program failure"); // Se déclenche après 2 secondes
  }, 2000);
  
  setTimeout(() => {
    resolve("Program complete"); // Se déclenche après 3 secondes
  }, 3000);
});

// 3. Log out the promise while it's pending
console.log(myPromise); // Promise { <pending> }

// 4. Print out "Program in progress..." as well
console.log("Program in progress...");

// 5. Print out "Program complete" if the promise fulfills
// 6. Print out "Program failure" if the promise rejects
myPromise
  .then((message) => {
    console.log(message); // "Program complete" (ne s'affichera jamais)
  })
  .catch((error) => {
    console.log(error); // "Program failure" (s'affichera après 2 secondes)
  });