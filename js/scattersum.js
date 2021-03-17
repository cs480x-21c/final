var scattermargin = {top: 50, right: 30, bottom: 50, left: 70},
scatterwidth = 1080 - scattermargin.left - scattermargin.right,
scatterheight = 720 - scattermargin.top - scattermargin.bottom;


var scatter
var x = d3.scaleLinear()
        .domain([2008, 2019])
        .range([ 0, scatterwidth ]);
var y
	

var reducedImp, reducedExp;
var growthImpNom = [{Date: 2008, Value: 0}], growthExpNom = [{Date: 2008, Value: 0}];

function formatData(data) {
	return data.map(d => {
		return {Date : +d.Year, Value : d.TradeValueK, TradeFlowName : d.TradeFlowName}
	})
}

Promise.all([
	d3.csv("data/Tradedata.csv")
]).then(([data]) => {
	data = formatData(data)
	buildScatterSum(data)
})


function buildScatterSum(data) {
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

    reducedImp = importData.reduce(function(allDates, d) {
        if (allDates.some(function(e) {
            return e.Date === d.Date
        })) {
            allDates.filter(function(e) {
            return e.Date === d.Date
            })[0].Value += +d.Value
        } else {
            allDates.push({
            Date: d.Date,
            Value: +d.Value
            })
        }
    return allDates
    }, []);

    reducedExp = exportData.reduce(function(allDates, d) {
        if (allDates.some(function(e) {
            return e.Date === d.Date
        })) {
            allDates.filter(function(e) {
            return e.Date === d.Date
            })[0].Value += +d.Value
        } else {
            allDates.push({
            Date: d.Date,
            Value: +d.Value
            })
        }
    return allDates
    }, []);

    for(var i = 0; i < reducedExp.length; i++) {
        if(i > 0) {
            growthImpNom.push({Date: reducedImp[i].Date, Value: (reducedImp[i].Value - reducedImp[i - 1].Value)})
            growthExpNom.push({Date: reducedExp[i].Date, Value: (reducedExp[i].Value - reducedExp[i - 1].Value)})
        }
    }

	scatter.append("g")
		.attr("transform", "translate(0," + scatterheight + ")")
		.call(d3.axisBottom(x));

	var domain = d3.extent(reducedImp, function(d) { return +d.Value})
	domain[0] -= 5000000
	domain[1] += 5000000

	y = d3.scaleLinear()
		.domain(domain) 
		.range([ scatterheight, 0 ]);

	scatter.append("g")
		.attr("id", "axis")
		.call(d3.axisLeft(y));

	scatter.append("line")
		.attr("id", "dashed")
		.attr("opacity", 0)

    scatter.append("path")
    .attr("id", "curvedPath")
    .datum(reducedImp)
    .attr("fill", "none")
    .attr("stroke", "#C81414")
    .attr("stroke-width", 3)
    .attr("d", d3.line()
        .curve(d3.curveCatmullRom)
        .x(function(r) { return x(r.Date) })
        .y(function(r) { return y(r.Value) })
    )

    scatter.append("g")
    .selectAll("dot")
    .data(reducedImp)
    .enter()
    .append("circle")
        .attr("cx", function(r) { return x(r.Date) } )
        .attr("cy", function(r) { return y(r.Value) } )
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

    //updateScatter(0)

}

function updateScatter(type) {
    var data;
    var btnF = document.getElementById("swapButton");
    var btnT = document.getElementById("swapType");

    if(type == 0) {
        if(btnF.innerHTML == "Exports") { 
			data = btnT.innerHTML == "Growth" ? reducedExp : growthExpNom
        } 
        else { 
            data = btnT.innerHTML == "Growth" ? reducedImp : growthImpNom
		}
    } else {
        if(btnT.innerHTML == "Growth") { 
            data = btnF.innerHTML == "Exports" ? growthImpNom : growthExpNom
            btnT.innerHTML = "Total" 
		} else { 
            data = btnF.innerHTML == "Exports" ? reducedImp : reducedExp
            btnT.innerHTML = "Growth" 
		}
    }
    fill = btnF.innerHTML == "Exports" ? "#69b3a2" : "#C81414"
    
    var fill;
    //var lineDat = [{Date : 2008, Value: 0}, {Date : 2019, Value: 0}];

	domain = d3.extent(data, function(d) { return +d.Value})
	domain[0] -= 5000000
	domain[1] += 5000000

    y.domain(domain)

    scatter.select("#axis")
        .transition()
        .duration(750)
        .call(d3.axisLeft(y))

    var dashed = scatter.select("#dashed")

    if(btnT.innerHTML == "Total") {
        dashed
            .enter()
            .append("line")
            .merge(dashed)
            .transition()
            .duration(750)
            .style("stroke-dasharray", ("3, 3"))
            .attr("x1", 0)
            .attr("x2", scatterwidth)
            .attr("y1", y(0))
            .attr("y2", y(0))
            .attr("id", "dashed")
            .attr("stroke", "black")
            .attr("opacity", 1)
    } else {
        dashed
            .enter()
            .append("line")
            .merge(dashed)
            .transition()
            .duration(750)
            .attr("opacity", 0)
    }


    var circ = scatter.selectAll("circle")
        .data(data)

    var path = scatter.selectAll("#curvedPath")
        .datum(data)

    circ
        .enter()
        .append("dot")
        .merge(circ)
        .transition()
        .duration(750)
            .attr("cx", function(d) { return x(d.Date); })
            .attr("cy", function(d) { return y(d.Value); })
            .attr("r", 8)
            .attr("fill", fill)

    path
        .enter()
        .append("path")
        .merge(path)
        .transition()
        .duration(750)
        .attr("d", d3.line()
            .curve(d3.curveCatmullRom)
            .x(function(r) { return x(r.Date) })
            .y(function(r) { return y(r.Value) }))
        .attr("fill", "none")
        .attr("stroke", fill)
        .attr("stroke-width", 3)

}
