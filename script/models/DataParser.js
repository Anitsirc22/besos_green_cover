function DataParser () {
	
};

DataParser.prototype.fetch = function () {
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status === 200) {
				console.log(this);
			}
			console.error("error status")
		}
	}
	ajax.open('GET', 'http://localhost:8000/csv/summary_allYears.txt', true);
};

DataParser.prototype.parse = function (strData) {
	this.data = strData.split('\n').map(function (line, index) {
		return line.split(';').map(function (value) {
			value = value.replace(/\,/, '.');
			if (index > 0) {
				value = Number(value);
			}
			return value;
		});
	});

	/*function reduce (fn, acumulador) {
		var index = 0;
		for (item in iterador) {
			// iter 1 -> item = OID; index = 0;
			// iter 2 -> item = gridcode; index = 1;
			acumulador = fn(acumulador, item, index);
			index++;
		}
	};

	// RESULTAT
	{
		"OID": 0,
		"gridcode": 1,
		"any2009": 2
	}*/

	this.headers = this.data[0].reduce((acum, value, index) => {
		acum[value] = index;
		return acum;
	}, new Object());

	this.data = this.data.slice(1);
}

DataParser.prototype.getLineChartData = function () {
	var self = this;
	var computed = Array.apply(null, Array(this.data[0].slice(2).length)).map(function () {
		return 0;
	});

	this.data.map(function (line, lineIndex) {
		line.slice(2).map(function (row, colIndex) {
			computed[colIndex] += row * line[1];
		});
	});
	return {
		values: computed,
		headers: ['2009','2010','2011','2012','2013','2014','2015','2016']
	};
}

DataParser.prototype.getStackedData = function () {
	const self = this;
	return {
		values: this.data.reduce((acum, row, rowIndx) => {
				acum.push(row.slice(2).reduce((rowAcum, colValue, colIndx) => {
					let base;
					if (rowIndx == 0) {
						absTop = 0;
					} else {
						absTop = acum[rowIndx-1][colIndx].absTop
					}

					if (rowIndx <= 1) {
						base = 0;
					} else {
						base = acum[rowIndx-1][colIndx].top
					}

					rowAcum.push({
						value: colValue,
						base: base,
						top: base + colValue,
						absTop: absTop + colValue
					});
					return rowAcum;
				}, new Array()));
				return acum;
			}, new Array()).slice(1),
		headers: ['2009','2010','2011','2012','2013','2014','2015','2016']
	};

}

DataParser.prototype.getLineLabel = function (year) {
  const lineChartData = this.getLineChartData();
  return lineChartData.values[lineChartData.headers.indexOf(String(year))];
}

DataParser.prototype.getStackedLabel = function (year, category) {
  debugger;
  const stackedChartData = this.getStackedData();
  const yearIdx = stackedChartData.headers.indexOf(String(year));
  var absolute, relative, total;
  // {
  //   "values": [
  //     [12354, 12356, 2651],
  //     [],
  //     [],
  //     []
  //   ],
  //   "headers": [2009, 2010, 2011]
  // }
  total = stackedChartData.values.reduce((acum, cateogryData, i) => {
    if (i == category) {
      absolute = cateogryData[yearIdx].value;
    }
    return acum + cateogryData[yearIdx].value;
  }, 0);

  relative = category != null ? (absolute/total*100).toFixed(2) : 100.00;
  absolute = absolute || total;

  return {
    absolute: absolute,
    relative: relative,
    total: total
  }
}