$(document).ready(function() {

  // dimensions
  var margin = {top: 40, right: 120, bottom: 90, left: 50};
  var width = 800 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;

  var radius = 4;

  // formats
  var parseTime = d3.timeParse("%M:%S");
  var formatTime = d3.timeFormat("%M:%S");

  // ranges
  var x = d3.scaleLinear()
    .range([width, 0]);
  var y = d3.scaleLinear()
    .range([0, height]);

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
  var url="https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

  d3.json(url, function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.Time = parseTime(d.Time);
    })

    // scale
    x.domain(d3.extent(data, function(d) {
      return d.Time;
    }));
    y.domain([0, d3.max(data, function(d) {
      return d.Place;
    }) + 1]);

    // Add the scatterplot
    chart.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", function(d) {
        return d.Doping ? "dope" : "no-dope";
      })
      .attr("r", radius)
      .attr("cx", function(d) {
        return x(d.Time);
      })
      .attr("cy", function(d) {
        return y(d.Place);
      })
      .on("mouseover", function(d) {
        d3.select(this)
          .attr("stroke", "#50717c")
          .attr("stroke-width", "2px");
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(
            d.Name + " (" + d.Nationality + ") " + 
            '<br/>Rank: <span class="time">' + d.Place + '</span> Time: <span class="time">' + formatTime(d.Time) + '</span>' +
            '<br/>' + d.Doping )
          .style("left", (d3.event.pageX - 490) + "px")
          .style("top", (d3.event.pageY - 82) + "px");
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("stroke-width", "0px");
        tooltip.transition()
          .duration(200)
          .style("opacity", 0);
      });

    // names on plot
    chart.selectAll(".name")
      .data(data)
      .enter()
      .append("text")
      .text(function(d) {
        return d.Name + " (" + d.Nationality + ")";
      })
      .attr("x", function(d) {
        return x(d.Time);
      })
      .attr("y", function(d) {
        return y(d.Place);
      })
      .attr("transform", "translate(8, 5)");

    // add the axes
    chart.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
        .tickFormat(formatTime));
    chart.append("g")
      .call(d3.axisLeft(y));

    // x label
    chart.append("text")
      .attr("class", "label")
      .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top) + ")")
      .text("Winning Time (Minutes:Seconds)");

    // y label
    chart.append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("x",0 - (height / 2))
      .attr("y", 0 - margin.left)
      .attr("dy", "1em")
      .text("Rank");

    // main title
    chart.append("text")
      .attr("class", "label title")
      .attr("x", (width / 2))       
      .attr("y", 0 - (margin.top / 2))
      .text("Doping in Professional Bicycle Racing");

    // legend
    chart.append("text")
      .attr("class", "legend")
      .attr("transform", "translate(410,"+ 385 + ")")
      .text("LEGEND");
    chart.append("circle")
      .attr("r", radius)
      .attr("class", "dope")
      .attr("transform", "translate(400,"+ 400 + ")")
    chart.append("text")
      .attr("transform", "translate(410,"+ 403 + ")")
      .text("Ride WITH doping allegation");
   chart.append("circle")
      .attr("r", radius)
      .attr("class", "no-dope")
      .attr("transform", "translate(400,"+ 415 + ")")
    chart.append("text")
      .attr("transform", "translate(410,"+ 418 + ")")
      .text("Ride with NO doping allegation");
  })
})