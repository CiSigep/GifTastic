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
            var imageData = data.data;
            // Clear the container
            $("#gifContainer").empty();

            var row;
            for(var i = 0; i < imageData.length; i++){
                if(i % 4 === 0) { 
                    row = $("<div>");
                    row.addClass("row");
                }

                // Get all the necessary data
                var still = imageData[i].images.fixed_height_still.url;
                var animated = imageData[i].images.fixed_height.url;
                var rating = imageData[i].rating;

                // Create our image tag
                var img = $("<img>");
                img.attr("data-state", "still");
                img.attr("data-still-url", still);
                img.attr("src", still);
                img.attr("data-animated-url", animated); 
                img.addClass("gif-image img-fluid");
                
                // Create our rating
                var p = $("<p>");
                p.text("Rating: " + rating);

                // Create our column
                var col = $("<div>");
                col.addClass("col-md-3 col-12");
                
                col.append(p);
                col.append(img);

                row.append(col);

                // Append our row if we run out of images or we're at the end of our row.
                if(i % 4 === 3 || i === imageData.length - 1)
                    $("#gifContainer").append(row);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log("FAILED: " + errorThrown);
        });
    }

    // Add Search click event
    $(".search-button").click(function() {
        // Grab our value from the associated text box.
        var queryValue = $(".query-input[data-which="+ $(this).attr("data-which") +"]").val();

        // Nothing's there, return.
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

        // Clear the textbox
        $(".query-input[data-which="+ $(this).attr("data-which") +"]").val("");

    });

    // Add click events for the buttons
    $(document).on("click", ".query-button", function(){
        sendRequest($(this).attr("data-query"));
    });

    // Add click events for the gifs
    $(document).on("click", ".gif-image", function(){
        // Check the state of the image
        var element = $(this);

        // if "still" then animate it.
        if(element.attr("data-state") === "still"){
            element.attr("src", element.attr("data-animated-url"));
            element.attr("data-state", "animated");
        }
        // else if "animated" then still it.
        else if (element.attr("data-state") === "animated") {
            element.attr("src", element.attr("data-still-url"));
            element.attr("data-state", "still")
        }
    });
});