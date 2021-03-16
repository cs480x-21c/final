(function () {

    // Colors
    var barColor = "#b8b3ff";
    var barDownColor = "#1100ff";
    var lineColor = "red";
    var lineColor2 = "blue";


    var color = d3.scaleOrdinal()
        .domain(d3.range(2))
        .range([lineColor, lineColor2])

    // Create a div for the SVG to be placed into
    var svgDiv = document.createElement("div");
    svgDiv.classList.add("svgdiv");
    svgDiv.id = "percentDiv";

    // Create a div for the text to go in
    var textDiv = document.createElement("div");
    textDiv.classList.add("textbox");
    textDiv.id = "percentTextDiv";

    // Append divs to body
    document.body.appendChild(svgDiv);
    document.body.appendChild(textDiv);

    // Define height, width, margins for svg
    var margin = {top: 50, right: 100, bottom: 50, left: 110},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Define svg
    var svg = d3.select("#percentDiv")
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

        // x and y scales for axes
        let x = d3.scaleBand()
            .padding(0.2)
            .range([0, width]);

        let y0 = d3.scaleLinear()
            .range([height, 0]);

        let y1 = d3.scaleLinear()
            .range([height, 0]);

        var xAxis = d3.axisBottom()
            .scale(x);

        var yAxisLeft = d3.axisLeft()
            .scale(y0)
            .ticks(10);

        var yAxisRight = d3.axisRight()
            .scale(y1)
            .ticks(10);

        // Set x and y domain
        x.domain(data.map(function (d) {
            return d.Year;
        }));

        y0.domain([-30,30]);


        var xScale = d3.scaleBand().range([0, width]).padding(0.4),
            yScale = d3.scaleLinear().range([height, 0]);

        // x scale
        xScale.domain(data.map(function (d) {
            return d.Year;
        }))
            .range([0, width]);

        // y scale
        yScale.domain([0, d3.max(data, function (d) {
            return d.PCTF;
        })]);




        // Add x axis label
        svg.append("text")
            .attr("transform", "translate(" + (width/2) + ", " + (height + margin.top) + ")")
            .style("text-anchor", "middle")
            .text("Fiscal Year")
            .style("font-size", "14px")

        // Add y axis left label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6 - margin.left)
            .attr("x", 0 - (height/2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Percent Change (%)")
            .style("font-size", "14px");



        // Add chart title
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top/3))
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text("Percent Change of TLNA vs Tuition");



        // Append line chart
        var line = svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", lineColor)
            .attr("stroke-width", 3)
            .attr("d", d3.line()
                .x(function(d) { return xScale(d.Year) + (xScale.bandwidth() / 2); })
                .y(function(d) { return y0(d.PCTLNA); })
            );

        // Append dots to line chart
        svg.selectAll("circle")
            .append("g")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("fill", lineColor)
            .attr("cx", function(d) { return xScale(d.Year) + (xScale.bandwidth() / 2); })
            .attr("cy", function(d) { return y0(d.PCTLNA); })
            .attr("r", 6)
            .on('mouseover', function (d) {
                d3.select(this).style("fill", "LightCoral");
                var div = document.getElementById("percentTextDiv");
                div.innerHTML = "";
                var previousYear = parseInt(d.Year.split('Y').pop()) - 1;
                var percentChange = d.PCTLNA;
                var sign = "+";
                if(percentChange < 0){ sign = "-";}
                div.innerHTML += "Total Liabilities and Net Assets Change from " + "FY" + previousYear + " " + "to " + d.Year + "<br>";
                div.innerHTML += sign + d.PCTLNA + "%";
            })
            .on('mouseout', function (d) {
                d3.select(this).style("fill", "red");
            })


        // Append line chart 2 (Tuition)
        var line2 = svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", lineColor2)
            .attr("stroke-width", 3)
            .attr("d", d3.line()
                .x(function(d) { return xScale(d.Year) + (xScale.bandwidth() / 2); })
                .y(function(d) { return y0(d.PCTF); })
            );

        // Append dots to line chart 2 (tuition)
        svg.selectAll("circle2")
            .append("g")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("fill", lineColor2)
            .attr("cx", function(d) { return xScale(d.Year) + (xScale.bandwidth() / 2); })
            .attr("cy", function(d) { return y0(d.PCTF); })
            .attr("r", 6)
            .on('mouseover', function (d) {
                d3.select(this).style("fill", "#b8b3ff");
                var div = document.getElementById("percentTextDiv");
                div.innerHTML = "";
                var previousYear = parseInt(d.Year.split('Y').pop()) - 1;
                var percentChange = d.PCTF;
                var sign = "+";
                if(percentChange < 0){ sign = "-";}
                div.innerHTML += "Tuition and Fees Change from " + "FY" + previousYear + " " + "to " + d.Year + "<br>";
                div.innerHTML += sign + Math.abs(d.PCTF) + "%";
            })
            .on('mouseout', function (d) {
                d3.select(this).style("fill", "blue");
            })



        // Append x axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function (d) {
                return "rotate(-65)"
            });

        // Append y axis left
        svg.append("g")
            .attr("id", "percentYAxisLeft")
            .attr("class", "yAxis")
            .call(yAxisLeft);

        // CREATE LEGEND //
        var R = 6; // legend marker
        var svgLegend = svg.append('g')
            .attr('class', 'gLegend')
            .attr("transform", "translate(" + (width + 20) + "," + 0 + ")");

        console.log("about to create legend....");

        var legend = svgLegend.selectAll('.legend')
            .data(color.domain())
            .enter().append('g')
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(-200," + i * 20 + ")"});

        console.log("should have created legend");

        legend.append("circle")
            .attr("class", "legend-node")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", R)
            .style("fill", function(d, i){
                return color(i);
            });



        legend.append("text")
            .attr("class", "legend-text")
            .attr("x", R*2)
            .attr("y", R/2)
            .style("fill", "#666666")
            .style("font-size", "14px")
            .text(function(d){
                if(d == 0){
                    return "Total Liabilities and Net Assets";
                } else if(d == 1){
                    return "Tuition and Fees";
                }
            });


    });

})();