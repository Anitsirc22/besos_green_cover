const StackedChart = function (options) {
	this.model = options.model;
	this.el = options.el;
	this.el.innerHTML = '<svg height="100%" width="100%"></svg>'
	this.svg = d3.select(this.el.firstElementChild);

	this.margins = options.margins || {
		left: 10,
  		right: 10,
  		top: 5,
  		bottom: 50
	}

	this.content = this.svg.append('g')
		.attr('class', 'content')
		.attr('transform', 'translate(' + this.margins.left +',' + this.margins.top + ')');
};

StackedChart.prototype.scaleX = function (data) {
	return d3.scaleLinear()
		.domain([0, data.length-1])
		.range([0, this.el.offsetWidth - this.margins.left - this.margins.right]);
}

StackedChart.prototype.scaleY = function (domain) {
	return d3.scaleLinear()
		.domain(domain)
		.range([this.el.offsetHeight - this.margins.top - this.margins.bottom, 0]);
}

StackedChart.prototype.colorScheme = function () {
	const colorScheme = [
		'#e2e2e2',
		'#919191',
		'#484848',
		'#030303'
	];
	return function (d,i) {
		return colorScheme[i];
	}
}

StackedChart.prototype.areaGen = function (scaleX, scaleY) {
	return d3.area()
	    .x(function(d,i) { return scaleX(i); })
	    .y0(function(d) { return scaleY(d.base); })
	    .y1(function(d) { return scaleY(d.top); })
	    .curve(d3.curveCatmullRom.alpha(0.5));
}

StackedChart.prototype.data = function (year) {
	var data;
	if (year) {
		data = this.model.getStackedData();
		data.source = data.values;
		data.values = data.values.map(row => {
			return row.filter((d,i) => data.headers[i] <= year)
		});
	} else {
		data = this.model.getStackedData();
		data.source = data.values;
	}
	return data;
}

StackedChart.prototype.draw = function (year) {
	var data = this.data(year);
	var x = this.scaleX(data.headers);
	var y = this.scaleY([
		d3.min(data.source[0].map(d => d.value)), 
		d3.max(data.source[data.source.length-1].map(d => d.top))
	]);
	// console.log(data);
	var areaFn = this.areaGen(x,y);
	var colors = this.colorScheme();

	var categories = this.content.selectAll('.area').data(data.values, function (d,i) {
		return 'gridcode-'+String(i+1);
	});
	

	categories.exit().remove();

	var categoriesEnter = categories.enter()
		.append('path')
		.attr('class','area')
		.attr('gridcode', function (d,i) { 
			console.log("d:"+d,"i:"+i);
			return i+1});

	categories = categories.merge(categoriesEnter)
		.attr('d', areaFn)
		.attr('fill', colors);
	console.log(categories);

};