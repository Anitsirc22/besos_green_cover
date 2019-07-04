function LeafletMap (settings) {
  this.map = L.map("map-leaflet",{
    zoomSnap: 1,
    //zoom: 15,
    zoomControl: false
  });

  this._data = 2009;

  // this.map.fitBounds(this.getViewportCoords());
  this.onMouseOver = settings.onMouseOver;
  this.onMouseLeave = settings.onMouseLeave;
/*
  debugger;*/

  // //STYLES
  // this.shape = new L.PatternCircle({ x: 7, y: 7, radius: 4, fill: true, color:'black',weight:2});
  // this.pattern = new L.Pattern({width:15, height:15});
  // this.pattern.addShape(this.shape);
  // this.pattern.addTo(this.map);
  // this.stripes = new L.StripePattern({
  //   color:'black',
  //   angle:45,
  //   weight:2,
  //   spaceWeight:0.2,
  //   spaceColor:'red',
  // });
  // this.stripes.addTo(this.map);
}


LeafletMap.prototype.draw = function () {
  var layer_2009 = new L.geoJson(ndvi_2009,{
    style: this.style.bind(this),
    onEachFeature: this.bindInteraction.bind(this)
  }).addTo(this.map);
  this.map.fitBounds(layer_2009.getBounds());
  var layer_2010 = new L.geoJson(ndvi_2010,{
    style: this.style.bind(this),
    onEachFeature: this.bindInteraction.bind(this)
  });
  var layer_2011 = new L.geoJson(ndvi_2011,{
    style: this.style.bind(this),
    onEachFeature: this.bindInteraction.bind(this)
  });
  var layer_2012 = new L.geoJson(ndvi_2012,{
    style: this.style.bind(this),
    onEachFeature: this.bindInteraction.bind(this)
  });
  var layer_2013 = new L.geoJson(ndvi_2013,{
    style: this.style.bind(this),
    onEachFeature: this.bindInteraction.bind(this)
  });
  var layer_2014 = new L.geoJson(ndvi_2014,{
    style: this.style.bind(this),
    onEachFeature: this.bindInteraction.bind(this)
  });
  var layer_2015 = new L.geoJson(ndvi_2015,{
    style: this.style.bind(this),
    onEachFeature: this.bindInteraction.bind(this)
  });
  var layer_2016 = new L.geoJson(ndvi_2016,{
    style: this.style.bind(this),
    onEachFeature: this.bindInteraction.bind(this)
  });
  this.layers = {
    2009: layer_2009,
    2010: layer_2010,
    2011: layer_2011,
    2012: layer_2012,
    2013: layer_2013,
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
  data = Number(data) < 2016 ? data > 2009 ? data : 2009 : 2016;
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

/*LeafletMap.prototype.style = function (feature) {
	if (feature.properties.gridcode === 2) {
    return {
      color: 'gray',
      weight: 1.5,
      opacity: 1,
      // clickable: true,
      // fillPattern: this.stripes
    };
  } else {
    return {
      color:'black',
      weight:'1',
      // clickable: true,
      // fillPattern: this.pattern, 
    }; 
  }
};*/

LeafletMap.prototype.bindInteraction = function (feature, layer) {
  layer.on({
    mouseover: this.highlightFeatures.bind(this),
    mouseout: this.resetHighlight.bind(this)
  });  
}

LeafletMap.prototype.highlightFeatures = function (e) {
    const targetLayer = e.target;
    const currentLayer = this.layers[this._data];
    const layers = currentLayer._layers;

    Object.keys(layers).map((layerKey) => {
      let layer = layers[layerKey];
      if (layer.feature && layer.feature.properties.gridcode == targetLayer.feature.properties.gridcode) {
        layer.setStyle({
          weight: 1,
          color: 'none',
          dashArray: '',
          fillOpacity: 0.3,
          fillColor:'red',

        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
        }
      }
    });

    this.onMouseOver({
      gridcode: targetLayer.feature.properties.gridcode,
      // feature: targetLayer.feature,
      // features: Object.keys(layers).map((layerKey) => layers[layerKey].feature)
    });
}

LeafletMap.prototype.resetHighlight = function (e) {
  const currentLayer = this.layers[this._data];
  const layers = currentLayer._layers;
  Object.keys(layers).map((layerKey) => {
    currentLayer.resetStyle(layers[layerKey]);
  });
  this.onMouseLeave();
}


LeafletMap.prototype.style = function (feature) {
  if (feature.properties.gridcode === 1) {
    return {
      fillColor: 'none',
      color: 'none',
      weight: 1.5,
      opacity: 1,
      clickable: true,
      /*fillPattern: this.stripes,*/

    };
  } else if (feature.properties.gridcode === 2) {
    return {
      fillColor: '#e2e2e2',//'#FBFAD3'
      color:'none',
      weight:'1',
      fillOpacity:'1',
      /*fillPattern: this.pattern, */
    }; 
  }else if (feature.properties.gridcode === 3) {
    return {
      fillColor:'#919191',//'#c6e377'
      color:'none',
      weight:'1',
      fillOpacity:'1',
      /*fillPattern: this.pattern, */
    };
  }else if (feature.properties.gridcode === 4) {
    return {
      fillColor:'#484848',//'#729d39'
      color:'none',
      weight:'1',
      fillOpacity:'1',
      /*fillPattern: this.pattern,*/ 
    };
  }else if (feature.properties.gridcode === 5) {
    return {
      fillColor:'#030303',//'#729d39'
      color:'none',
      weight:'1',
      fillOpacity:'1',
      /*fillPattern: this.pattern,*/ 
    };
  };
}
