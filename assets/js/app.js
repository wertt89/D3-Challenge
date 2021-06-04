// Setting up chart
var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Creating SVG wrapper, appending SVG group holding the chart and sets the margins
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Importing and formatting data to numerical values
d3.csv("assets/data/data.csv").then(function (CensusData) {
  console.log(CensusData);
  
  // Parsing data as numbers
  CensusData.forEach(function (data) {
        data.age = +data.age;
        data.smokes = +data.smokes;
    });

  // Creating scales
  var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(CensusData, d => d.age)])
    .range([0, width])
    .nice();

  var yLinearScale = d3.scaleLinear()
    .domain([6, d3.max(CensusData, d => d.smokes)])
    .range([height, 0])
    .nice();

  // Creating axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Appending axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // Creating scatter plot
  var circlesGroup = chartGroup.selectAll("circle")
    .data(CensusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "10")
    .attr("stroke-width", "1")
    .attr("fill", "blue")
    .attr("opacity", 0.75);  
    
  // Adding state abbreviation to each datapoint
  chartGroup.append("g")
  .selectAll('text')
  .data(CensusData)
  .enter()
  .append("text")
  .text(d=>d.abbr)
  .attr("x",d=>xLinearScale(d.age))
  .attr("y",d=>yLinearScale(d.smokes))
  .classed(".stateText", true)
  .attr("font-family", "sans-serif")
  .attr("text-anchor", "middle")
  .attr("fill", "white")
  .attr("font-size", "10px")
  .style("font-weight", "bold")
  .attr("alignment-baseline", "central");

  // Initializing tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("background", '#FFFFFF')
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Median age: ${d.age}<br>% of smokers: ${d.smokes}`);
    });

  // Creating tooltip in the chart
  chartGroup.call(toolTip);

  // Creating event triggers to display and hide the tooltip
  circlesGroup.on("click", function (data) {
    toolTip.show(data, this);
  })
    // Closing tool tip when cursor moved
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  // Creating axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .style("fill", "black")
    .style("font", "20px sans-serif")
    .style("font-weight", "bold")
    .text("% of smokers");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .style("font", "20px sans-serif")
    .style("font-weight", "bold")
    .text("Median age");

  }).catch(function (error) {
  console.log(error);
});