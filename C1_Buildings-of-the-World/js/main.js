/*
*    main.js
*/


var svg = d3.select("#chart-area").append("svg").attr("width", 700).attr("height", 1000);

d3.json("data/buildings.json").then((data)=> {
    console.log(data);
	data.forEach((d)=>{
		d.age = +d.age;
	});

    //var Building = [];
    for(var d=0; d<data.length; d++){
        var X = 50 + (50*d);
        var Y = 900 - data[d].height;
        var Building = svg.append("rect").attr("x", X).attr("y", Y)
                .attr("width", 40).attr("height", data[d].height).attr("fill","gray");
    }

}).catch((error)=> {
    console.log(error);
});