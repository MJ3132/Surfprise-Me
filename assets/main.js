let userLocation;
var geocoder;

var video = $('.background-video');
function runVideo() {
    video.get(0).play();
};

$('body').hover(function () {
    video.get(0).play();
});

function reverseGeo(coordinates) {
    // argument is a string type : lat,lng
    var settingsGoogle = {
        "async": true,
        "crossDomain": true,
        "url": "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + coordinates + "&key=AIzaSyCjU4tP9cgPggLk_lGUSzkwW75GgrsyLCY",
        "method": "GET",
    };
    $.ajax(settingsGoogle).done(function (response) {
        //extracted the info we need 
        // var country = response.results[0].address_components[6].long_name;
        // var stateProvince = response.results[0].address_components[5].long_name;
        // var city = response.results[0].address_components[3].long_name;
        console.log(response);
    });

};

// 
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
};

function showPosition(position) {
    userLocation = position.coords;
    console.log(userLocation);
    var latlng = String(userLocation.latitude + ',' + userLocation.longitude);
    console.log(" about to reverse Geo Code", latlng)
    //run call in here
    var settingsGoogle = {
        "async": true,
        "crossDomain": true,
        "url": "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&key=AIzaSyCjU4tP9cgPggLk_lGUSzkwW75GgrsyLCY",
        "method": "GET",
    };
    $.ajax(settingsGoogle).done(function (response) {
        //extracted the info we need 
        var country = response.results[0].address_components[6].long_name;
        var stateProvince = response.results[0].address_components[5].long_name;
        var city = response.results[0].address_components[3].long_name;
        console.log(response);
    });
};

//deals with error for geolocation
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
};

///user authentication stuff 
var config = {
    apiKey: "AIzaSyDarVTsZc6k-a491eF6C8PgcSIwXqf0xNY",
    authDomain: "signup-signin-58064.firebaseapp.com",
    databaseURL: "https://signup-signin-58064.firebaseio.com",
    projectId: "signup-signin-58064",
    storageBucket: "signup-signin-58064.appspot.com",
    messagingSenderId: "175269563861"
};
firebase.initializeApp(config);
const txtEmail = $('#emailtext');
const txtPassword = $('#passwordtext');
const signUpBtn = $('#signup');
const signInBTn = $('#signin');
const logOutBtn = $('#logout');
//add sign In event
signInBTn.on("click", function () {
    const email = txtEmail.val();
    const pass = txtPassword.val();
    // sign in 
    firebase.auth().signInWithEmailAndPassword(email, pass)
        .then(function () {
            console.log('you logged in');
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            console.log(errorCode, errorMessage);
        });
});
//sign up event
signUpBtn.on("click", function (event) {
    event.preventDefault();
    const email = txtEmail.val();
    const pass = txtPassword.val();
    // sign up a user
    firebase.auth().createUserWithEmailAndPassword(email, pass)
        .then(function () {
            console.log('you signed up');
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
            // ...
        });
});

// logout button
logOutBtn.on('click', function (event) {
    event.preventDefault();
    firebase.auth().signOut();
    console.log('you logged out');
});
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        renderPage('aftersignin');
        $('.footer').hide();
        $('.div-wrapper').hide();
        getLocation();
    } else {
        // User is signed out.
        // ...
        renderPage('beforesignin');
        $('.footer').show();
        $('.div-wrapper').show();

    }
});

//Next Event Button

$('#next-option').on('click', function () {
    var counter = 0;
    var activePost = $('.post.active');
    var nextActivePost = activePost.next();
    activePost.removeClass('active');
    if (nextActivePost.length > 0) {
        nextActivePost.addClass('active');

    } else {
        activePost.siblings().first().addClass('active');
    }
    updateActivePostWithAddress();
    // End Next Button   

})

// API Query URL + Parameters + AJAX CALLS
var categories = ["expos", "concerts", "festivals", "performing-arts", "sports", "community", "conferences"];

// Suprise Me button aka Gives Random Results
$("#suprise-me").on("click", function () {
    document.querySelector('#answer-div').innerHTML = '';
    var category = categories[Math.floor(Math.random() * (categories.length + 1))]

    $.ajax({
        url: `https://api.predicthq.com/v1/events/?within=10km@${userLocation.latitude}%2C${userLocation.longitude}&category=${category}`,
        method: 'GET',
        contentType: "application/json",
        headers: {
            Authorization: "Bearer 4SepDTuqqTQQgPSM68gLJpoJJoEpSB",
            Accept: "application/json"
        }
    }).done(function (response) {
        console.log(response);

        var answer = response.results;
        console.log(answer);

        var content = answer.map(function (eachEvent) {
            console.log(eachEvent);


            return {
                title: eachEvent.title,
                location: {
                    lat: eachEvent.location[1],
                    lng: eachEvent.location[0]
                },
                start: eachEvent.start,
                labels: eachEvent.labels,
                duration: eachEvent.duration
            };
        });
        console.log(content);
        var html = "";

        for (var i = 0; i < content.length; i++) {
            //ternary operator
            var postHTML = ` 
        
                <div class="post${i === 0 ? " active" : ""}">
                    <input type='hidden' value='${content[i].location.lat}' name='lat'>
                    <input type='hidden' value='${content[i].location.lng}' name='lng'>
                    
                    <p>${i + 1}/${content.length}</p>
                    <h1 class="post-title">${content[i].title}</h1>
                    <h2 class="post-description">Type:${content[i].labels}</h2>
                    <h2 class="post-location"></h2>
                    <input type='hidden' value='${content[i].start}' name='start'.
                    <h2 class="post-start"></h2>

                </div>
            `;
            console.log(postHTML);
            html += postHTML;
        }
        $('#answer-div').html(html);
        updateActivePostWithAddress();
    }).fail(function (err) {
        // throw errs
    });
});

function updateActivePostWithAddress() {
    //get active post
    var activePost = $('.post.active');
    // Change date formats
    var startTime = activePost.find("input[name='start']").val();
    console.log(startTime);
    let changedStart = moment(startTime).format('MMMM Do YYYY, h:mm:ss a');

    activePost.find('.post-start').text(changedStart);
    console.log(changedStart);


    // change Time Duration
    // var duration = activePost.find('.post-s  tart').val();

    // console.log(duration);
    // var formattedDur = moment.utc(duration*1000).format('H:mm');
    // activePost.find('.post-duration').text(formattedDur);

    // get latitude and longitude in a var

    var lat = parseFloat(activePost.find("input[name ='lat']").val());
    var lng = parseFloat(activePost.find("input[name ='lng']").val());

    // reverse geo code latitude and longitude 

    geocoder.geocode({ 'location': { lat: lat, lng: lng } }, function (results, status) {
        console.log(status, results);
        if (status === 'OK') {
            if (results[0]) {
                activePost.find('.post-location').text(results[0].formatted_address);
                

            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
    // when we get reponse back (callback function), check for status and check for address, and add the address somewhere in the active post
}

//Reverse Geo-code coordinates to address from API response(location)
function initMap() {
    geocoder = new google.maps.Geocoder;
}
// Page Rendering Function ( shows specific page, while hiding the other containers with the class of -page)
function isPageShownCurrently(page) {
    return false;
};
// [class*] all classes that have or end with]
function renderPage(page) {
    if (!$(`.${page}-page`).is(':visible')) {
        $('[class*="-page"]').hide(400, function () {
            $(`.${page}-page`).show(400);
        });
    }
};
// End page rendering function

//video background
var video = $('.background-video');
function runVideo() {
    video.get(0).play();
};
function pauseVideo() {
    video.get(0).pause();
};

$('#play').on('click', function (e) {
    runVideo();
    console.log('play');
}
);
$('#pause').on('click', function (e) {
    pauseVideo();
    console.log('pause');
}
);
//doing the footer stuff rn
$('footer').on('click', function (e) {
    console.log('waddup');
    document.getElementById('overlay').style.display = "block";
});
$('#overlay').on('click', function (e) {
    console.log('waddup');
    document.getElementById('overlay').style.display = "none";
});

