const LineChart = function (options) {
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

LineChart.prototype.scaleX = function (data) {
	return d3.scaleLinear()
		.domain([0, data.length-1])
		.range([0, this.el.offsetWidth - this.margins.left - this.margins.right]);
}

LineChart.prototype.scaleY = function (data) {
	return d3.scaleLinear()
		.domain(d3.extent(data))
		.range([this.el.offsetHeight - this.margins.top - this.margins.bottom, 0]);
}

LineChart.prototype.lineFn = function (scaleX, scaleY) {
	const self = this;
	return d3.line()
    	.x(function(d, i) { return scaleX(i); }) // set the x values for the line generator
    	.y(function(d) { return scaleY(d); }) // set the y values for the line generator 
    	// .curve(d3.curveMonotoneX)
}

LineChart.prototype.data = function (year) {
	var data;
	if (year) {
		data = this.model.getLineChartData();
		data.source = data.values;
		data.values = data.values.filter((d,i) => data.headers[i] <= year);
	} else {
		data = this.model.getLineChartData();
		data.source = data.values;
	}
	return data;
}

LineChart.prototype.draw = function (year) {
	var data = this.data(year);
	var x = this.scaleX(data.headers);
	var y = this.scaleY(data.source);
	var lineFn = this.lineFn(x, y);

	var points = this.content.selectAll('.point').data(data.values, function (d,i) {
		return data.headers[i];
	});

	points.exit().remove();

	var pointsEnter = points.enter()
		.append('circle')
		.attr('class','point')
		.attr('r','5')
		.style('fill', 'grey');

	points = points.merge(pointsEnter)
		.attr('cx', function (d,i) {
			return x(i);
		}).attr('cy', function (d) {
			return y(d);
		});

	var lines = this.content.selectAll('.line').data(['myLine']);
	var linesEnter = lines.enter()
		.append('path')
		.attr('class','line')
		.attr('fill','none')
		.attr('stroke','red')
		.attr('stroke-width','2');

	lines.exit().remove();

	lines = lines.merge(linesEnter)
		.attr('d', lineFn(data.values));
};