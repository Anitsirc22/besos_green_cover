function LeafletMap () {
  this.map = L.map("map-leaflet",{
    // zoomControl: true,
    zoomSnap: 0,
    zoom: 15
  });

  this._data = 2014;

  this.map.fitBounds(this.getViewportCoords());

  //STYLES
  this.shape = new L.PatternCircle({ x: 7, y: 7, radius: 4, fill: true, color:'black',weight:2});
  this.pattern = new L.Pattern({width:15, height:15});
  this.pattern.addShape(this.shape);
  this.pattern.addTo(this.map);
  this.stripes = new L.StripePattern({
    color:'black',
    angle:45,
    weight:2,
    spaceWeight:0.2,
    spaceColor:'red',
  });
  this.stripes.addTo(this.map);

  this.draw();
}


LeafletMap.prototype.draw = function () {
  var layer_2014 = new L.geoJson(ndvi_2014,{style: this.style.bind(this)}).addTo(this.map);
  var layer_2015 = new L.geoJson(ndvi_2015,{style: this.style.bind(this)});
  var layer_2016 = new L.geoJson(ndvi_2016,{style: this.style.bind(this)});
  this.layers = {
    2014: layer_2014,
    2015: layer_2015,
    2016: layer_2016
  };
};

LeafletMap.prototype.update = function () {
  Object.keys(this.layers).map(k => {
    this.map.removeLayer(this.layers[k]);
  });
  this.layers[this._data].addTo(this.map);
};

LeafletMap.prototype.data = function (data) {
  // temporal
  data = Number(data) < 2016 ? data > 2014 ? data : 2014 : 2016;
  // end temporal
  this._data = data;
  this.update();
};

LeafletMap.prototype.getViewportCoords = function () {
	var northEast=[41.4248428308,2.23679160282];
	var southWest=[41.4166000503,2.22524176012];
	var screenX=window.innerWidth;
	var screenY=window.innerHeight;
	var imageExtentX=northEast[1]-southWest[1];
	var imageExtentY=northEast[0]-southWest[0];
	var screenYToCoord=(imageExtentY*imageExtentX)/screenX;
	var marginsInCoord=(imageExtentY-screenYToCoord)/2;
	var newNorthEast = [northEast[0]-marginsInCoord, northEast[1]];
	var newSouthWest = [southWest[0]+marginsInCoord, southWest[1]];
	return [newNorthEast,newSouthWest];
};

LeafletMap.prototype.style = function (feature) {
	if (feature.properties.gridcode === 2) {
    return {
      color: 'gray',
      weight: 1.5,
      opacity: 1,
      clickable: true,
      fillPattern: this.stripes,

    };
  } else {
    return {
      color:'black',
      weight:'1',
      fillPattern: this.pattern, 
    }; 
  }
};
