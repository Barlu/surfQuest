
//---------------------------------ELEMENT GENERATION/GENERAL SETTINGS
//Create beach selector
function generateElements() {
    $('#loadingWrapper').hide();
    for (var beach in beaches) {
        $('.beachSelection').append('<option>' + beaches[beach].name + '</option>');
    }
    for (var i = 0; i < cities.length; i++) {
        $('.citySelection').append('<option>' + cities[i].city + '</option>');
    }
};


var storage = localStorage;

if (!storage.getItem('returning')) {
    window.location = "index.php?page=help";
    storage.setItem('returning', 'true');
    }

//---------------------------------UTILS
(function() {

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
        Math.round10 = function(value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
//     Decimal floor
    if (!Math.floor10) {
        Math.floor10 = function(value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
//     Decimal ceil
    if (!Math.ceil10) {
        Math.ceil10 = function(value, exp) {
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

function addHelpTooltips() {
    console.log('here');
    $('nav.handheld i').addClass('hint--top hint--always');
    $('nav.handheld i').attr('data-hint', 'This is the Auto-Locate key. It will find your position and the nearest beaches to you.');
}
