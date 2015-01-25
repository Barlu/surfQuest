
//---------------------------------UTILS
(function () {

    /**
     * Decimal adjustment of a number.
     *
     * @param	{String}	type	The type of adjustment.
     * @param	{Number}	value	The number.
     * @param	{Integer}	exp		The exponent (the 10 logarithm of the adjustment base).
     * @returns	{Number}			The adjusted value.
     */
    function decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Decimal round
    if (!Math.round10) {
        Math.round10 = function (value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
    // Decimal floor
    if (!Math.floor10) {
        Math.floor10 = function (value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
    // Decimal ceil
    if (!Math.ceil10) {
        Math.ceil10 = function (value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }

})();

//-------------------------------MAPS

var storage = localStorage;
if (navigator.geolocation) {
    var geoOptions = {
        enableHighAccuracy: true
    };

    navigator.geolocation.getCurrentPosition(locateSuccess, locateFail, geoOptions);

} else {
    alert('I\'m sorry, but Geolocation is not supported in your current browser.');
}

function locateSuccess(position) {
    var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var defaultZoom = 10;

    storage.setItem('userLat', position.coords.latitude);
    storage.setItem('userLng', position.coords.latitude);

    var mapOptions = {
        center: userLatLng,
        zoom: defaultZoom
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'),
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
    var rMax = 5000,
            rMin = 1000,
            step = 20,
            lastZoom = defaultZoom;
    var sonar;

    //Adds listener to map so that when zoomed in or out the size
    //of the radius is change by a factor of 2
    google.maps.event.addListener(map, 'zoom_changed', function () {
        var zoom = map.getZoom();
        if (zoom > lastZoom) {
            rMax /= 2;
            rMin /= 2;
            step /= 2;
        } else {
            rMax *= 2;
            rMin *= 2;
            step *= 2;
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
                sonar.setRadius(radius + step);
                sonar.setOptions({
                    strokeOpacity: opacity -= 0.006
                });
            }
        }, 10);
    }());
}

function getNearestBeaches(start, beaches, map) {
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
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
    for (var i = 0; i < 10; i++) {
        var destination = new google.maps.LatLng(sortedBeaches[i].beach.lat, sortedBeaches[i].beach.lng);
        var request = {
            origin: start,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
        };


        obtainAndDisplay(request, i, function (results, count) {
            if (count === 9) {
                results.sort(compareDistanceGoogle);
                for (var j = 4; j > -1; j--) {
                    console.log(results[j]);
                    if (j === 0) {
                        directionsDisplay.setMap(map);
                        directionsDisplay.setPanel(document.getElementById('directions-panel'));
                        directionsDisplay.setOptions({suppressMarkers: true});
                        directionsDisplay.setDirections(results[j].result);

                        var infoWindow = new google.maps.InfoWindow({
                            content: '<div id="infoWindow"><i class="loadingIcon fa fa-spinner fa-pulse fa-3x"></i></div>'
                        });
                    }
                    var marker = new google.maps.Marker({
                        position: {
                            lat: results[j].result.ic.destination.k,
                            lng: results[j].result.ic.destination.D
                        },
                        map: map,
                        title: results[j].beach.name
                    });
                    console.log(marker);
                    if (infoWindow) {
//                        Due to issues with the forcast API I needed to set a time out for
//                        the forcast to be called. This allowed enough time for the html infoWindow to be rendered
//                        then the swellmap to be placed inside.
//                        I also needed to pass the beach name into a single variable as this
//                        was unable to be accessed inside fethForcast() otherwise.
                        beachName = results[j].beach.name;
                        infoWindow.open(map, marker);
                        setTimeout(fetchForcast, 50);
                    }

                    function redefineDirections() {
                        
                        for (var i = 0; i < results.length; i++) {
                            console.log();
                            console.log(results[i].beach.lng)
                            console.log(i);
                            if (results[i].beach.lng === Math.round10(this.position.D, -6) && results[i].beach.lat === Math.round10(this.position.k, -6)) {
                                beachName = results[i].beach.name;
                                console.log(beachName);
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
                        setTimeout(fetchForcast, 50);
                    }
                    google.maps.event.addListener(marker, 'click', redefineDirections);
                }
            }
        });


    }

    function fetchForcast() {
        console.log(beachName)
        $("#infoWindow").swellmap({
            site: beachName,
            activity: "Surfing",
            smaplink: false
        });
        setTimeout(function(){
            $(".loadingIcon").remove();
        }, 500);
    }


    function obtainAndDisplay(request, count, fn) {
        directionsService.route(request, function (result, status) {
            if (status === google.maps.DirectionsStatus.OK) {

                results.push({
                    result: result,
                    beach: sortedBeaches[count].beach
                });
                fn(results, count);
            }
        });
    }
}

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
    console.log(a);
    return a.result.routes[0].legs[0].distance.value - b.result.routes[0].legs[0].distance.value;
}

var beaches = {
    ninetyMileBeach: {
        name: '90 Mile Beach',
        spotId: 118,
        lat: -34.719280,
        lng: 172.928415
    },
    ahuAhu: {
        name: 'Ahu Ahu',
        spotId: 2015,
        lat: -39.117856,
        lng: 173.931930
    },
    aramoanaSpit: {
        name: 'Aramoana Spit',
        spotId: 4063,
        lat: -45.772796,
        lng: 170.703259
    },
    backBeach: {
        name: 'Back Beach (Taranaki)',
        spotId: 1957,
        lat: -39.068919,
        lng: 174.017840
    },
    blacksBeach: {
        name: 'Black\'s Beach',
        spotId: 2028,
        lat: -39.068708,
        lng: 177.803179
    },
    blueDuckStream: {
        name: 'Blue Duck Stream',
        spotId: 4064,
        lat: -42.255906,
        lng: 173.809521
    },
    castlepoint: {
        name: 'Castlepoint',
        spotId: 573,
        lat: -40.896854,
        lng: 176.222082
    },
    clarenceRiver: {
        name: 'Clarence River',
        spotId: 4065,
        lat: -42.174698,
        lng: 173.931088
    },
    dinersBeach: {
        name: 'Diners Beach',
        spotId: 112,
        lat: -34.719280,
        lng: 172.928415
    },
    elliotBay: {
        name: 'Elliot Bay',
        spotId: 4066,
        lat: -34.719280,
        lng: 172.928415
    },
    fitzroyBeach: {
        name: 'Fitzroy Beach',
        spotId: 1269,
        lat: -34.719280,
        lng: 172.928415
    },
    forestry: {
        name: 'Forestry',
        spotId: 122,
        lat: -34.719280,
        lng: 172.928415
    },
    frentzesReef: {
        name: 'Frentzes Reef',
        spotId: 4067,
        lat: -34.719280,
        lng: 172.928415
    },
    gizzyPipe: {
        name: 'Gizzy Pipe (Gisborne)',
        spotId: 110,
        lat: -34.719280,
        lng: 172.928415
    },
    goreBay: {
        name: 'Gore Bay',
        spotId: 4068,
        lat: -42.862277,
        lng: 173.312013
    },
    greenMeadows: {
        name: 'Green Meadows',
        spotId: 2024,
        lat: -34.719280,
        lng: 172.928415
    },
    greymouth: {
        name: 'Greymouth',
        spotId: 116,
        lat: -42.449502,
        lng: 171.189228
    },
    hendersonBay: {
        name: 'Henderson Bay',
        spotId: 4069,
        lat: -34.719280,
        lng: 172.928415
    },
    hickoryBay: {
        name: 'Hickory Bay',
        spotId: 4071,
        lat: -43.777409,
        lng: 173.110073
    },
    horseshoeBay: {
        name: 'Horseshoe Bay',
        spotId: 4070,
        lat: -34.719280,
        lng: 172.928415
    },
    kahutara: {
        name: 'Kahutara',
        spotId: 4072,
        lat: -42.432731,
        lng: 173.590369
    },
    karitane: {
        name: 'Karitane',
        spotId: 4073,
        lat: -45.636134,
        lng: 170.661943
    },
    komerneRoad: {
        name: 'Komerne Road',
        spotId: 2020,
        lat: -34.719280,
        lng: 172.928415
    },
    lastChance: {
        name: 'Last Chance',
        spotId: 2033,
        lat: -34.719280,
        lng: 172.928415
    },
    loisells: {
        name: 'Loisells',
        spotId: 4074,
        lat: -34.719280,
        lng: 172.928415
    },
    longPoint: {
        name: 'Long Point',
        spotId: 2025,
        lat: -34.719280,
        lng: 172.928415
    },
    lyallBay: {
        name: 'Lyall Bay',
        spotId: 107,
        lat: -41.329901,
        lng: 174.797100
    },
    magnetBay: {
        name: 'Magnet Bay',
        spotId: 4075,
        lat: -43.843443,
        lng: 172.739412
    },
    mahiaReef: {
        name: 'Mahia Reef',
        spotId: 2029,
        lat: -39.085878,
        lng: 177.866499
    },
    makaroriPoint: {
        name: 'Makarori Point',
        spotId: 4076,
        lat: -34.719280,
        lng: 172.928415
    },
    mangamanunu: {
        name: 'Mangamanunu',
        spotId: 113,
        lat: -42.303790,
        lng: 173.750049
    },
    martinsBay: {
        name: 'Martins Bay',
        spotId: 3913,
        lat: -44.359203,
        lng: 167.993750
    },
    masonBay: {
        name: 'Mason Bay - Stuart Island',
        spotId: 3914,
        lat: -34.719280,
        lng: 172.928415
    },
    motunauBeach: {
        name: 'Motunau Beach',
        spotId: 4082,
        lat: -43.048912,
        lng: 173.067784
    },
    mountMaunganui: {
        name: 'Mount Maunganui',
        spotId: 93,
        lat: -34.719280,
        lng: 172.928415
    },
    murderers: {
        name: 'Murderers',
        spotId: 4077,
        lat: -34.719280,
        lng: 172.928415
    },
    muriwaiBeach: {
        name: 'Muriwai Beach',
        spotId: 4078,
        lat: -34.719280,
        lng: 172.928415
    },
    napier: {
        name: 'Napier',
        spotId: 132,
        lat: -34.719280,
        lng: 172.928415
    },
    newBrightonBeach: {
        name: 'New Brighton Beach',
        spotId: 114,
        lat: -43.496391,
        lng: 172.731472
    },
    newPlymouth: {
        name: 'New Plymouth',
        spotId: 104,
        lat: -34.719280,
        lng: 172.928415
    },
    northMakarori: {
        name: 'North Makarori',
        spotId: 4081,
        lat: -34.719280,
        lng: 172.928415
    },
    oakura: {
        name: 'Oakura',
        spotId: 2014,
        lat: -34.719280,
        lng: 172.928415
    },
    ohopeBeach: {
        name: 'Ohope Beach',
        spotId: 108,
        lat: -34.719280,
        lng: 172.928415
    },
    opoutama: {
        name: 'Opoutama',
        spotId: 2027,
        lat: -39.064749,
        lng: 177.855508
    },
    opunake: {
        name: 'Opunake',
        spotId: 106,
        lat: -34.719280,
        lng: 172.928415
    },
    orewaBeach: {
        name: 'Orewa Beach',
        spotId: 4079,
        lat: -34.719280,
        lng: 172.928415
    },
    owakaArea: {
        name: 'Owaka Area',
        spotId: 123,
        lat: -34.719280,
        lng: 172.928415
    },
    papamoaBeach: {
        name: 'Papamoa Beach',
        spotId: 109,
        lat: -34.719280,
        lng: 172.928415
    },
    papatowai: {
        name: 'Papatowai',
        spotId: 124,
        lat: -34.719280,
        lng: 172.928415
    },
    patauaBar: {
        name: 'Pataua Bar',
        spotId: 4080,
        lat: -34.719280,
        lng: 172.928415
    },
    piha: {
        name: 'Piha',
        spotId: 90,
        lat: -34.719280,
        lng: 172.928415
    },
    porpoiseBay: {
        name: 'Porpoise Bay',
        spotId: 3915,
        lat: -34.719280,
        lng: 172.928415
    },
    punihos: {
        name: 'Punihos',
        spotId: 2019,
        lat: -34.719280,
        lng: 172.928415
    },
    raglan: {
        name: 'Raglan',
        spotId: 91,
        lat: -34.719280,
        lng: 172.928415
    },
    railways: {
        name: 'Railways',
        spotId: 2026,
        lat: -39.074670,
        lng: 177.828051
    },
    rivertonRocks: {
        name: 'Riverton Rocks',
        spotId: 125,
        lat: -34.719280,
        lng: 172.928415
    },
    rollingStones: {
        name: 'Rolling Stones (Mahia Peninsula)',
        spotId: 111,
        lat: -39.074372,
        lng: 177.818973
    },
    sandflyBay: {
        name: 'Sandfly Bay',
        spotId: 1953,
        lat: -45.897110,
        lng: 170.643371
    },
    scottPoint: {
        name: 'Scott Point',
        spotId: 2021,
        lat: -34.719280,
        lng: 172.928415
    },
    smailsBeach: {
        name: 'Smails Beach',
        spotId: 1952,
        lat: -45.909832,
        lng: 170.561963
    },
    spongeBay: {
        name: 'Sponge Bay',
        spotId: 1958,
        lat: -34.719280,
        lng: 172.928415
    },
    stClair: {
        name: 'St Clair (Dunedin)',
        spotId: 115,
        lat: -45.913048,
        lng: 170.491314
    },
    stentRoad: {
        name: 'Stent Road',
        spotId: 105,
        lat: -34.719280,
        lng: 172.928415
    },
    stockRoute: {
        name: 'Stock Route',
        spotId: 1959,
        lat: -34.719280,
        lng: 172.928415
    },
    sumnerBar: {
        name: 'Sumner Bar (Christchurch)',
        spotId: 1950,
        lat: -43.566476,
        lng: 172.763321
    },
    waitaraBar: {
        name: 'Waitara Bar',
        spotId: 2017,
        lat: -34.719280,
        lng: 172.928415
    },
    waiwakaiho: {
        name: 'Waiwakaiho',
        spotId: 1956,
        lat: -34.719280,
        lng: 172.928415
    },
    westport: {
        name: 'Westport',
        spotId: 117,
        lat: -41.751497,
        lng: 171.600625
    },
    whangamata: {
        name: 'Whangamata',
        spotId: 92,
        lat: -34.719280,
        lng: 172.928415
    }
};








