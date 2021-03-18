var scattermargin = {top: 60, right: 100, bottom: 50, left: 70},
scatterwidth = 1000 - scattermargin.left - scattermargin.right,
scatterheight = 400 - scattermargin.top - scattermargin.bottom;


var scatter
var x = d3.scaleLinear()
        .domain([2008, 2019])
        .range([ 0, scatterwidth ]);
var domain
var y
	

var reducedImp, reducedExp;
var growthImpNom = [{Date: 2008, Value: 0}], growthExpNom = [{Date: 2008, Value: 0}];

function formatData(data) {
	return data.filter(d => d.ProductCode.length == 1)
		.map(d => {
			return {Date : +d.Year, Value : d.TradeValueK, TradeFlowName : d.TradeFlowName}
		})
}

function getScatterTitle() {
	var str = document.getElementById("swapType").innerHTML != 'Growth' ? 'Growth in ' : 'Net '
	str += _impFilter ? 'Brazilian Imports from the USA' : 'Brazilian Exports to the USA'
	return str
}

Promise.all([
	d3.csv("./data/Tradedata.csv")
]).then(([data]) => {
	buildScatterSum(formatData(data))
})

function reduceFunc(allDates, d) {
	if (allDates.some(e => e.Date === d.Date)) {
		allDates.filter(e => e.Date === d.Date)[0].Value += +d.Value
	} else {
		allDates.push({
			Date: d.Date,
			Value: +d.Value
		})
	}
	   return allDates
}


function buildScatterSum(data) {
	document.getElementById('scattertitle').innerHTML = getScatterTitle()

	scatter = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", scatterwidth + scattermargin.left + scattermargin.right)
        .attr("height", scatterheight + scattermargin.top + scattermargin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + scattermargin.left + "," + scattermargin.top + ")")
		.attr('id', 'scattersum')

    var importData = data.filter(d => d.TradeFlowName == 'Import')
    var exportData = data.filter(d => d.TradeFlowName == 'Export')

    reducedImp = importData.reduce(reduceFunc, []);

    reducedExp = exportData.reduce(reduceFunc, []);

    for(var i = 0; i < reducedExp.length; i++) {
        if(i > 0) {
            growthImpNom.push({Date: reducedImp[i].Date, Value: (reducedImp[i].Value - reducedImp[i - 1].Value)})
            growthExpNom.push({Date: reducedExp[i].Date, Value: (reducedExp[i].Value - reducedExp[i - 1].Value)})
        }
    }

	scatter.append("g")
		.attr("transform", "translate(0," + scatterheight + ")")
		.call(d3.axisBottom(x));

	domain = d3.extent(reducedImp, function(d) { return +d.Value})
	domain[0] -= 1000000
	domain[1] += 1000000

	y = d3.scaleLinear()
		.domain(domain) 
		.range([ scatterheight, 0 ]);

	scatter.append("g")
		.attr("id", "axis")
		.call(d3.axisLeft(y));

	scatter.append("path")
    .attr("id", "curvedPath")
    .datum(reducedImp)
    .attr("fill", "none")
    .attr("stroke", "#C81414")
    .attr("stroke-width", 3)
    .attr("d", d3.line()
        .curve(d3.curveCatmullRom)
        .x(r => x(r.Date))
        .y(r => y(r.Value))
    )

    scatter.append("g")
    .selectAll("dot")
    .data(reducedImp)
    .enter()
    .append("circle")
        .attr("cx", r => x(r.Date))
        .attr("cy", r => y(r.Value))
        .attr("r", 8)
        .attr("fill", "#C81414")

    scatter.append("text")
    .attr("text-anchor", "end")
    .attr("x", scatterwidth)
    .attr("y", scatterheight+40)
    .text("Time (year)");

    scatter.append("text")
    .attr("text-anchor", "end")
    .attr("x", -65)
    .attr("y", -20 )
    .text("Thousand Dollars")
    .attr("text-anchor", "start")

	scatter.append("line")
		.attr("id", "dashed")
		.attr("opacity", 0)
        .style("stroke-dasharray", ("3, 3"))
        .attr("stroke", "black")
        .attr("opacity", 0)
}

function updateScatter(type) {
	var data;
    var btnF = document.getElementById("swapButton");
    var btnT = document.getElementById("swapType");

	if (type) {
		btnT.innerHTML = btnT.innerHTML == 'Total' ? 'Growth' : "Total" 
	}

	data = btnT.innerHTML == 'Growth' 
		? (btnF.innerHTML == 'Imports' ? reducedExp : reducedImp)
		: (btnF.innerHTML == 'Imports' ? growthExpNom : growthImpNom) 

	var fill = btnF.innerHTML == "Exports" ? "#C81414" : "#69b3a2"

	document.getElementById('scattertitle').innerHTML = getScatterTitle()
    
    
	domain = d3.extent(data, d => +d.Value)
	domain[0] -= 1000000
	domain[1] += 1000000

    y.domain(domain)

    scatter.select("#axis")
        .transition()
        .duration(750)
        .call(d3.axisLeft(y))

    if (btnT.innerHTML == "Total") {
        scatter.select("#dashed")
			.transition()
            .duration(750)
            .attr("x1", 0)
        	.attr("x2", scatterwidth)
        	.attr("y1", y(0))
        	.attr("y2", y(0))
            .attr("opacity", 1)
    } else {
        scatter.select("#dashed")
			.transition()
            .duration(750)
            .attr("opacity", 0)
    }


    var circ = scatter.selectAll("circle").data(data)

    var path = scatter.selectAll("#curvedPath").datum(data)

    circ.enter()
        .append("dot")
        .merge(circ)
        .transition()
        .duration(750)
            .attr("cx", d => x(d.Date))
            .attr("cy", d => y(d.Value))
            .attr("r", 8)
            .attr("fill", fill)

    path.enter()
        .append("path")
        .merge(path)
        .transition()
        .duration(750)
        .attr("d", d3.line()
            .curve(d3.curveCatmullRom)
            .x(r => x(r.Date))
            .y(r => y(r.Value)))
        .attr("fill", "none")
        .attr("stroke", fill)
        .attr("stroke-width", 3)

}
