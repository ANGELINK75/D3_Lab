/*
*    main.js
*/

var chartWidth = 600;
var chartHeight = 400;
var margin = {left:100, right: 10, top: 10, bottom: 100};

var interval;
var leafData = [];
var years = []
var t = 0;
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
	years = data.map((d) => {return d.year;});
	var mainland = leafData[0].map((d) => {return d.continent;});
	var continents = [...new Set(mainland)];

	colorData.domain(continents)
	continents.forEach((c, i) => {
		var row = record.append("g").attr("transform", "translate(0, " + (i * 20) + ")");
		row.append("rect").attr("width", 10).attr("height", 10).attr("fill", colorData(c)).attr("stroke", "black");
		row.append("text").attr("x", -20).attr("y", 10).attr("text-anchor", "end").text(c);
	});

	update(years[k % years.length], leafData[k % years.length], t);
	k += 1;
});

function update(year, data, t) {

	var ySld = $("#date-slider").slider("value");
	year = years[ySld]

    var continent = $("#cmbContinent").val();
    var yData = data.filter((d) => { if (continent == "all") { return true; }
		                            else{ return d.continent == continent; } });

    var tip = d3.tip().attr('class', 'd3-tip')
	.html((d) => {
		var text = "<strong>Country:</strong>";
		text += "<span style='color:blue'> " + d.country + "</span><br>";
		text += "<strong>Continent:</strong> ";
		text += "<span style='color:blue;text-transform:capitalize'>" + d.continent + "</span><br>";
		text += "<strong>Life Expectancy:</strong>";
		text += "<span style='color:blue'>" + d3.format(".2f")(d.life_exp) + "</span><br>";
		text += "<strong>GDP Per Capita:</strong>";
		text += "<span style='color:blue'>" + d3.format("$,.0f")(d.income) + "</span><br>";
		text += "<strong>Population:</strong>";
		text += "<span style='color:blue'>" + d3.format(",.0f")(d.population) + "</span><br>";
		return text;
	});
    graph.call(tip);

	recordArea.text(ySld);

	xAxisGroup.call(xAxis).selectAll("text").attr("y", "15").attr("x", "-10").attr("filled", "black").attr("text-anchor", "middle");
	yAxisGroup.call(yAxis);

	var circles = graph.selectAll("circle").data(yData, (d) => { return d.country; });

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

	$("#sldYear").slider("value", +(k + 1800));
	$("#year")[0].innerHTML = +(ySld);
}

function step(){
	update(years[k % years.length], leafData[k % years.length], t);
	k += 1;
}

$("#btnPlay").on("click", ( ) => {
	var button = $("#btnPlay");
	if (button.text() == "Play"){
		button.text("Pause");
		interval = setInterval(step, 1000);
	} else if (button.text() == "Pause"){
		button.text("Play");
		clearInterval(interval);
	}
});

$("#btnReset").on("click", ( ) => { k = 0; });

$("#cmbContinent").on("change", ( ) => {
	update(years[k % years.length], leafData[k % years.length], t);
	k += 1;
});

$("#sldYear").slider({
	max: 2014,
	min: 1800,
	step: 1,
	slide:(event, ui) => {
		k = ui.value - 1800;
		update(years[k % years.length], leafData[k % years.length], t);
		k += 1;
	}
});
