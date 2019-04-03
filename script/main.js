document.addEventListener("DOMContentLoaded",function(){
	const slider=document.getElementById("slider")
	const images=Array.apply(null, document.getElementsByClassName("image"));//retorna una llista dels div
	const baseImage = images.shift();//to delete the first item of the list
	slider.addEventListener("input", function(e){//when the slider changes the value
		let value = e.srcElement.value;
		let index = Math.min(6, Math.floor(value/10));//map floor perque no agafi el valor del max slider, el 7
		if (index >= 1) {
			images[Math.max(0, index-1)].style.opacity = 1;//l'any anterior amb opacity 1
		}
		let currentImage = images[index];
		for (let i=0,n=images.length; i<n; i++) {
			if (i != index && i != index-1) {
				images[i].style.opacity = 0;
			}
		}
		let opacity = (value-(index*10))/10;
		currentImage.style.opacity = opacity;
	});

	var mapBounds = getViewportCoords();
	fetchMapData()
		.then((jsonData) => {//since showData has two parameters I need to define the jsonData first, if it had just one parameter i could use: .then(showData)
			showData(jsonData, mapBounds)
		});


})

function getViewportCoords(){
	var northEast=[2.23669368,41.42484283]
	var southWest=[2.22533880,41.41660166]
	var screenX=window.innerWidth
	var screenY=window.innerHeight
	var imageExtentX=northEast[0]-southWest[0]
	var imageExtentY=northEast[1]-southWest[1]
	var screenYToCoord=(imageExtentY*imageExtentX)/screenX
	var marginsInCoord=(imageExtentY-screenYToCoord)/2
	var newNorthEast = [northEast[0], northEast[1]-marginsInCoord]
	var newSouthWest = [southWest[0], southWest[1]-marginsInCoord]
	return [newNorthEast,newSouthWest]
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

