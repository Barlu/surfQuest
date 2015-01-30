/* 
 * This module is to run all map associated functions
 */

var mapModule = (function() {

    var map;
    var userLatLng;
    var defaultZoom = 10;
    var request;
    var favorites = [];
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var infoWindow = new google.maps.InfoWindow({
        content: '<div id="infoWindow"><i class="favorite fa fa-star-o fa-3x"></i><i class="loadingIcon fa fa-spinner fa-pulse fa-3x"></i></div>'
    });

    if (storage.getItem("favorites")) {
        favorites = JSON.parse(storage.getItem("favorites"));
    }
    ;

    function locateSuccess(position) {
        userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
            center: userLatLng,
            zoom: defaultZoom
        };

        map = new google.maps.Map(document.getElementById('map-canvas'),
                mapOptions);
        //assign directions display to map
        directionsDisplay.setMap(map);
        directionsDisplay.setOptions({suppressMarkers: true});
        //Set user location
        new google.maps.Marker({
            map: map,
            position: userLatLng,
            icon: {
                url: 'images/gpsLocation.png',
                size: new google.maps.Size(14, 14),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(7, 7)
            }
        });



        activateSonar(map, userLatLng, defaultZoom);
        if (storage.getItem("favoriteBeach")) {
            mapModule.setBeach(storage.getItem("favoriteBeach"));
            storage.removeItem("favoriteBeach");
        } else {
            getNearestBeaches(userLatLng, beaches, map);
        }

    }

    function locateFail(geoPositionError) {
        switch (geoPositionError.code) {
            case 0: // UNKNOWN_ERROR 
                alert('An unknown error occurred, sorry');
                break;
            case 1: // PERMISSION_DENIED 
                if ($(window).height() < 1280) {
                    window.location = "index.php?page=manual";
                }
                break;
            case 2: // POSITION_UNAVAILABLE 
                alert('Couldn\'t find you...');
                break;
            case 3: // TIMEOUT 
                alert('The Geolocation request took too long and timed out');
                break;
            default:
        }
    }


//Adds pulsing sonar functionality to marker icon based on user location
    function activateSonar(map, position, defaultZoom) {

        //Sets max and min radius of the pulse, the speed/step and 
        //assigns the circle variable and default zoom
        var rMax = 4500,
                rMin = 500,
                step = 20,
                lastZoom = defaultZoom;
        var sonar;

        //Adds listener to map so that when zoomed in or out the size
        //of the radius is change by a factor of 2
        google.maps.event.addListener(map, 'zoom_changed', function() {
            var zoom = map.getZoom();
            var diff = (zoom - lastZoom);

            if (diff === 1) {
                rMax /= 2;
                rMin /= 2;
                step /= 2;
            } else if (diff > 1) {
                for (var i = 0; i < diff; i++) {
                    rMax /= 2;
                    rMin /= 2;
                    step /= 2;
                }
            } else if (diff === -1) {
                rMax *= 2;
                rMin *= 2;
                step *= 2;
            } else if (diff < -1) {
                for (var i = 0; i > diff; i--) {
                    rMax *= 2;
                    rMin *= 2;
                    step *= 2;
                }
            }
            lastZoom = zoom;
        });

//    A self-invoking expression/closure that is run initially to create the circle
//    then change the circle radius and opacity at a given interval.
//    The closure is needed to isolate it from the listner being added to the map
//    otherwise multiple listners will be added.
        (function  animateSonar() {

            sonar = new google.maps.Circle({
                map: map,
                center: position,
                radius: rMin,
                strokeColor: "#fff",
                strokeOpacity: 1,
                strokeWeight: 2,
                fillColor: "#fff",
                fillOpacity: 0,
                scale: 10
            });

            var opacity = 1;
            var sonarAnimation = setInterval(function() {
                var radius = sonar.getRadius();
                if ((radius > rMax)) {
                    sonar.setMap(null);
                    animateSonar();
                    window.clearInterval(sonarAnimation);
                } else {
                    if (opacity <= 0.004) {
                        sonar.setOptions({
                            strokeOpacity: opacity
                        });
                    } else {
                        sonar.setOptions({
                            strokeOpacity: opacity -= 0.006
                        });
                    }
                    sonar.setRadius(radius + step);
                }
            }, 10);
        }());
    }



    //Controller function for searching nearest 10 beaches, then passing them through the google api, then recalculating distances
    //making it more accurate. Then it generattes markers based on top 5 and on the closest it will open infowindow
    function getNearestBeaches(start, beaches, map) {
        //displays modal loading pages while google api request are made
        displayLoading();
        //Holds beaches and distance
        var sortedBeaches = [];
        var beachName;
        //Hols results from google api
        var results = [];

        for (var beach in beaches) {
            sortedBeaches.push({
                distance: getDistance(start.lat(), start.lng(), beaches[beach].lat, beaches[beach].lng),
                beach: beaches[beach]
            });
        }

        sortedBeaches.sort(function(a, b) {
            return a.distance - b.distance;
        });

        var i = 0;
        (function delayedLoop(i) {
            // Set timeout is used to trottle requests and insure api query limit is not reached
            // Used a function as a loop to avoid issues
            setTimeout(function() {
                var destination = new google.maps.LatLng(sortedBeaches[i].beach.lat, sortedBeaches[i].beach.lng);
                request = {
                    origin: start,
                    destination: destination,
                    travelMode: google.maps.TravelMode.DRIVING
                };


                obtainAndDisplay(request, i, function() {
                    //Reorders array based on actual distance
                    results.sort(compareDistanceGoogle);
                    //Gets top 5 from the array
                    for (var j = 4; j > -1; j--) {
                        beachName = results[j].beach.name;
                        var marker = new google.maps.Marker({
                            position: {
                                lat: results[j].result.ic.destination.k,
                                lng: results[j].result.ic.destination.D
                            },
                            map: map,
                            title: beachName
                        });
                        //For the last (closest) its renders directions and opens info window
                        if (j === 0) {
                            directionsDisplay.setDirections(results[j].result);
                            $('#loadingWrapper').hide();
                            infoWindow.open(map, marker);
                            //Allows time for window to be added to the dom then fills it with forcast data
                            setTimeout(fetchForcast, 150, beachName);
                        }
                        //Resets directions when another marker is clicked
                        function redefineDirections() {
                            for (var i = 0; i < results.length; i++) {
                                if (results[i].beach.lng === Math.round10(this.position.D, -6) && results[i].beach.lat === Math.round10(this.position.k, -6)) {
                                    beachName = results[i].beach.name;
                                }
                            }

                            request = {
                                origin: start,
                                destination: this.position,
                                travelMode: google.maps.TravelMode.DRIVING
                            };

                            directionsService.route(request, function(result, status) {
                                if (status === google.maps.DirectionsStatus.OK) {
                                    directionsDisplay.setDirections(result);
                                }
                            });
                            //Opens info window based on clicked marker
                            infoWindow.open(map, this);
                            setTimeout(fetchForcast, 500, beachName);
                        }
                        //Added listener to all markers
                        google.maps.event.addListener(marker, 'click', redefineDirections);
                    }
                });
                i++;
                if (i < 10) {
                    delayedLoop(i);
                }
            }, 500);
        })(i);
        //Gets results array from google api
        function obtainAndDisplay(request, i, fn) {
            directionsService.route(request, function(result, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    results.push({
                        result: result,
                        beach: sortedBeaches[i].beach
                    });
                }
                if (i === 9) {
                    fn();
                }
            });
        }
    }
    //Retrieves forcast and sets up info window
    function fetchForcast(beachName) {
        //Deals with added favorits icon and assigning listners
        //Checks if it is already in favorites
        if (favorites.indexOf(beachName) === -1) {
            //If not assign hover listener
            $('.favorite').hover(
                    function() {
                        $(this).removeClass("fa-star-o");
                        $(this).addClass("fa-star");
                    },
                    function() {
                        $(this).removeClass("fa-star");
                        $(this).addClass("fa-star-o");
                    });
            //Assign onlick to setFavorite with beachName as event data        
            $('.favorite').on("click", {beach: beachName}, mapModule.setFavorite);
        } else {
            //If it is in favorites
            //Change class to full star
            $('.favorite').removeClass("fa-star-o").addClass("fa-star");
            //Add remove favorites onclick
            $('.favorite').on("click", {beach: beachName}, mapModule.removeFavorite);
        }
        mapModule.displayFavorites();
        //Adds my on title header
        $("#infoWindow").prepend("<h1>" + beachName + "</h1>");
        //Forcast api prepopulates rest of data
        $("#infoWindow").swellmap({
            site: beachName,
            activity: "Surfing",
            smaplink: false,
            title: false
        });
        //Removes loading icon just before swellmap returns data
        setTimeout(function() {
            $(".loadingIcon").remove();
        }, 1000);
    }

    function displayLoading() {

        var height = findWindowHeight();
        $('#loadingWrapper').height(height);
        $('#loadingWrapper').show();
    }

    //Any functions that need to be accessed publicly have been returned from the closure
    //as an object
    return {
        runAutoLocate: function() {
            if (navigator.geolocation) {
                var geoOptions = {
                    enableHighAccuracy: true
                };
                navigator.geolocation.getCurrentPosition(locateSuccess, locateFail, geoOptions);

            } else {
                if (storage.getItem("favoriteBeach")) {
                    getBeach(storage.getItem("favoriteBeach"));
                }
                window.location = "index.php?page=manual";
            }
        },
        //Sets map without geolocation
        setMap: function(mapOptions) {
            if (!mapOptions) {
                var latLng = new google.maps.LatLng(-41.477078, 172.993614);
                mapOptions = {
                    center: latLng,
                    zoom: 5
                };
            }
            map = new google.maps.Map(document.getElementById('map-canvas'),
                    mapOptions);
            $('#loadingWrapper').hide();
        },
        //Manual city selection
        setLocation: function(name) {
            for (var i = 0; i < cities.length; i++) {
                if (cities[i].city === name) {
                    var position = {
                        coords: {
                            latitude: cities[i].lat,
                            longitude: cities[i].lng
                        }
                    };
                    locateSuccess(position);
                }
            }
        },
        //Manual beach selection
        setBeach: function(name) {
            displayLoading();
            for (var beach in beaches) {
                if (beaches[beach].name === name) {
                    var marker = new google.maps.Marker({
                        position: {
                            lat: beaches[beach].lat,
                            lng: beaches[beach].lng
                        },
                        map: map,
                        title: name
                    });
                    console.log(userLatLng);
                    request = {
                        origin: userLatLng,
                        destination: marker.position,
                        travelMode: google.maps.TravelMode.DRIVING
                    };

                    directionsService.route(request, function(result, status) {
                        if (status === google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(result);
                        }
                    });
                    $('#loadingWrapper').hide();
                    infoWindow.open(map, marker);
                    setTimeout(fetchForcast, 500, name);

                }
            }
        },
        //Adds beach to local storage
        setFavorite: function(event) {
            favorites.push(event.data.beach);
            storage.setItem("favorites", JSON.stringify(favorites));
            $('.favorite').off();
            $('.favorite').removeClass("fa-star-o").addClass("fa-star");
            $('.favorite').on("click", {beach: event.data.beach}, mapModule.removeFavorite);
            mapModule.displayFavorites();
        },
        //Removes beach from local storage
        removeFavorite: function(event) {
            if (favorites.indexOf(event.data.beach) !== -1) {
                favorites.splice(favorites.indexOf(event.data.beach), 1);
                $('.favorite').removeClass("fa-star").addClass("fa-star-o");
                $('.favorite').off('click');
                $('.favorite').on("click", {beach: event.data.beach}, mapModule.setFavorite);
                $('.favorite').hover(
                        function() {
                            $(this).removeClass("fa-star-o");
                            $(this).addClass("fa-star");
                        },
                        function() {
                            $(this).removeClass("fa-star");
                            $(this).addClass("fa-star-o");
                        });
                storage.setItem("favorites", JSON.stringify(favorites));
                mapModule.displayFavorites();
            }
        },
        //Used to hold state from favorites back to map
        tempStoreFavorite: function(event) {
            storage.setItem("favoriteBeach", event.data.beach);
        },
        //Displays favorites for both desktop and handheld
        displayFavorites: function() {
            //Check if display is for desktop or handheld
            if ($(window).width() > 1280) {
                if (favorites.length > 0) {
                    //If desktop, check if there is a select box already there. If so, remove and recreate
                    if ($('#favoritesSelect').length > 0) {
                        $('#favoritesSelect').remove();
                    }
                    //Locate empty favorites li and add select box
                    $('nav #favoritesLi').append('<select id="favoritesSelect" class="navSelect" onchange="mapModule.setBeach(this.options[this.selectedIndex].text)"><option>Favorites</option></select>');
                    for (var i = 0; i < favorites.length; i++) {
                        //for each favorite add another option
                        $('#favoritesSelect').append('<option>' + favorites[i] + '</option>');
                    }
                }
            } else {
                //If handeheld
                //Ensure height is atleast viewport height
                if ($('.flexContainer').height() < $(window).height()) {
                    $('.flexContainer').height($(window).height());
                }
                //remove any favorites currently on screen
                $('.favoriteWrap').remove();
                
                if (favorites.length > 0) {
                    //if there are favorites to add remove no favories message
                    $('#noFavorites').remove();
                    for (var i = 0; i < favorites.length; i++) {
                        //add wrap with unique id
                        $('#favoritesContainer').append('<div class="favoriteWrap" id="' + i + '"></div>');
                        //add heading link and favorites icon
                        $('#' + i).prepend("<a href=index.php?page=manual><h1>" + favorites[i] + "</h1></a><i class='favorite fa fa-star fa-3x'></i>");
                        //add listener to heading to store selection in local strage keeping state before moving page
                        $('#' + i + ' h1').on('click', {beach: favorites[i]}, mapModule.tempStoreFavorite);
                        //add listener to favorite icon
                        $('div#' + i + ' .favorite').on("click", {beach: favorites[i], favoritesPage: true}, mapModule.removeFavorite);
                        //populate forcast
                        $("#" + i).swellmap({
                            site: favorites[i],
                            activity: "Surfing",
                            smaplink: false,
                            title: false
                        });
                    }
                }
            }

        }};

}());