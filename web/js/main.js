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
    var userLatLng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    var mapOptions = {
        center: userLatLng,
        zoom: 8
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);


    new google.maps.Marker({
        map: map,
        position: userLatLng,
        icon: {
            url: 'images/gpsLocation.png',
            size: new google.maps.Size(128, 128),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(64,64),

        }
    });



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






