
//---------------------------------ELEMENT GENERATION
//Create beach selector
function generateElements() {
    $('#loadingWrapper').hide();
    for (var beach in beaches) {
        $('.beachSelection').append('<option>' + beaches[beach].name + '</option>');
    }
    for (var i = 0; i < cities.length; i++) {
        $('.citySelection').append('<option>' + cities[i].city + '</option>');
    }
}
;
//---------------------------------UTILS
(function () {

//    /**
//     * Decimal adjustment of a number.
//     *
//     * @param	{String}	type	The type of adjustment.
//     * @param	{Number}	value	The number.
//     * @param	{Integer}	exp		The exponent (the 10 logarithm of the adjustment base).
//     * @returns	{Number}			The adjusted value.
//     */
    function decimalAdjust(type, value, exp) {
//         If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
//         If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
//         Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
//         Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

//     Decimal round
    if (!Math.round10) {
        Math.round10 = function (value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
//     Decimal floor
    if (!Math.floor10) {
        Math.floor10 = function (value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
//     Decimal ceil
    if (!Math.ceil10) {
        Math.ceil10 = function (value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }

})();

function findWindowHeight() {
    var body = document.body,
            html = document.documentElement;
    var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    return height;
}



//-------------------------------MAPS
var storage = localStorage;

if(!storage.getItem('returning')){
    window.location = "index.php?page=help";
    storage.setItem('returning', 'true');
}
//----------START CLOSURE
// Closure created to contain semi-global variables relevant to MAPS functions
var mapModule = (function () {

    var map;
    var userLatLng;
    var defaultZoom = 10;
    var request;
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var infoWindow = new google.maps.InfoWindow({
        content: '<div id="infoWindow"><i class="loadingIcon fa fa-spinner fa-pulse fa-3x"></i></div>'
    });

    function locateSuccess(position) {
        userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

//    storage.setItem('userLat', position.coords.latitude);
//    storage.setItem('userLng', position.coords.latitude);

        var mapOptions = {
            center: userLatLng,
            zoom: defaultZoom
        };

        map = new google.maps.Map(document.getElementById('map-canvas'),
                mapOptions);


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
        getNearestBeaches(userLatLng, beaches, map);


    }

    function locateFail(geoPositionError) {
        switch (geoPositionError.code) {
            case 0: // UNKNOWN_ERROR 
                alert('An unknown error occurred, sorry');
                break;
            case 1: // PERMISSION_DENIED 
                alert('Permission to use Geolocation was denied');
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
    //The two functions that need to be accessed publicly have been returned from the closure
    //as an object
    return {
        runAutoLocate: function () {
            if (navigator.geolocation) {
                var geoOptions = {
                    enableHighAccuracy: true
                };

                navigator.geolocation.getCurrentPosition(locateSuccess, locateFail, geoOptions);

            } else {
                alert('I\'m sorry, but Geolocation is not supported in your current browser.');
            }
        },
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
        }};

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
        console.log(sortedBeaches);
        var i = 0;
        (function delayedLoop(i) {
            // Loop delay is used to trottle requests and insure api query limit is not reached
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
                            directionsDisplay.setMap(map);
                            directionsDisplay.setPanel(document.getElementById('directions-panel'));
                            directionsDisplay.setOptions({suppressMarkers: true});
                            directionsDisplay.setDirections(results[j].result);
                            $('#loadingWrapper').hide();
                            infoWindow.open(map, marker);
                            setTimeout(fetchForcast, 150, beachName);
                        }

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

    function fetchForcast(beachName) {
        $("#infoWindow").swellmap({
            site: beachName,
            activity: "Surfing",
            smaplink: false
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

}());
//--------END CLOSURE

function getDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function compareDistanceGoogle(a, b) {
    return a.result.routes[0].legs[0].distance.value - b.result.routes[0].legs[0].distance.value;
}










