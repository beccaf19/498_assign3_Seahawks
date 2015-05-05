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


  var lineGen = d3.svg.line()
  .x(function(d) {
    return x(d.startDate);
  })
  .y(function(d) {
    return y(d.searchAmt);
  }); 

  svg.append('svg:path')
  .attr('d', lineGen(dataset))
  .attr('stroke', 'green')
  .attr('stroke-width', 2)
  .attr('fill', 'none');
});


var col = d3.scale.category10();

//create SVG element for graph
var svg = d3.select("body").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

//x axis start and end dates
var minDate = new Date(2005,01,02),
    maxDate = new Date(2015,05,02);


// set axis scales
var x = d3.time.scale()
        .domain([minDate, maxDate])
        .range([0, w]);

var y = d3.scale.linear()
        .domain([0, 125])
        .range([h, 0]);

var xAxis = d3.svg.axis()
    .ticks(10)
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
      $("#date").val(ui.values[0] + " - " + ui.values[1]);
       filterData("dates", ui.values);
    } 
  });

  $("#dateRange").val($("#date").slider("values", 0) +
     " - " + $("#date").slider("values", 1));  
});





var attributes = ["date"]
var ranges = [[2005, 2015]]

function filterData(attr, values){
  for (i = 0; i < attributes.length; i++){
    if (attr == attributes[i]){       
      ranges[i] = values;
    }
  }
  var toVisualize = dataset.filter(function(d) { 
    return isInRange(d)
  });
  update(toVisualize);
}

function isInRange(datum){
  for (i = 0; i < attributes.length; i++){
    if (datum[attributes[i]] < ranges[i][0] || datum[attributes[i]] > ranges[i][1]){
      return false;
    }
  }
  return true;
}





