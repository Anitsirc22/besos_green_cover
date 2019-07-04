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
    
  this.publicOnMouseOver = options.onMouseOver;
  this.publicOnMouseLeave = options.onMouseLeave;
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
  const self = this;
  const colorScheme = [
		'#e2e2e2',
		'#919191',
		'#484848',
		'#030303'
	];
	return function (d,i) {
		return self.foccused !== null && self.foccused == i ? '#ff000055' : colorScheme[i];
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
  const self = this;
  var data = this.data(year);
	var x = this.scaleX(data.headers);
	var y = this.scaleY([
		d3.min(data.source[0].map(d => d.value)), 
		d3.max(data.source[data.source.length-1].map(d => d.top))
	]);
	var areaFn = this.areaGen(x,y);
	var colors = this.colorScheme();

	var categories = this.content.selectAll('.area').data(data.values, function (d,i) {
		return 'gridcode-'+String(i+2);
	});
	

	categories.exit().remove();

	var categoriesEnter = categories.enter()
		.append('path')
		.attr('class','area')
    .attr('gridcode', function (d,i) { return i+2 })
    .style("cursor", "pointer")
    .on('mouseover', this.onMouseOver.bind(this))
    .on('mouseout', this.onMouseLeave.call(this));

	categories = categories.merge(categoriesEnter)
		.attr('d', areaFn)
		.attr('fill', colors);

};

StackedChart.prototype.onMouseOver = function (input) {
  const gridcode = input.gridcode != null ? input.gridcode : event.srcElement.getAttribute('gridcode');
  var targetArea;
  const areas = Array.apply(null, this.content.node().getElementsByClassName('area'));
  areas.map((area,i) => {
    area.setAttribute('fill', this.colorScheme()(null, i));
    if (area.getAttribute('gridcode') == gridcode) {
      this.foccused = i;
      targetArea = area;
    }
  });

  targetArea.setAttribute('fill', '#ff000055');
  input.manual !== true && this.publicOnMouseOver({gridcode: gridcode, manual: true});
};

StackedChart.prototype.onMouseLeave = function () {
  const self = this;
  var debouncedMouseLeave = function () {
    Array.apply(null, self.content.node().getElementsByClassName('area')).map((area, i) => {
      area.setAttribute('fill', self.colorScheme()(null, i));
    });
  };
  return function (input) {
    self.foccused = null;
    clearTimeout(debouncedMouseLeave);
    setTimeout(debouncedMouseLeave, 150);
    input.manual !== true && self.publicOnMouseLeave({manual: true});
   }
}