var link;

function makeSankey(data) {
  console.log("Sankey Start");

  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight * (0.5);
  var marginS = {
      top: 10,
      right: 250,
      bottom: 10,
      left: 175
    },
    widthS = windowWidth - marginS.left - marginS.right,
    heightS = windowHeight - marginS.top - marginS.bottom;

  var formatNumber = d3.format(",.0f"), // zero decimal places
    format = function(d) {
      return formatNumber(d);
    };


  //  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var svgSankey = d3.select("#my_dataviz").append("svg")
    .attr("width", widthS + marginS.left + marginS.right)
    .attr("height", heightS + marginS.top + marginS.bottom)
    .append("g")
    .attr("transform",
      "translate(" + 0 + "," + marginS.top + ")");

  var defs = svgSankey.append("defs");
  defs.append("pattern")
    .attr("id", "bg");
    // .attr('patternUnits', 'userSpaceOnUse')
    // .attr('width', 860)
    // .attr('height', 400)
    // .append("svg:image")
    // .attr("xlink:href", "img/space.jpg")
    // .attr("width", 860)
    // .attr("height", 400);


  var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([widthS, heightS])
    .nodeAlign(d3.sankeyJustify);
  var path = sankey.links();
  var graph;
  var links = svgSankey.append("g");
  var nodes = svgSankey.append("g");
  processCSV(data);

  function processCSV(data) {

    sankeydata = {
      "nodes": [],
      "links": []
    };

    data.forEach(function(d) {
      //  console.log(d);
      sankeydata.nodes.push({
        "name": d.source
      });
      sankeydata.nodes.push({
        "name": d.target
      });
      sankeydata.links.push({
        "source": d.source,
        "target": d.target,
        "value": +d.value,
        "color": d.color
      });
    });

    sankeydata.nodes = Array.from(
      d3.group(sankeydata.nodes, d => d.name),
      ([value]) => (value)
    );

    sankeydata.links.forEach(function(d, i) {
      sankeydata.links[i].source = sankeydata.nodes
        .indexOf(sankeydata.links[i].source);
      sankeydata.links[i].target = sankeydata.nodes
        .indexOf(sankeydata.links[i].target);
    });

    sankeydata.nodes.forEach(function(d, i) {
      sankeydata.nodes[i] = {
        "name": d
      };
    });
    graph = sankey(sankeydata);
    console.log(graph);
    build();
  }

  //});
  function build() {

    const color = d3.scaleOrdinal()
      .domain([
        'Male', 'Female', 'Bachelors',
        'Coast Guard', 'Air Force', 'Army',
        'Graduate', 'Marine Corps', 'Navy',
        'Space Walk', 'Active', 'Deceased',
        'Management', 'Space Flight', 'Retired'
      ])
      .range([
        '#90eb9d', '#f9d057', '#cc4040',
        '#B86125', '#3eb0f7', '#4b5320',
        '#f29e2e', '#a77C29', '#000048',
        '#175873', 'green', '#8b0000',
        '#f2952e', '#F04A00', 'grey'
      ]);

    link = links.selectAll(".link")
      .data(graph.links)
      .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", function(d) {
        return d.width + 5;
      });


    // add the link titles
    link.append("title")
      .text(function(d) {
        return d.source.name + " → " +
          d.target.name + "\n" + format(d.value);
      });


    var node = nodes.selectAll(".node")
      .data(graph.nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(
        d3
        .drag()
        .subject(function(d) {
          return d;
        })
        .on("start", function() {
          this.parentNode.appendChild(this);
        })
        .on("drag", dragmove)
      );

    node.append("rect")
      .attr("x", function(d) {
        return d.x0;
      })
      .attr("y", function(d) {
        return d.y0;
      })
      .attr("height", function(d) {
        return d.y1 - d.y0;
      })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) {
        return d.color = color(d.name);
      })
      //.attr("fill", "url(#bg)")
      .style("stroke", function(d) {
        return d3.rgb(d.color).darker(2);
      })
      .append("title")
      .text(function(d) {
        return d.name;
      });

    // add in the title for the nodes
    node.append("text")
      .attr("x", function(d) {
        return d.x0 - 6;
      })
      .attr("y", function(d) {
        return (d.y1 + d.y0) / 2;
      })
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text(function(d) {
        return d.name;
      })
      .attr("font-weight", 700)
      .filter(function(d) {
        return d.x0 < widthS / 2;
      })
      .attr("x", function(d) {
        return d.x1 + 6;
      })
      .attr("text-anchor", "start");

    //https://bl.ocks.org/micahstubbs/3c0cb0c0de021e0d9653032784c035e9
    // add gradient to links
    link.style('stroke', (d, i) => {
      const gradientID = `gradient${i}`;

      const startColor = d.source.color;
      const stopColor = d.target.color;

      const linearGradient = defs.append('linearGradient')
        .attr('id', gradientID);

      linearGradient.selectAll('stop')
        .data([{
            offset: '10%',
            color: startColor
          },
          {
            offset: '90%',
            color: stopColor
          }
        ])
        .enter().append('stop')
        .attr('offset', d => {
          // console.log('d.offset', d.offset);
          return d.offset;
        })
        .attr('stop-color', d => {
          // console.log('d.color', d.color);
          return d.color;
        });

      return `url(#${gradientID})`;
    });

    function dragmove(d) {
      d3.select(this)
        .select("rect")
        .attr("y", function(n) {
          //  console.log(n);
          n.y0 = Math.max(0, Math.min(n.y0 + d.dy, heightS - (n.y1 - n.y0)));
          n.y1 = n.y0 + (n.x0 - n.x1);
          return n.y0;
        });

      d3.select(this)
        .select("text")
        .attr("y", function(n) {
          return n.y0; //value_limit(((n.y1 + n.y0) / 2), n.y1, n.y0);
        });

      sankey.update(graph);
      link.attr("d", d3.sankeyLinkHorizontal());
    }

  }


}

function highlight(source, target) {
  console.log(source)
  console.log(target)
  var highlighted = link.filter(d => d.source.name === source && d.target.name === target);
  highlighted.style('stroke-opacity', 0.8);
};

function unHighlight() {
  link.style('stroke-opacity', 0.3);
};
