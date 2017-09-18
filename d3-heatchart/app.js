$(document).ready(function() {

  // dimensions
  var margin = {top: 60, right: 120, bottom: 90, left: 70};
  var width = 1280 - margin.left - margin.right;
  var height = 650 - margin.top - margin.bottom;

  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  var monthHeight = height / months.length;

var colors = [
    "#5e4fa2",
    "#3288bd",
    "#66c2a5",
    "#abdda4",
    "#e6f598",
    "#ffffbf",
    "#fee08b",
    "#fdae61",
    "#f46d43",
    "#d53e4f",
    "#9e0142"
  ];

  var parseYear = d3.timeParse("%Y");
  var formatYear = d3.timeFormat("%Y");

  // ranges
  var x = d3.scaleTime()
    .range([0, width]);
  var y = d3.scaleQuantize()
    .range(colors);

  // create chart area
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
  var url="https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";

  d3.json(url, function(error, json) {
    if (error) throw error;

    var baseTemp = json.baseTemperature;
    var data = json.monthlyVariance;

    var years = data.map(function(d) {
      return d.year;
    });
    years = years.filter(function(d,i) {
      return years.indexOf(d) == i;
    });
    var yearWidth = width / years.length;

    data.forEach(function(d) {
      d.year = parseYear(d.year);
    })

    x.domain(d3.extent(data, function(d) {
      return d.year;
    }));
    y.domain(d3.extent(data, function(d) {
      return d.variance;
    }));

    // Add the chart
    chart.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return x(d.year) - (yearWidth / 2);
      })
      .attr("y", function(d, i) {
        return (d.month - 1) * monthHeight;
      })
      .attr("width", yearWidth)
      .attr("height", monthHeight)
      .attr("fill", function(d) {
        return y(d.variance);
      })
      .on("mouseover", function(d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(months[d.month - 1] + " " + formatYear(d.year) +
            '<br/>Temperature: <span class="temp">' + (baseTemp + d.variance).toFixed(3) + '</span>&#176C' +
            '<br/>Variance: <span class="temp">' + (d.variance).toFixed(3) + '</span>&#176C')
          .style("left", (d3.event.pageX - ($(".tooltip").width() / 2) - 90) + "px")
          .style("top", (d3.event.pageY - 100) + "px");
      })
      .on("mouseout", function(d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", 0);
      })

    // add the x axis
    chart.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
        .tickFormat(formatYear));

    // add the y axis (as months)
    chart.selectAll(".month")
      .data(months)
      .enter()
      .append("text")
      .text(function(d) {
        return d;
      })
      .attr("x", -5)
      .attr("y", function(d, i) {
        return i * monthHeight + (monthHeight / 1.5);
      })
      .style("text-anchor", "end");

    // x label
    chart.append("text")
      .attr("class", "label")
      .attr("transform", "translate(" + (width / 2) + " ," + (height + 40) + ")")
      .text("Year");

    // y label
    chart.append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .text("Month");

    // main title
    chart.append("text")
      .attr("class", "label title")
      .attr("x", (width / 2))       
      .attr("y", 0 - (margin.top / 2))
      .text("Monthly Global Land-Surface Temperature: 1753 - 2015");

    // sub title
    chart.append("text")
      .attr("class", "label sub-title")
      .attr("x", (width / 2))       
      .attr("y", 0 - (margin.top / 2 - 20))
      .text("Temperatures are in Celsius and reported as anomalies relative to the estimated Jan 1951-Dec 1980 absolute temperature 8.66 +/- 0.07");

    // legend

    var legendWidth = 30;
    chart.selectAll(".legend")
      .data(colors)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        return i * legendWidth;
      })
      .attr("y", height + 50)
      .attr("width", legendWidth)
      .attr("height", 14)
      .attr("fill", function(d) {
        return d;
      });

    var legend = d3.scaleLinear()
      .domain(y.domain())
      .range([0, legendWidth * colors.length]);

    chart.append("g")
      .attr("transform", "translate(0," + (height + 65) + ")")
      .call(d3.axisBottom(legend));

  })
})