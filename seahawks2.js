<!doctype html>

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>jQuery UI Slider - Default functionality</title>
    <link rel="stylesheet" href="http://code.jquery.com/ui/1.9.0/themes/base/jquery-ui.css" />
    <script src="http://code.jquery.com/jquery-1.8.2.js"></script>
    <script src="http://code.jquery.com/ui/1.9.0/jquery-ui.js"></script>
   <script src="http://d3js.org/d3.v3.min.js"></script>
   

  </head>
  <body>
    

    <div id="chart">
      <script language="javascript">
      var margin = {top: 50, right: 20, bottom: 30, left: 125};
    var w = 1200 - margin.left - margin.right;
    var h = 500 - margin.top - margin.bottom;
     var dataset; //to hold full dataset

    d3.csv("report.csv", function(error, seahawks) {
      //read in the data
      if (error) return console.warn(error);
        seahawks.forEach(function(d) {
          d.searchAmt = +d.searchAmt;
          d.startDate = +getstartDate(d);
          d.endDate = +getendDate(d);
        });
      dataset=seahawks;
    });


      var x = d3.time.scale()
        .domain([minDate, maxDate])
        .range([0, w]);
      
      var y = d3.scale.linear()
        .domain([0, 125])
        .range([h, 0]);


      // automatically determining max range can work something like this
      // var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

      var line = d3.svg.line()
      .x(function(d) {
         return x(d.startDate);
      })
      .y(function(d) {
        return y(d.searchAmt);
      }); 



      // Add an SVG element with the desired dimensions and margin.
      var graph = d3.select("#chart").append("svg:svg")
      .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      

      // create yAxis
      var xAxis = d3.svg.axis()
        .ticks(10)
        .scale(x);
        
      // Add the x-axis.
      graph.append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxis);


      // create left yAxis
      var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
      // Add the y-axis to the left
      graph.append("svg:g")
      .attr("class", "y axis")
      .attr("transform", "translate(-25,0)")
      .call(yAxisLeft);


    var clip = graph.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("id", "clip-rect")
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", w)
        .attr("height", h);

      
      // Add the line by appending an svg:path element with the data line we created above
      // do this AFTER the axes above so that the line is above the tick-lines
      var path = graph.append("svg:path").attr("class","path").attr("clip-path", "url(#clip)").attr("d", line(data));
      
      </script>

    </div>

</div>
<div id="slider">
  <script>
    $(function() {
    $( "#slider" ).slider({
    range: true,
    min: 0,
    max: data.length-1,
    values: [0,data.length-1],
    slide: function( event, ui ) {
    var maxv = d3.min([ui.values[1], data.length]);
    var minv = d3.max([ui.values[0], 0]);;



    x.domain([minv, maxv-1]);
    graph.transition().duration(750)
      .select(".x.axis").call(xAxis);
    graph.transition().duration(750)
      .select(".path").attr("d", line(data));
    }});
    });