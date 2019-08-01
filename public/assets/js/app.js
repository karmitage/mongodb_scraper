
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


    //save article handler

    $(".save").on("click", function () {
        var thisId = $(this).attr("data-id");
        $.ajax({
            method: "POST",
            url: "/articles/save/" + thisId,
        }).done(function (data) {
            // Log the response
            console.log(data);
            window.location = "/"
        })
    });




});
