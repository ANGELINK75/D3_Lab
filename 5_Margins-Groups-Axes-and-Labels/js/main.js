/*
*    main.js
*/

var chartWidth = 600;
var chartHeight = 400;
var margin = {top: 10, right: 10, bottom: 100, left:100};

var svg = d3.select("#chart-area").append("svg").attr("width", (chartWidth + margin.right + margin.left) )
                                                .attr("height", (chartHeight + margin.top + margin.bottom) );

var graph = svg.append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

d3.json("data/buildings.json").then((data)=> {
    console.log(data);
	data.forEach((d)=>{
		d.age = +d.age;
	});

    var dataNames = data.map((d) => { return d.name; }) ;
    var dataColors = d3.scaleOrdinal().domain(dataNames).range(d3.schemeSet3);

    var x = d3.scaleBand().domain(dataNames).range([0,chartWidth]).paddingInner(0.3).paddingOuter(0.3);
    var y = d3.scaleLinear().domain([850,0]).range([0,chartHeight]);

    var rects = graph.selectAll("rect").data(data);
    for(var d=0; d<data.length; d++){
        rects.enter().append("rect").attr("x", x(data[d].name) ).attr("y", y(data[d].height) )
            .attr("height", chartHeight - y(data[d].height) ).attr("width", x.bandwidth())
            .attr("fill", dataColors(data[d].name) );
    }

    var xAxis = d3.axisBottom(x);
    graph.append("g").attr("class", "bottom axis").attr("transform", "translate(0, " + chartHeight + ")").call(xAxis)
                .selectAll("text").attr("y", "15").attr("x", "0").attr("text-anchor", "end").attr("transform", "rotate(-30)");

    var yAxis= d3.axisLeft(y).ticks(5).tickFormat( (d) => {return d + "m"} );
    graph.append("g").attr("class", "left axis").call(yAxis);

    g.append("text").attr("class", "x axis-label").attr("x", (chartWidth / 2)).attr("y", chartHeight + 140).attr("font-size", "18px")
                    .attr("text-anchor", "right").text("World's Tallest Buildings");

    g.append("text").attr("class", "y axis-label").attr("x", - (chartHeight / 2)).attr("y", -60).attr("font-size", "18px")
                    .attr("text-anchor", "right").attr("transform", "rotate(-90)").text("Height(m)");


}).catch((error)=> {
    console.log(error);
});
