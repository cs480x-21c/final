Promise.all([
	d3.csv('data/BrazilTradeAggregationL1.csv'),
	d3.csv('data/BrazilTradeAggregationL2.csv'),
	d3.csv('data/BrazilTradeAggregationL3.csv'),
	d3.csv('data/BrazilTradeAggregationL4.csv')
]).then(([l1, l2, l3, l4]) => {
	buildChart(l1)
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


function buildChart(data) {
	var margin = {top: 60, right: 230, bottom: 50, left: 70},
   	width = 800 - margin.left - margin.right,
   	height = 400 - margin.top - margin.bottom;

	var svg = d3.select("#chart")
  		.attr("width", width + margin.left + margin.right)
  		.attr("height", height + margin.top + margin.bottom)
  	.append("g")
  		.attr("transform",
  	   	"translate(" + margin.left + "," + margin.top + ")");


	data = data.sort((a,b) => parseInt(a.Year) - parseInt(b.Year))

	var keys = data.columns.filter(d => d != 'Year' && d != 'TradeFlowName')

	var stack = d3.stack()
		.keys(keys)
		.offset(d3.stackOffsetNone)
		.order(d3.stackOrderDescending)

	//JSON stringify/parse is for deep copy
	var importData = JSON.parse(JSON.stringify(data.filter(d => d.TradeFlowName == 'Import')))
	importData.forEach(d => delete d.TradeFlowName);
	
	var exportData = JSON.parse(JSON.stringify(data.filter(d => d.TradeFlowName == 'Export')))
	exportData.forEach(d => delete d.TradeFlowName);
	
	var importStack = stack(importData)
	var exportStack = stack(exportData)

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
		.domain([0, d3.max(flattenStack(importStack))]) 
		.range([ height, 0 ]);
	svg.append("g")
		.call(d3.axisLeft(y).ticks(5))

	svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", 0)
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
		.data(importStack)
		.enter()
		.append("path")
		  .attr("class", d => "myArea " + d.key)
		  .style("fill", d => color(d.key))
		  .attr("d", area)

	// Add the brushing
	//areaChart.append("g")
   //		.attr("class", "brush")
   //		.call(brush);
}
