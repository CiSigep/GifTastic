$(function (){

    // Add Search click event
    $("#searchButton").click(function() {
        var queryValue = $("#query").val();

        if(queryValue.length === 0)
            return;

        // Create a button for the query and attach it if it doesn't already exist
        if(!$("button[data-query="+ queryValue + "]").length){
            var newBtn = $("<button>");
            newBtn.attr("data-query", queryValue);
            newBtn.addClass("btn btn-dark mr-1 mb-1");
            newBtn.text(queryValue);
            $("#buttonContainer").append(newBtn);
        }


        // Send a request for the query



    });

    // Add click events for the buttons

    /* $.get({
        url : 'https://api.giphy.com/v1/gifs/search',
        data : {
            api_key: 'KEY_HERE',
            q : 'VALUE_HERE',
            limit : 10,
            offset : 0,
            rating : 'pg'
        }
    }).done(function(data){
        console.log(data);
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log("FAILED: " + errorThrown);
    }); */

});