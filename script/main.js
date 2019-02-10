document.addEventListener("DOMContentLoaded",function(){
	const slider=document.getElementById("slider")
	const images=Array.apply(null, document.getElementsByClassName("image"));//retorna una llista dels div
	const baseImage = images.shift();
	slider.addEventListener("input", function(e){
		let value = e.srcElement.value;
		let index = Math.min(6, Math.floor(value/10));
		if (index >= 1) {
			images[Math.max(0, index-1)].style.opacity = 1;
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
		.then((jsonData) => {
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