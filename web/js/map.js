/* 
 * This module is to run all map associated functions
 */

var mapModule = (function () {

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

        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('directions-panel'));
        directionsDisplay.setOptions({suppressMarkers: true});

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
                if ($(window).height() < 800) {
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
        google.maps.event.addListener(map, 'zoom_changed', function () {
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
            var sonarAnimation = setInterval(function () {
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
        displayLoading();
        var sortedBeaches = [];
        var beachName;
        var results = [];

        for (var beach in beaches) {
            sortedBeaches.push({
                distance: getDistance(start.lat(), start.lng(), beaches[beach].lat, beaches[beach].lng),
                beach: beaches[beach]
            });
        }

        sortedBeaches.sort(function (a, b) {
            return a.distance - b.distance;
        });

        var i = 0;
        (function delayedLoop(i) {
            // Set timeout is used to trottle requests and insure api query limit is not reached
            //Used a function as a loop to avoid issues
            setTimeout(function () {
                var destination = new google.maps.LatLng(sortedBeaches[i].beach.lat, sortedBeaches[i].beach.lng);
                request = {
                    origin: start,
                    destination: destination,
                    travelMode: google.maps.TravelMode.DRIVING
                };


                obtainAndDisplay(request, i, function () {

                    results.sort(compareDistanceGoogle);
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
                        if (j === 0) {
                            directionsDisplay.setDirections(results[j].result);
                            $('#loadingWrapper').hide();
                            infoWindow.open(map, marker);
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

                            directionsService.route(request, function (result, status) {
                                if (status === google.maps.DirectionsStatus.OK) {
                                    directionsDisplay.setDirections(result);
                                }
                            });

                            infoWindow.open(map, this);

                            setTimeout(fetchForcast, 500, beachName);
                        }
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
            directionsService.route(request, function (result, status) {
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
        if (favorites.indexOf(beachName) === -1) {
            console.log('noFavorites');
            $('.favorite').hover(
                    function () {
                        $(this).removeClass("fa-star-o");
                        $(this).addClass("fa-star");
                    },
                    function () {
                        $(this).removeClass("fa-star");
                        $(this).addClass("fa-star-o");
                    });
            $('.favorite').on("click", {beach: beachName}, mapModule.setFavorite);
        } else {
            $('.favorite').removeClass("fa-star-o").addClass("fa-star");
            $('.favorite').on("click", {beach: beachName}, mapModule.removeFavorite);
        }
        mapModule.displayFavorites();
        $("#infoWindow").prepend("<h1>" + beachName + "</h1>");
        $("#infoWindow").swellmap({
            site: beachName,
            activity: "Surfing",
            smaplink: false,
            title: false
        });
        setTimeout(function () {
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
        runAutoLocate: function () {
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
        setMap: function (mapOptions) {
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
        setLocation: function (name) {
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
        setBeach: function (name) {
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

                    directionsService.route(request, function (result, status) {
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
        setFavorite: function (event) {
            favorites.push(event.data.beach);
            storage.setItem("favorites", JSON.stringify(favorites));
            $('.favorite').off();
            $('.favorite').removeClass("fa-star-o").addClass("fa-star");
            $('.favorite').on("click", {beach: event.data.beach}, mapModule.removeFavorite);
            mapModule.displayFavorites();
        },
        //Removes beach from local storage
        removeFavorite: function (event) {
            if (favorites.indexOf(event.data.beach) !== -1) {
                favorites.splice(favorites.indexOf(event.data.beach), 1);
                $('.favorite').removeClass("fa-star").addClass("fa-star-o");
                $('.favorite').off('click');
                $('.favorite').on("click", {beach: event.data.beach}, mapModule.setFavorite);
                $('.favorite').hover(
                        function () {
                            $(this).removeClass("fa-star-o");
                            $(this).addClass("fa-star");
                        },
                        function () {
                            $(this).removeClass("fa-star");
                            $(this).addClass("fa-star-o");
                        });
                storage.setItem("favorites", JSON.stringify(favorites));
                mapModule.displayFavorites();
            }
        },
        //Used to hold state from favorites back to map
        tempStoreFavorite: function (event) {
            storage.setItem("favoriteBeach", event.data.beach);
        },
        //Displays favorites for both desktop and handheld
        displayFavorites: function () {
            if (favorites.length > 0) {
                console.log($(window).width());
                //Check if display is for desktop or handheld
                if ($(window).width() > 800) {
                    //If desktop, check if there is a select box already there. If so, remove and recreate
                    if ($('#favoritesSelect').length > 0) {
                        $('#favoritesSelect').remove();
                    }
                    $('nav #favoritesLi').append('<select id="favoritesSelect" class="navSelect" onchange="mapModule.setBeach(this.options[this.selectedIndex].text)"><option>Favorites</option></select>');
                    for (var i = 0; i < favorites.length; i++) {
                        $('#favoritesSelect').append('<option>' + favorites[i] + '</option>');
                    }
                } else {
                    if ($('.flexContainer').height() < $(window).height()) {
                        $('.flexContainer').height($(window).height());
                    }
                    $('.favoriteWrap').remove();
                    $('#noFavorites').remove();
                    for (var i = 0; i < favorites.length; i++) {
                        $('#favoritesContainer').append('<div class="favoriteWrap" id="' + i + '"></div>');
                        $('#' + i).prepend("<a href=index.php?page=manual><h1>" + favorites[i] + "</h1></a><i class='favorite fa fa-star fa-3x'></i>");
                        $('#' + i + ' h1').on('click', {beach: favorites[i]}, mapModule.tempStoreFavorite);
                        $('div#' + i + ' .favorite').on("click", {beach: favorites[i], favoritesPage: true}, mapModule.removeFavorite);
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