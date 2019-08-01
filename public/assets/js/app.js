
$(document).ready(function () {


    //scrape button handler
    $("#scrape").on("click", function () {
        $.ajax({
            method: "GET",
            url: "/scrape",
        }).done(function (data) {
            // Log the response
            console.log(data);
            window.location = "/"
        })
    });




});
