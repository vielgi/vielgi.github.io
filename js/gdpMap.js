//svg dimensions
/*var width = 1000,
    height = 600;*/
var width = 900,
    height = 500;

//svg area
var svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id","mapsvg");

//map projection
var projection = 
    d3.geo.mercator()
    .center([0, 5 ])
    .scale((width + 1) / 2 / Math.PI)
    .translate([width / 2, height / 2]);

//path for map projection
var path = d3.geo.path()
    .projection(projection);

//percentage and currency format
var percentFormat = d3.format(",.2%")
var currencyFormat = d3.format("$,.r")

//slider to select a year
$(function() {
    $( "#slider" ).slider({
      value:1951,
      min: 1951,
      max: 2007,
      step: 2,
      slide: function( event, ui ) {
        $( "#amount" ).val(ui.value );
          presPeriod = ui.value
          loadViz();
      }
    });
    $( "#amount" ).val( $( "#slider" ).slider( "value" ) );
  });
//end of slider

//load visualization
loadViz();

//default year period
var presPeriod = 1951;

// Load data parallel
function loadViz(){
    queue()
    .defer(d3.json, "data/worldGDP.json")
    .defer(d3.json, "data/world-110m.json")
    .await(createVisualization);
}

//function to create the visualization    
function createVisualization(error, worldGDP, worldData) {
    // Visualize data1 and data2
    var world = topojson.feature(worldData, worldData.objects.countries).features
    
    var democratsCount = 0;
    var republicansCount = 0;
    
    //set indicator values
    document.getElementById("usa").innerHTML = presPeriod + " - " + worldGDP.countries[0].country;
    document.getElementById("gdp").innerHTML = currencyFormat(worldGDP.countries[0].gdp[presPeriod]);
    document.getElementById("gdpChange").innerHTML = percentFormat(worldGDP.countries[0].gdpChange[presPeriod]);
    
    if(worldGDP.countries[0].gdpChange[presPeriod] > 0){
        document.getElementById("changeText").innerHTML = "Increase from " + (presPeriod - 2)
    }else{document.getElementById("changeText").innerHTML = "Decrease from " + (presPeriod - 2)}
    
    //document.getElementById("currentPresident").innerHTML = worldGDP.countries[0].president[presPeriod]
    
    /*if(worldGDP.countries[0].party[presPeriod].presidentParty==="R"){
        document.getElementById("currentPresParty").innerHTML = "Republican";
        $("#currentPresParty").css("color","#c0392b");
        republicansCount++;
    }else{
        document.getElementById("currentPresParty").innerHTML = "Democrat";
        $("#currentPresParty").css("color","#2980b9");
        democratsCount++;
    }
    
    if(worldGDP.countries[0].party[presPeriod].senateParty==="R"){
        document.getElementById("currentSenParty").innerHTML = "Republican";
        $("#currentSenParty").css("color","#c0392b");
        republicansCount++;
    }else{
        document.getElementById("currentSenParty").innerHTML = "Democrat";
        $("#currentSenParty").css("color","#2980b9");
        democratsCount++;
    }
    
    if(worldGDP.countries[0].party[presPeriod].houseParty==="R"){
        document.getElementById("currentHouseParty").innerHTML = "Republican";
        $("#currentHouseParty").css("color","#c0392b");
        republicansCount++;
    }else{
        document.getElementById("currentHouseParty").innerHTML = "Democrat";
        $("#currentHouseParty").css("color","#2980b9");
        democratsCount++;
    }*/
    
    $("#pImgTxt").text(worldGDP.countries[0].president[presPeriod])
    if(worldGDP.countries[0].party[presPeriod].presidentParty==="R"){
        $("#presImg").attr("src","images/repPres.png")
    }else{$("#presImg").attr("src","images/demPres.png")}
    if(worldGDP.countries[0].party[presPeriod].senateParty==="R"){
        $("#senImg").attr("src","images/repSen.png")
    }else{$("#senImg").attr("src","images/demSen.png")}
    if(worldGDP.countries[0].party[presPeriod].houseParty==="R"){
        $("#houseImg").attr("src","images/repHouse.png")
    }else{$("#houseImg").attr("src","images/demHouse.png")}
    
    // Render the U.S. by using the path generator
    svg.selectAll("path")
            .data(world)
        .enter().append("path")
            .attr("d", path);
    
    //removing previous circles
    d3.selectAll("circle").remove();
    d3.selectAll("text").remove();
    
    //add the countries pointers
    var myCircle = svg.selectAll("circle")
        .data(worldGDP.countries)
        .enter()
        .append('circle')
        .attr("class","myCircle")
        .on("click",function(d){
            document.getElementById("country").innerHTML = presPeriod + " - " + d.country;
            document.getElementById("gdpCountry").innerHTML = currencyFormat(d.gdp[presPeriod]);
            document.getElementById("gdpChangeCountry").innerHTML = percentFormat(d.gdpChange[presPeriod]);
            if(d.gdpChange[presPeriod] > 0){
                document.getElementById("countryText").innerHTML = "Increase from " + (presPeriod - 2)
            }else{
                document.getElementById("countryText").innerHTML = "Decrease from " + (presPeriod - 2)
            }
        return;
        })
        .attr("r",function(d){
        if( d.gdpChange[presPeriod] > 0.05 || d.gdpChange[presPeriod] < -0.05){
            return 20;
        }else{
            return 10;
        }
        })
        //.style("fill","coral")
        .style("fill",function(d){
            if(d.gdpChange[presPeriod] > 0){
                return "#2ecc71";
            }else{
                return "#e74c3c";
            }
        })
        /*.attr("cx", function(d) {
                    return projection([d.longitude, d.latitude])[0];
           })
        .attr("cy", function(d) {
                   return projection([d.longitude, d.latitude])[1];
           })*/
        .attr("transform", function(d) {
            return "translate(" + projection([d.longitude, d.latitude]) + ")";
        });
    
    svg.selectAll("text")
        .data(worldGDP.countries)
        .enter()
        .append('text')
        .attr("class","circleCountryText")
    .attr("transform", function(d) {
            return "translate(" + projection([d.longitude, d.latitude]) + ")";
        })
        //.text("GDP Percentage")
        .text(function(d){
            //console.log(d.country);
            //document.getElementById("country").innerHTML = d.country;
            //document.getElementById("gdpCountry").innerHTML = d.gdp[presPeriod];
            //document.getElementById("gdpChangeCountry").innerHTML = d.gdpChange[presPeriod];
        //changeData(d);
        //d3.select(this).style("fill", "purple");
        return (percentFormat(d.gdpChange[presPeriod]));
    })
    
    //create zoom tool
    var zoom = d3.behavior.zoom()
    .on("zoom",function() {
        svg.attr("transform","translate("+ 
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        svg.selectAll("path")  
            .attr("d", path.projection(projection)); 
    });
    svg.call(zoom)  
    
}