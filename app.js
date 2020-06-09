var framewidth2 = 1400,
    frameheight2 = 800;
    radius = 105;

var color = d3.scale.linear().range(["#ef8a62","#67a9cf"]).domain([0,24]);

var arc = d3.svg.arc()
    .outerRadius(radius *.6)
    .innerRadius(radius *.4);

var outerArc = d3.svg.arc()
	    .innerRadius(radius * 0.7)
	    .outerRadius(radius * 0.7);

var margin2 = {"left":50,"top":50,"right":50,"bottom":50};

var hour = [];
var hour2 = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
var date2 = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"];
for ( var i = 0 ; i<24 ;i++){ hour.push({"label":i,"value":1})}
var date = [];
for ( var j = 0 ; j<30 ;j++){ date.push({"label":j,"value":1})}

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.value; });

var dashboard2 = d3.select("#dashboard2").append("svg")
        .attr("width", framewidth2)
        .attr("height", frameheight2);

var widget = dashboard2.append("g").attr("transform", "translate(" + (margin2.left) + "," + (margin2.top) + ")");

var calender = widget.append("g");

var gridSize = radius*2/7;

var selectDate = 1;
var selectHour = 15;
var file = "./data/bikeshare/bs_2012_11_".concat(date2[0] + ".csv");

// initiate the calendar heat map
var calmap = calender.append("g");

  calmap.selectAll(".rect").data(date).enter().append("rect")
        .attr("x", function(d,i) { return ((i+4)%7)* gridSize; })
        .attr("y", function(d,i){ return Math.floor((i+4)/7)*gridSize})
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("id", function(d){ return "rect" + (+d.label+1);})
        .attr("width", gridSize*0.9)
        .attr("height", gridSize*0.9)
        .style("fill", function(d){ return x = (+d.label+1 === selectDate) ? "gray" : "silver"}).style("stroke","white")
        .on("mouseover", function(d){ d3.select(this).style("stroke","gray") ;})
        .on("mouseout", function(d){d3.select(this).style("stroke","white") ;})
        .on("click", function(d){

            d3.select(this).style("fill","gray");
            selectDate_ = "#rect" + selectDate;
            console.log(selectDate_);
            d3.select(selectDate_).transition().duration(300).style("fill","silver");
            selectDate = +d.label+1;

            // selected file change
            file = "./data/bikeshare/bs_2012_11_".concat(date2[+d.label] + ".csv");
//            plotCircle();
            updateCal(file);

        });


var days = ["Sun","Mon","Tue","Wed","Thur","Fri","Sat"];
var daysText = calender.append("g");
    daysText.selectAll(".days").data(days).enter().append("text").attr("x", function(d,i) { return (i+0.5) * gridSize; }).attr("y", -5)
                    .text(function(d){return d;}).style({"font-size":10,"text-anchor":"middle","font-family":"georgia, serif","font-weight":"bold"});

var dateText = calender.append("g");
    dateText.selectAll(".date").data(date).enter().append("text")
            .attr("x", function(d,i) { return ( ((i+4)%7) + 0.5)* gridSize; })
            .attr("y", function(d,i){ return (Math.floor((i+4)/7) + 0.5)*gridSize})
            .text(function(d){return (+d.label+1);}).style({"font-size":10,"text-anchor":"middle","font-family":"georgia, serif","font-weight":"bold"});

var donutChart = widget.append("g").attr("transform", "translate(" + radius + "," + (radius + gridSize*5) + ")");


// initial the clock donut chart
var donut = donutChart.selectAll(".arc")
        .data(pie(hour))
        .enter().append("g")
        .attr("class", "arc");


    donut.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color(d.data.label)}).style({"stroke":"white","stroke-width":"1"})
            .on("mouseover", function(d){
                d3.select(this).style("opacity",0.5);
            })
            .on("mouseout", function(d){
                d3.select(this).style("opacity",1);
            })
            .on("click", function(d){
                console.log(d);
                selectHour = +d.data.label;
                selectHourText.transition().duration(1000).style("fill","gray");

                updateClock(+d.data.label);


                selectHourText = d3.select("#hourText"+selectHour);
                selectHourText.style("fill","#fb8072");

                });


    donut.append("text")
      .attr("transform", function(d) { return "translate(" + outerArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .attr("id", function(d){ return "hourText"+d.data.label;})
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.label; })
            .style("fill",function(d){return (d.data.label === selectHour) ? "#fb8072" : "gray";})
            .style("font-size",14);

var selectHourText = d3.select("#hourText15");

var starthour = 15;

var width2 = 250;
var height2 = 100;

var xScale1 = d3.time.scale().range([0, width2]),
    yScale1 = d3.scale.linear().range([height2, 0]);

var xAxis1 = d3.svg.axis().scale(xScale1).orient("bottom").ticks(3),
    yAxis1 = d3.svg.axis().scale(yScale1).orient("left").ticks(3);

var line1 = d3.svg.line()
    .interpolate("cardinal") // smoothing method
    .x(function(d) { return xScale1(d.hour); })
    .y(function(d) { return yScale1(d["net"]); });

var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
var parseDate2 = d3.time.format("%H").parse;
var temperatureHeight = 100;
var lineChart1 = dashboard2.append("g").attr("transform", "translate(" + margin2.left + "," + (margin2.top + radius*2 + gridSize*5 + temperatureHeight) +")");
var dcmap = dashboard2.append("g").attr("transform", "translate(" + 500 + "," + margin2.top +")");


function compare(a,b) {
  if (a.hour < b.hour)
     return -1;
  if (a.hour > b.hour)
    return 1;
  return 0;
}
var lineChartLegend = ["steelblue","black"];
var legend = lineChart1.selectAll(".legend")
      .data(lineChartLegend)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + (1+(i+2)/5)*height2 + ")"; });

var legendline = legend.append("line")
      .attr("x1", 5)
      .attr("y1", 0)
      .attr("x2", 15)
        .style("stroke",function(d){return d;})
        .style({"fill":"none","stroke-width":2});



var linevalues0 = null;
var linevalues1 = null;
var linedata = null;

// updates the symbols values, must happen before drawing
var missStation = hour2.map(function(d){return 0;});
plotLineChart.values0 = function(_) {
        if (!arguments.length) {return linevalues0;}
        linevalues0 = _;
        return plotLineChart;
        };
plotLineChart.values1 = function(_) {
        if (!arguments.length) {return linevalues1;}
        linevalues1 = _;
        return plotLineChart;
        };
plotLineChart.data = function(_) {
        if (!arguments.length) {return linedata;}
        linedata = _;
        return plotLineChart;
        };
plotLineChart.update1 = function(){

    var data_ = [];
    var data2_ = [];

    linedata.forEach(function (d) {
        if (d.station === station0) {data_.push(d);}
        if (d.station === station1){ data2_.push(d);}
    });

    // if miss station0 or 1
    if ( data_.length < 24){ data_ = missStation;}
    if ( data2_.length < 24){ data2_ = missStation;}

    data_.sort(compare);
    data2_.sort(compare);
//    console.log(data_);
//    console.log(data2_);
    plotLineChart.values0(data_);
    plotLineChart.values1(data2_);
    d3.select("#line0").datum(linevalues0).transition().duration(1000).attr("d", line1);
    d3.select("#line1").datum(linevalues1).transition().duration(1000).attr("d", line1);

    //update line chart
};
plotLineChart.updateAxis = function(){


    xScale1.domain(d3.extent(linedata.map(function (d) {return d.hour;}))).ticks(4);
    yScale1.domain(d3.extent(linedata.map(function (d) {return d["net"];})));
//    console.log(yScale1.domain());
    yAxis1.scale(yScale1);
    d3.select("#lineChartyAxis").transition().duration(1000).call(yAxis1);
    var yGuide_ = d3.select("#lineChartyAxis");
    yGuide_.selectAll('line').style({"fill": "none", "stroke": "black"});
    yGuide_.selectAll('path').style({"fill": "none", "stroke": "black"});

};

var lineCount = 0; // for selecting the line chart
function updatelineChart(station, net){


    d3.csv(file,

        function(d){

                return {
                    "hour": parseDate2(d.hour),
                    "net": +d.net,
                    "station": d.station,
                    "lat" : +d.lat,
                    "lon" : +d.lon,
                    "zipcode" : d.postal_code};},

        function(error,data) {


            var data_ = [];

            data.forEach(function (d) {
                if (d.station === station) {
                    data_.push(d);
                }
            });
            data_.sort(compare);

            if (lineCount%2 === 0){
                plotLineChart.values0(data_);
                d3.select("#line0").datum(linevalues0).transition().duration(1000).attr("d", line1);
                d3.select("#linelegendlabel0").transition().duration(1000).text(station);
                station0 = station;
            }
            else{
                plotLineChart.values1(data_);
                d3.select("#line1").datum(linevalues1).transition().duration(1000).attr("d", line1);
                d3.select("#linelegendlabel1").transition().duration(1000).text(station);
                station1 = station;
            }
            lineCount++;


        })


}



//initiate the map
var projection = d3.geo.mercator().center([-77.0164,38.9047]).scale(120000).rotate([0,0,0]);
var path = d3.geo.path().projection(projection);

var opacity = d3.scale.linear().range([0.5,.9]);

var tooltip1 = d3.select("body").append("div")
    			 .attr("class", "tooltip")
   				 .style("opacity", 0.0);

var tooltip2 = d3.select("body").append("div")
    			 .attr("class", "tooltip")
   				 .style("opacity", 0.0);

var selectCircle0 = null;
var selectCircle1 = null;
var circleCount = 0;

d3.json("./data/dczipcode.geojson", function(error,dc){

        if (error) return console.error(error);
        console.log(dc);
//        console.log(topojson.feature(dc, dc.objects.dcZip));

//        console.log(topojson.feature(dc, dc.objects.dczipcode));
        dcmap.selectAll('path')
//            .data(topojson.feature(dc, dc.objects.dczipcode).features).enter().append('path')
            .data(dc.features).enter().append('path').attr("translate","transform(" + margin2.left + "," + (margin2.top + 200) +")")
            .attr("d", path).style("fill","rgb(192, 192, 192)").style({"stroke":"white","stroke-width":2});
        plotCircle();
    });
//initial the circle on the map

var circleData = null;
plotCircle.data = function(_){
        if (!arguments.length) {return linevalues0;}
        circleData= _;
        return plotCircle;
        };
function plotCircle(){

//    d3.csv("./data/bikeshare/bs_2012_11_01.csv",
    d3.csv(file,
        function(d){
                return {
                    "hour": +d.hour,
                    "net": +d.net,
                    "station": d.station,
                    "lat" : +d.lat,
                    "lon" : +d.lon,
                    "zipcode" : d.postal_code
                };
        },
        function(error,data) {

            console.log(error);
            console.log(file);

            var data_ = [];
            data.forEach(function (d) {
                if (d.hour === selectHour) {
                    data_.push(d);
                }
            });


            opacity.domain(d3.extent(data_.map(function (d) {
                return Math.abs(d.net);
            })));

// initiate two sided barchart
d3.csv(file,

        function(d){
                return {
                    "hour": +d.hour,
                    "net": +d.net,
                    "station": d.station,
                    "zipcode": +d.postal_code
                };
        },
        function(error,data){

            console.log(error);


            var temp = d3.nest().key(function(d){return d.hour})
                    .key(function(d){return d.zipcode;}).sortKeys(d3.ascending)
                    .rollup(function(d){ return d3.sum(d, function(e){ return e.net;});}).entries(data);


            plotTwoSideBar.values(temp);
            plotTwoSideBar();
        });





function plotTwoSideBar(){

    var dataRange = [];
    bardata.forEach(function(d){d.values.forEach(function(e){ dataRange.push(e.values);});});
    xScale.domain(d3.extent(dataRange));
    yScale.domain( bardata[0].values.map(function (d) {return d.key;}));
    var data_ = [];
    bardata.forEach(function(d){
        if (+d.key === selectHour){
            d.values.forEach(function(e){ data_.push(e);});
        } });

    console.log(yScale.domain());
    console.log(data_);
    console.log(bardata);
    var xGuide = twoSidedBar.append("g").attr("class", "x axis").attr("id", "xAxis1").call(xAxis);
    var yGuide = twoSidedBar.append("g").attr("class", "y axis").attr("id", "yAxis1").call(yAxis);

    xGuide.selectAll('line').style({"fill": "none", "stroke": "black"});
    xGuide.selectAll('path').style({"fill": "none", "stroke": "black"});

    var xGuideText = xGuide.append("text").attr("transform","translate(" + width1/2 + ",0)").attr("y",-30).text("Bike Demand").style("text-anchor","middle");

    yGuide.selectAll('line').style({"fill": "none", "stroke": "black"});
    yGuide.selectAll('path').style({"fill": "none", "stroke": "black"});

    var yGuideText = yGuide.append("text").attr("y", -60).attr("x", -height1/2).attr("transform", "rotate(-90)").text("zipcode").style("text-anchor","middle");

    var grid = twoSidedBar.append("g");

    grid.append("line").attr("class","grid").attr("id","zeroGrid")
            .attr("x1", xScale(0))
            .attr("x2", xScale(0))
            .attr("y2", height1).style({"fill":"none","stroke":"black"});

    grid.selectAll(".grid").data(data_).enter().append("line")
            .attr("x1",0)
            .attr("y1",function(d){return yScale(d.key) - 0.05*yScale.rangeBand();})
            .attr("x2",width1)
            .attr("y2",function(d){return yScale(d.key) - 0.05*yScale.rangeBand();}).style({"fill":"none","stroke":"gray","stroke-width":0.5});


    var bars = twoSidedBar.selectAll(".bar").data(data_).enter().append('rect')
            .attr("class","bars")
            .attr("id", function(d,i){ return "bar" + d.key})
            .attr("x",  function(d){
                if(d.values>=0){return xScale(0);}
                else{ return xScale(d.values);}
            })
            .attr("y",  function(d){return yScale(d.key);})
            .attr("height", yScale.rangeBand())
            .attr("width", function(d){

                if(d.values>=0){return xScale(d.values) - xScale(0);}
                else{ return xScale(0) - xScale(d.values);}
            })
            .style("fill","steelblue")
            .on("mouseover", function(d) {

                tooltip2.transition().duration(200)
                        .style("opacity", 1);

                tooltip2.html("<strong>Demand: </strong><span style='color:red'>" + d.values + "</span>")
                        .style("left", (event.pageX + 15) + "px")
                        .style("top", (event.pageY - 10) + "px");
                d3.select(this).style("opacity", 0.5);
//                console.log(d);
                plotCircle.hover(d.key);


            })
            .on("mouseout", function(d){

                tooltip2.transition().style("opacity", 0);
                d3.select(this).style("opacity", 1);
                plotCircle.hover_();
            });


}

plotTwoSideBar.values = function(_) {
        if (!arguments.length) {return bardata;}
        bardata = _;
        return plotTwoSideBar;
        };
plotTwoSideBar.update = function(_){
        if (!arguments.length) {return bardata;}

        // data transformation
        // select the data that corresponds to selected hour
        var data_ = [];
        bardata.forEach(function(d){
            if (+d.key === _ ){
                d.values.forEach(function(e){ data_.push(e);});
            } });

        // update the bar chart
        data_.forEach( function(d){

                var bar = "#bar" + d.key;

                d3.select(bar).datum(d).transition().duration(1000)
                    .attr("x", function(d){
                        if(d.values >=0 ){return xScale(0);}
                        else{return xScale(d.values);}})
                    .attr("width", function(d){
                        if(d.values >=0 ){return xScale(d.values)-xScale(0);}
                        else{return xScale(0)-xScale(d.values);}})
                });

        return plotTwoSideBar;
        };
plotTwoSideBar.updateAxis = function(){

    var dataRange = [];
    bardata.forEach(function(d){d.values.forEach(function(e){ dataRange.push(e.values);});});
    xScale.domain(d3.extent(dataRange));
    xAxis.scale(xScale);
    d3.select("#xAxis1").transition().duration(1000).call(xAxis);
    var xGuide_ = d3.select("#xAxis1");
    xGuide_.selectAll('line').style({"fill": "none", "stroke": "black"});
    xGuide_.selectAll('path').style({"fill": "none", "stroke": "black"});

    d3.select("#zeroGrid").transition().duration(1000)
            .attr("x1", xScale(0))
            .attr("x2", xScale(0));

//    yScale.domain( bardata[0].values.map(function (d) {return d.key;}));
//    console.log(yScale.domain().length);
//    yAxis.scale(yScale);
//    d3.select("#yAxis1").transition().duration(1000).call(yAxis);
};

function updateCal(file) {
    // read the new data from new file
    d3.csv(file,
            // parse the new data
            function (d) {
                return {
                    "hour": parseDate2(d.hour),
                    "net": +d.net,
                    "station": d.station,
                    "lat": +d.lat,
                    "lon": +d.lon,
                    "zipcode": d.postal_code
                };
            },
            // create data for barplot
            function (error, data) {

                // update two sided bar chart
                var temp = d3.nest().key(function (d) {return d.hour.getHours()})
                        .key(function (d) {return d.zipcode;}).sortKeys(d3.ascending)
                        .rollup(function (d) {return d3.sum(d, function (e) {return e.net;});
                        }).entries(data);

                // update bardata
                plotTwoSideBar.values(temp);
                plotTwoSideBar.updateAxis();
                console.log(selectHour);
                plotTwoSideBar.update(selectHour);

                //update linedata
                plotLineChart.data(data);
                plotLineChart.updateAxis();
                plotLineChart.update1();

                //update temperature
                plotTemperature.update();

                // update circles
                var data_ = [];
                data.forEach(function (d) {
                    if (d.hour.getHours() === selectHour) {
                        data_.push(d);
                    }
                });
                plotCircle.data(data_);
                plotCircle.update1();
            });
}
function updateClock(hour){

        d3.csv(file,
        function(d){
                return {
                    "hour": +d.hour,
                    "net": +d.net,
                    "station": d.station,
                    "lat" : +d.lat,
                    "lon" : +d.lon,
                    "zipcode" : d.postal_code
                };
        },
        function(error,data) {

//            console.log(data);
//            console.log(hour);


            // update two sided bar chart
            var temp = d3.nest().key(function(d){return d.hour})
                    .key(function(d){return d.zipcode;}).sortKeys(d3.ascending)
                    .rollup(function(d){ return d3.sum(d, function(e){ return e.net;});}).entries(data);

            //updae two-side barchart
            plotTwoSideBar.values(temp);
            plotTwoSideBar.update(hour);

            //update temperature
            plotTemperature.update();

            //update circle
            var data_ = [];
                data.forEach(function (d) {
                    if (d.hour === hour) {
                        data_.push(d);
                    }
                });
            plotCircle.data(data_);
            plotCircle.update();

                    });

}

selectTemp = null;
selectWeather = null;

var temperature = widget.append('g')
        .attr("transform","translate(0," + (radius*2 + gridSize*4) + ")");
var tempRect = temperature.append("rect")
        .attr("width",gridSize*7)
        .attr("height",temperatureHeight)
        .style("fill","none");
var temperatureData = null;


    d3.csv('./data/projectData.csv', function(d){
        return { "weather": +d.weather,
                "temp": +d.temp,
                "humidity": +d.humidity,
                "windspeed": +d.windspeed,
                "day" : +d.day,
                "hour" : +d.hour};
            }, function(error,data){

        data.forEach(function(d){

            if (d.hour === selectHour && d.day === selectDate){
                console.log(d);
                selectTemp = d.temp;
                console.log(d.weather);
                switch (d.weather){

                    case 1: selectWeather = "Clear, Partly Cloudy";
                        break;
                    case 2: selectWeather = "Mist, Cloudy";
                        break;
                    case 3: selectWeather = "Light Snow, Rain";
                        break;
                    case 4: selectWeather = "Heavy Rain, Thunderstorm";
                        break;
                    default: selectWeather = "";
                }
//                selectWeather = d.weather;
                console.log(selectWeather)
            }
        });
        var temp = d3.nest().key(function(d){return d.day}).sortKeys(d3.ascending)
                    .key(function(d){return d.hour;}).sortKeys(d3.ascending)
//                    .rollup(function(d){ return d3.sum(d, function(e){ return ;});})
                    .entries(data);

                console.log(temp);
        plotTemperature.data(temp);
        plotTemperature()
        }
    );

function plotTemperature(){

    temperature.append("text").attr("id","temperatureText").attr("transform","translate(0,45)").text(selectTemp+"˚C, ")
            .style({"font-family": "arial, sans-serif", "fill": "gray", "font-size": "24px", "font-weight": "bold"});
    temperature.append("text").attr("id","weatherText").attr("transform","translate(0,80)").text(selectWeather)
            .style({"font-family": "arial, sans-serif", "fill": "gray", "font-size": "24px", "font-weight": "bold"});
}
plotTemperature.data = function(_){
        if (!arguments.length) {return linevalues0;}
        temperatureData= _;
        return plotLineChart;
        };
plotTemperature.update = function(_){

    selectTemp = temperatureData[selectDate-1]["values"][selectHour]["values"][0]["temp"];
//    console.log(selectTemp);
    switch (temperatureData[selectDate-1]["values"][selectHour]["values"][0]["weather"]){

                    case 1: selectWeather = "Clear, Partly Cloudy";
                        break;
                    case 2: selectWeather = "Mist, Cloudy";
                        break;
                    case 3: selectWeather = "Light Snow, Rain";
                        break;
                    case 4: selectWeather = "Heavy Rain, Thunderstorm";
                        break;
                    default: selectWeather = "";
                }
//    console.log(selectWeather);
    d3.select("#temperatureText").transition().duration(1000).text(selectTemp+"˚C, ");
    d3.select("#weatherText").transition().duration(1000).text(selectWeather);
};
