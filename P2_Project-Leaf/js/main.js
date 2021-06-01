/*
*    main.js
*/


var chartWidth = 600;
var chartHeight = 400;
var margin = {left:100, right: 10, top: 10, bottom: 100};

var k = 0;
var t = d3.transition().duration(1000);
var graph = d3.select("#chart-area").append("svg").attr("width", chartWidth + margin.right + margin.left)
	.attr("height", chartHeight + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var x = d3.scaleLog().domain([100, 150000]).range([0, chartWidth]).base(10);
var y = d3.scaleLinear().domain([0, 90]).range([chartHeight, 0]);

var graphArea = d3.scaleLinear().domain([2000, 1400000000]).range([25*Math.PI, 1500*Math.PI]);

var colorData = d3.scaleOrdinal().range(d3.schemePastel1);

var xAxis = d3.axisBottom(x).tickValues([250,2500,25000]).tickFormat(d3.format("$"));

var yAxis = d3.axisLeft(y);
var xAxisGroup = graph.append("g").attr("class", "bottom axis").attr("transform", "translate(0, " + chartHeight + ")");
var yAxisGroup = graph.append("g").attr("class", "y axis");

var record = graph.append("g").attr("transform", "translate(" + (chartWidth - 15) + "," + (chartHeight - 150) + ")");

var yAxisLabel = graph.append("text").attr("class", "y axis-label").attr("x", - (chartHeight / 2)).attr("y", -60).attr("font-size", "30px")
	                .attr("text-anchor", "middle").attr("transform", "rotate(-90)").text("Life Expectancy (Years)");

var xAxisLabel = graph.append("text").attr("class", "x axis-label").attr("x", (chartWidth / 2)).attr("y", chartHeight + 140).attr("font-size", "30px")
                    .attr("text-anchor", "middle").attr("transform", "translate(0, -70)").text("GDP Per Capita ($)");

var recordArea = graph.append("text").attr("class", "x axis-label").attr("x", chartWidth - 50).attr("y", chartHeight - 20)
	                .attr("font-size", "30px").attr("text-anchor", "middle").attr("fill", "black")


d3.json("data/data.json").then((data)=>{
	console.log(data);
	data.forEach((d)=>{
		d.year = +d.year;
	});

	const leafData = data.map((year) => {
		return year["countries"].filter((country) => {
		    var dataExists = (country.income && country.life_exp);
		return dataExists;
		}).map((country) => {
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country;
		})
	});
	var years = data.map((d) => {return d.year;});
	var mainland = leafData[0].map((d) => {return d.continent;});
	var continents = [...new Set(mainland)];

	colorData.domain(continents)
	continents.forEach((c, i) => {
		var row = record.append("g").attr("transform", "translate(0, " + (i * 20) + ")");
		row.append("rect").attr("width", 10).attr("height", 10).attr("fill", colorData(c)).attr("stroke", "black");
		row.append("text").attr("x", -20).attr("y", 10).attr("text-anchor", "end").text(c);
	});

	d3.interval( ( ) => {
		update(years[k % years.length], leafData[k % years.length]);
		k += 1;
	}, 1000);
	update(years[k % years.length], leafData[k % years.length]);
	k += 1;
});

function update(year, data) {

	recordArea.text(year);
	xAxisGroup.call(xAxis).selectAll("text").attr("y", "15").attr("x", "-10").attr("filled", "black").attr("text-anchor", "middle");

	yAxisGroup.call(yAxis);

	var circles = graph.selectAll("circle").data(data, (d) => { return d.country; });

	circles.exit()
	    .transition(t)
		.attr("cx", (d) => { return y(d.income); })
		.attr("cy", (d) => { return y(d.life_exp); })
		.attr("r", (d)=>{ return Math.sqrt(graphArea(d.population) / Math.PI);})
		.attr("fill", (d) => { return colorData(d.continent); })
		.remove();

	circles.transition(t)
		.attr("cx", (d) => { return x(d.income); })
		.attr("cy", (d) => { return y(d.life_exp); })
		.attr("r", (d)=>{ return Math.sqrt(graphArea(d.population) / Math.PI);})
		.attr("fill", (d) => { return colorData(d.continent); })

	circles.enter()
	.append("circle")
		.attr("fill", (d) => { return colorData(d.continent) })
		.attr("cx", (d) => { return x(d.income); })
		.attr("cy", (d) => { return y(d.life_exp); })
		.attr("r", (d)=>{ return Math.sqrt(graphArea(d.population) / Math.PI); })
		.merge(circles)
		.transition(t)
			.attr("cx", (d) => { return x(d.income); })
			.attr("cy", (d) => { return y(d.life_exp); })
			.attr("r", (d)=>{ return Math.sqrt(graphArea(d.population) / Math.PI); });
}