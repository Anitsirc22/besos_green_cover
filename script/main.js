document.addEventListener("DOMContentLoaded", function () {

  const leafletMap = new LeafletMap();
  const sliderHandler = new SliderHandler({
    callback: leafletMap.data.bind(leafletMap)
  });
  const mouseCathcer = new MouseCatcher();
  mouseCathcer.catch();
  // sliderHandler.slider.addEventListener('change', function (ev) {
  //   console.log(ev);
  //   leafletMap.update(2015);
  // });
  
	// var mapBounds = getViewportCoords();
	// fetchMapData()
	// 	.then((jsonData) => {//since showData has two parameters I need to define the jsonData first, if it had just one parameter i could use: .then(showData)
	// 		showData(jsonData, mapBounds)
	// 	});


})

// function getViewportCoords(){
// 	var eastNorth=[2.23669368,41.42484283]
// 	var westSouth=[2.22533880,41.41660166]
// 	var screenX=window.innerWidth
// 	var screenY=window.innerHeight
// 	var imageExtentX=eastNorth[0]-westSouth[0]
// 	var imageExtentY=eastNorth[1]-westSouth[1]
// 	var screenYToCoord=(imageExtentY*imageExtentX)/screenX
// 	var marginsInCoord=(imageExtentY-screenYToCoord)/2
// 	var newEastNorth = [eastNorth[0], eastNorth[1]-marginsInCoord]
// 	var newWestSouth = [westSouth[0], westSouth[1]-marginsInCoord]
// 	return [newEastNorth,newWestSouth]
// }

// function getMonth(sliderValue){
// 	switch(sliderValue){
// 		case 0:
// 			text="Agost 2009";
// 		case 1:
// 			text="Octubre 2010";
// 		case 2:
// 			text="Juny 2011";
// 		case 3:
// 			text="Maig 2012";
// 		case 4:
// 			text="Juny 2013";
// 		case 5:
// 			text="Juny 2014";
// 		case 6:
// 			text="Agost 2015";
// 		case 7:
// 			text="Novembre 2016";
// 	}

// }

