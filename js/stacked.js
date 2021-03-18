var _aggData = []
var _sicTable = {}
var _aggLevel = 0
var _impFilter = true
var _aggFilter = ''

var stackmargin = {top: 60, right: 350, bottom: 50, left: 70},
   stackwidth = 1050 - stackmargin.left - stackmargin.right,
   stackheight = 400 - stackmargin.top - stackmargin.bottom;

Promise.all([
	d3.csv('./data/BrazilTradeAggregationL0.csv'),
	d3.csv('./data/BrazilTradeAggregationL1.csv'),
	d3.csv('./data/BrazilTradeAggregationL2.csv'),
	d3.csv('./data/BrazilTradeAggregationL3.csv'),
	d3.csv('./data/SIC_table.csv')
]).then(([l0, l1, l2, l3, sicTable]) => {
	_aggData.push(l0,l1,l2,l3)
	sicTable.forEach(d => {
		_sicTable[d.ProductCode] = d.ProductDescription
	})
	buildChart()
})

function getStackTitle() {
	var str = _impFilter ? 'Brazilian Imports from the USA: ' : 'Brazilian Exports to the USA: '
	str += _aggLevel == 0 ? 'Overall' : '\''+_sicTable[_aggFilter]+'\''
	return str
}

function swapView() {
	_impFilter = !_impFilter
	document.getElementById('stacktitle').innerHTML = getStackTitle()
	
	var data = parseSortFilter(_aggData[_aggLevel])

	var keys = Object.keys(data[0]).filter(d => d != 'Year')

	var makeStack = d3.stack()
		.keys(keys)
		.offset(d3.stackOffsetNone)
		.order(d3.stackOrderReverse)

	var stack = makeStack(data)

	var x = d3.scaleLinear()
		.domain(d3.extent(data, d => d.Year))
		.range([0, stackwidth])
	
	var y = d3.scaleLinear()
		.domain([0, d3.max(flattenStack(makeStack(_aggData[_aggLevel])))]) 
		.range([stackheight, 0]);

	var area = d3.area()
		.x(d => x(d.data.Year))
		.y0(d => y(d[0]))
		.y1(d => y(d[1]))
	
	var paths = d3.select('#areaChart').selectAll("path")

	paths.data(stack)
		.enter()
		.append('path')
			.merge(paths)
			.transition()
			.duration(750)
			.attr("d", area)
			
}

function flattenStack(arr) {
	var flattened = []
	arr.forEach(d => {
		d.forEach(i => {
			flattened.push(i[0])
			flattened.push(i[1])
		})
	})

	return flattened
}


function parseData(data) {
	return data.map(d => Object.keys(d)
			.reduce((obj, key) => {
				obj[key] = isNaN(d[key]) ? d[key] : parseFloat(d[key])
				return obj
			}, {})
	)
}

function sortData(data) {
	return data.sort((a,b) => a.Year - b.Year)
}


function filterData(data, aggFilter=_aggFilter) {
	var workingData = JSON.parse(JSON.stringify(data.filter(d => d.TradeFlowName == (_impFilter ? 'Import' : 'Export'))))
	workingData.forEach(d => delete d.TradeFlowName); //dont need this anymore. we know what we gave it

	workingData = workingData.map(d => {
		return Object.keys(d) //https://stackoverflow.com/questions/38750705/filter-object-properties-by-key-in-es6
			.filter(key => key.substring(0, aggFilter.length) == aggFilter || key == 'Year')
			.reduce((obj, key) => {
				obj[key] = d[key]
				return obj
			}, {})
	})

	return workingData
}

function parseSortFilter(data, aggFilter=_aggFilter) {
	return filterData(sortData(parseData(data)), aggFilter)
}


function validNextLayer(aggFilter=_aggFilter) {
	return _aggLevel < 3 && !isNaN(aggFilter) && Object.keys(parseSortFilter(_aggData[_aggLevel+1], aggFilter)[0]).length > 1
}

function buildChart() {
	document.getElementById('stacktitle').innerHTML = getStackTitle()

	d3.selectAll("#chart > *").remove() //to reset the SVG when drilling down / going back

	var stackarea = d3.select("#chart")
  		.attr("width", stackwidth + stackmargin.left + stackmargin.right)
  		.attr("height", stackheight + stackmargin.top + stackmargin.bottom)
  	.append("g")
  		.attr("transform",
  	   	"translate(" + stackmargin.left + "," + stackmargin.top + ")");


	var data = parseSortFilter(_aggData[_aggLevel])
	
	var keys = Object.keys(data[0]).filter(d => d != 'Year')

	var makeStack = d3.stack()
		.keys(keys)
		.offset(d3.stackOffsetNone)
		.order(d3.stackOrderReverse)

	var stack = makeStack(data)

	var color = d3.scaleOrdinal()
		.domain(keys)
		.range(d3.schemeTableau10)

	//ref: https://www.d3-graph-gallery.com/graph/stackedarea_template.html
	var x = d3.scaleLinear()
		.domain(d3.extent(data, d => d.Year))
		.range([0, stackwidth])
	
	var y = d3.scaleLinear()
		.domain([0, d3.max(flattenStack(makeStack(_aggData[_aggLevel])))]) 
		.range([stackheight, 0]);

	// Area generator
	var area = d3.area()
		.x(d => x(d.data.Year))
		.y0(d => y(d[0]))
		.y1(d => y(d[1]))

	var highlight = function(d, i){
		// reduce opacity of all groups
		d3.selectAll(".myArea,.legendBox,.legendText").style("opacity", .25)
		// expect the one that is hovered
		d3.selectAll("#area_"+i+',#legBox_'+i+',#legText_'+i).style("opacity", 1)
	}
	
	var noHighlight = function() {
		d3.selectAll(".myArea,.legendBox,.legendText").style("opacity", 1)
	}

	// Show the areas
	stackarea.append('g')
		.attr('id', 'areaChart')
		.selectAll("mylayers")
			.data(stack)
			.enter()
			.append("path")
				.attr("class", d => "myArea" + (validNextLayer(d.key) ? ' pointer' : ''))
				.attr('id', d => 'area_'+d.key.replace(/[\s:]/g,''))
				.style("fill", d => color(d.key))
				.attr("d", area)
				//.attr('stroke-stackwidth', 0.5)
				//.attr('stroke', '#252525')
				.on('mouseover', (d, i) =>	highlight(d, i.key.replace(/[\s:]/g,'')))
				.on('mouseout', (d, i) => noHighlight(d, i.key.replace(/[\s:]/g,'')))
				.on('click', function(d, i) {
					if (validNextLayer(i.key)) {
						_aggLevel++
						_aggFilter = i.key
						buildChart()
					} 
				})
				.on('contextmenu', function(d, i) {
					d.preventDefault();
					if (_aggLevel > 0) {
						_aggLevel--
						_aggFilter = i.key.slice(0,_aggLevel)
						buildChart()
					}
				})

	 // Add one dot in the legend for each name.
   var size = 20
   stackarea.selectAll("myrect")
   	.data(keys)
   	.enter()
   	.append("rect")
   		.attr("x", stackwidth + stackmargin.right/20)
   		.attr("y", (d,i) => 10 + i*(size+5)) // 100 is where the first dot appears. 25 is the distance between dots
   		.attr("width", size)
   		.attr("height", size)
			.attr('class', d => 'legendBox' + (validNextLayer(d) ? ' pointer' : ''))
			.attr('id', d => 'legBox_'+d.replace(/[\s:]/g,''))
   		.style("fill", d => color(d))
   		.on("mouseover", (d, i) => highlight(d, i.replace(/[\s:]/g,'')))
      	.on("mouseleave", (d, i) => noHighlight(d, i.replace(/[\s:]/g,'')))
		.on('click', function(d,i) {
			if (validNextLayer(i)) {
				_aggLevel++
				_aggFilter = i
				buildChart()
			}
		})
		.on('contextmenu', function(d, i) {
			console.log(i)
			d.preventDefault();
			if (_aggLevel > 0) {
				_aggLevel--
				_aggFilter = i.slice(0,_aggLevel)
				buildChart()
			}
		})

   // Add one dot in the legend for each name.
   stackarea.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
      	.attr("x", stackwidth + stackmargin.right/20 + size*1.2)
      	.attr("y", (d,i) => 10 + i*(size+5) + (size/2)) // 100 is where the first dot appears. 25 is the distance between dots
			.attr('class', d => 'legendText' + (validNextLayer(d) ? ' pointer' : ''))
			.attr('id', d => 'legText_'+d.replace(/[\s:]/g,''))
      	.style("fill", d => color(d))
      	.text(d => {
			var colonInd = d.indexOf(':')
			return _sicTable[d.slice(0, colonInd != -1 ? colonInd : _aggLevel+1)] + (colonInd != -1 ? ': Other' : '')
		})
      	.attr("text-anchor", "left")
      	.style("alignment-baseline", "middle")
      	.on("mouseover", (d, i) => highlight(d, i.replace(/[\s:]/g,'')))
      	.on("mouseleave", (d, i) => noHighlight(d, i.replace(/[\s:]/g,'')))
		.on('click', function(d,i) {
			if (validNextLayer(i)) {
				_aggLevel++
				_aggFilter = i
				buildChart()
			}
		})
		.on('contextmenu', function(d, i) {
			d.preventDefault();
			if (_aggLevel > 0) {
				_aggLevel--
				_aggFilter = i.slice(0,_aggLevel)
				buildChart()
			}
		})



	// AXES
	stackarea.append('g')
		.attr("transform", "translate(0," + stackheight + ")")
		.call(d3.axisBottom(x))
	
	stackarea.append("text")
		.attr("text-anchor", "end")
		.attr("x", stackwidth)
		.attr("y", stackheight+40 )
		.text("Time (year)");
	
	stackarea.append("g")
		.call(d3.axisLeft(y).ticks(7))
	
	stackarea.append("text")
		.attr("text-anchor", "end")
		.attr("x", -65)
		.attr("y", -20 )
		.text("Thousand Dollars")
		.attr("text-anchor", "start")
}
