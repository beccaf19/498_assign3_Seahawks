var margin = {top: 20, right: 20, bottom: 30, left: 125};
    var w = 960 - margin.left - margin.right;
    var h = 500 - margin.top - margin.bottom;

var dataset; //to hold full dataset

d3.csv("report.csv", function(error, seahawks) {
  //read in the data
  if (error) return console.warn(error);
     seahawks.forEach(function(d) {
        d.date = +d.date;
        d.searchAmt = +d.searchAmt;
        d.startDate = +d.startDate;
        d.endDate = +d.endDate;
     });
   dataset=seahawks;
   drawVis(dataset);
});



var col = d3.scale.category10();

var colLightness = d3.scale.linear()
	.domain([0, 1200])
	.range(["#FFFFFF", "#000000"])

var svg = d3.select("body").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var minDate = new Date(2005,01,02),
    maxDate = new Date(2015,05,02);

var x = d3.time.scale()
        .domain([minDate, maxDate])
        .range([0, w]);

var y = d3.scale.linear()
        .domain([0, 125])
        .range([h, 0]);

function drawVis(data) {
  var circles = svg.selectAll("circle")
   .data(data)
   .enter()
   .append("circle")
    .attr("cx", function(d) {
      return x(d.startDate);  
    })
    .attr("cy", function(d) { 
      return y(d.searchAmt);  
    })
    .attr("r", 4)
    .style("stroke", "black")
     //.style("fill", function(d) { return colLightness(d.vol); })
     .style("fill", function(d) { return col(d.type); })
    .style("opacity", 0.5)
}


var xAxis = d3.svg.axis()
    .ticks(10)
    .scale(x);

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis)
     .append("text")
      .attr("x", w)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Year");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

svg.append("g")
   .attr("class", "axis")
   .call(yAxis)
      .append("text")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Web Search Amount");



