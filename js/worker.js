onmessage = (e) => {
  console.log("Worker: Message received main thread");
  console.log(e);
  if (e.data.name === "hello") {
    console.log("Worker: Sending message to main thread");
    postMessage({ name: "hello back" });
  }
};
