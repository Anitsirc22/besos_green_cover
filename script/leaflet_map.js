function getViewportCoords(){
	//var northEast=[41.42484283,2.23669368]
	//var southWest=[41.41660166,2.22533880]
	var northEast=[41.4248428308,2.23679160282]
	var southWest=[41.4166000503,2.22524176012]
	var screenX=window.innerWidth
	var screenY=window.innerHeight
	var imageExtentX=northEast[1]-southWest[1]
	var imageExtentY=northEast[0]-southWest[0]
	var screenYToCoord=(imageExtentY*imageExtentX)/screenX
	var marginsInCoord=(imageExtentY-screenYToCoord)/2
	var newNorthEast = [northEast[0]-marginsInCoord, northEast[1]]
	var newSouthWest = [southWest[0]+marginsInCoord, southWest[1]]
	return [newNorthEast,newSouthWest]
}



var mapLeaflet = L.map("map-leaflet",{zoomControl:false});

//mapLeaflet.setView([41.421377,2.2292237],18)

//mapLeaflet.fitBounds([[41.42484283,2.231016274252378],[41.41660166,2.2196613942523777]])
mapLeaflet.fitBounds(getViewportCoords())


console.log(mapLeaflet.getBounds())
console.log(getViewportCoords())

//STYLES
var shape = new L.PatternCircle({ x: 7, y: 7, radius: 4, fill: true, color:'black',weight:2});
var pattern = new L.Pattern({width:15, height:15});
pattern.addShape(shape);
pattern.addTo(mapLeaflet);


var stripes = new L.StripePattern({
      color:'black',
      angle:45,
      weight:2,
      spaceWeight:0.2,
      spaceColor:'red',


    });
stripes.addTo(mapLeaflet);

function style(feature) {
	if ( feature.properties.gridcode === 2 ) {
    	return {
    		color: 'gray',
    		weight: 1.5,
    		opacity: 1,
    		clickable: true,
        	fillPattern: stripes,

      };
    }else {
	    return {
	      	color:'black',
	      	weight:'1',
	  		fillPattern: pattern,
	         
	    };
    
}};
var layer_2014 = new L.geoJson(ndvi_2014,{style:style}).addTo(mapLeaflet);
