// This function is adopted from...
// https://productforums.google.com/forum/#!topic/chrome/amTGcgaB9u8
function getCurrentTabUrl(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        var tab = tabs[0];
        var url = tab.url;
        // $.get(url, function(data, status){
        // 	console.log("links: ", data.getElementById('storytext'))
        // });

        console.assert(typeof url == "string", "tab.url should be a string");
        callback(url);
    });

}

function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return "" + y + "-" + (m <= 9 ? "0" + m : m) + "-" + (d <= 9 ? "0" + d : d);
}

var getTab = function(tab) {
    console.log(tab);
};

function parseURLintoData(innerUrl) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: "POST",
            url: "https://api.aylien.com/api/v1/extract",
            dataType: "json",
            data: {
                url: innerUrl,
                best_image: true
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader(
                    "X-AYLIEN-TextAPI-Application-Key",
                    "8968137332783762d4117e8532aff787"
                );
                xhr.setRequestHeader(
                    "X-AYLIEN-TextAPI-Application-ID",
                    "ac9f0736"
                );
            },
            success: function(data) {
                resolve(data);
            },
            error: function(err) {
                reject(err);
            }
        });
    });
}

function getword(info, tab) {
    if (info.selectionText) {
        var getText = info.selectionText;
        var newText = getText.replace(/,/g, "-");

        var cleanText = newText.replace(/['"]+/g, "");
        var finalCleanText = cleanText.replace(/ /g, "-").toLowerCase();

        var newURL = "http://localhost:8087/summary?selected=" + finalCleanText;
        //chrome.tabs.create({ url: newURL });
        chrome.windows.create({
            url: newURL,
            type: "popup",
            width: 560,
            height: 800
        });
    }

    if (info.linkUrl) {
        var innerUrl = info.linkUrl;
        parseURLintoData(innerUrl)
            .then(function(data) {
                // Run this when your request was successful
                var innerUrlData = data.article;
                //console.log(data.article);
                var c2Url = innerUrlData.replace(/['"]+/g, "");
                var c3Url = c2Url.replace(/(\r\n|\n|\r)/gm, ".");

                var newTextUrl = c3Url.replace(/,/g, "-");

                var cleanTextUrl = newTextUrl.replace(/['"]+/g, "");
                var finalCleanTextUrl = cleanTextUrl.replace(/ /g, "-").toLowerCase();

                var newURL = "http://localhost:8087/summary?selected=" + finalCleanTextUrl;
                chrome.windows.create({
                    url: newURL,
                    type: "popup",
                    width: 560,
                    height: 800
                });

                console.log("Data is: ", finalCleanTextUrl);
            })
            .catch(function(err) {
                // Run this when promise was rejected via reject()
                console.log(err);
            });

    }
}

chrome.contextMenus.create({
    title: "Get Summary",
    contexts: ["selection", "link"],
    onclick: getword
});


document.addEventListener("DOMContentLoaded", function() {
    getCurrentTabUrl(function(url) {
        var emailTitle = "";
        var emailImage;
        $.ajax({
            type: "POST",
            url: "https://api.aylien.com/api/v1/extract",
            dataType: "json",
            data: {
                url: url,
                best_image: true
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader(
                    "X-AYLIEN-TextAPI-Application-Key",
                    "8968137332783762d4117e8532aff787"
                );
                xhr.setRequestHeader(
                    "X-AYLIEN-TextAPI-Application-ID",
                    "ac9f0736"
                );
            },
            success: function(data) {
                var img = document.createElement("img");
                img.src = data.image;
                var image = document.getElementById("image");
                img.height = 250;
                img.width = 350;
                emailImage = img;
                image.appendChild(img);

                var author = document.getElementById("author");
                author.innerHTML += data.author;

                var title = document.getElementById("title");
                title.innerHTML += data.title;
                emailTitle = data.title;

                var publishDate = document.getElementById("publishDate");
                publishDate.innerHTML = data.publishDate;
            }
        });

        //Speech - read summary
        function listenSummary(text) {
            var msg = new SpeechSynthesisUtterance();
            var voices = window.speechSynthesis.getVoices();
            msg.voice = voices[10];
            msg.voiceURI = "native";
            msg.volume = 1;
            msg.rate = 1;
            msg.pitch = 0.8;
            msg.text = text;
            msg.lang = "en-US";
            speechSynthesis.speak(msg);
        }

        $.ajax({
            type: "POST",
            url: "https://api.aylien.com/api/v1/summarize",
            dataType: "json",
            async: true,
            data: {
                url: url,
                sentences_number: 3
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader(
                    "X-AYLIEN-TextAPI-Application-Key",
                    "5e6f18a451ddc09c062209b82d9c1911"
                );
                xhr.setRequestHeader(
                    "X-AYLIEN-TextAPI-Application-ID",
                    "3c42db39"
                );
                $("#loading-gif").show();
            },

            success: function(data) {
                $("#loading-gif").hide();
                var full_text = data.text;

                $("#loading-gif").show();
                var c2 = full_text.replace(/['"]+/g, "");
                var c3 = c2.replace(/(\r\n|\n|\r)/gm, ".");
                var obj = new Object();
                obj.article = c3;
                obj.title = "title";
                obj.n_sentence = 5;

                var emailData; 

                $.ajax({
                    type: "POST",
                    url: "http://127.0.0.1:5000/extractive",
                    dataType: "json",
                    data: JSON.stringify(obj),
                    success: function(data) {
                        $("#loading-gif").hide();
                        var summ = document.getElementById("summary");
                        summ.innerHTML = data;
                        emailData = data;

                        $("#speak").click(function() {
                            window.speechSynthesis.resume();
                            listenSummary(data);
                        });

                        $("#pause").click(function() {
                            window.speechSynthesis.pause();
                        });
                    }
                });

                $("#tab2").click(function() {
                    $("#submit").click(function(e) {
                        e.preventDefault();
                        var fullFormData = $(
                            "form[name=emailForm]"
                        ).serialize();
                        var sliceFormData = fullFormData.split("=", 2);
                        var email = sliceFormData[1];
                        var replaceChars = email.replace("%40", "@");
                        var sendEmail = new Object();
                        sendEmail.email = replaceChars;
                        sendEmail.summary = emailData;
                        sendEmail.link = url;
                        sendEmail.title = emailTitle;
                        console.log("Email summary is: ", emailData);

                        $.ajax({
                            type: "POST",
                            url: "http://127.0.0.1:8086/get-summary",
                            contentType: "application/json",
                            data: JSON.stringify(sendEmail),
                            beforeSend: function() {
                                $("#email-loading").show();
                            },
                            success: function() {
                                $("#email-loading").hide();
                                var msg = document.getElementById("message");
                                msg.innerHTML = "We have send you a email";
                            }
                        });
                    });
                });

                $("#tab3").click(function() {
                    $("#urlsubmit").click(function(e) {
                        e.preventDefault();
                        var urlForm = document.getElementById("url").value;
                        $.ajax({
                            type: "POST",
                            url: "https://api.aylien.com/api/v1/summarize",
                            dataType: "json",
                            async: true,
                            data: {
                                url: urlForm,
                                sentences_number: 3
                            },
                            beforeSend: function(xhr) {
                                xhr.setRequestHeader(
                                    "X-AYLIEN-TextAPI-Application-Key",
                                    "5e6f18a451ddc09c062209b82d9c1911"
                                );
                                xhr.setRequestHeader(
                                    "X-AYLIEN-TextAPI-Application-ID",
                                    "3c42db39"
                                );
                                $("#url-loading").show();
                            },

                            success: function(data) {
                                var url_text = data.text;
                                console.log("url text: ", url_text);

                                $("#url-loading").show();
                                var c22 = url_text.replace(/['"]+/g, "");
                                var c32 = c22.replace(/(\r\n|\n|\r)/gm, ".");
                                var obj2 = new Object();
                                obj2.article = c32;
                                obj2.title = "title";
                                obj2.n_sentence = 6;
                                console.log("data is: ", obj2);
                                $("#url-loading").show();

                                $.ajax({
                                    type: "POST",
                                    url: "http://127.0.0.1:5000/extractive",
                                    dataType: "json",
                                    data: JSON.stringify(obj2),
                                    success: function(data) {
                                        $("#url-loading").hide();
                                        var summ = document.getElementById(
                                            "urlsummary"
                                        );
                                        summ.innerHTML = data;

                                        var link = document.getElementById(
                                            "urllink"
                                        );
                                        link.innerHTML = urlForm;
                                    }
                                });
                            }
                        });
                    });
                });
            }
        });
    });
});
