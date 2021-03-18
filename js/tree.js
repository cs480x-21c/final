var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
var sliderAgg = document.getElementById("myAgg");
var outputAgg = document.getElementById("Agg");
output.innerHTML = slider.value;
var year = "2008"
var treewidth = 1000, treeheight = 800;
var agg = 0;
d3.select('#right').style('width', treewidth)

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateYear() {
	year = slider.value
	output.innerHTML = slider.value;
	updateTree()
}

function updateAgg() {
	agg = sliderAgg.value
	outputAgg.innerHTML = sliderAgg.value;
	updateTree()
}

function getTreeTitle() {
	var str = _impFilter ? 'Breakdown of Brazilian Imports from the USA: ' : 'Breakdown of Brazilian Exports to the USA: '
	str += year
	return str
}

function updateTree() {
	var imp = document.getElementById('swapButton').innerHTML == 'Imports' ? 'Export' : 'Import'
	var myNode = document.getElementById("kek");
	myNode.innerHTML = '';
	makeTreemap(String(year), imp, agg);
}


function makeTreemap(year, dir, agg=0) {
	document.getElementById('treetitle').innerHTML = getTreeTitle()

	color = d3.scaleSequential([8, 0], d3.interpolateMagma)
	var nest = d3.nest()
		.key(d => d.first)
		.key(d => d.second)
		.key(d => d.third)
		.key(d => d.fourth)
		.rollup(d => d3.sum(d, a => a.TradeValueK));


	

	Promise.all([
		d3.csv("data/TreeDataAggL"+agg+".csv")
	]).then(([data]) => {
		var filtered = data.filter(d => d.Year == year).filter(d => d.TradeFlowName == dir);
		
		var root = d3.hierarchy({values: nest.entries(filtered)}, d => d.values)
			.sum(d => d.value)
			.sort((a, b) => b.value - a.value);

		var treemap = d3.treemap()
			.size([treewidth, treeheight])
			.padding(1)
			.round(true);
		var testing = treemap(root);

		var ttip = d3.select('.tooltip')

		d3.select("#treemap").node()
		
		var node = d3.select("#kek")
			.style('width', treewidth)
			.style('height', treeheight)
			.selectAll(".node")
			.data(testing.leaves())
			.enter().append("div")
			.attr("class", "node")
			.style("left", d => d.x0)
			.style("top", d => d.y0)
			.style("width", d => d.x1 - d.x0)
			.style("height", d => d.y1 - d.y0)
			.style("fill", "#1f77b4")
			.on("mouseover", function (d, i) {
				var top = d3.select(this).node().getBoundingClientRect().top + window.pageYOffset;
				var left = d3.select(this).node().getBoundingClientRect().left + window.pageXOffset;

				
				ttip.transition()
					.duration(200)
					.style("opacity", .9);
				ttip.html(i.data.key + "<br/>" + "Trade Value in USD: $" + numberWithCommas(Math.round((i.data.value*1000))))
					.style("left", left + 3*(i.x1 - i.x0)/4)
					.style("top", top-5);
			})
			.on("mouseout", function (d) {
				ttip.transition()
					.duration(500)
					.style("opacity", 0);
			});
		
		node.append("div")
			.attr("class", "node-label")
			.text(d => d.data.key);

	})

	
}


makeTreemap("2008", "Import");
