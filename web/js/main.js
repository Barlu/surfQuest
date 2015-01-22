//-------------------------------MAPS


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
            anchor: new google.maps.Point(7, 7),
        }
    });

    activateSonar(map, userLatLng, defaultZoom);
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
    google.maps.event.addListener(map, 'zoom_changed', function() {
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
    
    //A self-invoking expression/closure that is run initially to create the circle
    //then change the circle radius and opacity at a given interval.
    //The closure is needed to isolate it from the listner being added to the map
    //otherwise multiple listners will be added.
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
                sonar.setRadius(radius + step);
                console.log(opacity);
                sonar.setOptions({
                    strokeOpacity: opacity -= 0.006
                });
            }
        }, 10);
    }());
}

var beaches = {
    ninetyMileBeach : {
        name : '90 Mile Beach',
        spotId : 118,
        lat : -34.719280, 
        lng : 172.928415
    },
    ahuAhu : {
        name : 'Ahu Ahu',
        spotId : 2015,
        lat : -34.719280, 
        lng : 172.928415
    },
    aramoanaSpit : {
        name : 'Aramoana Spit',
        spotId : 4063,
        lat : -34.719280, 
        lng : 172.928415
    },
    backBeach : {
        name : 'Back Beach (Taranaki)',
        spotId : 1957,
        lat : -34.719280, 
        lng : 172.928415
    },
    blacksBeach : {
        name : 'Black\'s Beach',
        spotId : 2028,
        lat : -34.719280, 
        lng : 172.928415
    },
    blueDuckStream : {
        name : 'Blue Duck Stream',
        spotId : 4064,
        lat : -34.719280, 
        lng : 172.928415
    },
    castlepoint : {
        name : 'Castlepoint',
        spotId : 573,
        lat : -34.719280, 
        lng : 172.928415
    },
    clarenceRiver : {
        name : 'Clarence River',
        spotId : 4065,
        lat : -34.719280, 
        lng : 172.928415
    },
    dinersBeach : {
        name : 'Diners Beach',
        spotId : 112,
        lat : -34.719280, 
        lng : 172.928415
    },
    elliotBay : {
        name : 'Elliot Bay',
        spotId : 4066,
        lat : -34.719280, 
        lng : 172.928415
    },
    fitzroyBeach : {
        name : 'Fitzroy Beach',
        spotId : 1269,
        lat : -34.719280, 
        lng : 172.928415
    },
    forestry : {
        name : 'Forestry',
        spotId : 122,
        lat : -34.719280, 
        lng : 172.928415
    },
    frentzesReef : {
        name : 'Frentzes Reef',
        spotId : 4067,
        lat : -34.719280, 
        lng : 172.928415
    },
    gizzyPipe : {
        name : 'Gizzy Pipe (Gisborne)',
        spotId : 110,
        lat : -34.719280, 
        lng : 172.928415
    },
    goreBay : {
        name : 'Gore Bay',
        spotId : 4068,
        lat : -34.719280, 
        lng : 172.928415
    },
    greenMeadows : {
        name : 'Green Meadows',
        spotId : 2024,
        lat : -34.719280, 
        lng : 172.928415
    },
    greymouth : {
        name : 'Greymouth',
        spotId : 116,
        lat : -34.719280, 
        lng : 172.928415
    },
    hendersonBay : {
        name : 'Henderson Bay',
        spotId : 4069,
        lat : -34.719280, 
        lng : 172.928415
    },
    hickoryBay : {
        name : 'Hickory Bay',
        spotId : 4071,
        lat : -34.719280, 
        lng : 172.928415
    },
    horseshoeBay : {
        name : 'Horseshoe Bay',
        spotId : 4070,
        lat : -34.719280, 
        lng : 172.928415
    },
    kahutara : {
        name : 'Kahutara',
        spotId : 4072,
        lat : -34.719280, 
        lng : 172.928415
    },
    karitane : {
        name : 'Karitane',
        spotId : 4073,
        lat : -34.719280, 
        lng : 172.928415
    },
    komerneRoad : {
        name : 'Komerne Road',
        spotId : 2020,
        lat : -34.719280, 
        lng : 172.928415
    },
    lastChance : {
        name : 'Last Chance',
        spotId : 2033,
        lat : -34.719280, 
        lng : 172.928415
    },
    loisells : {
        name : 'Loisells',
        spotId : 4074,
        lat : -34.719280, 
        lng : 172.928415
    },
    longPoint : {
        name : 'Long Point',
        spotId : 2025,
        lat : -34.719280, 
        lng : 172.928415
    },
    lyallBay : {
        name : 'Lyall Bay',
        spotId : 107,
        lat : -34.719280, 
        lng : 172.928415
    },
    magnetBay : {
        name : 'Magnet Bay',
        spotId : 4075,
        lat : -34.719280, 
        lng : 172.928415
    },
    mahiaReef : {
        name : 'Mahia Reef',
        spotId : 2029,
        lat : -34.719280, 
        lng : 172.928415
    },
    makaroriPoint : {
        name : 'Makarori Point',
        spotId : 4076,
        lat : -34.719280, 
        lng : 172.928415
    },
    mangamanunu : {
        name : 'Mangamanunu',
        spotId : 113,
        lat : -34.719280, 
        lng : 172.928415
    },
    martinsBay : {
        name : 'Martins Bay',
        spotId : 3913,
        lat : -34.719280, 
        lng : 172.928415
    },
    masonBay : {
        name : 'Mason Bay - Stuart Island',
        spotId : 3914,
        lat : -34.719280, 
        lng : 172.928415
    },
    motunauBeach : {
        name : 'Motunau Beach',
        spotId : 4082,
        lat : -34.719280, 
        lng : 172.928415
    },
    mountMaunganui : {
        name : 'Mount Maunganui',
        spotId : 93,
        lat : -34.719280, 
        lng : 172.928415
    },
    murderers : {
        name : 'Murderers',
        spotId : 4077,
        lat : -34.719280, 
        lng : 172.928415
    },
    muriwaiBeach : {
        name : 'Muriwai Beach',
        spotId : 4078,
        lat : -34.719280, 
        lng : 172.928415
    },
    napier : {
        name : 'Napier',
        spotId : 132,
        lat : -34.719280, 
        lng : 172.928415
    },
    newBrightonBeach : {
        name : 'New Brighton Beach',
        spotId : 114,
        lat : -34.719280, 
        lng : 172.928415
    },
    newPlymouth : {
        name : 'New Plymouth',
        spotId : 104,
        lat : -34.719280, 
        lng : 172.928415
    },
    northMakarori : {
        name : 'North Makarori',
        spotId : 4081,
        lat : -34.719280, 
        lng : 172.928415
    },
    oakura : {
        name : 'Oakura',
        spotId : 2014,
        lat : -34.719280, 
        lng : 172.928415
    },
    ohopeBeach : {
        name : 'Ohope Beach',
        spotId : 108,
        lat : -34.719280, 
        lng : 172.928415
    },
    opoutama : {
        name : 'Opoutama',
        spotId : 2027,
        lat : -34.719280, 
        lng : 172.928415
    },
    opunake : {
        name : 'Opunake',
        spotId : 106,
        lat : -34.719280, 
        lng : 172.928415
    },
    orewaBeach : {
        name : 'Orewa Beach',
        spotId : 4079,
        lat : -34.719280, 
        lng : 172.928415
    },
    owakaArea : {
        name : 'Owaka Area',
        spotId : 123,
        lat : -34.719280, 
        lng : 172.928415
    },
    papamoaBeach : {
        name : 'Papamoa Beach',
        spotId : 109,
        lat : -34.719280, 
        lng : 172.928415
    },
    papatowai : {
        name : 'Papatowai',
        spotId : 124,
        lat : -34.719280, 
        lng : 172.928415
    },
    patauaBar : {
        name : 'Pataua Bar',
        spotId : 4080,
        lat : -34.719280, 
        lng : 172.928415
    },
    piha : {
        name : 'Piha',
        spotId : 90,
        lat : -34.719280, 
        lng : 172.928415
    },
    porpoiseBay : {
        name : 'Porpoise Bay',
        spotId : 3915,
        lat : -34.719280, 
        lng : 172.928415
    },
    punihos : {
        name : 'Punihos',
        spotId : 2019,
        lat : -34.719280, 
        lng : 172.928415
    },
    raglan : {
        name : 'Raglan',
        spotId : 91,
        lat : -34.719280, 
        lng : 172.928415
    },
    railways : {
        name : 'Railways',
        spotId : 2026,
        lat : -34.719280, 
        lng : 172.928415
    },
    rivertonRocks : {
        name : 'Riverton Rocks',
        spotId : 125,
        lat : -34.719280, 
        lng : 172.928415
    },
    rollingStones : {
        name : 'Rolling Stones (Mahia Peninsula)',
        spotId : 111,
        lat : -34.719280, 
        lng : 172.928415
    },
    sandflyBay : {
        name : 'Sandfly Bay',
        spotId : 1953,
        lat : -34.719280, 
        lng : 172.928415
    },
    scottPoint : {
        name : 'Scott Point',
        spotId : 2021,
        lat : -34.719280, 
        lng : 172.928415
    },
    smailsBeach : {
        name : 'Smails Beach',
        spotId : 1952,
        lat : -34.719280, 
        lng : 172.928415
    },
    spongeBay : {
        name : 'Sponge Bay',
        spotId : 1958,
        lat : -34.719280, 
        lng : 172.928415
    },
    stClair : {
        name : 'St Clair (Dunedin)',
        spotId : 115,
        lat : -34.719280, 
        lng : 172.928415
    },
    stentRoad : {
        name : 'Stent Road',
        spotId : 105,
        lat : -34.719280, 
        lng : 172.928415
    },
    stockRoute : {
        name : 'Stock Route',
        spotId : 1959,
        lat : -34.719280, 
        lng : 172.928415
    },
    sumnerBar : {
        name : 'Sumner Bar (Christchurch)',
        spotId : 1950,
        lat : -34.719280, 
        lng : 172.928415
    },
    waitaraBar : {
        name : 'Waitara Bar',
        spotId : 2017,
        lat : -34.719280, 
        lng : 172.928415
    },
    waiwakaiho : {
        name : 'Waiwakaiho',
        spotId : 1956,
        lat : -34.719280, 
        lng : 172.928415
    },
    westport : {
        name : 'Westport',
        spotId : 117,
        lat : -34.719280, 
        lng : 172.928415
    },
    whangamata : {
        name : 'Whangamata',
        spotId : 92,
        lat : -34.719280, 
        lng : 172.928415
    }   
};








