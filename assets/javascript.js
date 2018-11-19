// when the user clicks on one of the genres...
$(".hvrbx-layer-top").on("click", function() {
    // clear the movies from the previous genre, if any are on the page
    $("#movie-results").empty();  

    // grab the value of the genre button, to be passed to the TMDB API
    var searchTerm = $(this).attr("value");

    // `movieData` will hold the response object
    var movieData;

    // `search` corresponds to the genre code for the TMDB API
    var queryURL = "https://api.themoviedb.org/3/discover/movie?api_key=6d9d4c1511419d5253e7cf5683b3e1df&with_genres=" + searchTerm + "&sort_by=popularity.desc";

    // Creates AJAX call for the specific movie button being clicked
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        // creating a shortcut
        movieData = response.results;

        // show 10 results on the page
        for (var i = 0; i < 10; i ++) {
            displayMovieInfo(movieData[i]);
        }
    });
});

function displayMovieInfo(search) {
    var newRow = $("<div>");
    newRow.addClass("row");
    
    var posterCol = $("<div>");
    posterCol.addClass("col-lg-4");
    var detailsCol = $("<div>");
    detailsCol.addClass("col-lg-8");

    var movieImage = $("<img>")
    var moviePoster = search.poster_path
    var moviePosterUrl = "https://image.tmdb.org/t/p/w300" + moviePoster
    movieImage.attr("src", moviePosterUrl)

    var newTitle = $("<h4>");
    newTitle.text(search.title);
    
    var newOverview = $("<p>");
    newOverview.text(search.overview);
    
    var newRelease = $("<p>");
    newRelease.text("Release: " + search.release_date);
    
    var newPopularity = $("<p>");
    newPopularity.text("Popularity: " + search.popularity);

    var newAvgVote = $("<p>");
    newAvgVote.text("Average Vote: " + search.vote_average);

    // attaching the movie ID to the trailer button
    // when the button is clicked, it will pass the movie ID to the TMDB API again
    var watchTrailer = $("<button>");
    watchTrailer.addClass("watch-trailer-btn btn btn-dark sm-btn");
    watchTrailer.text("Watch the trailer");
    watchTrailer.attr("movieID", search.id);

    var newTrailer = $("<iframe>");
    newTrailer.attr("width", "853");
    newTrailer.attr("height", "480");
    newTrailer.attr("src", "");
    newTrailer.attr("class", "movie-trailer")
    // attaching the movie ID to the video element so it can be located later
    newTrailer.attr("id", search.id);

    // appending all the information to the two columns
    posterCol.append(movieImage);

    detailsCol.append(newTitle);
    detailsCol.append(newOverview);
    detailsCol.append(newRelease);
    detailsCol.append(newPopularity);
    detailsCol.append(newAvgVote);
    detailsCol.append(watchTrailer);
    detailsCol.append("<br><br>");
    detailsCol.append(newTrailer);
    newTrailer.hide();

    // appending the two columns to the new row
    newRow.append(posterCol);
    newRow.append(detailsCol);

    // appending the new row to the page with spacing
    $("#movie-results").append("<br>");
    $("#movie-results").append(newRow);
    $("#movie-results").append("<br>");

    // automatically scroll to the results area when a genre is clicked
    var offset = $("#movie-results").offset();
    window.scroll(0, offset.top);
}

$(document).on("click", ".watch-trailer-btn", function() {
    // hide any previously opened trailer
    $(".movie-trailer").hide();
    var trailerID = $(this).attr("movieID");
    
    // using the movieID attribute to complete the second query URL
    var trailerQueryURL = "https://api.themoviedb.org/3/movie/" + trailerID + "/videos?api_key=6d9d4c1511419d5253e7cf5683b3e1df&language=en-US";

    // Creates AJAX call for the specific trailer button being clicked
    $.ajax({
        url: trailerQueryURL,
        method: "GET"
    }).then(function(response) {
        // get the end of the URL from the response
        var videoKey = (response.results[0]).key;
        // add the key to the rest of the YouTube link
        var youtubeLink = "https://www.youtube.com/embed/" + videoKey;
        // change the source of the video and show the element
        $("#" + trailerID).attr("src", youtubeLink);
        $("#" + trailerID).show();
        
    });
});


var googleURL = "https://maps.googleapis.com/maps/api/geocode/json";
var loc;

$("#location-submit").on("click", function() {
    event.preventDefault();
    
    geolocation()
    
});

// // making a GET request to get user lat & long from user location
function geolocation() {
    loc =  $("#locationText").val().trim()   
    axios.get(googleURL, {
        params: {
            address: loc,
            key : 'AIzaSyAWBZmsW4r6XvMYn5LUIrAT4O5Kooc4W3o'
        }
    })
    .then(function(response){
        console.log(response);
    // latitude 
        const latitude = response.data.results[0].geometry.location.lat;
        console.log(latitude)
        //longitude 
        const longitude = response.data.results[0].geometry.location.lng;
        console.log(longitude)
     
        var movieURl = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+latitude+","+longitude+"&radius=1500&type=movie_theater&key=AIzaSyAWBZmsW4r6XvMYn5LUIrAT4O5Kooc4W3o";
        console.log(movieURl, "hi")
        $.ajax({
        url: movieURl,
        method: "GET"
    }).then(function(response){
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<")
        console.log(response.results[0].name)
        var movieLocation = response.results[0].name; 
        var movieDistance = response.results[0].vicinity
        console.log(response)

        var movieLocationDiv = $("<div>"); 
        movieLocationDiv.empty()
        movieLocationDiv.addClass("theater")
        movieLocationDiv.text("The theater nearest to you is: "+movieLocation+", located at " +movieDistance+"."); 
        $("#nearestCinema").append(movieLocationDiv); 
    }).catch(function(error){
        console.log(error)
    }); 
})
}




     // Initialize Firebase
var config = {
    apiKey: "AIzaSyAZ-i2ghZA6YqyiuhGpzYU9f_UqgeWxhpA",
    authDomain: "groupproject-48ce2.firebaseapp.com",
    databaseURL: "https://groupproject-48ce2.firebaseio.com",
    projectId: "groupproject-48ce2",
    storageBucket: "groupproject-48ce2.appspot.com",
    messagingSenderId: "917227256677"
};
      firebase.initializeApp(config);

    // //Create a variable to reference the database
    var database = firebase.database();
    console.log(database)


    console.log("Firebase location value stored: " + userStoredLocation)
    $("#location-submit").on("click", function(event){
        event.preventDefault(); 
        var movieLocation = $("#locationText").val.trim(); 
        database.ref().set( {
            movieLocation:movieLocation
        }); 
        console.log(movieLocation);
        $("#nearestCinema").text(movieLocation); 
    })
