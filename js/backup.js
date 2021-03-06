//area of the line chart
//var margin = {top: 20, right: 80, bottom: 30, left: 50},
  //  width = 960 - margin.left - margin.right,
    //height = 500 - margin.top - margin.bottom;

var margin = {top: 20, right: 80, bottom: 120, left: 50},
    width = 960 - margin.left - margin.right,
    height = 520 - margin.top - margin.bottom;

//upper and lower bound of my data
var lb = "1947";
var ub = "2013"

//range slider
$(function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 1947,
      max: 2013,
      values: [ 1947, 2013 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "From " + ui.values[ 0 ] + " - to " + ui.values[ 1 ] );
          lb = String(ui.values[ 0 ])
          ub = String(ui.values[ 1 ])
          updateVisualization()
      }
    });
    $( "#amount" ).val( "Year range: " + $( "#slider-range" ).slider( "values", 0 ) +
      " - " + $( "#slider-range" ).slider( "values", 1 ) );
  });

// event listener to all checkboxes
$(".myCheckBox").click(updateVisualization);

//global variables to store viz data
var globalData;
var newEventData;
var eventHeight = height + 25;

// variable to get the value of the checked element
var checkValue;

//date parser
var format = d3.time.format("%Y");

//percentage parser
var formatPercent = d3.format("1%")

//x scale
var x = d3.time.scale()
    .range([0, width]);

//y scale
var y = d3.scale.linear()
    .range([height, 0]);

//color scale for mulitple lines in the line chart
var color = d3.scale.category10();

//x axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

//y axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

//creating different indicator lines
var gdpLine = d3.svg.line()
    .interpolate("basis")
   // .x(function(d) { return x(d.term); })
    .y(function(d) { return y(d.gdp_change); });

var budgetLine = d3.svg.line()
    .interpolate("basis")
    //.x(function(d) { return x(d.term); })
    .y(function(d) { return y(d.budget_change); });

var cpiLine = d3.svg.line()
    .interpolate("basis")
    //.x(function(d) { return x(d.term); })
    .y(function(d) { return y(d.cpi_change); });

var incomeLine = d3.svg.line()
    .interpolate("basis")
   // .x(function(d) { return x(d.term); })
    .y(function(d) { return y(d.income_change); });

//svg area
var svg = d3.select("#lineChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//line paths
var gdpLinePath = svg.append("path")
.attr("class", "gdpLine");

var cpiLinePath = svg.append("path")
.attr("class", "cpiLine");

var incomeLinePath = svg.append("path")
.attr("class", "incomeLine");

var budgetLinePath = svg.append("path")
.attr("class", "budgetLine");


//loading president data
//president terms line chart
    var eventData = [
        {"name": "Truman", "startdate": "1947",  "enddate": "1952", "party":"D"},
        {"name": "Eisenhower", "startdate": "1953",  "enddate": "1960", "party":"R"},
        {"name": "Kennedy", "startdate": "1961",  "enddate": "1963", "party":"D"},
        {"name": "Johnson", "startdate": "1963",  "enddate": "1968", "party":"D"},
        {"name": "Nixon", "startdate": "1969",  "enddate": "1974", "party":"R"},
        {"name": "Ford", "startdate": "1974",  "enddate": "1976", "party":"R"},
        {"name": "Carter", "startdate": "1977",  "enddate": "1980", "party":"D"},
        {"name": "Regan", "startdate": "1981",  "enddate": "1988", "party":"R"},
        {"name": "H.W. Bush", "startdate": "1989",  "enddate": "1992", "party":"R"},
        {"name": "Clinton", "startdate": "1993",  "enddate": "2000", "party":"D"},
        {"name": "W. Bush", "startdate": "2001",  "enddate": "2008", "party":"R"},
        {"name": "Obama", "startdate": "2009",  "enddate": "2013", "party":"D"}
    ];
    
    eventData.forEach(function(d) {
        d.startdate = format.parse(d.startdate);
        d.enddate = format.parse(d.enddate);
    });
    
    

//loading the data
d3.csv("data/bars.csv", function(error, data) {
  if (error) throw error;
    //console.log(data);
    
    // Convert string to 'date object' and numeric objects
    data.forEach(function(d){
        d.term = format.parse(d.term)
        d.gdp_change = +d.gdp_change * 100;
        d.budget_change = +d.budget_change;
        d.cpi_change = +d.cpi_change * 100;
        d.income_change = +d.income_change * 100;
    });
    //console.log(data);
    
    //giving the data to a global variable
    globalData = data
    
    // x scale domain
    //x.domain(d3.extent(data, function(d) { return d.term; }));
    
    //y scale domain
    //y.domain(d3.extent(data, function(d) { return d.gdp; }));
    y.domain([-20,20])
    
    // group for x axis
    var xAxisGroup = svg.append("g")
      .attr("class", "x axis x-axis")
      .attr("transform", "translate(0," + height + ")");
      //.call(xAxis);
    
    //group for y axis
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Percentage (%)");
    
    //call the viz
    updateVisualization();
  });

//drawing the mulit-line chart viz
function updateVisualization() {
    //date periods
    var newData = globalData.filter(function(d) { return (d.term >= format.parse(lb) && d.term <= format.parse(ub)) });
    
    //setting the domain for the x scale
    x.domain(d3.extent(newData, function(d) { return d.term; }));
    
    //line coordinates updated
    gdpLine.x(function(d) { return x(d.term); })
    cpiLine.x(function(d) { return x(d.term); })
    budgetLine.x(function(d) { return x(d.term); })
    incomeLine.x(function(d) { return x(d.term); })
    
    
    //updating individual lines
    if ($("#gdpCB").is(":checked")){
        svg.select(".gdpLine")
            .datum(newData)
            .transition()
            .duration(800)
            .style("visibility","visible")
            .attr("d", gdpLine);
    }else{
        svg.select(".gdpLine").style("visibility","hidden");
    }

    if ($("#cpiCB").is(":checked")){
        svg.select(".cpiLine")
            .datum(newData)
            .attr("d", cpiLine)
            .style("visibility","visible");
    }else{
        svg.select(".cpiLine").style("visibility","hidden");
    }
    
    if ($("#incomeCB").is(":checked")){
        svg.select(".incomeLine")
            .datum(newData)
            .style("visibility","visible")
            .attr("d", incomeLine);
    }else{
        svg.select(".incomeLine").style("visibility","hidden");
    }

    if ($("#budgetCB").is(":checked")){
        svg.select(".budgetLine")
            .datum(newData)
            .style("visibility","visible")
            .attr("d", budgetLine);
    }else{
        svg.select(".budgetLine").style("visibility","hidden");
    }
    
    //updating the x axis
    svg.select(".x-axis")
        .transition()
        .duration(800)
        .call(xAxis);
    
    
    newEventData = eventData.filter(function(d) { return (d.startdate >= format.parse(lb) && d.enddate <= format.parse(ub)) });
    
    console.log(newEventData)
    
    var eventInd = svg.selectAll(".eventInd")
    .data(newEventData)
    .enter()
    .append("g")
    .attr("class", "eventInd");
    
    // draw a line: start event
    eventInd.append("line")
        .attr("x1", function(d) { return x(d.startdate); })
        .attr("y1", 0)
        .attr("x2", function(d) { return x(d.startdate); })
        .attr("y2", eventHeight)
        .attr("class","eventlineborder")
        .style("stroke",function(d){
            if (d.party ==="D"){return "#66d9ff"}
            else{return "#ff6666"}
        });
    
  // draw a line: end event
    eventInd.append("line")
        .attr("x1", function(d) { return x(d.enddate); })
        .attr("y1", 0)
        .attr("x2", function(d) { return x(d.enddate); })
        .attr("y2", eventHeight)
        .attr("class","eventlineborder")
        .style("stroke",function(d){
            if (d.party ==="D"){return "#66d9ff"}
            else{return "#ff6666"}
        });
    
    // draw a line: period connector event
    eventInd.append("line")
        .attr("x1", function(d) { return x(d.startdate); })
        .attr("y1", eventHeight)
        .attr("x2", function(d) { return x(d.enddate); })
        .attr("y2", eventHeight)
        .attr("class","eventlineconnector")
        .style("stroke",function(d){
            if (d.party ==="D"){return "#66d9ff"}
            else{return "#ff6666"}
        });
    
    // add event label
    eventInd.append("text")
        //.attr("x", function(d) { return x(d.startdate) + ((x(d.enddate) - x(d.startdate))/2); })
        //.attr("y", eventHeight + 12)
        .attr("x",eventHeight + 5)
        .attr("y",function(d) { return -1* (x(d.startdate) + ((x(d.enddate) - x(d.startdate))/2)); })
        .attr("class", "eventtitle")
        .text(function(d) { return d.name; })
        .attr("transform", "rotate(90)")
        .style("stroke",function(d){
            if (d.party ==="D"){return "#66d9ff"}
            else{return "#ff6666"}
        });
    
    //eventInd.exit().remove();
}