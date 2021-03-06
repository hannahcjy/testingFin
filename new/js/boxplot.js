    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    
    // append the svg object to the body of the page
    var svg = d3.select("#boxplot")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    
    // Read the data and compute summary statistics for each month
    d3.csv("../grouped_data.csv", function(data) {
    
      var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d.Date.split("/")[1];})
        .rollup(function(d) {
          q1 = d3.quantile(d.map(function(g) { return g.Ave_duration/60;}).sort(d3.ascending),.25)
          median = d3.quantile(d.map(function(g) { return g.Ave_duration/60;}).sort(d3.ascending),.5)
          q3 = d3.quantile(d.map(function(g) { return g.Ave_duration/60;}).sort(d3.ascending),.75)
          interQuantileRange = q3 - q1
          min = q1 - 1.5 * interQuantileRange
          max = q3 + 1.5 * interQuantileRange
          return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
        })
        .entries(data)
    
      // Show the X scale
      var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(["1", "2", "3","4","5","6","7","8","9","10","11","12"])
        .paddingInner(1)
        .paddingOuter(.5)
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
    
      // Show the Y scale
      var y = d3.scaleLinear()
        .domain([0,50])
        .range([height, 0])
      svg.append("g").call(d3.axisLeft(y))
    
      // Show the main vertical line
      svg
        .selectAll("vertLines")
        .data(sumstat)
        .enter()
        .append("line")
          .attr("x1", function(d){return(x(d.key))})
          .attr("x2", function(d){return(x(d.key))})
          .attr("y1", function(d){return(y(d.value.min))})
          .attr("y2", function(d){return(y(d.value.max))})
          .attr("stroke", "black")
          .style("width", 40)
    
      // rectangle for the main box
      var boxWidth = 30
      svg
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
            .attr("x", function(d){return(x(d.key)-boxWidth/2)})
            .attr("y", function(d){return(y(d.value.q3))})
            .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
            .attr("width", boxWidth )
            .attr("stroke", "black")
            .style("fill", "#69b3a2")
    
      // Show the median
      svg
        .selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
          .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
          .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
          .attr("y1", function(d){return(y(d.value.median))})
          .attr("y2", function(d){return(y(d.value.median))})
          .attr("stroke", "black")
          .style("width", 80)

    })