/**
* Module of visualisation.js where most THREE.JS related tools are declared, the size of the canvas and
* all objects related to drawing, viewing and rendering. Also some styling.
* @author Robert Walhout
*/



var VisualisationJsModule = (function () {
	d3.select('body').append('div').attr("class","containerAttributes").attr("id", "classContainer").style("display", "none");
	
	d3.select('#classContainer').append('div').attr("class","arrow narrower").style("display", "none");	
	d3.select('#classContainer').append('div').attr("class","arrow broader").style("display", "none");	
	d3.select('#classContainer').append('div').attr("class","arrow related").style("display", "none");
	d3.select('#classContainer').append('div').attr("class","arrow default").style("display", "none");
	
	
	d3.select('#classContainer').append('div').attr("class","sphere").style("display", "none");
	d3.select('#classContainer').append('div').attr("class","sphere centersphere").style("display", "none");
	
		
	d3.select('#classContainer').append('div').attr("class","slider").style("display", "none");	
	
	d3.select('#classContainer').append('div').attr("class","sphere").style("display", "none");

	

	var WIDTH=parseInt(d3.select('.containerAttributes').style('width'));
	var HEIGHT=parseInt(d3.select('.containerAttributes').style('height'));

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