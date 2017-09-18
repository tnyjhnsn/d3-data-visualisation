// JavaScript Document
/*jshint esversion: 6 */

const { 
	json,
	select,
	forceSimulation,
	forceLink,
	forceManyBody,
	forceCenter,
	drag,
	forceCollide
} = d3;

const url = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";
const flags ="https://www.rogatis.eti.br/fcc/flags.png";


const margin = { top: 0, right: 0, bottom: 25, left:25 };

const height = 800 - margin.top - margin.bottom,
  	  width = 1000 - margin.left - margin.right;


json(url, (error, json) =>{
	
	if (error) return console.warn(error);	
	
	const linkDistance = 50;
	
	const simulation = forceSimulation()
		.nodes(json.nodes);

	const links = forceLink(json.links)
					.distance(linkDistance);
	
	const tooltip = select('body').append('div')
            .style('position', 'absolute')
            .style('padding', '0 10px')
            .style('background', 'black')
		    .style('color', 'white')
            .style('opacity', 0);
	
	const toolText = (d)  =>{
			const text = `<div id= toolTip>   
			   	<p><strong> ${d.country}   </strong>   
			  	</div>`;
			
		return text;		
		
	};
	

	simulation
		.force('link', links)
		.force("charge",forceManyBody().distanceMax(100).distanceMin(40))
		.force("center", forceCenter(width/2, height/2))
		.force("collide", forceCollide().radius(25));
		

	const chart = select('#chart')
		.attr('width', width + margin.left + margin.right);	
	
	chart
		.append('svg')
			.style('background', 'black')
			.style('opacity', 0.7)
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom);
	
	const dragstarted  = (d) => {
			if (!d3.event.active) simulation.alphaTarget(0.3).restart()
				};

	const dragged = (d) => {
  					d.fx = d3.event.x;
  					d.fy = d3.event.y;
					};

	const dragended = (d) =>{
				  if (!d3.event.active) simulation.alphaTarget(0);
				  d.fx = undefined;
				  d.fy = undefined;
			};
	
	
	const flags = chart.append('div')
					.attr('id', 'flags');
	
		
	const clampTop = (x) =>  Math.max(0, Math.min(height,x));
	
	const clampLeft = (y) =>  Math.max(0, Math.min(width,y));

	const node = flags.selectAll('.node')
						.data(simulation.nodes(), d => d.code)
						.enter().append("img")
							.attr('id', d => d.code )
							.attr("width", "25")
							.attr("height", "15")
							.attr('class', d => 'flag flag-' + d.code)
							.on('mouseover', (d,i)=> {
								console.log('opa')
							select(`#${d.code}`)
									.style('cursor', 'pointer');
								tooltip.transition()
									.style('opacity', 0.8);

								tooltip.html(toolText(d))
									.style('left', (d3.event.pageX - 30) + 'px')
									.style('top',  (d3.event.pageY - 30) + 'px');
								})
							.on('mouseout', (d,i)=>{ 
								tooltip.style('opacity', 0);
			   					select(`#${d.code}`)
									.style('cursor', 'default');
			   
								 })
							.call(drag()
								  .on("start", dragstarted)
        						  .on("drag", dragged)
                                  .on("end", dragended));
							
	
	const svg = select('svg');
	
	const link = svg.selectAll('.link')
		.data(links.links())
		.enter()
		.append('line')
		.attr('class', 'link')
		.style('stroke', 'white');
	
	simulation.on('tick', () => {
		node
			.style('left', d => `${clampLeft(d.x -10)}px` )
			.style('top', d=> `${ clampTop(d.y -8) }px`);
		
		link
        	.attr("x1", (d)=>  `${clampLeft(d.source.x)}px`)
        	.attr("y1", (d) => `${clampTop(d.source.y)}px`)
        	.attr("x2", (d) => `${clampLeft(d.target.x)}px`)
        	.attr("y2", (d) => `${clampTop(d.target.y)}px`);
			
	});
					
	
	



	
					
});
