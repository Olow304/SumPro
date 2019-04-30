chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        // do what you want to the message
        // var gethtml = document.getElementById("selected");
        // gethtml.innerHTML = message;
        console.log("message is: " + message);
    });