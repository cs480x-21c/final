var margin = {top: 50, right: 30, bottom: 50, left: 70},
width = 1080 - margin.left - margin.right,
height = 720 - margin.top - margin.bottom;


var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


        var x = d3.scaleLinear()
            .domain([2008, 2019])
            .range([ 0, width ]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        var y = d3.scaleLinear()
            .domain( [50000000, 140000000]) 
            .range([ height, 0 ]);
            
        svg.append("g")
            .attr("id", "axis")
            .call(d3.axisLeft(y));

        svg.append("line")
            .attr("id", "dashed")
            .attr("opacity", 0)

var reducedImp, reducedExp;
var growthImpNom = [{Date: 2008, Value: 0}], growthExpNom = [{Date: 2008, Value: 0}];

d3.csv("data/Tradedata.csv",
    function(d) {
        return { Date : +d.Year, Value : d.TradeValueK, TradeFlowName : d.TradeFlowName}
    },
    function(data) {
        buildScatterSum(data)
    }
)

function buildScatterSum(data) {

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

    svg.append("path")
    .attr("id", "curvedPath")
    .datum(reducedImp)
    .attr("fill", "none")
    .attr("stroke", "#69b3a2")
    .attr("stroke-width", 3)
    .attr("d", d3.line()
        .curve(d3.curveCatmullRom)
        .x(function(r) { return x(r.Date) })
        .y(function(r) { return y(r.Value) })
    )

    svg.append("g")
    .selectAll("dot")
    .data(reducedImp)
    .enter()
    .append("circle")
        .attr("cx", function(r) { return x(r.Date) } )
        .attr("cy", function(r) { return y(r.Value) } )
        .attr("r", 8)
        .attr("fill", "#69b3a2")

    svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height+40)
    .text("Time (year)");

    svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", -65)
    .attr("y", -20 )
    .text("Thousand Dollars")
    .attr("text-anchor", "start")

    update(0)

}

function update(type) {
    var data;
    var btnF = document.getElementById("swapFlow");
    var btnT = document.getElementById("swapType");

    growthExpNom, growthImpNom, reducedExp, reducedImp;
    if(type == 0) {
        if(btnF.innerHTML == "Export") { 
            if(btnT.innerHTML == "Growth") { data = reducedExp } else { data = growthExpNom }
            btnF.innerHTML = "Import" 
        } 
        else { 
            if(btnT.innerHTML == "Growth") { data = reducedImp } else { data = growthImpNom }
            btnF.innerHTML = "Export" }
    } else {
        if(btnT.innerHTML == "Growth") { 
            if(btnF.innerHTML = "Export") { data = growthImpNom } else { data = growthExpNom }
            btnT.innerHTML = "Total" }
        else { 
            if(btnF.innerHTML = "Export") { data = reducedImp } else { data = reducedExp }
            btnT.innerHTML = "Growth" }
    }
    if(btnF.innerHTML == "Export") { fill = "#69b3a2" } else { fill = "#C81414" }
    
    
    var fill;
    var lineDat = [{Date : 2008, Value: 0}, {Date : 2019, Value: 0}];

    y.domain(d3.extent(data, function(d) { return +d.Value}))

    svg.select("#axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y))

    var dashed = svg.select("#dashed")

    if(btnT.innerHTML == "Total") {
        dashed
            .enter()
            .append("line")
            .merge(dashed)
            .transition()
            .duration(1000)
            .style("stroke-dasharray", ("3, 3"))
            .attr("x1", 0)
            .attr("x2", width)
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
            .duration(1000)
            .attr("opacity", 0)
    }


    var circ = svg.selectAll("circle")
        .data(data)

    var path = svg.selectAll("#curvedPath")
        .datum(data)

    circ
        .enter()
        .append("dot")
        .merge(circ)
        .transition()
        .duration(1000)
            .attr("cx", function(d) { return x(d.Date); })
            .attr("cy", function(d) { return y(d.Value); })
            .attr("r", 8)
            .attr("fill", fill)

    path
        .enter()
        .append("path")
        .merge(path)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
            .curve(d3.curveCatmullRom)
            .x(function(r) { return x(r.Date) })
            .y(function(r) { return y(r.Value) }))
        .attr("fill", "none")
        .attr("stroke", fill)
        .attr("stroke-width", 3)

}
