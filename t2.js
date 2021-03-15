var aggData = []

Promise.all([
	d3.csv('data/BrazilTradeAggregationL0.csv'),
	d3.csv('data/BrazilTradeAggregationL1.csv'),
	d3.csv('data/BrazilTradeAggregationL2.csv'),
	d3.csv('data/BrazilTradeAggregationL3.csv')
]).then(([l0, l1, l2, l3]) => {
	aggData.push(l0,l1,l2,l3)
	buildChart(0, true, '')
})



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


function filterData(data, impFilter, aggFilter) { //impfilter = true gets only import data, false is export data
	var workingData = JSON.parse(JSON.stringify(data.filter(d => d.TradeFlowName == (impFilter ? 'Import' : 'Export'))))
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

function parseSortFilter(data, impFilter, aggFilter) {
	return filterData(sortData(parseData(data)), impFilter, aggFilter)
}


function buildChart(aggLevel, impFilter, aggFilter) {
	var margin = {top: 60, right: 230, bottom: 50, left: 70},
   	width = 800 - margin.left - margin.right,
   	height = 400 - margin.top - margin.bottom;

	d3.selectAll("#chart > *").remove() //to reset the SVG

	var svg = d3.select("#chart")
  		.attr("width", width + margin.left + margin.right)
  		.attr("height", height + margin.top + margin.bottom)
  	.append("g")
  		.attr("transform",
  	   	"translate(" + margin.left + "," + margin.top + ")");


	var data = parseSortFilter(aggData[aggLevel], impFilter, aggFilter)
	
	var keys = Object.keys(data[0]).filter(d => d != 'Year')

	var stack = d3.stack()
		.keys(keys)
		.offset(d3.stackOffsetNone)
		.order(d3.stackOrderDescending)

	var stack = stack(data)

	var color = d3.scaleOrdinal()
		.domain(keys)
		.range(d3.schemeCategory10)

	//ref: https://www.d3-graph-gallery.com/graph/stackedarea_template.html
	var x = d3.scaleLinear()
		.domain(d3.extent(data, d => d.Year))
		.range([0, width])
	
	var xAxis = svg.append('g')
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).ticks(5))

	svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height+40 )
      .text("Time (year)");



	var y = d3.scaleLinear()
		.domain([0, d3.max(flattenStack(stack))]) 
		.range([height, 0]);
	svg.append("g")
		.call(d3.axisLeft(y).ticks(5))

	svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", -65)
      .attr("y", -20 )
      .text("Thousand Dollars")
      .attr("text-anchor", "start")

	
	
	// Add a clipPath: everything out of this area won't be drawn.
	var clip = svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", 0)
      .attr("y", 0);

	// Add brushing
	//var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
	//	.extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
	//	.on("end", updateChart)              // Each time the brush selection changes, trigger the 'updateChart' function

	// Create the scatter variable: where both the circles and the brush take place
	var areaChart = svg.append('g')
		.attr("clip-path", "url(#clip)")

	// Area generator
	var area = d3.area()
		.x(d => x(d.data.Year))
		.y0(d => y(d[0]))
		.y1(d => y(d[1]))

	// Show the areas
	areaChart.selectAll("mylayers")
		.data(stack)
		.enter()
		.append("path")
			.attr("class", d => "myArea " + d.key)
			.style("fill", d => color(d.key))
			.attr("d", area)
			.attr('stroke-width', 0.5)
			.attr('stroke', '#252525')
			.on('click', function(d, i) {
				if (aggLevel < 3 && Object.keys(parseSortFilter(aggData[aggLevel+1], true, i.key)[0]).length > 1) {
					buildChart(aggLevel+1, impFilter, i.key)
				}
			})
			.on('contextmenu', function(d, i) {
				d.preventDefault();
				if (aggLevel > 0) {
					buildChart(aggLevel-1, impFilter, i.key.substring(0,i.key.length-2))
				}
			})

	// Add the brushing
	//areaChart.append("g")
   //		.attr("class", "brush")
   //		.call(brush);
}
