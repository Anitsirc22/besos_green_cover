document.addEventListener("DOMContentLoaded",function(){
	var animation;
	const slider=document.getElementById("slider");
	const images=Array.apply(null, document.getElementsByClassName("image"));//retorna una llista dels div
	const baseImage = images.shift();//to delete the first item of the list
	function sliderChangeCallback (e) {
		let value = e.srcElement.value;
		let index = Math.min(6, Math.floor(value/10));//map floor perque no agafi el valor del max slider, el 7
		if (index >= 1) {
			images[index-1].style.opacity = 1;//l'any anterior amb opacity 1
		}
		let currentImage = images[index];
		for (let i=index+1,n=images.length; i<n; i++) {
			if (i != index && i != index-1) {
				images[i].style.opacity = 0;
			}
		}
		let opacity = (value-(index*10))/10;
		// console.log(images[index-1]);
		// console.log('opacit: ', opacity, 'value: ', value, 'index:', index);
		currentImage.style.opacity = opacity;
	}
	slider.addEventListener("input", sliderChangeCallback);//when the slider notify an input the value);
//	slider.addEventListener("change", sliderChangeCallback);//when the slider value changes the value);
	animation = setInterval((function () {
		var index = 0;
		return function () {
			index++;
			slider.value = index;
			sliderChangeCallback({srcElement: slider});
			if (index == slider.getAttribute('max')) {
				// index = 0;
				clearInterval(animation);
			}
		}
	})(), 200);


	var mapBounds = getViewportCoords();
	fetchMapData()
		.then((jsonData) => {//since showData has two parameters I need to define the jsonData first, if it had just one parameter i could use: .then(showData)
			showData(jsonData, mapBounds)
		});


})

function getViewportCoords(){
	var eastNorth=[2.23669368,41.42484283]
	var westSouth=[2.22533880,41.41660166]
	var screenX=window.innerWidth
	var screenY=window.innerHeight
	var imageExtentX=eastNorth[0]-westSouth[0]
	var imageExtentY=eastNorth[1]-westSouth[1]
	var screenYToCoord=(imageExtentY*imageExtentX)/screenX
	var marginsInCoord=(imageExtentY-screenYToCoord)/2
	var newEastNorth = [eastNorth[0], eastNorth[1]-marginsInCoord]
	var newWestSouth = [westSouth[0], westSouth[1]-marginsInCoord]
	return [newEastNorth,newWestSouth]
}

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

