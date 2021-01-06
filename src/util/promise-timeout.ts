export default function<T>(ms: number, promise: Promise<T>): Promise<T|"TIMEOUT"> {

  // Create a promise that rejects in <ms> milliseconds
  const timeout: Promise<"TIMEOUT"> = new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject("TIMEOUT");
    }, ms)
  })

  // Returns a race between our timeout and the passed in promise
  return Promise.race([
    promise,
    timeout
  ])
}
