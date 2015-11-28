/**
* Module of visualisation.js where most THREE.JS related tools are declared, the size of the canvas and
* all objects related to drawing, viewing and rendering. Also some styling.
* @author Robert Walhout
*/


var VisualisationJsModule = (function () {
  //TODO think about defaults for WIDTH and HEIGHT
	var getStyle = function(CLASSname) {
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
								if(ret.indexOf(classes[x].selectorText) == -1){ret = classes[x].selectorText + "{" + ret + "}";}
								return ret;
							}
						}
					}
					return null;			
			}
	
	var getStyleAttr = function(CLASSname,attr,defaultValue) {
	  try {
	    var text=getStyle(CLASSname).cssText;
	    var p=text.indexOf("{");
	    text=text.substring(p);
	    p=text.indexOf(attr);
	    text=text.substring(p+attr.length);
	    var f=text.substring(0,1);
	    if (!((f==" ")|| (f==":"))) return defaultValue;
	    //TODO check for other possible occurrences of attr, by using while
	    p=text.indexOf(":");
	    text=text.substring(p+1);
	    p=text.indexOf(";");
	    text=text.substring(0,p);
	    if ( text.length>0) return text;else return defaultValue;
	  }
	  catch (e) {
	    return defaultValue;
	  }
  
	}
	
	//These variables determine the initial state of the visualisation, depth = the depth that will be loaded initially.
	var DEPTH=getStyleAttr(".maxDepth","order","4");
	var WIDTH=parseInt(getStyleAttr('.containerAttributes',"width","400"));
	var HEIGHT=parseInt(getStyleAttr('.containerAttributes',"height","400"));	
	

	// Set camera attributes and create camera
	var VIEW_ANGLE = 20, //field of view
	    ASPECT = WIDTH / HEIGHT, 
		//ASPECT  = $VisualisationJsModule.container[0].clientWidth / $VisualisationJsModule.container[0].clientHeight,
	    NEAR = 10,
	    FAR = 10000;
	var camera =  new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);	
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
		container : container,
		sphereArray : sphereArray,
		//three arrays to contain the visible objects of the model. Distance of all objects is set.
		//used to make objects visible or not
		threeDObjects: threeDObjects,
		
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
		getStyleAttr:getStyleAttr
	};
	
});