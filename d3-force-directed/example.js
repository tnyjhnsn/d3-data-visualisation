const animationStep = 200;
const nodeRadius = 4;
const forceCharge = -100;
const linkDistance = 50;

var graph = d3.select('.graph')

let width = parseInt(graph.style("width"));
let height = parseInt(graph.style("height"));

var svg = graph.append('svg')
  .attr("width", width)
  .attr("height", height);

var tooltip = d3.select("#tooltip")

let request = new XMLHttpRequest();
request.addEventListener("load", loaded);

function loaded() {
  const data = JSON.parse(request.responseText);

  var force = d3.layout.force()
    .size([width, height])
    .nodes(data.nodes)
    .links(data.links)
    .linkDistance(linkDistance)
    .charge(forceCharge);

  var link = svg.selectAll('.link')
    .data(data.links)
    .enter()
    .append('line')
    .attr('class', 'link');

  var node = graph.select('.flagbox').selectAll('.node')
    .data(data.nodes)
    .enter()
    .append('img')
    .attr('class', d => 'flag flag-' + d.code)
    .on("mouseover", (d) => {
      tooltip.style("display", "block");
      tooltip.html(d.country)
        .style("left", d3.event.pageX + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", (d) => {
      tooltip.style("display", "none");
    })
    .call(force.drag);
  force.on('tick', function() {
  //  node.transition().ease('linear').duration(animationStep)
    node.style('left', d => (d.x - 8) + "px")
      .style('top', d => (d.y - 5) + "px");
    /*
    node.attr('r', nodeRadius)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);*/

    //link.transition().ease('linear').duration(animationStep)
      link.attr('x1', d => d.source.x)
      .attr('x2', d => d.target.x)
      .attr('y1', d => d.source.y)
      .attr('y2', d => d.target.y);

  //  force.stop();

  //  setTimeout( () => force.start(),
  //           animationStep);
  });

  force.start();
};
/*).error( function(err) {
  console.log("Couldn't load country list: error " + err);
})*/

request.open('GET', "https://dl.dropboxusercontent.com/u/64467477/country%20data%20for%20force%20directed%20graph/countries.json", true);
request.send(null);
