/**
* Module of visualisation.js where most THREE.JS related tools are declared, the size of the canvas and
* all objects related to drawing, viewing and rendering.
* @author Robert Walhout
*/



var VisualisationJsModule = (function () {
	//"private" variables:
	var WIDTH=600;
	var HEIGHT=600;
console.log("WORDT VISUALISATIONMODULE TELKENS AANGEROEPEN??????");	
	
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
	
	
//	var heyaa = d3.select("div").append("div:div");
//	console.log("heyaaa=");
//	console.log(heyaa);	
	//"private" method:
	var myPrivateMethod = function () {
		console.log("I can be accessed only from within YAHOO.myProject.myModule");
	}
	
	return  {
		//these properties can be asked by: VisualisationJsModule.propertyname
		height : HEIGHT,
		width : WIDTH,
		scene : scene,
		camera : camera,
		controls : controls,
		container : container,
		
		getContainerSize: function () {
			var size = [WIDTH,HEIGHT]
			return size;			
		}	
	};
});