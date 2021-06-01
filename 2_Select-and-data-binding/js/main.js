/*
*    main.js
*/
var svg = d3.select("#chart-area").append("svg").attr("width", 400).attr("height", 400);
var data = [25, 20, 15, 10, 5];

var Rectangles = [];


for(var d=0; d<data.length; d++){
    var X = (60*d);
    console.log(data[d]);
    Rectangles.push( svg.append("rect").attr("x", X).attr("y", 100)
          .attr("width", 40).attr("height", data[d]).attr("fill","orange") );
}
