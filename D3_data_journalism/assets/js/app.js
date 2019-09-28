// SVG Dimensions
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//SVG Wrapper - chart holder 
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

//Data Import 
d3.csv("assets/data/data.csv")
  .then(function(censusData) {
      console.log("Raw Data:",censusData);

    //Cast 2 variables: Smoke & Age
    censusData.forEach(function(data) {
        data.smokes = +data.smokes;
        data.age = +data.age;

        console.log("-------------------------")
        console.log("Smokes", data.smokes);
        console.log("Age:", data.age);
    
    }); //Cast ending

    //Scaling 
    var xLinearScale = d3.scaleLinear()
      .domain([20, d3.max(censusData, d => d.age)])
      .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(censusData, d => d.smokes)])
      .range([height, 0]);
    
    //Axis Functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append Axes to Chart 
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    chartGroup.append("g")
        .call(leftAxis); 
    
    //Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "12")
    .attr("fill", "blue")
    .attr("opacity", ".3");

    //Labels on Circles
    chartGroup.append("g").selectAll("text")
    .data(censusData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.age))
    .attr("y", d => yLinearScale(d.smokes))
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "central")
    .attr("font-size", "10px")
    .attr("fill", "white")
    .style("font-weight", "bold");

    //Tool tip: display state abbrevation when hover mouse for further clarity
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([25, 0])
      .html(function(d) {
        return (d.abbr);
      });
 
    chartGroup.call(toolTip);
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
        });
    
    //Axes Setup 
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Smokes %");

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Age");


  }); //.then ending


