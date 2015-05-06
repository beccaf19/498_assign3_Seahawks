

var margin = {top: 50, right: 20, bottom: 30, left: 125};
    var w = 1200 - margin.left - margin.right;
    var h = 500 - margin.top - margin.bottom;

var dataset; //to hold full dataset

var attributes = ["date"]
var ranges = [[2005, 2015]]
var svg;

//x axis start and end dates
var minDate = new Date(2005,00,01),
    maxDate = new Date(2015,04,01);


$(document).ready(function(){

  d3.csv("report.csv", function(error, seahawks) {

  //read in the data
    if (error) {
      return console.warn(error);
    }
    seahawks.forEach(function(d) {
       d.searchAmt = +d.searchAmt;
       d.startDate = +getstartDate(d);
       d.endDate = +getendDate(d);
    });

    dataset=seahawks;
     //create SVG element for graph
  svg = d3.select("body").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    drawVis(dataset);
  });

  // $('#dateRange').change(function(){
  //   var value = $('#dateRange').val
  //   var newYear = new Date(value, 01, 01);
  //    filterData(dataset, newYear);

  // });



});






function drawVis(data) {

 

//create axis elements
var xAxis = d3.svg.axis()

    .scale(x);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// append axis elements and add labels
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis)
     .append("text")
      .attr("x", w)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Year");


svg.append("g")
   .attr("class", "axis")
   .call(yAxis)
      .append("text")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Web Search Amount");        


//draw line
  var lineGen = d3.svg.line()
  .x(function(d) {
    return x(d.startDate);
  })
  .y(function(d) {
    return y(d.searchAmt);
  }); 

  svg.append('svg:path')
  .attr('d', lineGen(data))
  .attr('stroke', 'green')
  .attr('stroke-width', 2)
  .attr('fill', 'none');

}




var col = d3.scale.category10();


var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);


// set axis scales
var x = d3.time.scale()
        .domain([minDate, maxDate])
        .range([0, w]);

var y = d3.scale.linear()
        .domain([0, 125])
        .range([h, 0]);


//get date functions
function getstartDate(d) {
  return new Date(d.startDate);
}

function getendDate(d) {
  return new Date(d.endDate);
}




$(function() {
  $("#date").slider({  
    range: true,       
    min:  2005,      
    max: 2015,
    values: [2005, 2015],

    slide: function(event, ui) {
      $("#dateRange").val(ui.values[0] + " - " + ui.values[1]);
       
      var ticks = (ui.values[1] - ui.values[0]) + 1;
      var newYear1 = new Date(ui.values[0], 00, 00);
      var newYear2 = new Date(ui.values[1], 00, 00);


       x = d3.time.scale()
        .domain([newYear1, newYear2])
        .range([0, w]);

      xAxis = d3.svg.axis()
      
          .scale(x)
          .orient("bottom"); 

      svg.selectAll(".x.axis")
      .call(xAxis);
      svg.selectAll("*").remove();
      filterData("date", ui.values, newYear1, newYear2);
    }
  });

  $("#dateRange").val($("#date").slider("values", 0) +    
          " - " + $("#date").slider("values", 1));
    });





function filterData(attr, values, newYear1, newYear2){
  for (i = 0; i < attributes.length; i++){
    if (attr == attributes[i]){       
      ranges[i] = values[i];
    }
  }
  var toVisualize = dataset.filter(function(d) { 
     return isInRange(d, newYear1, newYear2)
  });
  drawVis(toVisualize);
}

function isInRange(datum, newYear1, newYear2){
  for (i = 0; i < attributes.length; i++){
    if (getstartDate(datum) < newYear1 || getstartDate(datum) > newYear2){
      return false;
    }
  }
  return true;
}







