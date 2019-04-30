$("showhide").hide();
$("#loader").hide();
$(document).ready(function() {
    //alert("test");
    //console.log("hi there");
    $("#loader").show();
    var text = $('textarea').val();
    var finalText = text.replace(/-/g, ' ');
    if(text!=''){
        var obj = new Object();
        obj.article = finalText;
        obj.title = "title";
        obj.n_sentence = 5;

        var summaryOutput = "";

        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:5000/extractive",
            dataType: "json",
            crossDomain: true,
            data: JSON.stringify(obj),
            success: function(data) {
                $("#loader").hide();
                summaryOutput = data;
                console.log("Summary is: ", data);
                var summary = document.getElementById("showsummary");
                summary.innerHTML = data;
                $("showhide").show();

                document.getElementById("summary").innerHTML = "Summary generated!";
                document.getElementById("summary").style.backgroundColor = "orange";
                document.getElementById("summary").style.borderColor = "orange";
            }
        });
    }

});


