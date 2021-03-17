function treemap(year, dir){

var svg = d3.select("#treemap")

color = d3.scaleSequential([8, 0], d3.interpolateMagma)
var width = 1260,
    height = 1060;

var nest = d3.nest()
    .key(function(d) { return d.first; })
    .key(function(d) { return d.second; })
    .key(function(d) { return d.third; })
    .key(function(d) { return d.fourth; })
    .rollup(function(d) { return d3.sum(d, function(d) { return d.TradeValue_in_1000_USD; }); 
  });

 


    // .append("svg")
    // .attr("width", width)
    // .attr("height", height)
    // .append("g")

d3.csv("https://gist.githubusercontent.com/FelChen/fa8e7c2148e000daf2fd5edb12b43ff6/raw/1d462ac7521a8ae3e7f19007973a5fde8bea2a47/cleanish.csv", function(error, data) {
  if (error) throw error;

  //console.log(year)
var lel = data
// console.log(lel);
  var filtered = lel.filter(function(d) {return d.Year==year});
  filtered = filtered.filter(function(d) {return d.TradeFlowName==dir});

// console.log(filtered);
  var root = d3.hierarchy({values: nest.entries(filtered)}, function(d) { return d.values; })
      .sum(function(d) { return d.value; })
      .sort(function(a, b) { return b.value - a.value; });

 var treemap = d3.treemap()
    .size([width, height])
    .padding(1)
    .round(true);
   var testing = treemap(root);


var div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);


d3.select("#treemap").node()
//console.log(d3.select("#treemap").node())

  var node = d3.select("#kek")
    .selectAll(".node")
    .data(testing.leaves())
    .enter().append("div")
      .attr("class", "node")
      .style("left", function(d) { return d.x0 + "px"; })
      .style("top", function(d) { return d.y0 + "px"; })
      .style("width", function(d) { return d.x1 - d.x0 + "px"; })
      .style("height", function(d) { return d.y1 - d.y0 + "px"; })
      .style("fill", function(d) { return "#1f77b4";})
      .on("mouseover", hovered(true))
      .on("mouseout", hovered(false))
              .on("mouseover", function(d) {    

            div.transition()    
                .duration(200)    
                .style("opacity", .9);    
            div .html(d.data.key + "<br/>"  + "Trade Value in 1000 USD: $" + d.data.value)  
                .style("left", ((d.x1 + d.x0)/2) + "px")   
                .style("top", (d.y0+100) + "px");  
            })          
        .on("mouseout", function(d) {   
            div.transition()    
                .duration(500)    
                .style("opacity", 0); 
        });
var bod = d3.select("#kek")
//console.log(bod)
//console.log(node)
  node.append("div")
      .attr("class", "node-label")
      .text(function(d) { 
        // console.log(d)
        return d.data.key; });

  // node.append("div")
  //     .attr("class", "node-value")
  //     .text(function(d) { return d.parent.parent.parent.data.key + "\n" + d.parent.parent.data.key + "\n" + d.parent.data.key + "\n" + d.data.key; });
 

// return testing;

});
}


 function hovered(hover) {
  return function(d) {
    //console.log(d.value)
    // this.append("g")
        

  };
}
