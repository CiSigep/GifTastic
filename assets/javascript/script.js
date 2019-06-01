$(function (){

    // Function to send a request for the gifs
    function sendRequest(query, resultLimit, page) {
        if(!resultLimit)
            resultLimit = 10;
        if(!page)
            page = 0;
        $.get({
            url : 'https://api.giphy.com/v1/gifs/search',
            data : {
                api_key: 'YOUR_KEY',
                q : query,
                limit : resultLimit,
                offset : resultLimit * page,
                rating : 'pg'
            }
        }).done(function(data){
            console.log(data);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log("FAILED: " + errorThrown);
        });
    }

    // Add Search click event
    $("#searchButton").click(function() {
        var queryValue = $("#query").val();

        if(queryValue.length === 0)
            return;

        // Create a button for the query and attach it if it doesn't already exist
        if(!$("button[data-query="+ queryValue + "]").length){
            var newBtn = $("<button>");
            newBtn.attr("data-query", queryValue);
            newBtn.addClass("query-button btn btn-dark mr-1 mb-1");
            newBtn.text(queryValue);
            $("#buttonContainer").append(newBtn);
        }


        // Send a request for the query
        sendRequest(queryValue);

        $("#query").val("");

    });

    // Add click events for the buttons
    $(document).on("click", ".query-button", function(){
        sendRequest($(this).attr("data-query"));
    });
});