/**
* Very basic code for a slider, this is not finished by far and MUST be improved at some point. 
* -scaling -dynamic sizing(by the height of the div) of the slider -dynamic resizing of the restricted drag button area
* -add functionality -remove public variables -
* @author Robert Walhout
*/
var createSlider = (function(divHeight, initialiseDrawingSequence, concept){
console.log("ja createslider is geropee he");

var HEIGHT = divHeight; //TODO KAN WEG IN project?

var containerHeight = HEIGHT;

var containerWidth = 60;
var slideDepth = 1;
var tempSliderDepthInt=1;

var sliderOffsetTop = 20;
var sliderOffsetSides = 10;

var sliderDiv = d3.select('#' + targetDivId).append("div")
//var sliderDiv = d3.select('#' + containerDivId).append("div")
	.attr("id", "sliderDiv")
	.attr("width", containerWidth)
	.attr("position", "fixed")
	.attr("height", containerHeight)
	.style("display", "inline-block")
	.style("background", VisualisationJsModule.getStyle(".sliderAttributes.background").style.background );
	
	
console.log("sliderDiv");
console.log(sliderDiv);
var svgContainer = d3.select("#sliderDiv").append("svg")
	.attr("width", containerWidth)
	.attr("height", containerHeight);
	
console.log(svgContainer);

var depthScale = d3.scale.linear()
        .domain([0,5])
        .range([0,100]);

//de "volume" driehoek
var vis = d3.select("svg").append("svg")
         .attr("width", containerWidth)
         .attr("height", containerHeight),
scaleX = d3.scale.linear()
        .domain([0,100])
        .range([0,100]),
scaleY = d3.scale.linear()
        .domain([0,100])
        .range([0,100]),
poly = [{"x":sliderOffsetSides, "y":sliderOffsetTop},
        {"x":containerWidth-sliderOffsetSides,"y":sliderOffsetTop},
        {"x":sliderOffsetSides,"y":containerHeight-sliderOffsetTop}];

vis.selectAll("polygon")
    .data([poly])
  .enter().append("polygon")
    .attr("points",function(d) { 
        return d.map(function(d) { return [scaleX(d.x),scaleY(d.y)].join(","); }).join(" ");})
    .attr("fill",  VisualisationJsModule.getStyle(".sliderAttributes.sliderPolygon").style.background )
    .attr("stroke", VisualisationJsModule.getStyle(".sliderAttributes.sliderPolygon").style.color )
    .attr("stroke-width",2);


  
  //text boven de slider
  sliderInfo = svgContainer.append('foreignObject')
                        .attr('x', 2)
                        .attr('y', 1)
                        .attr('width', 150)
                        .attr('height', 100)
    .text('Depth: ' + slideDepth);


//de sliderbutton
var sliderAttr = [
  { "rx": sliderOffsetSides/2, "ry": containerHeight-(sliderOffsetTop*2), "height": 20, "width": containerWidth-(sliderOffsetSides)}];	
	
//naar boven plaatsen??????????????????
var sliderRect = svgContainer.selectAll("rect")
                              .data(sliderAttr)
                              .enter()
                              .append("rect");

	
//TODO wat is dit 
var rectangleAttributes = sliderRect
.attr("id", "amountSlider")
                          .attr("x", function (d) { return d.rx; })
                          .attr("y", function (d) { return d.ry; })
                          .attr("height", function (d) { return d.height; })
                          .attr("width", function (d) { return d.width; })
                         .style("fill", VisualisationJsModule.getStyle(".sliderAttributes.sliderButton").style.color );
	



//drag functionality
var drag2 = d3.behavior.drag()
        .origin(function() { 
            var t = sliderRect;
            return {x: t.attr("x"), y: t.attr("y")};
        })
        .on("drag", function(d,i) {
            //console.log(slideDepth);
            if(d3.event.y < containerHeight-sliderOffsetTop && d3.event.y > containerHeight-(containerHeight-sliderOffsetTop)){            
            	d3.select(this)
           		.attr("x", sliderOffsetSides/2)            
          	    .attr("y", d3.event.y);   
                
               
                
                var sliderY = d3.select(this).attr("y");
               
            switch (true) {
                case (sliderY > 0 && sliderY < 50):
                    tempSliderDepthInt=4
                    break;
                case (sliderY > 100 && sliderY < 150):
                   tempSliderDepthInt=3
                    break;
                case (sliderY > 150 && sliderY < 200):
                   tempSliderDepthInt=2
                    break;
                case (sliderY > 200 && sliderY < 300):
                    tempSliderDepthInt=1
                    break;
                default:
                   // alert("none");
                    break;
            }
                
         
                sliderInfo[0][0].textContent = "Depth: " + tempSliderDepthInt;
            }           
        }).on("dragend", function () {
			slideDepth=tempSliderDepthInt; 
			console.log(slideDepth); 
			initialiseDrawingSequence(concept, slideDepth); 
			
		}); //dragend should invoke the drawing sequence

	//invokes functions on the slider button	
	sliderRect.call(drag2)


        //this is only necesary if another class has to call the current depth
		//return  {
		////returns the property sliderdepth, can ba called with the name of this variable (createslider.sliderDepth)
		//sliderDepth : tempSliderDepthInt
		//};

});
