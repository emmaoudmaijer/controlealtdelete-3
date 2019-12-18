dataset = {
	"children": [{
		"facilityId": "NL",
		"responseCount": 2
	}, {
		"facilityId": "Arubaans",
		"responseCount": 2
	}, {
		"facilityId": "Marokkaans",
		"responseCount": 1
	}, {
		"facilityId": "Indonesisch",
		"responseCount": 2
	}, {
		"facilityId": "Curacaos",
		"responseCount": 3
	}, {
		"facilityId": "Anders",
		"responseCount": 1
	}]
};

var diameter = 600;
var color = d3.scaleOrdinal(d3.schemeCategory20);
//var formatTime = d3.timeFormat("%e %B");

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
		.sum(function(d) { return d.responseCount; });
	   
	   
var node = svg.selectAll(".node")
		.data(bubble(nodes).descendants())
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
			div.transition()
			  .duration(200)
			  .style("opacity", .9);
			div.html(d.facilityId + "<br/>" + d.responseCount)
			  .style("left", (d3.event.pageX) + "px")
			  .style("top", (d3.event.pageY - 28) + "px");
			})
		  .on("mouseout", function(d) {
			div.transition()
			  .duration(500)
			  .style("opacity", 0);
			});
 
		// -1- Create a tooltip div that is hidden by default:
	

node.append("title")
		.text(function(d) {
			return d.facilityId + ": " + d.responseCount;
		});

node.append("circle")
		.attr("r", function(d) {
			return d.r;
		})
		//.attr("class", "circle")
		// .style("fill", function(d) {
		// 	return color (d.facilityId);
		// });
		.style("fill", "#FFF33D");

node.append("text")
		.attr("dy", ".3em")
		.style("text-anchor", "middle")
		.text(function(d) {
			return d.data.facilityId.substring(0, d.r / 3) + ": " + d.data.responseCount;
		});
		

d3.select(self.frameElement)
		.style("height", diameter + "px");



// const data = [
// 	{
// 	  afkomst: 'NL',
// 	  value: 78.9,
// 	},
// 	{
// 	  afkomst: 'Marrokaans',
// 	  value: 75.1,
// 	},
// 	{
// 	  afkomst: 'Curacaos',
// 	  value: 68.0,
// 	},
// 	{
// 	  afkomst: 'Indonesisch',
// 	  value: 67.0,
// 	},
// 	{
// 	  afkomst: 'Arubaans',
// 	  value: 65.6,
// 	},
// 	{
// 	  afkomst: 'Anders',
// 	  value: 65.1,
// 	}
//   ];

// let svg = d3.select('svg');
// 	//hoe breed en hoe hoog wordt de visualisatie?
// 	const margin = 80;
// 	const width = 1000 - 2 * margin;
// 	const height = 580 - 2 * margin;

// 	const chart = svg.append('g')
// 		.attr('transform', `translate(${margin}, ${margin})`);
// 	//x-as schaal

// 	results.sort(function(a, b) {
// 		return d3.descending(a.value, b.value)
// 	})

// 	const xScale = d3.scaleBand()
// 		.range([0, width])
// 		.domain(data.map((s) => s.afkomst))
// 		.padding(0.4)

// 	//y-as schaal Bron: https://www.d3indepth.com/scales/
// 	let yScale = d3.scaleSqrt() //scaleSqrt toegevoegd omdat de data te ver uit elkaar lag, om zo een beter overzicht te geven
// 		.exponent(0.5)
// 		.range([height, 0])
// 		.domain([0, d3.max(data.map((s) => s.value))]).nice()

// 	const makeYLines = () => d3.axisLeft()
// 		.scale(yScale)

// 	// Nieuwe groep, horizontale lijn x-as tekenen
// 	chart.append('g')
// 		.attr('transform', `translate(0, ${height})`)
// 		.call(d3.axisBottom(xScale));

// 	// Nieuwe groep, verticale lijn y-as tekenen
// 	chart.append('g')
// 		.call(d3.axisLeft(yScale));
		
// 	//grid maken op achtergrond bar chart
// 	chart.append('g')
// 		.attr('class', 'grid')
// 		.call(makeYLines()
// 		.tickSize(-width, 0, 0)
// 		.tickFormat('')
// 		)
// 	// data aanroepen, versturen en groeperen
// 	const categoryBar = chart.selectAll()
// 		.data(results)
// 		.enter()
// 		.append('g')

// 	console.log(results)

// 	categoryBar
// 		.append('rect')
// 		.attr('class', 'bar')
// 		.attr('x', (g) => xScale(g.afkomst))
// 		.attr('y', (g) => yScale(g.value))
// 		.transition()
// 		.duration(800)
// 		.attr('height', (g) => height - yScale(g.value))
// 		.attr('width', xScale.bandwidth())
// 		//hover loslaten , geen opacity
	
// 	categoryBar
// 		.on('mouseenter', function (actual, i, category) {
// 			//d3.select('.bar')
// 			d3.select('value')
// 				.attr('opacity', 0) //weghalen van de bar

// 			d3.select(this)
// 			//d3.select('.bar')
// 				.transition()
// 				.duration(300)
// 				.attr('opacity', 0.6) //terugzetten van de bar transparant
// 				.attr('x', (a) => xScale(a.afkomst) - 5)
// 				.attr('width', xScale.bandwidth() + 10)
				  
// 			const y = yScale(actual.value)
// 			// Bron bij tooltip: https://wattenberger.com/blog/d3-interactive-charts
// 			const tooltip = d3.select("#tooltip")
// 			tooltip
// 				.style("opacity", 1)
// 				.select("#range")
// 				.html([ 
// 					 "Categorie: " + (actual.category + "<br>" + "<img src=" + actual.foto + " width= 100px; height= 100px />") 
// 					 + "<p>Items in de collectie:</p>" + (actual.value) + " Items"
// 				].join(" ")) //waardes meegeven aan de tooltip

// 			// LIJN BOVEN DE BAR CHARTS VOOR EEN DUIDELIJK OVERZICHT
// 				line = chart.append('line')
// 				.attr('id', 'limit')
// 				.attr('x1', 0)
// 				.attr('y1', y)
// 				.attr('x2', width)
// 				.attr('y2', y)								
// 		})
// 		//hover loslaten , geen opacity
// 		.on('mouseleave', function () {
// 			//d3.select('.bar')
// 			 d3.select('.value')
// 				.attr('opacity', 1)

// 			 d3.select(this)
// 				.transition()
// 				.duration(300)
// 				.attr('opacity', 1)
// 				.attr('x', (a) => xScale(a.category))
// 				.attr('width', xScale.bandwidth())

// 			chart.selectAll('#limit').remove()
// 			const tooltip = d3.select("#tooltip")
// 			tooltip
// 				.style("opacity", 0) //hover loslaten , geen opacity
// 		})

// 	categoryBar
// 		.append('text')
// 		.attr('x', (a) => xScale(a.category) + xScale.bandwidth() / 2)
// 		.attr('y', (a) => yScale(a.value) + 40)
// 		.attr('text-anchor', 'middle')
// 		.text((a) => `${a.value}`)

// 	svg
// 		.append('text')
// 		.attr('class', 'label')
// 		.attr('x', -(height / 2) - margin)
// 		.attr('y', margin / 2.4)
// 		.attr('transform', 'rotate(-90)')
// 		.attr('text-anchor', 'middle')
// 		.text('Aantal ruilmiddelen')

// 	svg.append('text')
// 		.attr('class', 'label')
// 		.attr('x', width / 2 + margin)
// 		.attr('y', height + margin * 1.7)
// 		.attr('text-anchor', 'middle')
// 		.text('categorie')

// 	svg.append('text')
// 		.attr('class', 'title')
// 		.attr('x', width / 2 + margin)
// 		.attr('y', 40)
// 		.attr('text-anchor', 'middle')
// 		.text('Uit welke ruilmiddelen bestaat de collectie van het NMWC?')
