let map=d3.select("#map");
map.attr("width",window.innerWidth)
map.attr("height",window.innerHeight)

function fetchMapData () {
	return d3.json("json/ndvi_reclass_2014.json");	
}

function showData (json_map, bounds){
	let mapHeight=window.innerHeight
	let mapWidth=window.innerWidth

	
	// var projection=d3.geoMercator()
	// 	.center(d3.geoCentroid(json_map))
	// 	.scale(50)
	// 	.translate([mapWidth/2,mapHeight/2])
		
	// var center=d3.geoCentroid(json_map)
	var center = [bounds[1][0]+Math.abs(bounds[1][0] - bounds[0][0])/2, bounds[1][1]+Math.abs(bounds[1][1] - bounds[0][1])/2];
	var scale  = Math.abs(bounds[1][0] - bounds[0][0]);
	scale = 50;
	var bounds  = d3.geoPath().projection(d3.geoMercator()).bounds(json_map);
	console.log(center);
    var hscale  = scale*mapWidth  / Math.abs(bounds[1][0] - bounds[0][0]);
    var vscale  = scale*mapHeight / Math.abs(bounds[1][1] - bounds[0][1]);
    var scale   = (hscale < vscale) ? hscale : vscale;
    var offset  = [mapWidth/2,mapHeight/2]; //[mapWidth - (bounds[0][0] + bounds[1][0])/2,mapHeight - (bounds[0][1] + bounds[1][1])/2];
    projection = d3.geoMercator()
    	.center(center)
    	.scale(scale)
    	.translate(offset);
	var path=d3.geoPath()
		.projection(projection);

	let max_range=d3.max(json_map.features,d=>d.properties.gridcode);
	let cscale=d3.scaleLinear()
		.domain([0,max_range])
		.range(["white","red"])

	map.selectAll("path")
		.data(json_map.features)
		.enter().append("path")
		.attr("d",path)
		.attr("stroke","none")
		.attr("fill",d=>d.properties.gridcode?cscale(d.properties.gridcode):"none")
		.attr("stroke-width","0.2")
}