/**
* Very basic code for a slider, this is not finished by far and MUST be improved at some point. 
* -scaling -dynamic sizing(by the height of the div) of the slider -dynamic resizing of the restricted drag button area
* -add functionality -remove public variables -
* @author Robert Walhout
*/

var createSlider = (function(divHeight, higherFunction, lowerDepthFunction, concept,depth){
  
var MAXDEPTH=4;

//TODO set width container in css
//var sliderDivId="sliderDiv"; //id attribute given to the sliderdiv variable
var sliderDivId=VisualisationJsModule.sliderDivId; 
var containerWidth = VisualisationJsModule.getStyleAttrInt('#'+sliderDivId,"width",30);
var divHeight = VisualisationJsModule.getStyleAttrInt('#'+sliderDivId,"height",divHeight);
var slideDepth = 1;
var tempSliderDepthInt=1;

var sliderOffsetTop = VisualisationJsModule.getStyleAttrInt(".sliderDiv", "top");
var sliderOffsetSides = VisualisationJsModule.getStyleAttrInt(".sliderDiv", "border");

var sliderDiv = d3.select('#' + VisualisationJsModule.targetDivId).append("div")
//var sliderDiv = d3.select('#' + containerDivId).append("div")
	.attr("id", sliderDivId)
	.attr("width", containerWidth)
	.style("position", "absolute")
	//TODO find out why vertical-align:top only works when added to css, and not here....
	.style("vertical-align", "top")	
	.attr("height", divHeight)
	.style("display", "inline-block")
	//.style("background", VisualisationJsModule.getStyle(".sliderAttributes.background", "background") );
	.style("background", VisualisationJsModule.getStyle(".sliderAttributes.background").style.background );
	

	
//TODO transition .style("left", "200px") en 	.attr("height", divHeight) met de canvas mee
	
	
var svgContainer = d3.select('#'+sliderDivId).append("svg")
	.attr("id", "svgContainer")
	.attr("width", containerWidth)
	.attr("height", divHeight);
	
//de "volume" driehoek
var vis = d3.select("svg")
	 .attr("id", "sliderTotal")
	 .append("svg")
         .attr("width", containerWidth)
         .attr("height", divHeight),
scaleX = d3.scale.linear()
        .domain([0,100])
        .range([0,100]),
scaleY = d3.scale.linear()
        .domain([0,100])
        .range([0,100]),
poly = [{"x":sliderOffsetSides, "y":sliderOffsetTop},
        {"x":containerWidth-sliderOffsetSides,"y":sliderOffsetTop},
        {"x":sliderOffsetSides,"y":divHeight-sliderOffsetTop}];

vis.selectAll("polygon")
    .data([poly])
  .enter().append("polygon")
    .attr("id", "sliderArea")
    .attr("points",function(d) { 
        return d.map(function(d) { return [scaleX(d.x),scaleY(d.y)].join(","); }).join(" ");})
  //  .attr("fill",  VisualisationJsModule.getStyle(".sliderAttributes.sliderPolygon").style.background )
    .attr("fill",  "rgb(237,231,220)")
    .attr("stroke", VisualisationJsModule.getStyle(".sliderAttributes.sliderPolygon").style.color )
    .attr("stroke-width",1);


  
	var setSliderInfoText=function(width,value){
	  return ((width<40)?"":"Depth: ") + value;
	}
	
	//text boven de slider
	sliderInfo = svgContainer.append('foreignObject')
                        .attr('x', 2)
                        .attr('y', 1)
			.attr("id","sliderText")
			  //center text above slider
			.style(    "text-align","center")
                        .attr('width', containerWidth)
                        .attr('height', 100)
		.text(setSliderInfoText(containerWidth-(sliderOffsetSides), slideDepth));


	//de sliderbutton
	var sliderAttr = [
	  { "rx": sliderOffsetSides/2, "ry": divHeight-(sliderOffsetTop*2), "height": 12, "width": containerWidth-(sliderOffsetSides)}];	
	
	var sliderRect = svgContainer.selectAll("rect")
        .data(sliderAttr)
        .enter()
        .append("rect");

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
            if(d3.event.y < divHeight-sliderOffsetTop && d3.event.y > divHeight-(divHeight-sliderOffsetTop)){            
            	d3.select(this)
           		.attr("x", sliderOffsetSides/2)            
          	    .attr("y", d3.event.y);   
                
				
    var sliderY = d3.select(this).attr("y");
		tempSliderDepthInt=Math.floor((divHeight-sliderY)/divHeight*MAXDEPTH+1);

                sliderInfo[0][0].textContent = setSliderInfoText(d.width,tempSliderDepthInt);
            }           
        }).on("dragend", function () {
			slideDepth=tempSliderDepthInt;
			if (slideDepth<=depth){
			  lowerDepthFunction(slideDepth);
			}
			else if (slideDepth>depth){ 
				depth=slideDepth;
				higherFunction(concept, slideDepth,slideDepth);
			}
			
		}); //dragend should invoke the drawing sequence

	//invokes functions on the slider button	
	sliderRect.call(drag2)


        //this is only necessary if another class has to call the current depth
		//return  {
		////returns the property sliderdepth, can ba called with the name of this variable (createslider.sliderDepth)
		//sliderDepth : tempSliderDepthInt
		//};

});
