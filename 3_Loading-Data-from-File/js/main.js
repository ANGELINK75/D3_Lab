/*
*    main.js
*/

d3.csv("data/ages.csv").then((data)=> {
	console.log(data);
});

d3.tsv("data/ages.tsv").then((data)=> {
	console.log(data);
});


var svg = d3.select("#chart-area").append("svg").attr("width", 800).attr("height", 400);

d3.json("data/ages.json").then((data)=> {
    console.log(data);
	data.forEach((d)=>{
		d.age = +d.age;
	});

    var People = [];
    for(var d=0; d<data.length; d++){
        var X = 50 + (50*d);
        People = svg.append("circle").attr("cx", X).attr("cy", 100).attr("r", (data[d].age * 2) ).attr("fill", "blue");
    }

}).catch((error)=> {
    console.log(error);
});