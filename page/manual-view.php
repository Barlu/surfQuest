
<div class="selectWrapper">
    <select class='navSelect citySelection' onchange="mapModule.setLocation(this.options[this.selectedIndex].text)">
        <option>Select nearest location...</option>
    </select>
    <select class='navSelect beachSelection' onchange="mapModule.setBeach(this.options[this.selectedIndex].text)">
        <option>Select a beach...</option>
    </select>
</div>
<div id="map-canvas"></div>

