

function dataOmzet() {
	let result = fetch('../convertcsvdata.json') 
		.then(data => data.json())
		.then(json => {
			// console.log(json)
 			const newResults = json.map(result => {
			return {
					id: result.response_ID,
					afkomst: result.Herkomst_def,
					totstand: result.Totstand,
					contact: result.Contact_gehad,
					freqcontact: result.freqcontact,
					//responseCount: Number(1)
					}
		})
		//data = transformData(newResults)
		// console.log(newResults)
		//bouwViz(newResults)
		bubbleChart(newResults)
})
}
dataOmzet() 


// function bubbleChart2(results){



function bubbleChart(results) {


		
	function remove99999(data){
		data.forEach(data => {
			for (let key in data) {
				if (data[key] == '99999') {
				delete data[key];
				}
			}
		});
		return data;
	}

	data = remove99999(results);


	/*
		function removeNull(data){
			data.forEach(data => {
				for (let key in data) {
					if (data[key] == '#NULL!') {
					delete data[key];
					}
				}
			});
			return data;
		}
		data = removeNull(results);
		console.log(results)
	*/
	
		function transformData(data){
			let transformed =  d3.nest()
				  .key(d => d.afkomst)
				  //.key(d => d.contact)
				  //.value(d => d.freqcontact)
				.rollup(function(v) { 
						return d3.sum(v, function(d) { return d.freqcontact; });
					 })
				.entries(data)
				//.map (function (group){
				//	return {
				// 		afkomst: group.key,
				// 		//contact: group.values,
				// 		freqcontact: group.values[4]
			 	//}
				 //})
			return transformed
		}

		data = transformData(data)

		console.log("transformed: ", data)



		let datasetSub = JSON.stringify(data);
		
		//console.log(datasetSub)
		dataset = {"children": JSON.parse(datasetSub)}
		console.log(dataset)
		


var diameter = 600;
var color = d3.scaleOrdinal(d3.schemeCategory20);
// console.log(results)
var bubble = d3.pack(dataset)
		.size([diameter, diameter])
		.padding(1.5);

var svg = d3.select(".chart")
		.append("svg")
		.attr("width", diameter)
		.attr("height", diameter)
		.attr("class", "bubble");
	
var div = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);	

var nodes = d3.hierarchy(dataset)
		.sum(function(d) { return d.value; });

		// var simulation = d3.forceSimulation(nodes)
		// .force('charge', d3.forceManyBody().strength(5))
		// .force('center', d3.forceCenter(width / 2, height / 2))
		// .force('collision', d3.forceCollide().radius(function(d) {
		//   return d.radius
		// }))
		// .on('tick', ticked);
	  
	//   function ticked() {
	// 	var u = d3.select('svg')
	// 	  .selectAll('circle')
	// 	  .data(nodes)
	  
	// 	u.enter()
	// 	  .append('circle')
	// 	  .attr('r', function(d) {
	// 		return d.radius
	// 	  })
	// 	  .merge(u)
	// 	  .attr('cx', function(d) {
	// 		return d.x
	// 	  })
	// 	  .attr('cy', function(d) {
	// 		return d.y
	// 	  })
	  
	// 	u.exit().remove()
	//   }
          
var node = svg.selectAll(".node")
		.data(bubble(nodes).descendants())
		.enter()
		.filter(function(d){
			return  !d.children
			//return  !d.results
		})
		.append("g")
		.attr("class", "node")
		.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")";
		})
		.on("mouseover", function(d) {
			console.log(d)
			div.transition()
			  .duration(200)
			  .style("opacity", .9);
			div.html(d.data.key + "<br/>" + d.data.value)
			  .style("left", (d3.event.pageX) + "px")
			  .style("top", (d3.event.pageY - 28) + "px")
			})
		.on("mouseout", function(d) {
			div.transition()
			  .duration(500)
			  .style("opacity", 0);
			});
	
			//let forceCollide = d3.forceCollide(d => d.radius + paddingObject);
node.append("title")
		.text(function(d) {
			// console.log(d.afkomst)
			return d.key + ": " + d.value;
		});

node.append("circle")
		.attr("r", function(d) {
			return d.data.value * 0.11;
		})
		//.style("fill", "#FFF33D");
		.style("fill", function(d) {
			return color(Math.random());
		});
		//.style("fill", url("flag-NL"));

				var cs = [];
		data.forEach(function(d){
				if(!cs.contains(d.group)) {
					cs.push(d.group);
				}
		});
// 		function create_nodes(data,node_counter) {
// 			var i = cs.indexOf(data[node_counter].group),
// 				r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
// 				d = {
// 				  cluster: i,
// 				  radius: data[node_counter].size*1.5,
// 				  text: data[node_counter].text,
// 				  x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
// 				  y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
// 				};
// 			if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
// 			return d;
// 		  };
// create_nodes()

node.append("text")
		.attr("dy", ".3em")
		.style("text-anchor", "middle")
		.text(function(d) {
			return d.data.key.substring(0, d.r / 3) + ": " + d.data.value;
		});
	}

// const defs = svg.append("defs");
// 	let imgPattern = defs.selectAll("pattern")
// 	.append("pattern")
// 		.attr('id','flag-NL-pattern')
// 		.attr("width",1)
// 		.attr("height",1)
// 		.attr('patternUnits',"userSpaceOnUse")
// 	.append("svg:image")
// 			//.attr("xlink:href",flag)
// 			.attr("width",40)
// 			.attr("height",40)
// 			.attr("x",0)
// 			.attr("y",0);

// node.append("circle")
// 		.attr("cx",100)
// 		.attr("cy",100)

// 		.attr("r", function(d) {
// 			return d.r;
// 		})
		//.style("fill", "#FFF33D");
		//.style("fill", function(d) {
		//	return color(Math.random());
		//});

		//.attr("fill", "#fff")
		//.attr("fill", "url(#flag-NL-pattern)");
		//.attr("fill", "#ff0000")
		//let imgPattern = defs.selectAll("pattern")
	

//let circles = svg.selectAll(".flag")
	//	.data(bubble(nodes).descendants())
	//	.enter()
		// node.append("circle")
		// // //.attr("class", "flag")
		// .attr("r", function(d) {
 		// 	return d.r;
		//  })
		// // // .attr("cx", 100)
		// // // .attr("cy", 180)
		// .style("fill", function(d) {
		// 	return color(Math.random());
		// });
		//.style("fill", "#FFF33D")
		//.attr("class", "flag")
		// .style("fill", "url(#flag-NL-pattern)");
		
		
// node.enter().append("image")
// .attr("xlink:href", "images/NL.svg")
// .attr("width", function(d) { return 2*d.r; })
// .attr("height", function(d) { return 2*d.r; })
// .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
// .attr('class', function(d) { return d.responseCount; });

// node.append('image')
// 		.attr('xlink:href', 'images/NL.svg')
// 		.attr('x', function(d, i) { return -d.r/2; })
// 		.attr('y', function(d, i) { return -d.r/2; })
// 		.attr('width', function(d, i) { return d.r + 'px'; })
// 		.attr('height', function(d, i) { return d.r + 'px'; })









 d3.select(self.frameElement)
		 .style("height", diameter + "px");
		// .style('height', '550px');
		 
		(function($) {
			"use strict"; 
			
			/* Preloader */
			$(window).on('load', function() {
				var preloaderFadeOutTime = 500;
				function hidePreloader() {
					var preloader = $('.spinner-wrapper');
					setTimeout(function() {
						preloader.fadeOut(preloaderFadeOutTime);
					}, 500);
				}
				hidePreloader();
			});
		
			
			/* Navbar Scripts */
			// jQuery to collapse the navbar on scroll
			$(window).on('scroll load', function() {
				if ($(".navbar").offset().top > 20) {
					$(".fixed-top").addClass("top-nav-collapse");
				} else {
					$(".fixed-top").removeClass("top-nav-collapse");
				}
			});
		
			// jQuery for page scrolling feature - requires jQuery Easing plugin
			$(function() {
				$(document).on('click', 'a.page-scroll', function(event) {
					var $anchor = $(this);
					$('html, body').stop().animate({
						scrollTop: $($anchor.attr('href')).offset().top
					}, 600, 'easeInOutExpo');
					event.preventDefault();
				});
			});
		
			// closes the responsive menu on menu item click
			$(".navbar-nav li a").on("click", function(event) {
			if (!$(this).parent().hasClass('dropdown'))
				$(".navbar-collapse").collapse('hide');
			});
		})






		// var diameter = 600;
        // var color = d3.scaleOrdinal(d3.schemeCategory20);

        // var bubble = d3.pack(dataset)
        //     .size([diameter, diameter])
        //     .padding(1.5);

        // var svg = d3.select("body")
        //     .append("svg")
        //     .attr("width", diameter)
        //     .attr("height", diameter)
        //     .attr("class", "bubble");

        // var nodes = d3.hierarchy(dataset)
        //     .sum(function(d) { return d.freqcontact; });

        // var node = svg.selectAll(".node")
        //     .data(bubble(nodes).descendants())
        //     .enter()
        //     .filter(function(d){
        //         return  !d.children
        //     })
        //     .append("g")
        //     .attr("class", "node")
        //     .attr("transform", function(d) {
        //         return "translate(" + d.x + "," + d.y + ")";
        //     });

        // node.append("title")
        //     .text(function(d) {
        //         return d.afkomst + ": " + d.freqcontact;
        //     });

        // node.append("circle")
        //     .attr("r", function(d) {
        //         return d.r;
        //     })
        //     .style("fill", function(d,i) {
        //         return color(i);
        //     });

        // node.append("text")
        //     .attr("dy", ".2em")
        //     .style("text-anchor", "middle")
        //     .text(function(d) {
        //         return d.data.afkomst.substring(0, d.r / 3);
        //     })
        //     .attr("font-family", "sans-serif")
        //     .attr("font-size", function(d){
        //         return d.r/5;
        //     })
        //     .attr("fill", "white");

        // node.append("text")
        //     .attr("dy", "1.3em")
        //     .style("text-anchor", "middle")
        //     .text(function(d) {
        //         return d.data.freqcontact;
        //     })
        //     .attr("font-family",  "Gill Sans", "Gill Sans MT")
        //     .attr("font-size", function(d){
        //         return d.r/5;
        //     })
        //     .attr("fill", "white");

        // d3.select(self.frameElement)
        //     .style("height", diameter + "px");



		// dataset2 = {
// 	"children": [{
// 		"facilityId": "NL",
// 		"responseCount": 2
// 	}, {
// 		"facilityId": "Arubaans",
// 		"responseCount": 2
// 	}, {
// 		"facilityId": "Marokkaans",
// 		"responseCount": 1
// 	}, {
// 		"facilityId": "Indonesisch",
// 		"responseCount": 2
// 	}, {
// 		"facilityId": "Curacaos",
// 		"responseCount": 3
// 	}, {
// 		"facilityId": "Anders",
// 		"responseCount": 1
// 	}]
// };
//console.log(dataset2)
	

// function bouwViz(results) {
// data = transformData(results)

// function remove99999(data){
//     data.forEach(data => {
//         for (let key in data) {
//             if (data[key] == '99999') {
//             delete data[key];
//             }
//         }
//     });
//     return data;
// }
// data = remove99999(results);

// function removeNull(data){
//     data.forEach(data => {
//         for (let key in data) {
// 			if (data[key] == '#NULL!') {
//             delete data[key];
//             }
//         }
//     });
//     return data;
// }
// data = removeNull(results);
// console.log(results)
// function transformData(results){
// 	let transformed =  d3.nest()
// 		  .key(d => d.afkomst)
// 		  .key(d => d.contact)
// 		  .key(d => d.freqcontact)
// 		.entries(results)
// 		.map (function (group){
// 			return {
// 				afkomst: group.key,
// 				//contact: group.values,
// 				freqcontact: group.values
// 			}
// 		})
// 		return transformed
// }
// console.log("transformed: ", data)

// let datasetSub = JSON.stringify(results);

// console.log(datasetSub)
// dataset = {"children": JSON.parse(datasetSub)}
// console.log(dataset)