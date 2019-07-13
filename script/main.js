document.addEventListener("DOMContentLoaded", function () {

  const dataParser = new DataParser();
  dataParser.parse(summaryData);

  const lineChart = new LineChart({
  	model: dataParser,
  	el: document.getElementById('lineChart'),
  	margins: {
  		left: 50,
  		right: 50,
  		top: 5,
  		bottom: 50
  	}
  });

  const stackedChart = new StackedChart({
  	model: dataParser,
  	el: document.getElementById('stacked-container'),
  	margins: {
  		left: 0,
  		right: 0,
  		top: 0,
  		bottom: 55
    },
    onMouseOver: function () {
      sliderHandler.setCategory.apply(sliderHandler, arguments);
      leafletMap.highlightFeatures.apply(leafletMap, arguments);
    },
    onMouseLeave: function () {
      sliderHandler.setCategory.call(sliderHandler, {gridcode: null});
      leafletMap.resetHighlight.apply(leafletMap, arguments);
    }
  });

  const leafletMap = new LeafletMap({
  	onMouseOver: function () {
      sliderHandler.setCategory.apply(sliderHandler, arguments);
      stackedChart.onMouseOver.apply(stackedChart, arguments);
  	},
  	onMouseLeave: function () {
      var __callback = stackedChart.onMouseLeave.call(stackedChart);
      return function () {
        sliderHandler.setCategory.call(sliderHandler, {gridcode: null});
        __callback.apply(null, arguments);
      }
    }()
  });

/*  .call(context, arg1, arg2, arg3, argN);
  .apply(context, **args)*/

  const sliderCallback = function () {
  	return function () {
  		lineChart.draw.apply(lineChart, arguments);
  		stackedChart.draw.apply(stackedChart, arguments);
  		leafletMap.data.apply(leafletMap, arguments);
  	}
  }();

  const sliderHandler = new SliderHandler({
    callback: sliderCallback,
    model: dataParser
  });
  const mouseCathcer = new MouseCatcher();
  mouseCathcer.catch();

  leafletMap.draw();
/*  lineChart.draw();
  stackedChart.draw();*/

  window.onresize = function () {
  	lineChart.draw(sliderHandler.currentYear);
  	stackedChart.draw(sliderHandler.currentYear);
  }
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

