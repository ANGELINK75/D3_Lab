/*
*    main.js
*/

var chartWidth = 600;
var chartHeight = 400;
var margin = {top: 10, right: 10, bottom: 100, left:100};

var flag = true;
var t = d3.transition().duration(750);
var svg = d3.select("#chart-area").append("svg").attr("width", (chartWidth + margin.right + margin.left) )
                                                .attr("height", (chartHeight + margin.top + margin.bottom) );

var graph = svg.append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var x = d3.scaleBand().range([0,chartWidth]).paddingInner(0.3).paddingOuter(0.3);
var y = d3.scaleLinear().range([chartHeight,0]);

var xAxisGroup = graph.append("g").attr("class", "bottom axis")
            .attr("transform", "translate(0, " + chartHeight + ")");

var yAxisGroup = graph.append("g").attr("class", "y axis");

var yAxisLabel = graph.append("text").attr("class", "y axis-label").attr("x", - (chartHeight / 2)).attr("y", -60).attr("font-size", "24px")
                    .attr("text-anchor", "middle").attr("transform", "rotate(-90)").text("Revenue (Dollars)");

d3.json("data/revenues.json").then((data)=> {
    console.log(data);
	data.forEach((d)=>{
		d.revenue = parseInt(d.revenue);
		d.profit= +d.profit;
	});

    d3.interval( ( ) => { update(data);
        var newData = flag ? data : data.slice(1);
		update(newData);
        flag = !flag;
	}, 1000);
    update(flag ? data : data.slice(1));

}).catch((error)=> {
    console.log(error);
});

function update(data) {

    var value = flag ? "revenue" : "profit";

    x.domain(data.map((d) => { return d.month; }))
    y.domain([0, d3.max(data, (d) => { return d[value]; })])

    var xAxis = d3.axisBottom(x);
    xAxisGroup.call(xAxis).selectAll("text").attr("y", "15").attr("x", "0").attr("filled", "white")
                                            .attr("text-anchor", "middle").attr("transform", "rotate(-10)");

    var yAxis= d3.axisLeft(y).ticks(5).tickFormat( (d) => {return "$" + d/1000 + "k"} );
    yAxisGroup.transition(t).call(yAxis);

    graph.append("text").attr("class", "x axis-label").attr("x", (chartWidth / 2)).attr("y", chartHeight + 140).attr("font-size", "24px")
                    .attr("text-anchor", "middle").attr("transform", "translate(0, -50)").text("Month");


    var yLabel = flag ? "Revenue" : "Profit";
    yAxisLabel.text(yLabel)

    var bars = graph.selectAll("rect").data(data, (d) => { return d.month; });
    bars.exit().transition(t).attr("y", y(0)).attr("height", 0).remove();

    bars.attr("x", (d) => { return x(d.month); })
	    .attr("y", (d) => { return y(d[value]); })
	    .attr("width", x.bandwidth)
	    .attr("height",(d) => { return chartHeight - y(d[value])});

    bars.enter()
        .append("rect")
            .attr("x", (d) => { return x(d.month); })
            .attr("y", chartHeight)
            .attr("height", 0)
            .attr("width", x.bandwidth())
            .attr("fill", "yellow")
            .merge(bars)
            .transition(t)
                .attr("x", (d) => { return x(d.month) })
                .attr("y", (d) => { return y(d[value]); })
                .attr("width", x.bandwidth)
                .attr("height", (d) => { return chartHeight - y(d[value]); })
                .attr("fill", ()=>{ return flag ? "yellow" : "orange"; });

}