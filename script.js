Promise.all([
	d3.csv("data/TradeData.csv")
]).then(([data]) => {
	buildScatter(data)
})

function buildScatter(data) {
	var dim = {
		width: 700,
		height: 500,
		margin: {
			top: 10, 
			right: 30, 
			bottom: 30, 
			left: 60}
	}

	var svg = d3.select('body').select('#chart')
		.attr('width', dim.width + dim.margin.left + dim.margin.right)
		.attr('height', dim.height + dim.margin.top + dim.margin.bottom)
		.append("g")
		.attr("transform",
				"translate(" + dim.margin.left + "," + dim.margin.top + ")");

	var x = d3.scaleLinear()
		.domain([d3.min(data.map(d => parseInt(d.Year)))-1, d3.max(data.map(d => parseInt(d.Year))) + 1])
		.range([0, dim.width])
	svg.append("g")
		.attr("transform", "translate(0," + dim.height + ")")
		.call(d3.axisBottom(x))

	var y = d3.scaleLinear()
		.domain([d3.min(data.map(d => parseInt(d.TradeValueK))), d3.max(data.map(d => parseInt(d.TradeValueK)))]) //d3.extent?
		.range([dim.height, 0])
	svg.append('g')
		.call(d3.axisLeft(y))
	
	var importData = data.filter(d => d.TradeFlowName == 'Import')
	var exportData = data.filter(d => d.TradeFlowName == 'Export')

	svg.selectAll('circle')
		.data(importData)
		.enter()
		.append('circle')
			.attr('cx', d => x(d.Year))
			.attr('cy', d => y(d.TradeValueK))
			.attr('r', 4)
			.attr('fill', 'red')
			.attr('opacity', 0.5)
			.attr('stroke-width', 1)
			.attr('stroke', '#252525')

	svg.selectAll('rect')
		.data(exportData)
		.enter()
		.append('rect')
			.attr('x', d => x(d.Year) - 4 )
			.attr('y', d => y(d.TradeValueK) - 4 )
			.attr('width', 8)
			.attr('height', 8)
			.attr('fill', 'green')
			.attr('opacity', 0.5)
			.attr('stroke-width', 1)
			.attr('stroke', '#252525')
}


/**
	0: "Nomenclature"
	1: "ReporterISO3"
	2: "ProductCode"
	3: "ReporterName"
	4: "PartnerISO3"
	5: "PartnerName"            (Partner Exports TO Reporter) AND (Partner Imports FROM Reporter)
	6: "Year"         
	7: "TradeFlowName"                               ^^ (Export/Import) ^^
	8: "TradeFlowCode"
	9: "TradeValue in 1000 USD"
	10: "Quantity"
	11: "ProductDescription"
	12: "QtyUnit"
	13: "NetWeight in KGM"
 */

/**
Aggregation Structure:
	Example:
	-0: Agricultural, forestry, and fishery products
		-01: Agricultural Products
		-011: Cash Grains and other crops
			-0111: Wheat
		-013: Field crops, except cash grains
			-0131: Cotton and cottonseed
		-02:
			etc
		-08:
			etc
		-09:
			etc
	-1: Mineral Commodities
	-2: Manufactured commodities
	-3: Manufactured commodities not identified by kind
	-9: Other commodities
	Structure:
		-Highest aggregation is single digit with 5 seperate categories listed above.
		-Anything within each category will start with that number followed by another number (always adding numbers to the end).
			-Continue with this pattern until 4 digit numbers where the final layer of aggregation is
	Example:
		Given the 4 digit number "3524"
			-Looking at "3" its identified as "Manufacture commodity not identified by kind"
			-Looking at "35" its identified as "Machinery, except electrical"
			-Looking at "352" its identified as "Farm and garden machinery equipment"
			-Looking at "3524" its identified as "Lawn and garden equipment, and parts, nspf" (nspf -- not specified)
 */
