

function dataOmzet() {
	let result = fetch('../convertcsvdata.json') 
		.then(data => data.json())
		.then(json => {
			console.log(json)
 			const newResults = json.map(result => {
			return {
					afkomst: result.Herkomst_def,
					totstand: result.Totstand,
					contact: result.Contact_gehad,
					cijfer: result.rapportcijfer,
					responseCount: 1
					}
		})
		console.log(newResults)
		bouwViz(newResults)
})
}
dataOmzet() 

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
function bouwViz(results) {

//dataset = {"children": [results]};
//dataset = results

let datasetSub = JSON.stringify(results);

console.log(datasetSub)
dataset = {"children": JSON.parse(datasetSub)}
console.log(dataset)

var diameter = 600;
var color = d3.scaleOrdinal(d3.schemeCategory20);
console.log(results)
var bubble = d3.pack(dataset)
		.size([diameter, diameter])
		.padding(1.5);

var svg = d3.select(".chart")
		.append("svg")
		.attr("width", diameter)
		.attr("height", diameter)
		.attr("class", "bubble");

const defs = svg.append("defs");
	let imgPattern = defs.selectAll("pattern")
	.append("pattern")
		.attr('id','flag-NL-pattern')
		.attr("width",1)
		.attr("height",1)
		.attr('patternUnits',"userSpaceOnUse")
	.append("svg:image")
			//.attr("xlink:href",flag)
			.attr("width",40)
			.attr("height",40)
			.attr("x",0)
			.attr("y",0);
	
var div = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);	

var nodes = d3.hierarchy(dataset)
		.sum(function(d) { return d.responseCount; });
	   
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
			div.transition()
			  .duration(200)
			  .style("opacity", .9);
			div.html('d.afkomst' + "<br/>" + d.responseCount)
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
			console.log(d.afkomst)
			return d.afkomst + ": " + d.responseCount;
		});

node.append("circle")
		.attr("r", function(d) {
			return d.r;
		})
		//.style("fill", "#FFF33D");
		.style("fill", function(d) {
			return color(Math.random());
		});
		//.style("fill", url("flag-NL"));

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
		
node.append("text")
		.attr("dy", ".3em")
		.style("text-anchor", "middle")
		.text(function(d) {
			return d.data.afkomst.substring(0, d.r / 3) + ": " + d.data.responseCount;
		});
	}

 d3.select(self.frameElement)
 		.style("height", diameter + "px");

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
		
		});