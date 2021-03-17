var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;
var year = "2008"

function updateYear() {
	year = slider.value
	updateTree()
}

function updateTree() {
	var imp = document.getElementById('swapButton').innerHTML.slice(0, -1)
	var myNode = document.getElementById("kek");
	myNode.innerHTML = '';
	treemap(String(year), imp);
}


function treemap(year, dir) {
	color = d3.scaleSequential([8, 0], d3.interpolateMagma)
	var treewidth = 1000,
		treeheight = 800;

	var nest = d3.nest()
		.key(d => d.first)
		.key(d => d.second)
		.key(d => d.third)
		.key(d => d.fourth)
		.rollup(d => d3.sum(d, a => a.TradeValue_in_1000_USD));


	// .append("svg")
	// .attr("width", treewidth)
	// .attr("height", treeheight)
	// .append("g")

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

				div.transition()
					.duration(200)
					.style("opacity", .9);
				div.html(i.data.key + "<br/>" + "Trade Value in 1000 USD: $" + i.data.value)
					.style("left", i.x0 + 3*(i.x1 - i.x0) / 4)
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
