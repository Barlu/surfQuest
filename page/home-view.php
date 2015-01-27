<div class="selectWrapper">
    <select class='navSelect citySelection' onchange="mapModule.setLocation(this.options[this.selectedIndex].text)">
        <option>Select nearest location...</option>
    </select>
</div>
<div id="map-canvas"></div>

<div id='loadingWrapper'>
    
    <div class="spinner centered">
        <p>Finding beaches...</p>
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
    </div>
</div>
<!--<div id="directions-panel"></div>-->
<!--<div id="forcast"></div>-->
