function main(){
    let selector = "2019";


    let submitSelect = document.getElementById("select");
    submitSelect.addEventListener("change", function(d){
        selector = (submitSelect.options[submitSelect.selectedIndex].text);
        console.log(selector);
        createTreeMap(selector);
        createPieChart(selector);
    })


    createTreeMap(selector);
    createPieChart(selector);
    animatedLineGraph();

    function createPieChart(selector){
        d3.select("#svgPie").remove();

        let margin = {top: 100, right: 100, bottom: 10, left: 100},
            width = 945 - margin.left - margin.right,
            height = 445 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        let svg = d3.select("#piechart")
            .append("svg").attr("id", "svgPie")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        let data;
        //Only showing top 4 military powerhouses
         if(selector === "2017"){
             data =  [{country: "USA", value: 646.7},{country: "CHINA", value: 228.4},{country: "INDIA", value: 64.5},{country: "RUSSIA", value: 66.5}]
         }
         if(selector === "2018"){
             data =  [{country: "USA", value: 682.4},{country: "CHINA", value: 253.4},{country: "INDIA", value: 66.2},{country: "RUSSIA", value: 61.3}]

         }if(selector === "2019"){
            data =  [{country: "USA", value: 732},{country: "CHINA", value: 261},{country: "INDIA", value: 71.1},{country: "RUSSIA", value: 65.1}]
         }

        console.log(data);

        // Creating Pie generator
        let pie = d3.pie()
            .value(function(d) { return d.value;});

        // Creating arc
        let radius = 200;
        let arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius - 10);

        let g = svg.append("g")
            .attr("transform", "translate(150,120)");

        // Grouping different arcs
        let arcs = g.selectAll("arc")
            .data(pie(data))
            .enter()
            .append("g");

        // Appending path
        arcs.append("path")
            .attr("fill", (data)=> {
                let value = data.data.country;
                return setColorPie(value)
            })
            .attr("stroke", "black")
            .attr("d", arc);

        // Adding data to each arc

        arcs.append("text")
            .attr("transform",(d)=>{
                let _d = arc.centroid(d);
                _d[0] *= 2.3;	//multiply by a constant factor
                _d[1] *= 2.3;	//multiply by a constant factor
                return "translate(" + _d + ")";
            })
            .attr("dy", ".50em")
            .style("text-anchor", "middle")
            .text(function(d){
                return d.data.country;
            });

    }


    function createTreeMap(selector){

        d3.select("#svgTreemap").remove();

        let margin = {top: 10, right: 10, bottom: 10, left: 10},
            width = 845 - margin.left - margin.right,
            height = 845 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        let svg = d3.select("#treemap")
            .append("svg").attr("id", "svgTreemap")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        let data;
        if(selector === "2017"){
            data = "csv/totalspending2017.js"
        }
        if(selector === "2018"){
            data = "csv/totalspending2018.js"

        }if(selector === "2019"){
            data = "csv/totalspending2019.js"
        }

            // stratify the data: reformatting for d3.js
            let root = d3.stratify()
                .id(function(d) { return d.country; })   // Name of the entity (column name is name in csv)
                .parentId(function(d) { return d.parent; })   // Name of the parent (column name is parent in csv)
                (data);
            root.sum(function(d) { return +d.spending})   // Compute the numeric value for each entity

            // Then d3.treemap computes the position of each element of the hierarchy
            // The coordinates are added to the root object above
            d3.treemap()
                .size([width, height])
                .padding(2)
                (root)

            console.log(root.leaves())
            // use this information to add rectangles:
            svg
                .selectAll("rect")
                .data(root.leaves())
                .enter()
                .append("rect")
                .attr('x', function (d) { return d.x0; })
                .attr('y', function (d) { return d.y0; })
                .attr('width', function (d) { return d.x1 - d.x0; })
                .attr('height', function (d) { return d.y1 - d.y0; })
                .style("stroke", "black")
                .style("fill", function(d){ return setColor(d.data.country)});

            // and to add the text labels
            svg
                .selectAll("text")
                .data(root.leaves())
                .enter()
                .append("text")
                .attr("x", function(d){ return d.x0 + 1})    // +10 to adjust position (more right)
                .attr("y", function(d){ return d.y0 + 20})    // +20 to adjust position (lower)
                .text(function(d){ return d.data.country + " " + d.data.spending})
                .attr("font-size", "10px")
                .attr("fill", "black")

    }

    function animatedLineGraph(){

         let resetButton = document.getElementById("resetbutton");
         resetButton.addEventListener("click", function(){
             d3.select("#svgLine").remove();
             animatedLineGraph();
         })

        let data = [
            {
                year: 2000,
                value: 320
            },
            {
                year: 2001,
                value: 331.8
            },
            {
                year: 2002,
                value: 378.4
            },
            {
                year: 2003,
                value: 440.5
            },
            {
                year: 2004,
                value: 492.9
            },
            {
                year: 2005,
                value: 533.2
            },
            {
                year: 2006,
                value: 558.3
            },
            {
                year: 2007,
                value: 589.5
            },
            {
                year: 2008,
                value: 656.7
            },
            {
                year: 2009,
                value: 705.9
            },
            {
                year: 2010,
                value: 738
            },
            {
                year: 2011,
                value: 752.2
            },
            {
                year: 2012,
                value: 725.5
            },
            {
                year: 2013,
                value: 679.2
            },
            {
                year: 2014,
                value: 647.7
            },
            {
                year: 2015,
                value: 633.8
            },
            {
                year: 2016,
                value: 639.8
            },
            {
                year: 2017,
                value: 646.7
            },
            {
                year: 2018,
                value: 682.4
            },
            {
                year: 2019,
                value: 732
            }
        ]

        const svg = d3
            .select("#linegraph")
            .append("svg")
            .attr("height", 300)
            .attr("id", "svgLine")
            .attr("width", 600);
        const margin = { top: 0, bottom: 20, left: 30, right: 20 };
        const chart = svg.append("g").attr("transform", `translate(${margin.left},0)`);
        const width = +svg.attr("width") - margin.left - margin.right;
        const height = +svg.attr("height") - margin.top - margin.bottom;
        const grp = chart
            .append("g")
            .attr("transform", `translate(-${margin.left},-${margin.top})`);

        const yScale = d3
            .scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(data, dataPoint => dataPoint.value) + 100]);
        const xScale = d3
            .scaleBand()
            .range([0, width])
            .domain([2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019]);

        const line = d3
            .line()
            .x(dataPoint => xScale(dataPoint.year))
            .y(dataPoint => yScale(dataPoint.value));

        // Add path
        const path = grp
            .append("path")
            .attr("transform", `translate(${margin.left},0)`)
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#8edb95")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 2.5)
            .attr("d", line);

        const pathLength = path.node().getTotalLength();
    // D3 provides lots of transition options, have a play around here:
    // https://github.com/d3/d3-transition
        const transitionPath = d3
            .transition()
            .ease(d3.easeSin)
            .duration(2500);

        path
            .attr("stroke-dashoffset", pathLength)
            .attr("stroke-dasharray", pathLength)
            .transition(transitionPath)
            .attr("stroke-dashoffset", 0);

        // Add the X Axis
        chart
            .append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale).ticks(data.length));
        // Add the Y Axis
        chart
            .append("g")
            .attr("transform", `translate(0, 0)`)
            .call(d3.axisLeft(yScale));

    }


    function setColor(country){
        switch(country) {
            case "USA":
                return "#078553";
                break;
            default:
                return "#8edb95"
        }

    }

    function setColorPie(key){
        switch(key) {
            case "USA":
                return "#078553";
                break;
            default:
                return "#8edb95"
        }
    }

    let ml_margin = {top: 10, right: 30, bottom: 60, left: 70},
        ml_width = 1000 - ml_margin.left - ml_margin.right,
        ml_height = 520 - ml_margin.top - ml_margin.bottom;

    // Append SVG
    let ml_svg = d3.select("#military_line_vis")
        .append("svg")
        .attr("width", ml_width + ml_margin.left + ml_margin.right)
        .attr("height", ml_height + ml_margin.top + ml_margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + ml_margin.left + "," + ml_margin.top + ")");

    // X axis
    let ml_x = d3.scaleBand()
        .domain([2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021])
        .range([0, ml_width])
        .paddingInner(0.1);
    ml_svg.append("g")
        .attr("transform", "translate(0," + ml_height + ")")
        .call(d3.axisBottom(ml_x).tickValues([2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021]).tickFormat(d3.format("d")));
    ml_svg.append("text")
        .attr("x", ml_width/2)
        .attr("y", ml_height + ml_margin.bottom)
        .style("text-anchor", "middle")
        .attr("class", "label")
        .text("Years")

    // Y axis
    let ml_y = d3.scaleLinear()
        .domain([300, 1100])
        .range([ ml_height, 0 ]);
    ml_svg.append("g")
        .call(d3.axisLeft(ml_y));
    ml_svg.append("text")
        .attr("y", 0 - ml_margin.left)
        .attr("x",0 - (ml_height / 2))
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("class", "label")
        .style("text-anchor", "middle")
        .text("Total Military Spending in Billions (USD)")

    // Bars
    ml_svg.selectAll("bar")
        .data(militaryData)
        .enter()
        .append("rect")
        .attr("x", function (d) { return ml_x(d.year) })
        .attr("y", function (d) { return ml_y(d.budget) })
        .attr("width", ml_x.bandwidth())
        .attr("height", function(d) { return ml_height - ml_y(d.budget) })
        .style("padding", "5px")
        .style("fill", "#6EAF73")
        .on("mouseover", function(d, i) {
            d3.select(this)
                .style("fill", "#93BEDF");
            ml_svg.append("text")
                .attr("x", ml_x(i.year))
                .attr("y", 490)
                .attr("class", "hoverLabel")
                .style("font-size", "14px")
                .style("font-weight", "bold")
                .style("fill", function(d) {
                    if (document.getElementById("body").className === "dark") return "#F9F9F9"
                    else return "#373E40"
                })
                .text("$" + i.budget + " B");
        })
        .on("mouseout", function() {
            d3.select(this)
                .style("fill", "#6EAF73");
            ml_svg.selectAll(".hoverLabel")
                .remove()
        })

    // 2003 text
    ml_svg.append("text")
        .attr("x", 53)
        .attr("y", 20)
        .attr("class", "label")
        .text("Start of")
    ml_svg.append("text")
        .attr("x", 50)
        .attr("y", 40)
        .attr("class", "label")
        .text("Iraq War")
    ml_svg.append("text")
        .attr("x", 53)
        .attr("y", 60)
        .attr("class", "label")
        .text("(2003)")
    ml_svg.append('line')
        .attr('x1', 75)
        .attr('y1', 70)
        .attr('x2', 75)
        .attr('y2', 200)
    ml_svg.append('line')
        .attr('x1', 75)
        .attr('y1', 199.5)
        .attr('x2', 19.5)
        .attr('y2', 199.5)
    ml_svg.append('line')
        .attr('x1', 20)
        .attr('y1', 199.5)
        .attr('x2', 20)
        .attr('y2', 373)

    // 2006 text
    ml_svg.append("text")
        .attr("x", 170)
        .attr("y", 20)
        .attr("class", "label")
        .text("Costs rise")
    ml_svg.append("text")
        .attr("x", 180)
        .attr("y", 40)
        .attr("class", "label")
        .text("in Iraq")
    ml_svg.append("text")
        .attr("x", 180)
        .attr("y", 60)
        .attr("class", "label")
        .text("(2006)")
    ml_svg.append('line')
        .attr('x1', 200)
        .attr('y1', 70)
        .attr('x2', 200)
        .attr('y2', 150)
    ml_svg.append('line')
        .attr('x1', 200)
        .attr('y1', 149.5)
        .attr('x2', 160)
        .attr('y2', 149.5)
    ml_svg.append('line')
        .attr('x1', 160.5)
        .attr('y1', 150)
        .attr('x2', 160.5)
        .attr('y2', 256.5)

    // 2011 text
    ml_svg.append("text")
        .attr("x", 295)
        .attr("y", 40)
        .attr("class", "label")
        .text("Iraq War ends")
    ml_svg.append("text")
        .attr("x", 317)
        .attr("y", 60)
        .attr("class", "label")
        .text("(2011)")
    ml_svg.append('line')
        .attr('x1', 335)
        .attr('y1', 70)
        .attr('x2', 335)
        .attr('y2', 110)
    ml_svg.append('line')
        .attr('x1', 335)
        .attr('y1', 110)
        .attr('x2', 400)
        .attr('y2', 110)
    ml_svg.append('line')
        .attr('x1', 400)
        .attr('y1', 110)
        .attr('x2', 400)
        .attr('y2', 140)

    // 2012 text
    ml_svg.append("text")
        .attr("x", 455)
        .attr("y", 20)
        .attr("class", "label")
        .text("Troop withdrawal in")
    ml_svg.append("text")
        .attr("x", 465)
        .attr("y", 40)
        .attr("class", "label")
        .text("Afghanistan War")
    ml_svg.append("text")
        .attr("x", 495)
        .attr("y", 60)
        .attr("class", "label")
        .text("(2012)")
    ml_svg.append('line')
        .attr('x1', 515)
        .attr('y1', 70)
        .attr('x2', 515)
        .attr('y2', 130)
    ml_svg.append('line')
        .attr('x1', 515)
        .attr('y1', 130)
        .attr('x2', 450)
        .attr('y2', 130)
    ml_svg.append('line')
        .attr('x1', 450)
        .attr('y1', 130)
        .attr('x2', 450)
        .attr('y2', 160)

    // 2016 text
    ml_svg.append("text")
        .attr("x", 635)
        .attr("y", 20)
        .attr("class", "label")
        .text("Resurgence")
    ml_svg.append("text")
        .attr("x", 646)
        .attr("y", 40)
        .attr("class", "label")
        .text("of ISIS")
    ml_svg.append("text")
        .attr("x", 647)
        .attr("y", 60)
        .attr("class", "label")
        .text("(2016)")
    ml_svg.append('line')
        .attr('x1', 665)
        .attr('y1', 70)
        .attr('x2', 665)
        .attr('y2', 120)
    ml_svg.append('line')
        .attr('x1', 665)
        .attr('y1', 120)
        .attr('x2', 640)
        .attr('y2', 120)
    ml_svg.append('line')
        .attr('x1', 640)
        .attr('y1', 120)
        .attr('x2', 640)
        .attr('y2', 188)

    // 2018 text
    ml_svg.append("text")
        .attr("x", 775)
        .attr("y", 20)
        .attr("class", "label")
        .text("Trump requests")
    ml_svg.append("text")
        .attr("x", 765)
        .attr("y", 40)
        .attr("class", "label")
        .text("a spending increase")
    ml_svg.append("text")
        .attr("x", 800)
        .attr("y", 60)
        .attr("class", "label")
        .text("(2018)")
    ml_svg.append('line')
        .attr('x1', 820)
        .attr('y1', 70)
        .attr('x2', 820)
        .attr('y2', 80)
    ml_svg.append('line')
        .attr('x1', 820)
        .attr('y1', 80)
        .attr('x2', 735)
        .attr('y2', 80)
    ml_svg.append('line')
        .attr('x1', 735)
        .attr('y1', 80)
        .attr('x2', 735)
        .attr('y2', 120)



    /*** Social Bar Graph ***/
    let margin = {top: 10, right: 30, bottom: 60, left: 70},
        width = 1000 - margin.left - margin.right,
        height = 520 - margin.top - margin.bottom;


    // Append SVG
    let social_svg = d3.select("#social_vis")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    //x axis
    let social_x = d3.scaleBand()
        .domain([2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019])
        .range([0, width])
        .paddingInner(0.1);
    social_svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(social_x).tickValues([2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019]).tickFormat(d3.format("d")));

    social_svg.append("text")
        .attr("x", width/2)
        .attr("y", height + margin.bottom)
        .style("text-anchor", "middle")
        .attr("class", "label")
        .text("Years")

    // y axis
    let social_y = d3.scaleLinear()
        .domain([0, 6])
        .range([height, 0])
    social_svg.append("g")
        .call(d3.axisLeft(social_y).tickFormat(function(d) { return d; })
            .tickSize(3))
        .style("stroke-width", "1.5px")

    social_svg.append("text")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("class", "label")
        .style("text-anchor", "middle")
        .text("Total Social Spending in Trillions (USD)")

    social_svg.selectAll("bar")
        .data(socialData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .style("fill", "#93BEDF")
        .attr("x", function(d) { return social_x(d.year); })
        .attr("width", social_x.bandwidth())
        .attr("y", function(d) { return social_y(d.trillion); })
        .attr("height", function(d) { return height - social_y(d.trillion); })
        .on("mouseover", function(d, i) {
            d3.select(this)
                .style("fill", "#6EAF73");
            social_svg.append("text")
                .attr("x", social_x(i.year))
                .attr("y", 490)
                .attr("class", "hoverLabel")
                .style("fill", function(d) {
                    if (document.getElementById("body").className === "dark") return "#F9F9F9"
                    else return "#373E40"
                })
                .style("font-size", "14px")
                .style("font-weight", "bold")
                .text("$" + i.trillion + " T");
        })
        .on("mouseout", function() {
            d3.select(this)
                .style("fill", "#93BEDF");
            social_svg.selectAll(".hoverLabel")
                .remove()
        })

    // 2008 text
    social_svg.append("text")
        .attr("x", 220)
        .attr("y", 40)
        .attr("class", "label")
        .text("Stock Market Crash")
    social_svg.append("text")
        .attr("x", 270)
        .attr("y", 60)
        .attr("class", "label")
        .text("(2008)")
    social_svg.append('line')
        .attr('x1', 290)
        .attr('y1', 70)
        .attr('x2', 290)
        .attr('y2', 271)

    // fiscal cliff text
    social_svg.append("text")
        .attr("x", 470)
        .attr("y", 40)
        .attr("class", "label")
        .text("Fiscal Cliff")
    social_svg.append("text")
        .attr("x", 485)
        .attr("y", 60)
        .attr("class", "label")
        .text("(2012)")
    social_svg.append('line')
        .attr('x1', 505)
        .attr('y1', 70)
        .attr('x2', 505)
        .attr('y2', 227)

    // trade war text
    social_svg.append("text")
        .attr("x", 760)
        .attr("y", 40)
        .attr("class", "label")
        .text("Trade War Begins")
    social_svg.append("text")
        .attr("x", 800)
        .attr("y", 60)
        .attr("class", "label")
        .text("(2018)")
    social_svg.append('line')
        .attr('x1', 822)
        .attr('y1', 70)
        .attr('x2', 822)
        .attr('y2', 170)
    // })

    /*** Light / Dark Slider ***/
    let slider = document.getElementById("sliderId")
    let body = document.getElementById("body")

    slider.addEventListener('change', function() {
        if (slider.checked) {
            body.className = "dark"
            d3.selectAll(".label").style("fill", "#F9F9F9").style("transition", "1s")
            d3.selectAll("line").style("stroke", "#F9F9F9").style("transition", "1s")
        } else {
            body.className = "light"
            d3.selectAll(".label").style("fill", "#373E40").style("transition", "1s")
            d3.selectAll("line").style("stroke", "#373E40").style("transition", "1s")
        }
    })

}
