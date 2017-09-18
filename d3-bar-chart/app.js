$(document).ready(function() {

  // dimensions
  var margin = {top: 40, right: 10, bottom: 70, left: 70};
  var width = 1024 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;

  // formats
  var parseTime = d3.timeParse("%Y-%m-%d");
  var formatMonth = d3.timeFormat("%B %Y");
  var formatCurrency = d3.format("$,.1f");

  // ranges
  var x = d3.scaleTime()
    .range([0, width]);
  var y = d3.scaleLinear()
    .range([height, 0]);

  // create chart
  var chart = d3.select(".chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //  create tooltip
  var tooltip = d3.select(".chart")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // get and process data
  var url="https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";

  d3.json(url, function(error, json) {
    if (error) throw error;
    
    var data = json.data.map(function(d) {
      return {date: parseTime(d[0]), value: d[1]}
    })

    // scale
    x.domain(d3.extent(data, function(d) {
      return d.date;
    }));
    y.domain([0, d3.max(data, function(d) {
      return d.value;
    })]);

    // bar dimensions = 4px wide
    var barWidth = Math.ceil(width / data.length);

    // create bars
    chart.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        return x(d.date);
      })
      .attr("y", function(d) {
        return y(d.value);
      })
      .attr("width", barWidth)
      .attr("height", function(d) {
        return height - y(d.value);
      })
      .on("mouseover", function(d) {
        d3.select(this).attr("class", "mouseover");
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(formatMonth(d.date) + '<br/><span class="amount">' + formatCurrency(d.value) + ' Billion</span>')
          .style("left", (d3.event.pageX - 328) + "px")
          .style("top", (d3.event.pageY - 42) + "px");
        })
      .on("mouseout", function(d) {
        d3.select(this).attr("class", "bar");
        tooltip.transition()
          .duration(200)
          .style("opacity", 0);
    });

    // add the axes
    chart.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    chart.append("g")
      .call(d3.axisLeft(y));

    // x label
    chart.append("text")
      .attr("class", "label")
      .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top) + ")")
      .text("Year");

    // y label
    chart.append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .text("$US Billions");

    // main title
    chart.append("text")
      .attr("class", "label title")
      .attr("x", (width / 2))       
      .attr("y", 0 - (margin.top / 2))
      .text("USA Gross Domestic Product: 1947-2015");

    // description
    d3.select(".desc")
      .append("text")
      .text(json.description);
  })
})