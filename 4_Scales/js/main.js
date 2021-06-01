/*
*    main.js
*/


var svg = d3.select("#chart-area").append("svg").attr("width", 500).attr("height", 500);


d3.json("data/buildings.json").then((data)=> {
    console.log(data);
	data.forEach((d)=>{
		d.age = +d.age;
	});

    var dataNames = data.map((d) => { return d.name; }) ;
    var dataColors = d3.scaleOrdinal().domain(dataNames).range(d3.schemeSet3);

    var x = d3.scaleBand().domain(dataNames).range([0,400]).paddingInner(0.3).paddingOuter(0.3);
    var y = d3.scaleLinear().domain([0,850]).range([0,400]);

    for(var d=0; d<data.length; d++){
        var posX = x(data[d].name);
        var posY = 500 - y(data[d].height);
        var Building = svg.append("rect").attr("x", posX).attr("y", posY)
                .attr("width", x.bandwidth() ).attr("height", y(data[d].height) ).attr("fill", dataColors(data[d].name) );
    }

}).catch((error)=> {
    console.log(error);
});