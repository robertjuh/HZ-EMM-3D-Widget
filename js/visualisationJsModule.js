/**
* Module of visualisation.js where most THREE.JS related tools are declared, the size of the canvas and
* all objects related to drawing, viewing and rendering. Also some styling.
* @author Robert Walhout
*/
	//CSS constants (integers!) (default values)
	var CSSmaxDepth_order=4;
	var CSScontainerAttributes_width=400;
	var CSScontainerAttributes_height=400;	

	//ID names of used divs //TODO TARGETDIV KAN DEFAULT WORDEn
	var targetDivId = 'bodyContent'; //targetDivId kan een element op de mediawiki zijn. Plaatst de hele visualisation bij dit element
	var sliderDivId = 'sliderDiv';
	var rendererDomElementId = 'containerCanvas';
	var containerDivId = 'containerDiv'; //attr("id", "containerDiv")
	
	//relevant DOM elements
	var containerDiv = d3.select("div").append("div:div").attr("id", containerDivId).style("display", "inline-block");	

	
	
	//var VisualisationJsModule = (function (newHeight, newWidth) {
	var VisualisationJsModule = (function () {
		
		
	
	//Picks the navigatorstyle.css stylesheet so it doesn't have to loop through each style sheet each fuction call. Use getStyleByLoopingEachSheet if used on other sheet.
	var styleSheets = window.document.styleSheets;	
	var currentstylesheet;	
	for(var i = 0; i < styleSheets.length; i++){		
			if(window.document.styleSheets[i].href != null && window.document.styleSheets[i].href.search("navigatorStyle") > 1){
				currentstylesheet = window.document.styleSheets[i];
			}
			else{
				console.log("dit is hem nie");
				console.log(window.document.styleSheets[i]);
			}
	}
			
		
	var getStyle = function(CLASSname) {
				if (currentstylesheet.rules ) { var classes = currentstylesheet.rules; }
					else { 
						try {  if(!currentstylesheet.cssRules)
								{
									console.log("no cssrules available")
									return;
								}
						} 
						//Note that SecurityError exception is specific to Firefox.
						catch(e) { if(e.name == 'SecurityError') { console.log("SecurityError. Cant read: "+ currentstylesheet.href);  return; }}
						var classes = currentstylesheet.cssRules ;
					}
				for (var x = 0; x < classes.length; x++) {
					if (classes[x].selectorText == CLASSname) {
						return classes[x];
						var ret = (classes[x].cssText) ? classes[x].cssText : classes[x].style.cssText ;
						if(ret.indexOf(classes[x].selectorText) == -1){ret = classes[x].selectorText + "{" + ret + "}";};
						return ret;
					}
				}
			return null;			
	}		
		

	var getStyleByLoopingEachSheet = function(CLASSname) {
					var styleSheets = window.document.styleSheets;
					var styleSheetsLength = styleSheets.length;
					for(var i = 0; i < styleSheetsLength; i++){
						if (styleSheets[i].rules ) { var classes = styleSheets[i].rules; }
						else { 
							try {  if(!styleSheets[i].cssRules) {continue;} } 
							//Note that SecurityError exception is specific to Firefox.
							catch(e) { if(e.name == 'SecurityError') { console.log("SecurityError. Cant readd: "+ styleSheets[i].href);  continue; }}
							var classes = styleSheets[i].cssRules ;
						}
						for (var x = 0; x < classes.length; x++) {
							if (classes[x].selectorText == CLASSname) {
					 return classes[x];
								var ret = (classes[x].cssText) ? classes[x].cssText : classes[x].style.cssText ;
								if(ret.indexOf(classes[x].selectorText) == -1){ret = classes[x].selectorText + "{" + ret + "}";};
								return ret;
							}
						}
					}
					return null;			
	}
	
	/*
	 * get attribute in style, if not available return defaultValue
	 */ 
	var getStyleAttr = function(CLASSname,attr,defaultValue) {
	  try {
	    var text=getStyle(CLASSname).cssText;
	    if (CLASSname=='#sliderDiv')console.log(text);
	    //parse css, get text inbetween brackets
	    var p=text.indexOf("{");
	    text=text.substring(p+1);
	    var p=text.indexOf("}");
	    text=text.substring(0,p-1);
	    //split into parts
	    var listattr = text.split(";");//list with all attributes
	    var found=false;
	    var value=null;
	    for (var i = 0; i < listattr.length; i++) {
		var attrn = listattr[i].split(":");//becomes key-value pair
		var key=attrn[0].trim();
		if (key==attr) {found=true;value=attrn[1].trim();}
		//Do something
	    }
	    if (found) return value;else return defaultValue;
	  }
	  catch (e) {
	    return defaultValue;
	  }  
	}
	
	/*
	 * get attribute in style as in integer, if not available return defaultValue (must be int)
	 */ 
	var getStyleAttrInt = function(CLASSname,attr,defaultValue) {
	  try {
	    return parseInt(getStyleAttr(CLASSname,attr,""+defaultValue));
	  }
	  catch (e) {
	    return defaultValue;
	  }	  
	}
	
	
	//These variables determine the initial state of the visualisation, depth = the depth that will be loaded initially.
	var DEPTH=getStyleAttrInt(".maxDepth","order",CSSmaxDepth_order);
	var WIDTH=getStyleAttrInt('.containerAttributes', "width",CSScontainerAttributes_width);
	var HEIGHT=getStyleAttrInt('.containerAttributes', "height",CSScontainerAttributes_height);
	
	// Set camera attributes and create camera
	var VIEW_ANGLE = 20, //field of view
	    ASPECT = WIDTH / HEIGHT, 
		//ASPECT  = $VisualisationJsModule.container[0].clientWidth / $VisualisationJsModule.container[0].clientHeight,
	    NEAR = 65,
	    FAR = 10000;
	var camera =  new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);	
	
	var renderer = new THREE.WebGLRenderer({
			alpha : true,
			antialiasing : true
		});
		
	
	//Variables which are relevant to the THREE visualisation element
	renderer.domElement.id = rendererDomElementId; //The canvas ID where the visualisation is being drawn upon
	var containerCanvas; //is set in visualisation.js, but defined here for accesibility
	//var container = document.getElementById( containerDivId ); //now uses global var
	var container = document.getElementById( containerDivId );
	var controls = new THREE.OrbitControls(camera, container);
	var scene = new THREE.Scene;
	var threeDObjects=[];
	var sphereArray=[]; //Array will be filled with spheres; the objects that will be intersected through on mouse events
	var newDepth;
		
	return  {
		//these properties can be asked by: VisualisationJsModule.propertyname
		height : HEIGHT,
		width : WIDTH,
		depth : DEPTH,
		newDepth : newDepth,
		scene : scene,
		camera : camera,
		controls : controls,
		targetDivId : targetDivId,
		sliderDivId : sliderDivId,
		containerDiv : containerDiv,
		containerDivId : containerDivId,
		container : container,
		containerCanvas : containerCanvas,
		sphereArray : sphereArray,
		renderer : renderer,
		//three arrays to contain the visible objects of the model. Distance of all objects is set.
		//used to make objects visible or not
		threeDObjects: threeDObjects,
		
		setContainerSize: function(h, w) {
			this.width = w;
			this.height = h;			
		},
		
		getContainerSize: function () {
			var size = [WIDTH,HEIGHT]
			return size;			
		},

		//can ask CSS propertys in code as: VisualisationJsModule.getStyle(".className").style.color;
		
		init3DObjects: function(){
		  threeDObjects=[];
		},
		//functions to set distance for visible yes/no
		add3DObject(object,distance){
		  object.distance=distance;
		  this.threeDObjects.push(object);
		},
		getStyle: getStyle,
		getStyleAttr:getStyleAttr,
		getStyleAttrInt:getStyleAttrInt
	};
	
});