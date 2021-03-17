var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
var sliderAgg = document.getElementById("myAgg");
var outputAgg = document.getElementById("Agg");
output.innerHTML = slider.value;
var year = "2008"
var treewidth = 1000, treeheight = 800;
var agg = 1;
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
	var imp = document.getElementById('swapButton').innerHTML.slice(0, -1)
	var myNode = document.getElementById("kek");
	myNode.innerHTML = '';
	treemap(String(year), imp, agg);
}


function treemap(year, dir, agg=1) {
	document.getElementById('treetitle').innerHTML = getTreeTitle()

	color = d3.scaleSequential([8, 0], d3.interpolateMagma)
	var nest
	if(agg == 1){
		nest = d3.nest()
		.key(d => d.first)
		.rollup(d => d3.sum(d, a => a.TradeValue_in_1000_USD));
	}
	else if(agg == 2){
		nest = d3.nest()
		.key(d => d.first)
		.key(d => d.second)
		.rollup(d => d3.sum(d, a => a.TradeValue_in_1000_USD));
	}
	else if(agg == 3){
		nest = d3.nest()
		.key(d => d.first)
		.key(d => d.second)
		.key(d => d.third)
		.rollup(d => d3.sum(d, a => a.TradeValue_in_1000_USD));
	}
	else if(agg == 4){
		nest = d3.nest()
		.key(d => d.first)
		.key(d => d.second)
		.key(d => d.third)
		.key(d => d.fourth)
		.rollup(d => d3.sum(d, a => a.TradeValue_in_1000_USD));
	}



	Promise.all([
		d3.csv("https://gist.githubusercontent.com/FelChen/fa8e7c2148e000daf2fd5edb12b43ff6/raw/2940493146c74c08809a3d0c4633fd47420a6b88/cleanish.csv")
	]).then(([data]) => {
		//console.log(year)
		var lel = data
		// console.log(lel);
		var filtered = lel.filter(d => d.Year == year);
		filtered = filtered.filter(d => d.TradeFlowName == dir);

		// console.log(filtered);
		var root = d3.hierarchy({values: nest.entries(filtered)}, d => d.values)
			.sum(d => d.value)
			.sort((a, b) => b.value - a.value);

		var treemap = d3.treemap()
			.size([treewidth, treeheight])
			.padding(1)
			.round(true);
		var testing = treemap(root);


		var div = d3.select('.tooltip')


		d3.select("#treemap").node()
		//console.log(d3.select("#treemap").node())

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
				
				div.transition()
					.duration(200)
					.style("opacity", .9);
				div.html(i.data.key + "<br/>" + "Trade Value in USD: $" + numberWithCommas(Math.round((i.data.value*1000))))
					.style("left", left + 3*(i.x1 - i.x0)/4)
					.style("top", top);
			})
			.on("mouseout", function (d) {
				div.transition()
					.duration(500)
					.style("opacity", 0);
			});
		
		node.append("div")
			.attr("class", "node-label")
			.text(d => d.data.key);

		// node.append("div")
		//     .attr("class", "node-value")
		//     .text(function(d) { return d.parent.parent.parent.data.key + "\n" + d.parent.parent.data.key + "\n" + d.parent.data.key + "\n" + d.data.key; });


		// return testing;
	})

	
}


treemap("2008", "Import");
