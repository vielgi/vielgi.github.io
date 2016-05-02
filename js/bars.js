var dataset;

//Define bar chart function 
function barChart(dataset) {

    //Set width and height as fixed variables
    var w = 1000;
    var h = 800;
    var padding = 35;

    //Scale function for axes and radius
    var yScale = d3.scale.linear()
                    .domain(d3.extent(dataset, function (d) { return d.gdp_change; }))
                    .range([w + padding, padding]);

    var xScale = d3.scale.ordinal()
                    .domain(dataset.map(function (d) { return d.term; }))
                    .rangeRoundBands([padding, h + padding], .5);

    //To format axis as a percent
    var formatPercent = d3.format("%1");

    //Create y axis
    var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(5).tickFormat(formatPercent);

    //Define key function
    var key = function (d) { return d.term };

    //Define tooltip for hover-over info windows
    var div = d3.select("body").append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);

    //Create svg element
    var svg = d3.select("#bars-area").append("svg")
            .attr("width", w).attr("height", h)
            .attr("id", "chart")
            .attr("viewBox", "0 0 " + w + " " + h)
            .attr("preserveAspectRatio", "xMinYMin");

    //Resizing function to maintain aspect ratio (uses jquery)
    var aspect = w / h;
    var chart = $("#bars-area");
    $(window).on("resize", function () {
        var targetWidth = $("body").width();

        if (targetWidth < w) {
            chart.attr("width", targetWidth);
            chart.attr("height", targetWidth / aspect);
        }
        else {
            chart.attr("width", w);
            chart.attr("height", w / aspect);
        }

    });


    //Initialize state of chart according to drop down menu
    var state = d3.selectAll("option");

    //Create barchart
    svg.selectAll("rect")
        .data(dataset, key)
        .enter()
        .append("rect")
        .attr("class", function (d) { return d.president_party == "R" ? "negative" : "positive"; })
        .attr({
            x: function (d) {
                return xScale(d.term);
            },
            y: function (d) {
                return yScale(Math.max(0, d.gdp_change));
            },
            width: xScale.rangeBand(),
            height: function (d) {
                return Math.abs(yScale(d.gdp_change) - yScale(0));
            }
        })
        .on('mouseover', function (d) {
            d3.select(this)
                .style("opacity", 0.2)
                .style("stroke", "black")

            var info = div
                        .style("opacity", 1)
                        .style("left", (d3.event.pageX + 10) + "px")
                        .style("top", (d3.event.pageY - 30) + "px")
                        .text(d.term);

            if (state[0][0].selected) {
                info.append("p")
                        .text(formatPercent(d.income_change) + " Median Income Change in %" + " " + d.president);

            }
            else if (state[0][1].selected) {
                info.append("p")
                        .text(formatPercent(d.gdp_change) + " GDP Change in %" + " " + d.president);
            }
            else if (state[0][2].selected) {
                info.append("p")
                        .text(formatPercent(d.cpi_change) + " CPI Change in %" + " " + d.president);
            }
            else if (state[0][3].selected) {
                info.append("p")
                        .text(formatPercent(d.cpi_change) + " S&P500 Change in %" + " " + d.president);
            }
            else if (state[0][4].selected) {
                info.append("p")
                        .text(formatPercent(d.cpi_change) + " Budget As % of GDP" + " " + d.president);
            }
            else if (state[0][5].selected) {
                info.append("p")
                        .text(formatPercent(d.cpi_change) + " Budget As % Change" + " " + d.president);
            }
            else if (state[0][6].selected) {
                info.append("p")
                        .text(formatPercent(d.cpi_change) + " Debt Change in %" + " " + d.president);
            }
            else if (state[0][7].selected) {
                info.append("p")
                        .text(formatPercent(d.cpi_change) + " Unemployment Change in %" + " " + d.president);
            }
            else if (state[0][8].selected) {
                info.append("p")
                        .text(formatPercent(d.cpi_change) + " Unemployment in %" + " " + d.president);
            }



        })
                    .on('mouseout', function (d) {
                        d3.select(this)
                        .style({ 'stroke-opacity': 0.5, 'stroke': '#a8a8a8' })
                        .style("opacity", 1);

                        div
                            .style("opacity", 0);
                    });

    //Add y-axis
    svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(40,0)")
            .call(yAxis);

    //Sort data when sort is checked
    d3.selectAll(".checkbox").
    on("change", function () {
        var x0 = xScale.domain(dataset.sort(sortChoice())
        .map(function (d) { return d.term }))
        .copy();

        var transition = svg.transition().duration(750);
        var delay = function (d, i) { return i * 10; };

        transition.selectAll("rect")
        .delay(delay)
        .attr("x", function (d) { return x0(d.term); });

    })

    //Function to sort data when sort box is checked
    function sortChoice() {
        var state = d3.selectAll("option");
        var sort = d3.selectAll(".checkbox");

        if (sort[0][0].checked && state[0][0].selected) {
            var out = function (a, b) { return b.gdp_change - a.gdp_change; }
            return out;
        }
        else if (sort[0][0].checked && state[0][1].selected) {
            var out = function (a, b) { return b.income_change - a.income_change; }
            return out;
        }
           
        else if (sort[0][0].checked && state[0][2].selected) {
            var out = function (a, b) { return b.cpi_change - a.cpi_change; }
            return out;
        }

        else if (sort[0][0].checked && state[0][3].selected) {
            var out = function (a, b) { return b.sp_change - a.sp_change; }
            return out;
        }

        else if (sort[0][0].checked && state[0][4].selected) {
            var out = function (a, b) { return b.budget_change - a.budget_change; }
            return out;
        }

        else if (sort[0][0].checked && state[0][5].selected) {
            var out = function (a, b) { return b.budget_as_percentage - a.budget_as_percentage; }
            return out;
        }

        else if (sort[0][0].checked && state[0][6].selected) {
            var out = function (a, b) { return b.debt_change - a.debt_change; }
            return out;
        }

        else if (sort[0][0].checked && state[0][7].selected) {
            var out = function (a, b) { return b.unemployment_change - a.unemployment_change; }
            return out;
        }

        else if (sort[0][0].checked && state[0][8].selected) {
            var out = function (a, b) { return b.unemployment - a.unemployment; }
            return out;
        }

        else {
            var out = function (a, b) { return d3.ascending(a.term, b.term); }
            return out;
        }
    };

    //Change data to correct values on input change
    d3.selectAll("select").
    on("change", function () {

        var value = this.value;

        if (value == "gdp") {
            var x_value = function (d) { return d.gdp_change; };
            var color = function (d) { return d.president_party == "R" ? "negative" : "positive"; };
            var y_value = function (d) {
                return yScale(Math.max(0, d.gdp_change));
            };
            var height_value = function (d) {
                return Math.abs(yScale(d.gdp_change) - yScale(0));
            };
        }

        else if (value == "income") {
            var x_value = function (d) { return d.income_change; };
            var color = function (d) { return d.president_party == "R" ? "negative" : "positive"; };
            var y_value = function (d) {
                return yScale(Math.max(0, d.income_change));
            };
            var height_value = function (d) {
                return Math.abs(yScale(d.income_change) - yScale(0));
            };
        }
        
        
        else if (value == "sp") {
            var x_value = function (d) { return d.sp_change; };
            var color = function (d) { return d.president_party == "R" ? "negative" : "positive"; };
            var y_value = function (d) {
                return yScale(Math.max(0, d.sp_change));
            };
            var height_value = function (d) {
                return Math.abs(yScale(d.sp_change) - yScale(0));
            };
        }

        else if (value == "cpi") {
            var x_value = function (d) { return d.cpi_change; };
            var color = function (d) { return d.president_party == "R" ? "negative" : "positive"; };
            var y_value = function (d) {
                return yScale(Math.max(0, d.cpi_change));
            };
            var height_value = function (d) {
                return Math.abs(yScale(d.cpi_change) - yScale(0));
            };
        }
        else if (value == "budget") {
            var x_value = function (d) { return d.budget_change; };
            var color = function (d) { return d.president_party == "R" ? "negative" : "positive"; };
            var y_value = function (d) {
                return yScale(Math.max(0, d.budget_change));
            };
            var height_value = function (d) {
                return Math.abs(yScale(d.budget_change) - yScale(0));
            };
        }

        else if (value == "budgetpercentage") {
            var x_value = function (d) { return d.budget_as_percentage; };
            var color = function (d) { return d.president_party == "R" ? "negative" : "positive"; };
            var y_value = function (d) {
                return yScale(Math.max(0, d.budget_as_percentage));
            };
            var height_value = function (d) {
                return Math.abs(yScale(d.budget_as_percentage) - yScale(0));
            };
        }
        else if (value == "debt") {
            var x_value = function (d) { return d.debt_change; };
            var color = function (d) { return d.president_party == "R" ? "negative" : "positive"; };
            var y_value = function (d) {
                return yScale(Math.max(0, d.debt_change));
            };
            var height_value = function (d) {
                return Math.abs(yScale(d.debt_change) - yScale(0));
            };
        }
        else if (value == "unemployment_change") {
            var x_value = function (d) { return d.unemployment_change; };
            var color = function (d) { return d.president_party == "R" ? "negative" : "positive"; };
            var y_value = function (d) {
                return yScale(Math.max(0, d.unemployment_change));
            };
            var height_value = function (d) {
                return Math.abs(yScale(d.unemployment_change) - yScale(0));
            };
        }
        else if (value == "unemployment") {
            var x_value = function (d) { return d.unemployment; };
            var color = function (d) { return d.president_party == "R" ? "negative" : "positive"; };
            var y_value = function (d) {
                return yScale(Math.max(0, d.unemployment));
            };
            var height_value = function (d) {
                return Math.abs(yScale(d.unemployment) - yScale(0));
            };
        }

        //Update y scale
        yScale.domain(d3.extent(dataset, x_value));

        //Update with correct data
        var rect = svg.selectAll("rect").data(dataset, key);
        rect.exit().remove();

        //Transition chart to new data
        rect
        .transition()
        .duration(2000)
        .ease("linear")
        .each("start", function () {
            d3.select(this)
            .attr("width", "0.2")
            .attr("class", color)
        })
        .attr({
            x: function (d) {
                return xScale(d.term);
            },
            y: y_value,
            width: xScale.rangeBand(),
            height: height_value

        });

        //Update y-axis
        svg.select(".y.axis")
            .transition()
            .duration(1000)
            .ease("linear")
            .call(yAxis);
    });

};

//Load data and call bar chart function 
d3.csv("data/bars.csv", function (error, data) {
    if (error) {
        console.log(error);
    }
    else {
        data.forEach(function (d) {
            d.gdp_change = parseFloat(d.gdp_change);
            d.income_change = parseFloat(d.income_change);
            d.cpi_change = parseFloat(d.cpi_change);
            d.sp_change = parseFloat(d.sp_change);
            d.budget_change = parseFloat(d.budget_change);
            d.budget_as_percentage = parseFloat(d.budget_as_percentage);
            d.debt_change = parseFloat(d.debt_change);
            d.unemployment_change = parseFloat(d.unemployment_change);
            d.unemployment = parseFloat(d.unemployment);
        });
        dataset = data;
        barChart(dataset);
    }
});