(function (){

    var textDiv1 = document.createElement("div");
    textDiv1.classList.add("textbox");
    textDiv1.id = "Intro";

   textDiv1.innerHTML = "WPI students pay thousands of dollars in tuition yearly but where does all that money go? We use data visualizations of WPI's University Audited Financial Statements to visually compare and contrast differences in where WPI gets it's money, and how it spends it.";


    var svgDiv = document.createElement("div");
    svgDiv.classList.add("svgdiv");
    svgDiv.id = "TLNAvsYearDiv";

    // Create a div for the text to go in
    var textDiv = document.createElement("div");
    textDiv.classList.add("textbox");
    textDiv.id = "TLNAvsYearTextDiv";

    // Append divs to body
    document.body.appendChild(textDiv1);
    document.body.appendChild(svgDiv);
    document.body.appendChild(textDiv);




    var margin = { top: 20, right: 20, bottom: 80, left: 100 },
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var xScale = d3.scaleBand().range([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range([height, 0]);


    var svg = d3.select("#TLNAvsYearDiv")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    d3.csv("maincsv.csv", function (error, data) {
        if (error) {
            throw error;
        }

        // x and y scales for axes
        let x = d3.scaleBand()
            .padding(0.2)
            .range([0, width]);

        let y = d3.scaleLinear()
            .range([height, 0]);


        var xAxis = d3.axisBottom()
            .scale(x);

        var yAxisLeft = d3.axisLeft()
            .scale(y)
            .ticks(10);


        var heightScale = 1.05;

        x.domain(data.map(function(d) { return d.Year; }));
        y.domain([0, d3.max(data, function (d) {
            return (parseInt(d.TLNA) * 1000)*heightScale;
        })]);


        xScale.domain(data.map(function (d) {
            return d.Year;
        }));
        yScale.domain([0, d3.max(data, function (d) {
            return d.TLNA * heightScale;
        })]);

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return xScale(d.Year);
            })
            .attr("y", function (d) {
                return yScale(d.TLNA);
            })
            .attr("width", xScale.bandwidth())
            .style("fill", "#b8b3ff")
            .attr('id', function (d) {
                return d.Year;

            })
            .attr("height", function (d) {
                return height - yScale(d.TLNA);
            })
            .on('mouseover', function (d) {
                d3.select(this).style("fill", "#1100ff");
                var div = document.getElementById("TLNAvsYearTextDiv");
                div.innerHTML = "";
                div.innerHTML += d.Year + "<br>";
                div.innerHTML += "Total liabilities and net assets: $" + d.TLNA.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "<br>";
            })
            .on('mouseout', function (d) {
                d3.select(this).style("fill", "#b8b3ff");

            })







        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6 - margin.left)
            .attr("x", 0 - (height/2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Total Liabilities and Net Assets (dollars)")
            .style("font-size", "14px");

        svg.append("text")
            .attr("transform", "translate(" + (width/2) + ", " + (height + margin.top * 2.5) + ")")
            .style("text-anchor", "middle")
            .text("Fiscal Year")
            .style("font-size", "14px")

        svg.append("g")
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

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxisLeft)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("TLNA");
    });
})();
