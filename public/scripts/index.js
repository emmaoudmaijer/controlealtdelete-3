
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
					cijfer: result.rapportcijfer
					}
		})
		bubbleChart(newResults)
		bubbleChart2(newResults)
		chart3(newResults)
})
}
dataOmzet() 

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

		function transformData(data){
			let transformed =  d3.nest()
				  .key(d => d.afkomst)
				.rollup(function(v) { 
						return d3.sum(v, function(d) { return d.freqcontact; });
					 })
				.entries(data)
			return transformed
		}

		data = transformData(data)

		console.log("transformed: ", data)

		let datasetSub = JSON.stringify(data);
		dataset = {"children": JSON.parse(datasetSub)}
		console.log(dataset)	


		var diameter = 600;

		var color = d3.scaleOrdinal(d3.schemeCategory20);
		var bubble = d3.pack(dataset)
		.size([diameter, diameter])
		.padding(1.5);

		var animation = d3.transition()
		.duration(700)
		.ease(d3.easePoly);

		var svg = d3.select(".chart")
		.append("svg")
		.attr("width", diameter)
		.attr("height", diameter)
		.attr("class", "bubble");

		var div = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);	

		var nodes = d3.hierarchy(dataset)
		.sum(function(d) { return Math.sqrt(d.value); });
		

		var node = svg.selectAll(".node")
		.data(bubble(nodes).leaves())
		.enter()
		.filter(function(d){
			return  !d.children
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

		node.append("title")
		.text(function(d) {
			return d.key + ": " + d.value;
		});

		node.append("circle")
		.transition(animation)
		.attr("r", function(d) {
			return (d.r) ;
		})
		.style("fill", function(d) {
			return color(Math.random());
		});

		// 		var cs = [];
		// data.forEach(function(d){
		// 		//if(!cs.contains(d.group)) {
		// 		//	cs.push(d.group);
		// 		//}
		// });

		node.append("text")
		.attr("dy", ".3em")
		.style("text-anchor", "middle")
		.text(function(d) {
			return d.data.key.substring(0, d.r ) + ": " + d.data.value;
		});

		d3.select(self.frameElement)
		.style("height", diameter + "px");
	}

	function bubbleChart2(results) {

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
	
			function transformData(data){
				let transformed =  d3.nest()
					  .key(d => d.afkomst)
					.rollup(function(v) { 
							return d3.sum(v, function(d) { return d.freqcontact; });
						 })
					.entries(data)
				return transformed
			}
	
			data = transformData(data)
	
			console.log("transformed: ", data)
	
			let datasetSub = JSON.stringify(data);
			dataset = {"children": JSON.parse(datasetSub)}
			console.log(dataset)	
	
	
			var diameter = 600;
	
			var color = d3.scaleOrdinal(d3.schemeCategory20);
			var bubble = d3.pack(dataset)
			.size([diameter, diameter])
			.padding(1.5);
	
			var svg = d3.select(".chart2")
			.append("svg")
			.attr("width", diameter)
			.attr("height", diameter)
			.attr("class", "bubble");
	
			var div = d3.select("body").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);	
	
			var nodes = d3.hierarchy(dataset)
			.sum(function(d) { return Math.sqrt(d.value); });
			
	
			var node = svg.selectAll(".node")
			.data(bubble(nodes).leaves())
			.enter()
			.filter(function(d){
				return  !d.children
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
	
			node.append("title")
			.text(function(d) {
				return d.key + ": " + d.value;
			});
	
			node.append("circle")
			.attr("r", function(d) {
				return (d.r) ;
			})
			.style("fill", function(d) {
				return color(Math.random());
			});
	
			// 		var cs = [];
			// data.forEach(function(d){
			// 		if(!cs.contains(d.group)) {
			// 			cs.push(d.group);
			// 		}
			// });
	
			node.append("text")
			.attr("dy", ".3em")
			.style("text-anchor", "middle")
			.text(function(d) {
				return d.data.key.substring(0, d.r ) + ": " + d.data.value;
			});
	
			d3.select(self.frameElement)
			.style("height", diameter + "px");
		}

// node.append('image')
// 		.attr('xlink:href', 'images/NL.svg')
// 		.attr('x', function(d, i) { return -d.r/2; })
// 		.attr('y', function(d, i) { return -d.r/2; })
// 		.attr('width', function(d, i) { return d.r + 'px'; })
// 		.attr('height', function(d, i) { return d.r + 'px'; })

	 
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


function chart3 (results){
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
	
			function transformData(data){
				let transformed =  d3.nest()
					  .key(d => d.afkomst)
					.rollup(function(v) { 
							return d3.sum(v, function(d) { return d.freqcontact; });
						 })
					.entries(data)
				return transformed
			}
	
			data = transformData(data)
	
			console.log("transformed: ", data)
	
			let datasetSub = JSON.stringify(data);
			dataset = {"children": JSON.parse(datasetSub)}
			console.log(dataset)	
	
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("chart3")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 4000])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 500000])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(dataset)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.afkomst); } )
      .attr("cy", function (d) { return y(d.cijfer); } )
      .attr("r", 1.5)
      .style("fill", "#69b3a2")

}

}
