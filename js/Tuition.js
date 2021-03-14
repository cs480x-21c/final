// Create a div for the SVG to be placed into
var tuitionSVGDiv = document.createElement("div");
tuitionSVGDiv.classList.add("svgdiv");
tuitionSVGDiv.id = "tuitionDiv";

// Create a div for the text to go in
var tuitionTextDiv = document.createElement("div");
tuitionTextDiv.classList.add("textbox");
tuitionTextDiv.id = "tuitionTextDiv";

// Append divs to body
document.body.appendChild(tuitionSVGDiv);
document.body.appendChild(tuitionTextDiv);

// Define height, width, margins for svg
var margin = { top: 20, right: 20, bottom: 80, left: 100 },
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Define svg
var tuitionSVG = d3.select("#tuitionDiv")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "svg");

// Read from csv
d3.csv("maincsv.csv", function (error, data) {
    if (error) {
        throw error;
    }

    // x scale
    xScale.domain(data.map(function (d) {
        return d.Year;
    }));

    // y scale
    yScale.domain([0, d3.max(data, function (d) {
        return d.TF;
    })]);

    // Draw bar chart
    tuitionSVG.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return xScale(d.Year);
        })
        .attr("y", function (d) {
            return yScale(d.TF);
        })
        .attr("width", xScale.bandwidth())
        .style("fill", "#b8b3ff")
        .attr('id', function (d) {
            return d.Year;

        })
        .attr("height", function (d) {
            return height - yScale(d.TF);
        })
        .on('mouseover', function (d) {
            d3.select(this).style("fill", "#1100ff");
            var div = document.getElementById("tuitionTextDiv");
            div.innerHTML += d.Year + "<br>";
            div.innerHTML += "Tuition and Fees: $" + (d.TF*1000).toLocaleString("en") + "<br>";
        })
        .on('mouseout', function (d) {
            d3.select(this).style("fill", "#b8b3ff");
            var div = document.getElementById("tuitionTextDiv");
            div.innerHTML = "";
        })

    // x and y scales for axes and labels
    let x = d3.scaleBand()
        .padding(0.2)
        .range([0, width]);

    let y = d3.scaleLinear()
        .range([height, 0]);

    var xAxis = d3.axisBottom()
        .scale(x);

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(10);

    // Set x and y domain
    x.domain(data.map(function(d) { return d.Year; }));
    y.domain([0, d3.max(data, function(d) { return parseInt(d.TF) * 1000; })]);

    // Append x axis
    tuitionSVG.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-65)"

        });

    // Append y axis
    tuitionSVG.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Tuition And Fees");
});



// Code from o4 remix for multi line chart with hover legend:

/*
//==================================================================================
        // Begin line chart

        // Format
        data.forEach(function (d) {
            d.Sex = d['sex'];
            d.Race = d['race'];
            d.Year = d['year'];
            d.WeeklyEarnings = d['median_weekly_earn'];
        });

        // Convert quarters into fractions of year
        data.forEach(function (d) {
            // console.log("year before: " + d.year + " adding: " + (d.quarter/4 - 0.25));
            d.year = parseInt(d.year) + d.quarter / 4 - 0.25;
            // console.log("year in conversion: " + d.year);
        });

        // Filter data to show just men and women of all races
        var allRacesData = data.filter(function (row) {
            if (row.sex != "Both Sexes"
                && row.race == "All Races"
                && row.age == "16 years and over"
                && row.ethnic_origin == "All Origins") {
                return true;
            }

        });


        // Group data by sex
        var groupData = d3.nest()
            .key(function (d) {
                return d.Sex;
            })
            .entries(allRacesData);


        // Add x axis
        var x = d3.scaleLinear()
            .domain([2010, 2021])
            .range([0, width])
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(11).tickFormat(d3.format("d")))
            .attr("class", "xaxis");

        // Add x axis label
        svg.append("text")
            .attr("transform", "translate(" + (width/2) + ", " + (height + margins.top - 10) + ")")
            .style("text-anchor", "middle")
            .text("Year")
            .style("font", "14px arial")



        // Add y axis
        var y = d3.scaleLinear()
            .domain([600,
                1200])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add y axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6 - margins.left)
            .attr("x", 0 - (height/2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Median Weekly Earnings")
            .style("font", "14px arial");



        // Add chart title
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margins.top/3))
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text("Median Weekly Earnings Per Year");

        // Add tooltip
        svg.append("text")
            .attr("x", (width/2))
            .attr("y", (height + 100))
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .text("Click on the year values on the x axis for more data");



        // color palette
        var res = groupData.map(function (d) {
            return d.key
        }) // list of group names
        var color = d3.scaleOrdinal()
            .domain(res)
            .range(['#e41a1c', '#377eb8'])

        var yearPositions = [];

        // Draw lines
        svg.selectAll(".line")
            .data(groupData)
            .enter()
            .append("path")
            //.filter(function(d) { return d.Race == "All Races"})
            .attr("fill", "none")
            .attr("stroke", function (d) {
                return color(d.key)
            })
            .attr("stroke-width", 2)
            .attr("d", function (d) {
                return d3.line()
                    .x(function (d) {
                        // Log the x values at the start of each year for only men so you don't double count it
                        if(d.quarter == 1 && d.sex == "Men") {
                            yearPositions.push(x(d.year));
                        }
                        return x(d.year);
                    })
                    .y(function (d) {
                        return y(d.WeeklyEarnings);
                    })
                    (d.values)
            });



        //Legend and Mouse hover capabilities over multi-line chart taken majorly from:
        //https://bl.ocks.org/dianaow/0da76b59a7dffe24abcfa55d5b9e163e
        //I used this page to understand how the hover functionality works and how to create intersections with multi line charts


var mouseBuffer = 8;

// CREATE LEGEND //
var R = 6; // legend marker
var svgLegend = svg.append('g')
    .attr('class', 'gLegend')
    .attr("transform", "translate(" + (width + 20) + "," + 0 + ")")

var legend = svgLegend.selectAll('.legend')
    .data(res)
    .enter().append('g')
    .attr("class", "legend")
    .attr("transform", function (d, i) {return "translate(0," + i * 20 + ")"})

legend.append("circle")
    .attr("class", "legend-node")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", R)
    .style("fill", d=>color(d))

legend.append("text")
    .attr("class", "legend-text")
    .attr("x", R*2)
    .attr("y", R/2)
    .style("fill", "#666666")
    .style("font-size", 12)
    .text(d=>d)

// CREATE HOVER TOOLTIP WITH VERTICAL LINE //
tooltip = d3.select("body").append("div")
    .attr('id', 'tooltip')
    .style('position', 'absolute')
    .style("background-color", "#D3D3D3")
    .style('padding', 6)
    .style('display', 'none')

mouseG = svg.append("g")
    .attr("class", "mouse-over-effects");

mouseG.append("path") // create vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "#A9A9A9")
    .style("stroke-width", "2px")
    .style("opacity", "0");

var lines = document.getElementsByClassName('line');

var res_nested = d3.nest()
    .key(d=>d.sex)
    .entries(allRacesData)

var mousePerLine = mouseG.selectAll('.mouse-per-line')
    .data(res_nested)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");

mousePerLine.append("circle")
    .attr("r", 4)
    .style("stroke", function (d) {
        return color(d.key)
    })
    .style("fill", "none")
    .style("stroke-width", "2px")
    .style("opacity", "0");

mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseout', function () { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
            .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
            .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
            .style("opacity", "0");
        d3.selectAll("#tooltip")
            .style('display', 'none')

    })
    .on('mouseover', function () { // on mouse in show line, circles and text
        d3.select(".mouse-line")
            .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
            .style("opacity", "1");
        d3.selectAll("#tooltip")
            .style('display', 'block')
    })
    .on('mousemove', function () { // update tooltip content, line, circles and text when mouse moves
        var mouse = d3.mouse(this)

        d3.selectAll(".mouse-per-line")
            .attr("transform", function (d, i) {
                var xDate = x.invert(mouse[0] - mouseBuffer) // use 'invert' to get date corresponding to distance from mouse position relative to svg
                var bisect = d3.bisector(function (d) { return d.year; }).left // retrieve row index of date on parsed csv
                var idx = bisect(d.values, xDate);

                d3.select(".mouse-line")
                    .attr("d", function () {
                        if(d.values[idx]) {
                            var data = "M" + x(d.values[idx].year) + "," + (height);
                            data += " " + x(d.values[idx].year) + "," + 0;
                            return data;
                        }
                    });
                if(d.values[idx]) return "translate(" + x(d.values[idx].year) + "," + y(d.values[idx].median_weekly_earn) + ")";

            });

        updateTooltipContent(mouse, res_nested)

    })

function updateTooltipContent(mouse, res_nested) {

    var tooltipFontSize = 15;

    sortingObj = []
    res_nested.map(d => {
        var xDate = x.invert(mouse[0] - mouseBuffer)
        var bisect = d3.bisector(function (d) { return d.year; }).left
        var idx = bisect(d.values, xDate)
        if(d.values[idx]) {
            var q = d.values[idx].year - parseInt(d.values[idx].year);

            var realQ = "";
            switch (q) {
                case 0:
                    realQ = "Q1";
                    break;
                case 0.25:
                    realQ = "Q2";
                    break;
                case 0.5:
                    realQ = "Q3";
                    break;
                case 0.75:
                    realQ = "Q4";
                    break;
                default:
                    realQ = "Q?";
                    break;
            }
            sortingObj.push({
                key: d.values[idx].sex,
                year: parseInt(d.values[idx].year),
                quarter: realQ
            })
        }
    })

    sortingObj.sort(function(x, y){
        return d3.descending(x.median_weekly_earn, y.median_weekly_earn);
    })

    var sortingArr = sortingObj.map(d=> d.key)

    var res_nested1 = res_nested.slice().sort(function(a, b){
        return sortingArr.indexOf(a.key) - sortingArr.indexOf(b.key) // rank vehicle category based on price of premium
    })

    if(sortingObj[0]) {
        tooltip.html(sortingObj[0].year + "-" + sortingObj[0].quarter)
            .style('display', 'block')
            .style('left', d3.event.pageX + 20)
            .style('top', d3.event.pageY - 20)
            .style('font-size', tooltipFontSize)
            .selectAll()
            .data(res_nested1).enter() // for each vehicle category, list out name and price of premium
            .append('div')
            .style('color', d => {
                return color(d.key)
            })
            .style('font-size', tooltipFontSize)
            .html(d => {
                var xDate = x.invert(mouse[0])
                var bisect = d3.bisector(function (d) {
                    return d.year;
                }).left
                var idx = bisect(d.values, xDate)
                return d.key + ": $" + d.values[idx].median_weekly_earn;
            })
    }
}
 */