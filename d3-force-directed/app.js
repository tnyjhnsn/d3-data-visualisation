$(document).ready(function() {

  var margin = { top: 80, right: 0, bottom: 0, left: 0 };
  var height = 1000 - margin.top - margin.bottom;
  var width = 1000 - margin.left - margin.right;

  var chart = d3.select(".chart");
  
  chart
    .append("svg")
    .attr('width', width - margin.left - margin.right)
    .attr('height', height - margin.top - margin.bottom);
    
  var position = function(dimension, val) {
    return Math.max(0, Math.min(dimension, val));    
  }  

  var url = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";
  d3.json(url, function(error, json) {
    if (error) throw error;

    var nodes = json.nodes;
    var links = json.links;

    var simulation = d3.forceSimulation()
      .nodes(nodes)
      .force("link", d3.forceLink(links).distance(20))
      .force("charge", d3.forceManyBody().distanceMax(60).distanceMin(20))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(20))
      .on("tick", ticked);

    var node = chart.selectAll('.node')
      .data(nodes)
      .enter()
      .append("img")
        .attr('class', function(d) { return 'flag flag-' + d.code; })
      .on('mouseover', function(d) {
        tooltip.transition()
          .style('opacity', 0.9);
        tooltip.html(d.country)
          .style('left', (d3.event.pageX - 240) + 'px')
          .style('top',  (d3.event.pageY - 80) + 'px');
        })
      .on('mouseout', function(d) { 
        tooltip.transition()
          .duration(200)
          .style("opacity", 0);
      })
      .call(d3.drag()
        .on("start", startDrag)
        .on("drag", dragging)
        .on("end", endDrag)
      );
    
    var svg = d3.select('svg');
    
    var link = svg.selectAll('.link')
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link");

    var tooltip = chart.append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    function ticked() {
      node
        .style("left", function(d) { return (position(width, d.x) - 8) + "px"; })
        .style("top", function(d) { return (position(height, d.y) - 5) + "px"; });
      link
        .attr("x1", function(d) { return position(width, d.source.x) + "px"; })
        .attr("y1", function(d) { return position(height, d.source.y) + "px"; })
        .attr("x2", function(d) { return position(width, d.target.x) + "px"; })
        .attr("y2", function(d) { return position(height, d.target.y) + "px"; } );
    };

    function startDrag(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    };

    function dragging(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    function endDrag(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = undefined;
      d.fy = undefined;
    };

  });

});
