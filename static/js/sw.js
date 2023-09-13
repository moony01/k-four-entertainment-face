self.addEventListener("fetch", function (event) {
    debugger;
    console.log("Fetch request for: ", event.request.url);
});