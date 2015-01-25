/*
 *  SwellMap - JQuery plugin for providing marine weather
 *  Version: 1.0
 *  Copyright (c) 2011 MetOcean Solutions Ltd
 *
 *  See our terms and conditions of use at http://www.swellmap.com/info/terms
 *
 */

(function($){
    $.fn.swellmap = function(opts) {	
        // Plugin defaults
        var defaults_surfing = {
            site: 'Piha',
            title: true,
            smaplink: 'View 7 day forecast',
            time: true,
            showerror: true,
            rating: true,
            summary: true,
            hide: ["hs","gstma","hs_sea","dpm_sea"],
            tides: true,
            seatemp: false
        };
        
        var defaults_boating = {
            site: 'Firth of Thames',
            title: true,
            smaplink: 'View 7 day forecast',
            time: true,
            showerror: true,
            rating: true,
            summary: true,
            hide: [  "hs", "gstma", "hs_sea", "dpm_sea" ],
            tides: true,
            seatemp: false
        };
        
        var defaults_general = {
            site: 'Auckland',
            title: true,
            smaplink: 'View 7 day forecast',
            time: true,
            showerror: true,
            rating: false,
            summary: true,
            hide: [  "windchill" ],
            tides: false,
            seatemp: false
        };
        
        var activity=opts.activity.toLowerCase().substr(0, 7);
        eval('var defaults_activity=defaults_'+activity);
        var options = $.extend({}, defaults_activity, opts);
        return this.each(function(i, e) {
            var $e = $(e);
            if (!$e.hasClass('smap-plugin')) $e.addClass('smap-plugin');
            if (!options.site) return false;
            // Send request
            $.getJSON('http://www.swellmap.com/ajr.php?r=plugin&a='+options.activity+'&s='+options.site+'&callback=?', function(data) {
                if (data) {
                    _callback(e, data, options);
                }
                else {
                    if (options.showerror) $e.html('<p>Weather information unavailable.</p>');
                }
            });
        });
    };

    var _callback = function(e, json, options) {
        var $e = $(e);
        var html = '<div class="smap-item">';
        if (options.title) html+='<div class="title"><a href="'+json.smaplink+'">'+ json.title +'</a></div>';
        if (options.time) html+='<div class="smap-fdate">Forecast for '+ json.forecastdate +' today</div>';
        if (options.summary && json.summary) html+='<div class="smap-summary">'+ json.summary +'</div>';
        if (options.rating && json.rating) html+='<div class="smap-rating">'+ json.rating +'</div>';
        html+='<div class="smap-content">';
        /* Weather variable content */
        if (options.hide!="all") {
            $.each(json.vars, function(key, smapvar) {
                if (key) {
                    if (($.inArray(key, options.hide))==-1) {
                        html+='<div class="smap-'+key+'">';
                        if (smapvar.title) html+='<span class="smap-desc">'+smapvar.title+'</span>';
                        if (smapvar.value) html+= ' '+smapvar.value;
                        if (smapvar.unit) html+=smapvar.unit
                        html+='</div>';
                    }
                }
            });
        }
        /* End of weather variable content */
        if (options.tides && json.tides) html+='<div class="smap-tides">'+ json.tides +'</div>';
        if (options.seatemp && json.seatemp) html+='<div class="smap-seatemp">'+ json.seatemp +'</div>';
        if (options.smaplink && json.smaplink) html+='<div class="smap-link"><a href="'+ json.smaplink +'">'+options.smaplink+'</a></div>';
        html+='</div>';
        html+='</div>';
        $e.append(html);
    };

})(jQuery);
