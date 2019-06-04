$(function (){

    var numGifs = 0;
    var currentQuery = "";
    // Our topic is "Vehicles"
    var topics = ["Car", "Truck", "Bus", "Motorcycle", "Bicycle", "Scooter", "Tractor", "ATV", "Chariot", "Carriage", "Wagon", "Train", "Plane", "Helicopter", "Boat", "Blimp", "Hot-Air Balloon", "Sled", "Snowmobile", "Rocket", "Spacecraft"];

    function renderButtons(topics) {
        $("#buttonContainer").empty();
        topics.forEach(function(topic){
            var newBtn = $("<button>");
            newBtn.attr("data-query", topic);
            newBtn.addClass("query-button btn btn-dark mr-1 mb-1");
            newBtn.text(topic);
            $("#buttonContainer").append(newBtn);
        });
    }

    // Function to send a request for the gifs
    function sendRequest(query) {
        currentQuery = query;
        $.get({
            url : 'https://api.giphy.com/v1/gifs/search',
            data : {
                api_key: 'PdaxPTr3o2UH5Fv2shcFiOFMo8Rrqggr',
                q : query,
                limit : 10,
                offset : numGifs,
                rating : 'pg'
            }
        }).done(function(data){
            var imageData = data.data;

            // Clear the container if its a new search.
            if(numGifs === 0)
                $(".gif-row").remove();

            // No results check
            if(imageData.length === 0){
                var noResultsRow = $("<div>");
                noResultsRow.addClass("row gif-row my-2");

                var noResultsCol = $("<div>");
                noResultsCol.addClass("col-12");
                
                noResultsCol.text(numGifs === 0 ? "No Results" : "No More Results");

                noResultsRow.append(noResultsCol);
                
                $("#loadRow").before(noResultsRow);

                $("#loadRow").addClass("d-none");

                return;
            }

            var row;
            var grabbedRow = false;
            if(numGifs % 4 !== 0) {
                row = $(".gif-row:last");
                grabbedRow = true;
            }
            for(var i = 0; i < imageData.length; i++){
                if(numGifs % 4 === 0) { 
                    grabbedRow = false;
                    row = $("<div>");
                    row.addClass("row gif-row");
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
                img.attr("alt", query + " gif " + (numGifs + 1)); 
                img.addClass("gif-image img-fluid");
                
                // Create our rating
                var p = $("<p>");
                p.text("Rating: " + rating);

                // Create our column
                var col = $("<div>");
                col.addClass("col-lg-3 col-md-6 col-12");
                
                col.append(p);
                col.append(img);

                row.append(col);

                // Append our row if we run out of images or we're at the end of our row.
                if((numGifs % 4 === 3 && !grabbedRow) || i === imageData.length - 1)
                    $("#loadRow").before(row);

                numGifs++;


            }

            $("#loadRow").removeClass("d-none");
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
        if(topics.map(function(item){ return item.toLowerCase(); }).indexOf(queryValue.toLowerCase()) < 0){
            topics.push(queryValue);
            renderButtons(topics);
        }

        numGifs = 0;

        // Send a request for the query
        sendRequest(queryValue);

        // Clear the textbox
        $(".query-input[data-which="+ $(this).attr("data-which") +"]").val("");

    });

    // Add Click event for the load button.
    $("#loadButton").click(function(){
        sendRequest(currentQuery);
    });

    // Add click events for the buttons
    $(document).on("click", ".query-button", function(){
        numGifs = 0;
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

    $(".query-input").keyup(function(e){
        if(e.which === 13)
            $(".search-button[data-which=" + $(this).attr("data-which") + "]").click();
        return false;
    })

    renderButtons(topics);
});