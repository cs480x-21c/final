// (function () {
//
//     // Colors
//     var barColor = "#b8b3ff";
//     var barDownColor = "#1100ff";
//     var lineColor = "red";
//
//     // Create a div for the SVG to be placed into
//     var svgDiv = document.createElement("div");
//     svgDiv.classList.add("svgdiv");
//     svgDiv.id = "tuitionDiv";
//
//     // Create a div for the text to go in
//     var textDiv = document.createElement("div");
//     textDiv.classList.add("textbox");
//     textDiv.id = "tuitionTextDiv";
//
//     // Append divs to body
//     document.body.appendChild(svgDiv);
//     document.body.appendChild(textDiv);
//
//     // Define height, width, margins for svg
//     var margin = {top: 50, right: 100, bottom: 50, left: 110},
//         width = 800 - margin.left - margin.right,
//         height = 500 - margin.top - margin.bottom;
//
//     // Define svg
//     var svg = d3.select("#tuitionDiv")
//         .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
//         .attr("class", "svg");
//
//     // Read from csv
//     d3.csv("maincsv.csv", function (error, data) {
//         if (error) {
//             throw error;
//         }
//
//         // x and y scales for axes
//         let x = d3.scaleBand()
//             .padding(0.2)
//             .range([0, width]);
//
//         let y0 = d3.scaleLinear()
//             .range([height, 0]);
//
//         let y1 = d3.scaleLinear()
//             .range([height, 0]);
//
//         var xAxis = d3.axisBottom()
//             .scale(x);
//
//         var yAxisLeft = d3.axisLeft()
//             .scale(y0)
//             .ticks(10);
//
//         var yAxisRight = d3.axisRight()
//             .scale(y1)
//             .ticks(10);
//
//         // Set x and y domain
//         x.domain(data.map(function (d) {
//             return d.Year;
//         }));
//
//         y0.domain([0, d3.max(data, function (d) {
//             return parseInt(d.TF) * 1000;
//         })]);
//
//         y1.domain([3000, d3.max(data, function(d) {
//             return parseInt(d.TS) + 1000;
//         })])
//
//
//         var xScale = d3.scaleBand().range([0, width]).padding(0.4),
//             yScale = d3.scaleLinear().range([height, 0]);
//
//         // x scale
//         xScale.domain(data.map(function (d) {
//             return d.Year;
//         }))
//             .range([0, width]);
//
//         // y scale
//         yScale.domain([0, d3.max(data, function (d) {
//             return d.TF;
//         })]);
//
//
//         /*
//         // Filter data to show just men and women of all races
//         var allRacesData = data.filter(function (row) {
//             if (row.sex != "Both Sexes"
//                 && row.race == "All Races"
//                 && row.age == "16 years and over"
//                 && row.ethnic_origin == "All Origins") {
//                 return true;
//             }
//
//         });
//
//
//         // Group data by sex
//         var groupData = d3.nest()
//             .key(function (d) {
//                 return d.Sex;
//             })
//             .entries(allRacesData);
//          */
//
//
//
//
//         // Draw bar chart
//         var bar = svg.selectAll(".bar")
//             .data(data)
//             .enter().append("rect")
//             .attr("class", "bar")
//             .attr("x", function (d) {
//                 return xScale(d.Year);
//             })
//             .attr("y", function (d) {
//                 return yScale(d.TF);
//             })
//             .attr("width", xScale.bandwidth())
//             .style("fill", barColor)
//             .attr('id', function (d) {
//                 return d.Year;
//
//             })
//             .attr("height", function (d) {
//                 return height - yScale(d.TF);
//             })
//             .on('mouseover', function (d) {
//                 d3.select(this).style("fill", barDownColor);
//                 var div = document.getElementById("tuitionTextDiv");
//                 div.innerHTML = hoverData(d);
//             })
//             .on('mouseout', function (d) {
//                 d3.select(this).style("fill", barColor);
//                 var div = document.getElementById("tuitionTextDiv");
//                 //div.innerHTML = "";
//             })
//
//         // Add x axis label
//         svg.append("text")
//             .attr("transform", "translate(" + (width/2) + ", " + (height + margin.top) + ")")
//             .style("text-anchor", "middle")
//             .text("Fiscal Year")
//             .style("font-size", "14px")
//
//         // Add y axis left label
//         svg.append("text")
//             .attr("transform", "rotate(-90)")
//             .attr("y", 6 - margin.left)
//             .attr("x", 0 - (height/2))
//             .attr("dy", "1em")
//             .style("text-anchor", "middle")
//             .text("Tuition And Fees")
//             .style("font-size", "14px");
//
//         // Add y axis right label
//         svg.append("text")
//             .attr("transform", "rotate(-90)")
//             .attr("y", width + margin.right/2)
//             .attr("x", 0 - (height/2))
//             .attr("dy", "1em")
//             .style("text-anchor", "middle")
//             .text("Total Students Enrolled")
//             .style("font-size", "14px");
//
//
//         // Add chart title
//         svg.append("text")
//             .attr("x", (width / 2))
//             .attr("y", 0 - (margin.top/3))
//             .attr("text-anchor", "middle")
//             .style("font-size", "20px")
//             .style("font-weight", "bold")
//             .text("Tuition And Fees, Total Students Enrolled vs Year");
//
//
//
//         // Append line chart
//         var line = svg.append("path")
//             .datum(data)
//             .attr("fill", "none")
//             .attr("stroke", lineColor)
//             .attr("stroke-width", 3)
//             .attr("d", d3.line()
//                 .x(function(d) { return xScale(d.Year) + (xScale.bandwidth() / 2); })
//                 .y(function(d) { return y1(d.TS); })
//             );
//
//         // Append dots to line chart
//         svg.selectAll("circle")
//             .append("g")
//             .data(data)
//             .enter()
//             .append("circle")
//             .attr("class", "dot")
//             .attr("fill", lineColor)
//             .attr("cx", function(d) { return xScale(d.Year) + (xScale.bandwidth() / 2); })
//             .attr("cy", function(d) { return y1(d.TS); })
//             .attr("r", 4);
//
//
//
//         // Append x axis
//         svg.append("g")
//             .attr("class", "x axis")
//             .attr("transform", "translate(0," + height + ")")
//             .call(xAxis)
//             .selectAll("text")
//             .style("text-anchor", "end")
//             .attr("dx", "-.8em")
//             .attr("dy", ".15em")
//             .attr("transform", function (d) {
//                 return "rotate(-65)"
//             });
//
//         // Append y axis left
//         svg.append("g")
//             .attr("id", "tuitionYAxisLeft")
//             .attr("class", "yAxis")
//             .call(yAxisLeft);
//
//         // Append y axis right
//         svg.append("g")
//             .attr("id", "tuitionYAxisRight")
//             .attr("class", "yAxis")
//             .call(yAxisRight)
//             .attr("transform", "translate(" + width + ", 0)");
//
//     });
//
//     /*
//     //==================================================================================
//         // Begin line chart
//
//         // Format
//         data.forEach(function (d) {
//             d.Sex = d['sex'];
//             d.Race = d['race'];
//             d.Year = d['year'];
//             d.WeeklyEarnings = d['median_weekly_earn'];
//         });
//
//         // Convert quarters into fractions of year
//         data.forEach(function (d) {
//             // console.log("year before: " + d.year + " adding: " + (d.quarter/4 - 0.25));
//             d.year = parseInt(d.year) + d.quarter / 4 - 0.25;
//             // console.log("year in conversion: " + d.year);
//         });
//
//         // Filter data to show just men and women of all races
//         var allRacesData = data.filter(function (row) {
//             if (row.sex != "Both Sexes"
//                 && row.race == "All Races"
//                 && row.age == "16 years and over"
//                 && row.ethnic_origin == "All Origins") {
//                 return true;
//             }
//
//         });
//
//
//         // Group data by sex
//         var groupData = d3.nest()
//             .key(function (d) {
//                 return d.Sex;
//             })
//             .entries(allRacesData);
//
//
//         // Add x axis
//         var x = d3.scaleLinear()
//             .domain([2010, 2021])
//             .range([0, width])
//         svg.append("g")
//             .attr("transform", "translate(0," + height + ")")
//             .call(d3.axisBottom(x).ticks(11).tickFormat(d3.format("d")))
//             .attr("class", "xaxis");
//
//         // Add x axis label
//         svg.append("text")
//             .attr("transform", "translate(" + (width/2) + ", " + (height + margins.top - 10) + ")")
//             .style("text-anchor", "middle")
//             .text("Year")
//             .style("font", "14px arial")
//
//
//
//         // Add y axis
//         var y = d3.scaleLinear()
//             .domain([600,
//                 1200])
//             .range([height, 0]);
//         svg.append("g")
//             .call(d3.axisLeft(y));
//
//         // Add y axis label
//         svg.append("text")
//             .attr("transform", "rotate(-90)")
//             .attr("y", 6 - margins.left)
//             .attr("x", 0 - (height/2))
//             .attr("dy", "1em")
//             .style("text-anchor", "middle")
//             .text("Median Weekly Earnings")
//             .style("font", "14px arial");
//
//
//
//         // Add chart title
//         svg.append("text")
//             .attr("x", (width / 2))
//             .attr("y", 0 - (margins.top/3))
//             .attr("text-anchor", "middle")
//             .style("font-size", "20px")
//             .style("font-weight", "bold")
//             .text("Median Weekly Earnings Per Year");
//
//         // Add tooltip
//         svg.append("text")
//             .attr("x", (width/2))
//             .attr("y", (height + 100))
//             .attr("text-anchor", "middle")
//             .attr("font-size", "14px")
//             .text("Click on the year values on the x axis for more data");
//
//
//
//         // color palette
//         var res = groupData.map(function (d) {
//             return d.key
//         }) // list of group names
//         var color = d3.scaleOrdinal()
//             .domain(res)
//             .range(['#e41a1c', '#377eb8'])
//
//         var yearPositions = [];
//
//         // Draw lines
//         svg.selectAll(".line")
//             .data(groupData)
//             .enter()
//             .append("path")
//             //.filter(function(d) { return d.Race == "All Races"})
//             .attr("fill", "none")
//             .attr("stroke", function (d) {
//                 return color(d.key)
//             })
//             .attr("stroke-width", 2)
//             .attr("d", function (d) {
//                 return d3.line()
//                     .x(function (d) {
//                         // Log the x values at the start of each year for only men so you don't double count it
//                         if(d.quarter == 1 && d.sex == "Men") {
//                             yearPositions.push(x(d.year));
//                         }
//                         return x(d.year);
//                     })
//                     .y(function (d) {
//                         return y(d.WeeklyEarnings);
//                     })
//                     (d.values)
//             });
//      */
//
// })();