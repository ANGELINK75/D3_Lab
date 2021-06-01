/*
*    main.js
*/

var svg = d3.select("#chart-area").append("svg").attr("width", 400).attr("height", 400);
var circle = svg.append("circle").attr("cx", 100).attr("cy", 100).attr("r", 70).attr("fill", "blue");
var rect = svg.append("rect").attr("x", 20).attr("y", 20).attr("width", 20).attr("height", 30).attr("fill","red");


var Center1 = svg.append("circle").attr("cx", 300).attr("cy", 150).attr("r", 75).attr("fill", "blue");
var Center2 = svg.append("circle").attr("cx", 300).attr("cy", 150).attr("r", 60).attr("fill", "white");
var Center3 = svg.append("circle").attr("cx", 300).attr("cy", 150).attr("r", 45).attr("fill", "blue");
var Center3 = svg.append("circle").attr("cx", 300).attr("cy", 150).attr("r", 30).attr("fill", "white");
var CrossV = svg.append("rect").attr("x", 290).attr("y", 60).attr("width", 20).attr("height", 300).attr("fill","orange");
var CrossH = svg.append("rect").attr("x", 200).attr("y", 140).attr("width", 200).attr("height", 20).attr("fill","orange");