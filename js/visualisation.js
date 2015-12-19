/**
 * VisualisationJsModule.js
* Module of visualisation.js where most THREE.JS related tools are declared, the size of the canvas and
* all objects related to drawing, viewing and rendering. Also some styling.
* @author Robert Walhout
*/
//Global constant
var TARGETDIVID = 'bodyContent'; 
	//targetDivId is een element op de mediawiki waaronder de knoppen vallen, en waar het model wordt gepresenteerd.
var CONTAINERDIV = 'containerDiv'; 
var SHOWBUTTONDIV='showbutton';
var BODYCONTENTDIV='bodyContent';
var SLIDERDIVID='sliderDiv';
var EMMCONTAINERDIV='EMMContainerDiv';	
var VisualisationJsModule;//global


//CSS constants (integers!)
var CSSmaxDepth_order=4;
var CSScontainerAttributes_width=400;
var CSScontainerAttributes_height=400;	

var VisualisationJsModulePrototype = (function (containerDivId) {

	//These variables determine the initial state of the visualisation, depth = the depth that will be loaded initially.
	var DEPTH=visualisationInstance.getStyleAttrInt(".maxDepth","order",CSSmaxDepth_order);
	var WIDTH=visualisationInstance.getStyleAttrInt('.containerAttributes',"width",CSScontainerAttributes_width);
	var HEIGHT=visualisationInstance.getStyleAttrInt('.containerAttributes',"height",CSScontainerAttributes_height);
	// Set camera attributes and create camera
	var VIEW_ANGLE = 20, //field of view
	    ASPECT = WIDTH / HEIGHT, 
		//ASPECT  = $VisualisationJsModule.container[0].clientWidth / $VisualisationJsModule.container[0].clientHeight,
	    NEAR = 10,
	    FAR = 10000;
	var camera =  new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);	
	var container = document.getElementById( containerDivId );
	//var container = document.getElementById("containerdiv");
	console.log(container);
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
		}
	};
	
});
 
 
 //VisualisationJsModule= new VisualisationJsModulePrototype(CONTAINERDIV);
//visualisation module.

console.log("VisualisationJsModulePrototype");
console.log(VisualisationJsModule);


window.Visualisation = (function () {//CSS constants
var CSScontainerAttributes_width=400;
var CSScontainerAttributes_height=400;	
  var CSSarrow_related_color="red";
  var CSSsphere_color="rgb(191,172,136)";
  var CSSsphere_colors=["rgb(76,151,214)","rgb(191,172,136)","rgb(191,172,136)","rgb(191,172,136)","rgb(191,172,136)","rgb(191,172,136)","rgb(191,172,136)"];
  var CSScontainerAttributes_fontsize="20px";
  var CSScontainerAttributes_fontfamily="Times";
  var CSScontainerAttributes_fontweight="normal";
  var CSSarrow_related_color="red";
  var CSSarrow_broader_color="black";
  var renderer;//global
  var	mouse;//global
  var	raycaster;//global
  var labels;//global
  var sliderObject;
  var valuesHaveBeenShown=false;
  var thisconcept;
	  
  /**
  * @author NJK @author robertjuh
  * This script is responsible for drawing the 3d objects to the canvas and initialising an ajax call. 
  * 
  * VisualisationJsModule (located in visualisationJsModule.js) contains all global variables that are relevant to the THREEjs drawing sequence.
  */
//  var startVisualisation = (function(currentPageName){
//    //anton: not used right now.
//    //setTimeout(function(){startVisualisation(currentPageName)}, 1000);
//		  //mouselocation variables 
//		  initVariables();
//  });
  
  function initVariables(){
    //THREE can only be used if library is read using Resource loader
  }
		  
  //pakt de sphere die als eerste getroffen wordt door de ray, negeert labels en arrows.
  function filterFirstSpheregeometryWithRay(event, mouse){			
		  normalizeCurrentMouseCoordinates(event, mouse);						
		  raycaster.setFromCamera( mouse, VisualisationJsModule.camera);

		  var intersects = raycaster.intersectObjects( VisualisationJsModule.sphereArray ); 

		  if(intersects.length > 0 && intersects[0].object != null && intersects[0].object.urlName != null){
			  checkGeometryTypeAndSlice(intersects, intersects[0].object.callback(intersects[0].object.urlName));			
		  }			
	  }
	  
  function colorSelectedSphere(event, mouse){
		  normalizeCurrentMouseCoordinates(event,mouse);
		  
		  raycaster.setFromCamera( mouse, VisualisationJsModule.camera );
		  
		  var intersects = raycaster.intersectObjects( VisualisationJsModule.scene.children ); 	

		  checkGeometryTypeAndSlice(intersects)	
	  }	
		  
		  
//TODO onderstaande functie volledig opschonen omdat er nu alleen nog spheres worden meegenomen in intersects (intersectable objects.
function checkGeometryTypeAndSlice(intersects, urlname){
    var intersectLength = intersects.length;
    //If there is an intersection, and it is a sphere, apply click event.
    //Loops through each intersected object and cuts off the planeGeometries so that the sphere will be clicked even though there is something in front of it.
    for (var i = 0; i <= intersectLength; i++) {

    if(intersects == 0 || intersects[0].object.geometry.type == null){	
	    return;
    }else{				 
	switch(intersects[0].object.geometry.type){
		case 'SphereGeometry':
			intersects[0].object.material.color.setHex( Math.random() * 0xffffff );
			
				intersects[0].object.callback(intersects[0].object.urlName);

			//console.log("je heb geklikt op een geometry:");
			//console.log(intersects[0].object.geometry.type);
			return;
			//break;
		case 'PlaneGeometry':
			intersects = intersects.slice(1); //cut off the first element(a plane) and check if the next one is a sphere								
			break;
		case 'BufferGeometry':
			intersects = intersects.slice(1); //cut off the first element(a plane) and check if the next one is a sphere
			break;
		case 'CylinderGeometry':
			intersects = intersects.slice(1); //cut off the first element(a plane) and check if the next one is a sphere		
		    break;
		default:					
	}
      }
    }
  }
	
	


  //get offset for dom-element, while looping over all parent elements and summing all offsets
  function getOffset( el ) {
      var _x = 0;
      var _y = 0;
      while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
	  _x += el.offsetLeft - el.scrollLeft;
	  _y += el.offsetTop - el.scrollTop;
	  el = el.offsetParent;
      }
      return { top: _y, left: _x };
  }
  //function for normalising mouse coordinates to prevent duplicate code. This will take offset and scrolled position into account and the renderer width/height.
  //uses the mouse variable which is a THREE.Vector2
  function normalizeCurrentMouseCoordinates(e, mouse){
  var x = getOffset( e.target ).left; 
      /*console.log($("#EMMContainerDiv").offset().left,$("#EMMContainerDiv").offset().top);
      console.log(getOffset( e.target ).left,getOffset( e.target ).top);//1
      console.log($(document).scrollLeft(),$(document).scrollTop());//2
      console.log(e.clientX,e.clientY);//3
      console.log(e.layerX,e.layerY);
      console.log( (e.clientX - (getOffset( e.target ).left-$(document).scrollLeft())),( e.clientY - (getOffset( e.target ).top-$(document).scrollTop()))   );*/
			  var x=(e.clientX - (getOffset( e.target ).left-$(document).scrollLeft()));
			  if (x>e.layerX)x=e.layerX;
			  var y=( e.clientY - (getOffset( e.target ).top-$(document).scrollTop()));
			  if (y>e.layerY)y=e.layerY;
			  /*mouse.x = ( ( (e.clientX+$(document).scrollLeft()) - (renderer.domElement.offsetLeft )) / renderer.domElement.width ) * 2 - 1;			
			  mouse.y = - ( ( (e.clientY+$(document).scrollTop()) - (renderer.domElement.offsetTop)) / renderer.domElement.height ) * 2 + 1;	*/		
			  mouse.x = ( (x) / renderer.domElement.width ) * 2 - 1;			
			  mouse.y = - ( (y) / renderer.domElement.height ) * 2 + 1;			
      //console.log(mouse.x,mouse.y);
  }


  //create a callback function for each sphere, after clicking on a sphere the canvas will be cleared and the selected sphere will be the center point
  function createCallbackFunctionForSphere(sphere){
    sphere.callback = function(conceptNameString){
      if (sphere.distance>0){
	window.location = window.location.href.getFirstPartOfUrl() + conceptNameString;
      }
    }		
  }
		  
  //functions for arrows			
  function setArrowSourceTarget(arrow) {
    var relationDepth=arrow.distance;
    //copy position of sphere connected to source to position of arrow
    var originPosition=arrow.source.sphere.position;
    arrow.position.set(originPosition.x,originPosition.y,originPosition.z);
    // Cast function argument to Vector3 format
    var targetPosition=arrow.target.sphere.position;
    
    var newTarget = new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z);
    //Calculate new terminus vectors and set length (initial size: arrow.setLength(arrow.position.distanceTo(newTarget) - 5, 10, 5);
    arrow.setLength(arrow.position.distanceTo(newTarget) - arrow.target.sphere.geometry.boundingSphere.radius , (10 - (relationDepth*0.8)), (5-(relationDepth*0.8)));
    arrow.setDirection(new THREE.Vector3().subVectors(newTarget, arrow.position).normalize());
  }
  //end of functions for arrows -----======-----
  
  
  // Initializes calculations and spaces nodes according to a forced layout
  // takes variables from the startvisualisation method
  function initialiseConstraints(nodes, spheres, three_links) {

	  var min=-100;
	  var max=50;
	  var xScale = d3.scale.linear().domain([0, VisualisationJsModule.height+1]).range([min, max]),
	      yScale = d3.scale.linear().domain([0, VisualisationJsModule.height+1]).range([min, max]),
	      zScale = d3.scale.linear().domain([0, VisualisationJsModule.height+1]).range([min, max]);
		  
	  
	  //first see what the new position of base-node will be, because that is positioned on 0,0,0
	  //base for translation of nodes
	  var xcomp=xScale(0),
	      ycomp=yScale(0),
	      zcomp=yScale(0);
			  
	  for (var key in nodes) {
		  //scale to new location and do a translation to place nodes in the middle
	  
		  spheres[key].position.set(xScale(nodes[key].x)-xcomp, yScale(nodes[key].y)-ycomp , zScale(nodes[key].z)-zcomp );
		  var p=spheres[key].position;
		  nodes[key].label.position.set(p.x, p.y+5 , p.z-5 );				
	  }
	  
	  //three_links is copy of nodelinks, so they also contain source and target of relation, and distance.
	  
	  for (var j = 0; j < three_links.length; j++) {			  
		  setArrowSourceTarget(three_links[j]);
	  }

	  renderer.render(VisualisationJsModule.scene, VisualisationJsModule.camera);
  }//initialiseConstraints
  
  
  //MouseEvents start -----====-----		
  //touchevent will trigger the mouse event, this is for mobile users.
  function onDocumentTouchStart(event){
		  event.preventDefault();
		  event.clientX = event.touches[0].clientX;
		  event.clientY = event.touches[0].clientY;
		  onDocumentMouseUp( event );
  }

  //colors the ball that is being clicked, serves no real purpose yet.
  function onDocumentMouseDown(event){
	  event.preventDefault();
	  colorSelectedSphere(event, mouse); //Mouse and camera are global variables.
  }
  
  //calls the callback function on mouse up, on the appointed sphere. Mouse and camera are global variables.
  function onDocumentMouseUp(event){
	  event.preventDefault();	
	  //filterFirstSpheregeometryWithRay(event, mouse);
  }
  //end of functions for mouseEvents -----======-----
  
  function setCoordinatesSpheres(baseLevel,nodes,nodelinks) {
    var grootte= Math.pow((VisualisationJsModule.height*VisualisationJsModule.height + VisualisationJsModule.width*VisualisationJsModule.width), 1/2)*0.9 ;
    //var grootte= VisualisationJsModule.height ; // zo was het eerst

    //- bepaal het maximum niveau van alle nodes
    var root=null;
    var max=0;
    for (var key in nodes) {
      if(nodes[key].distance>max)max=nodes[key].distance;
    //- zoek op node met niveau 0 (er is er maar 1!)
      if(nodes[key].distance==0)root=key;
    }
    //range is van -200 tot 100
    //zet root in het midden
    grootte=Math.floor(grootte/2);
    nodes[root].x=0;nodes[root].y=0;nodes[root].z=0;
    //always skip node with distance 0, because it is already placed at the center
    if (baseLevel<1)baseLevel=1;
    //- voor alle niveaus (van 1 tot max):
    for (var currentniveau=1;currentniveau<max+1;currentniveau++) {
      //volgend niveau staat iedere keer minder dan de helft verder weg
      if (currentniveau>=baseLevel)
	for (var key in nodes) 
	  if (nodes[key].distance==currentniveau){
	      //genereer een random vector v van lengte = grootte
	      //possible negative values give better dispersion
	      var x = Math.floor((Math.random() * 100) + 1-50);
	      var y = Math.floor((Math.random() * 100) + 1-50);
	      var z = Math.floor((Math.random() * 100) + 1-50);
	      var v1 = new THREE.Vector3(x, y, z);
	      
	      v1=v1.normalize ();//vector is now size 1
	      
	      
	      var v3 = new THREE.Vector3(v1.x*grootte, v1.y*grootte, v1.z*grootte);//v3 has now size grootte
	      nodes[key].x=v3.x;
	      nodes[key].y=v3.y;
	      nodes[key].z=v3.z;
	      //voor alle relaties verbonden met node
	      var opponent=null;
	      nodelinks.forEach(function(link) {
		{
		  //zoek in de lijst een node met niveau < currentniveau (die is er!)
		  if ((link.source==nodes[key])&&(link.target.distance==currentniveau-1))opponent=link.target;
		  if ((link.target==nodes[key])&&(link.source.distance==currentniveau-1))opponent=link.source;
		}
	      });
	      if (opponent!=null){
		//tel bij de x/y/z van vector v de gevonden x/y/z (van die gevonden node) op  -->xn,yn,zn
		//ken die xn/yn/zn toe aan huidige node
		nodes[key].x=Math.floor(nodes[key].x+opponent.x);
		nodes[key].y=Math.floor(nodes[key].y+opponent.y);
		nodes[key].z=Math.floor(nodes[key].z+opponent.z);
	      } else console.log(nodes[key],"toch niet gevonden!");
	  }
      if (currentniveau<3){//otherwise spheres get too close
		  grootte=Math.floor(grootte/1.5); 
	  }
    }
  }//setCoordinatesSpheres
  
	  
  // Visualize RDF data
  //will create nodes(spheres), labels and arrows and positions them.
  //will omit all nodes with distance < baseLevel
  function visualize(baseLevel,nodes, nodelinks) {
	  setCoordinatesSpheres(baseLevel,nodes,nodelinks);
	  var three_links = [];
	  var spheres = [];
	  if (baseLevel>0){
	    //three_links and spheres have already been created
	    //so get them from memory
	    spheres = VisualisationJsModule.spheres;
	    three_links = VisualisationJsModule.three_links;
	  }
		  // Create spheres based on nodes.
		  for (var key in nodes) {
			  if (nodes.hasOwnProperty(key) && nodes[key].distance>=baseLevel) { 
				  var val = nodes[key];
				  
				  // set up the sphere vars
				  var radius = 5 - (nodes[key].distance)*0.93, //nodes get smaller as their depth increases
				      segments = 32,
				      rings = 32;

				  // create the sphere's material and color
				  var sphereMaterial;
				  try 
				  { 
					  sphereMaterial = new THREE.MeshPhongMaterial({
						  color : getStyleAttr(".sphere.level"+nodes[key].distance,"color",CSSsphere_colors[nodes[key].distance])
					  });												
				  }
				  catch (e){//if level is too high, set default
					  sphereMaterial = new THREE.MeshPhongMaterial({
						  color : getStyleAttr(".sphere","color",CSSsphere_color)
					  });
				  }

				  //create the sphere
				  try {
				    var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), sphereMaterial);
				    sphere.name = nodes[key].name;
				    sphere.node = nodes[key];
				    nodes[key].sphere=sphere;
				    sphere.urlName = nodes[key].url.getLastPartOfUrl();
				    VisualisationJsModule.add3DObject(sphere,nodes[key].distance);
				    spheres[key] = sphere;	
				    VisualisationJsModule.sphereArray.push(sphere);

				    // add the sphere to the scene
				    VisualisationJsModule.scene.add(sphere);

				    nodes[key].label=createLabelWithSprite( key ,nodes[key]["uri:Eigenschap:Heading"] ,nodes[key].distance);
				    
				    
				    createCallbackFunctionForSphere(sphere); 
				  } catch(e){console.log("error creating node for"+nodes[key]);}
			  }
		  }
		  //save spheres to memory, so they can be recalled
		  VisualisationJsModule.spheres=spheres;
	  
		  
		  createArrows(three_links, nodelinks);
		  initialiseConstraints(nodes, spheres, three_links);
		  VisualisationJsModule.three_links=three_links;
		  VisualisationJsModule.container.addEventListener( 'mouseup', onDocumentMouseUp, false );
		  VisualisationJsModule.container.addEventListener( 'touchstart', onDocumentTouchStart, false );
		  VisualisationJsModule.container.addEventListener( 'mousedown', onDocumentMouseDown, false );			
  }//visualize
		  
		  
  /*	function createLabel(key,distance){
			  var canvas1 = document.createElement('canvas');
			  var context1 = canvas1.getContext('2d');
			  context1.font = VisualisationJsModule.getStyle(".containerAttributes").style.font;
			  context1.fillStyle = VisualisationJsModule.getStyle(".nodeTextLabel").style.color;
			  context1.fillText(key, 10, 30);
			  var texture1 = new THREE.Texture(canvas1);
			  texture1.needsUpdate = true;
			  texture1.magFilter = THREE.NearestFilter;
			  texture1.minFilter = THREE.LinearMipMapLinearFilter;
			  texture1.minFilter = THREE.NearestFilter;
			  var material1 = new THREE.MeshBasicMaterial({
				  map : texture1,
				  side : THREE.DoubleSide
			  });
			  material1.transparent = true;
			  var mesh1 = new THREE.Mesh(new THREE.PlaneGeometry(30, 15), material1);						
			  
			  labels[key] = mesh1;
			  VisualisationJsModule.scene.add(mesh1);	
			  VisualisationJsModule.add3DObject(mesh1,distance);
	  }*/
		  
		  
  //creates label and connect it to node	
  function createLabelWithSprite( key, text,distance ){

	  try {
	    text=text.replace(/_/g, " ");
	  } catch(e){
	    text=key.replace(/_/g, " ");
	  }
	  var canvas = document.createElement('canvas');
	  var context = canvas.getContext('2d');
	  var textWidth = context.measureText( text ).width;
	  
	  var canvas = document.createElement('canvas');
	  //TODO make width of sprite dependant on width of text
	  //size is now hard-coded!?
	  var size = 350;
	  canvas.width = size;
	  canvas.height = size;
	  var context = canvas.getContext('2d');
	  context.fillStyle = '#990000';
	  context.textAlign = 'center';
	  context.font = getStyleAttr(".containerAttributes","font-weight",CSScontainerAttributes_fontweight)+" "+
	    getStyleAttr(".containerAttributes","font-size",CSScontainerAttributes_fontsize)+" "+
	    getStyleAttr(".containerAttributes","font-family",CSScontainerAttributes_fontfamily);
	  context.fillText(text, size / 2, size / 2);

	  var amap = new THREE.Texture(canvas);
	  amap.needsUpdate = true;

	  var mat = new THREE.SpriteMaterial({
	      map: amap,
	      transparent: true,
	      //useScreenCoordinates: false,
	      color: 0x000000
	  });

	  var sprite = new THREE.Sprite(mat);
	  sprite.scale.set(50,50,1.2); //grootte van text
	  sprite.textWidth=textWidth;
	  
	  labels[key] = sprite;
	  sprite.position.set(10,10,0);
	  VisualisationJsModule.scene.add( sprite );
	  VisualisationJsModule.add3DObject(sprite,distance);		
	  //node.label=sprite;
	  
	  
	  return sprite;	
	  
  }//createLabelWithSprite
	  
	  //TODO check if used, otherwise can be omitted
  function roundRect(ctx, x, y, w, h, r){
		  ctx.beginPath();
		  ctx.moveTo(x+r, y);
		  ctx.lineTo(x+w-r, y);
		  ctx.quadraticCurveTo(x+w, y, x+w, y+r);
		  ctx.lineTo(x+w, y+h-r);
		  ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
		  ctx.lineTo(x+r, y+h);
		  ctx.quadraticCurveTo(x, y+h, x, y+h-r);
		  ctx.lineTo(x, y+r);
		  ctx.quadraticCurveTo(x, y, x+r, y);
		  ctx.closePath();
		  ctx.fill();
		  ctx.stroke();   
  }
	  
  
  function createArrows(three_links, nodelinks){	
	  for (var i = 0; i < nodelinks.length; i++) {
									  
			  if(nodelinks[i].type.compareStrings("Eigenschap:Skos:related", true, true)){
				  three_links.push(setArrowData(getStyleAttr(".arrow.related","color",CSSarrow_related_color), nodelinks[i]));					
			  }
			  else if(nodelinks[i].type.compareStrings("Eigenschap:Skosem:broader", true, true)){
				  three_links.push(setArrowData(getStyleAttr(".arrow.broader","color",CSSarrow_broader_color), nodelinks[i]));			
			  }
			  else{
				  console.log("ik heb geen nodelinks kunnen vinden dus heb de arrow geen kleurtje kunnen geven");
				  return;
			  };			
	  }			
  }
  
  
  /*
  * Function for adding an arrow to the visualisation scene, the given parameters will determine the color and the source and target of the arrows.
  * Note: the arrows are added to the scene first, and after that they will get their positions assigned in the initialiseconstraints() function by the three_links data.
  *
  */
  //function for setting the data and creating the new arrow
  function setArrowData(arrowColor, currentNodeLink){
	  var origin = new THREE.Vector3(50, 100, 50);
	  var terminus = new THREE.Vector3(75, 75, 75);
	  var direction = new THREE.Vector3().subVectors(terminus, origin).normalize();
	  var distance = origin.distanceTo(terminus);
	  var arrow = new THREE.ArrowHelper(direction, origin, distance, arrowColor); 		
	  arrow.userData = {
				  target : currentNodeLink.target.name,
				  source : currentNodeLink.source.name
	  };
	  arrow.source=currentNodeLink.source;
	  arrow.target=currentNodeLink.target;
	  arrow.distance=currentNodeLink.distance;
	  currentNodeLink.arrow=arrow;//keep connection between nodelink and arrow. Arrow is made for nodelink
	  VisualisationJsModule.add3DObject(arrow,currentNodeLink.distance);
	  

		  
	  //sets the arrowcolor to narrower if the target is deeper than the source and the nodelinktype is related
	  //This code become rudimentary if there are new types introduced
		  if(arrow.target.distance < arrow.source.distance && currentNodeLink.type != "Eigenschap:Skos:related"){	
		    //commented out by anton
		    //color red was arbitrarily added to some arrows
		    //TODO: see what next line does. If not necessary: omit it!
			  //arrow.setColor(VisualisationJsModule.getStyle(".arrow.narrower").style.color);
		  }
	  
	  
	  VisualisationJsModule.scene.add(arrow);	
	  return arrow;
  }//setArrowData
  
  //adds lightsources to the scene, for aesthetic purposes
  function createLightingForScene() {
	  // Instantiate light sources
	  var pointLight1 = new THREE.PointLight(0xFFFFFF);
	  pointLight1.position.set(0,50,500);
	  VisualisationJsModule.scene.add(pointLight1);
	  var pointLight2 = new THREE.PointLight(0xFFFFFF);
	  pointLight2.position.set(0,500,-500);
	  VisualisationJsModule.scene.add(pointLight2);
	  var pointLight3 = new THREE.PointLight(0xFFFFFF);
	  pointLight3.position.set(500,500,0);
	  VisualisationJsModule.scene.add(pointLight3);
	  var pointLight4 = new THREE.PointLight(0xFFFFFF);
	  pointLight4.position.set(-500,50,0);
	  VisualisationJsModule.scene.add(pointLight4);
	  var pointLight5 = new THREE.PointLight(0xFFFFFF);
	  pointLight5.position.set(0,-100,0);
	  VisualisationJsModule.scene.add(pointLight5);
  }

  function clearCanvas(){
		  for( var i = VisualisationJsModule.scene.children.length - 1; i >= 0; i--) {						
			  //does it have a geometry or is it an Object3D? remove it. This just deletes the spheres and arrows and not the lighting and camera.
			  if(VisualisationJsModule.scene.children[i].geometry != null | VisualisationJsModule.scene.children[i].type == "Object3D"){
				  VisualisationJsModule.scene.remove(VisualisationJsModule.scene.children[i]);	
			  }
		  };			
  }	
  function changeDepth(depth){
    //make objects visible yes/no depending on depth
    var links=VisualisationJsModule.threeDObjects
    links.forEach(function(link){
      link.visible=link.distance<=depth;
    });
  }
  
  function getNodeAndNodelinksFromMemory(jsonResult,baseLevel) {
      //produces nodes, nodelinks and baseLevel when nodes are already on screen while ajax is called
      //gets nodes and nodelinks from memory
      var nodes=VisualisationJsModule.nodes;
      var labels=VisualisationJsModule.labels;
      var nodelinks=VisualisationJsModule.nodelinks;

      //depth calculated to largest distance of old ones
      for (var key in nodes) {
	if (baseLevel<nodes[key].distance)
	  baseLevel=nodes[key].distance;
      }
      //baseLevel is 1 larger than largest of old ones
      baseLevel++;

      var nodeFound=false;
      //add new nodes to old ones
      for (var key in jsonResult.nodes) {
      if ((jsonResult.nodes[key].distance>=baseLevel))
	nodes[key]=jsonResult.nodes[key];
	nodeFound=true;
      }
      if(!nodeFound)
	baseLevel=VisualisationJsModule.depth;

      //add new nodelinks to old ones
      var nodelinks=VisualisationJsModule.nodelinks;
      jsonResult.relations.forEach(function(link) {
	var found=false;
	nodelinks.forEach(function(linkold) {
	  if (link.type==linkold.type && link.urlsource==linkold.urlsource  && link.urltarget==linkold.urltarget)
	    found=true;
	});
	if (!found)
	  nodelinks.push(link);
      });
      //three return values
      return {nodes:nodes,nodelinks:nodelinks,baseLevel:baseLevel};
  }//getNodeAndNodelinksFromMemory

	//gets called after the ajax call
  var drawNewObjectsWithAjaxData = function (result) {
    //end loading icon
    $("body").toggleClass("wait");

    if (result.length==0) 
      result='{"relations":[],"nodes":{"'+thisconcept+'":{"name":"'+thisconcept+
      '","distance":0,"url":"http:\/\/195.93.238.56\/wiki\/hzportfolio\/wiki\/index.php\/KNKR_Oncologen"}}}';

    VisualisationJsModule.init3DObjects();

    var baseLevel=0;

    var jsonResult = JSON.parse(result);
    console.log(jsonResult);
    if (typeof VisualisationJsModule.nodes == 'undefined'){
      //first time to draw nodes and arrows.
      //init nodes, nodelinks and labels
	  VisualisationJsModule.init3DObjects();
		  
	  //Contains arrows
	  labels = []; //Contains label sprites			
	  
	  var nodes = jsonResult.nodes;
	  var nodelinks = jsonResult.relations;
    } else {
      //read nodes from memory
      var ret=getNodeAndNodelinksFromMemory(jsonResult,baseLevel);
      //parse return value
      var nodes=ret.nodes,nodelinks=ret.nodelinks;
      baseLevel=ret.baseLevel;
    }

    // replace the description of the source and target of the links with the actual nodes.
    nodelinks.forEach(function(link) {
      {
	//check if link-desccription already replaced with corresponding object
	if (typeof link.source == "string"){
	  //replace link-desccription with corresponding object
	    link.source = nodes[link.source] ;
	    link.distance=link.source.distance;
	    link.target = nodes[link.target];
	    //distance is smallest from target and source
	    if (link.distance<link.target.distance) link.distance=link.target.distance;
	}
      }
    });

    VisualisationJsModule.camera.updateProjectionMatrix();
    visualize(baseLevel,nodes, nodelinks);
    animate();
    changeDepth(VisualisationJsModule.newDepth);//initial position in depth-slider is 1
    console.log("initialized all");
    VisualisationJsModule.nodes=nodes;
    VisualisationJsModule.labels=labels;
    VisualisationJsModule.nodelinks=nodelinks;
    
    // Animate the webGL objects for rendering
    function animate() {
	    requestAnimationFrame(animate);
	    renderer.render(VisualisationJsModule.scene, VisualisationJsModule.camera);
	    VisualisationJsModule.controls.update();

	    for (var label in labels) {
		    labels[label].lookAt(VisualisationJsModule.camera.position); //makes the labels spin around to try to look at the camera
	    }
	    render();
    }

    // Extension of default render function, runs continuously, add code here if needed
    function render() {

    }
  };//drawNewObjectsWithAjaxData

		  
  function initialiseDrawingSequence(concept, depth, newdepth){
    thisconcept=concept;//save in class-variable so it can be used outside function
		  
	  if ( typeof concept === 'undefined' || concept === '') {
		  throw "Concept is undefined";
	  }		

	  //var depth = typeof depth !== 'undefined' ? depth : 2 ;
	  var mydepth =1 ;	
	  if (typeof newdepth !== 'undefined'){
	    mydepth = newdepth;
	    VisualisationJsModule.depth=depth;
	  }
	  else //TODO van Robert: waarom staat hier geen scoping?
	    clearCanvas();//first time, clear canvas   
	  VisualisationJsModule.newDepth=mydepth;//TODO is newdepth a good description? And it should become a class-variable
	  var relations = typeof relations !== 'undefined' ? relations : "broader,narrower,related";
	  //display loading icon before ajax-call
	  $("body").toggleClass("wait");	
	  $.ajax(
	    {
		  type : "POST",
		  cache : false,
		  //url : "php/VisualisationScript.php",
		  url : mw.config.get('wgExtensionAssetsPath')+"/EM3DNavigator/php/VisualisationScript.php", //refer to the path where the PHP class resides
		  async : true,
		  data : {
			  concept : decodeURI(concept.replace(/_/g, " ")),
			  depth : depth.toString(),
			  relations : relations,
			  uri : mw.config.get('wgEM3DNavigator').eM3DNavigatorUri,
			  fusekidataset : mw.config.get('wgEM3DNavigator').eM3DFusekiDataset
		  },
		  success:function(result)//we got the response
		  {
		  },
		  error:function(exception){console.log('Exeption: '+exception);}	   
	    }).done(drawNewObjectsWithAjaxData);
  }//initialiseDrawingSequence
				    
  /**
  *Initialise the components that are relevant to the canvas/renderer
  */	
//  function initialiseTHREEComponents(currentPageName){ //current page name als concept mee
//    //TODO anton:function not used anymore. can be removed.
//	  drawHTMLElements(TARGETDIVID);
//	  drawModel(currentPageName);  
//  }//initialiseTHREEComponents

  function initGlobalVariables(CONTAINERDIV){
      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();
      //initalise global module to store global variables
      VisualisationJsModule= new VisualisationJsModulePrototype(CONTAINERDIV);

      var containerHEIGHT = VisualisationJsModule.height;
      var containerWIDTH = VisualisationJsModule.width; //TODO width and height are set two lines above. Should be used here
      //set width and height of divs. Can only be done here because css is not read earlier
      $("#"+EMMCONTAINERDIV).css("height",""+containerHEIGHT+ "px").css("width",""+containerWIDTH+ "px");
      $("#"+SLIDERDIVID).css("position","absolute").css("left",""+(containerWIDTH-$("#"+SLIDERDIVID).width())+"px")
	      .css("background", getStyleAttr(".sliderAttributes.background","background","rgb(229,222,205)") );

      
      // Create Renderer
      renderer = new THREE.WebGLRenderer({
	      alpha : true,
	      antialiasing : true
      });

      renderer.setClearColor(0x000000, 0);
      renderer.setSize(containerWIDTH, containerHEIGHT);
      var containerDiv=document.getElementById( CONTAINERDIV ); //TODO van Robert, gets the containerdiv... again...
      $("#"+CONTAINERDIV).empty();
      containerDiv.appendChild(renderer.domElement);
  }//initGlobalVariables
  
  function drawTotalModel(currentPageName){
        if (typeof currentPageName == 'undefined'){
	  currentPageName=mw.config.get( 'wgPageName' );
	}
	//initVariables();
	initGlobalVariables(CONTAINERDIV);
	drawModel(currentPageName);//TODO merge drawmodel into this function, and call it drawModel
  }

  var  drawHTMLElements = function(targetDivId, currentPageNameFromMw){
  //draw html-elements, and give them basic csss-styles to position them
      if (window.EMMElementsDrawn) {
	      return;
      }
      window.EMMElementsDrawn=true;
      
      //create containerDiv and other elements
      jQuery('<div/>', {
	id: CONTAINERDIV,
      }).appendTo('#'+targetDivId);
      //create sliderdiv
      jQuery('<div/>', {
	id: SLIDERDIVID,
      }).appendTo('#'+targetDivId);;
      jQuery('<div/>', {
	id: EMMCONTAINERDIV
      }).prependTo('#'+BODYCONTENTDIV);
      $("#"+CONTAINERDIV).appendTo('#'+EMMCONTAINERDIV);
      $("#"+SLIDERDIVID).appendTo('#'+EMMCONTAINERDIV);
      var showdivcontainer=jQuery('<div/>', {
	id: SHOWBUTTONDIV+"container"
      });
      var showdivtext=jQuery('<span/>', {
	id: SHOWBUTTONDIV+"text",
	html:"<b>Model</b>"
      });
      var showdivcontainer2=jQuery('<span/>', {
	id: SHOWBUTTONDIV+"container2"
      }).css("float","right");

      var leftBracket=jQuery('<span/>', {
		  html:"["
      });

      var rightBracket=jQuery('<span/>', {
	html:"]"
      });
      var showdiv=jQuery('<a/>', {
      id: SHOWBUTTONDIV,
      href:"#",
      html:checkIfEmpty(mw.message( 'collapsible-expand' ).text(),"Expand") 
      });

      showdivcontainer2.append(leftBracket).append(showdiv).append(rightBracket);

      showdivcontainer.append(showdivtext);
      showdivcontainer.append(showdivcontainer2);
      showdivcontainer.prependTo('#'+BODYCONTENTDIV);
	      
      //set CSS of elements
      //met de volgende code extra, en het stuk in css, kun je de slider over het model heen laten vallen.
      $("#"+SLIDERDIVID).css("position", "fixed")
	      .css("vertical-align", "top")
	      .css("display", "inline-block");
      $("#"+CONTAINERDIV).css("position","absolute").css("display", "inline-block");
      $("#"+EMMCONTAINERDIV).css("position","relative");
         var divWidth=getStyleAttrInt('.containerAttributes',"width",CSScontainerAttributes_width);

      $("#"+SLIDERDIVID).css("width",getStyleAttrInt('#'+SLIDERDIVID,"width",30))
	      .css("width", getStyleAttrInt('#'+SLIDERDIVID,"width",30))
	      .css("height", getStyleAttrInt('#'+SLIDERDIVID,"height",400))
      $("#"+EMMCONTAINERDIV).css("height",""+$("#"+CONTAINERDIV).height()+ "px")
	.css("width",""+divWidth+ "px").css("display","inline-block");

      //define event on button
      $( '#'+EMMCONTAINERDIV ).hide();
      $( "#"+SHOWBUTTONDIV  ).click(function () {
	if ( $( '#'+EMMCONTAINERDIV ).is( ":hidden" ) ) {
	  var timeout=0;
	  if (!valuesHaveBeenShown){
	    drawTotalModel(currentPageNameFromMw);
	    timeout=1000;
	  }
	  showdiv.html(checkIfEmpty(mw.message( 'collapsible-collapse' ).text(),"Collapse"));
	  //slide down after one second; smooth animation
	  setTimeout(function(){$( '#'+EMMCONTAINERDIV ).slideDown( "slow" );}, timeout);
	} else {
	  valuesHaveBeenShown=true;
	  $( '#'+EMMCONTAINERDIV ).slideUp( "slow" );
	  showdiv.html(checkIfEmpty(mw.message( 'collapsible-expand' ).text(),"Expand"));
	}
      });
  }//drawHTMLElements

  function drawModel(currentPageName){
  //draw model
      var containerHEIGHT = VisualisationJsModule.height;
      var containerWIDTH = VisualisationJsModule.width; 
      //TODO van Robert, deze variabelen worden ook al gedeclareerd in initglobalVariables, 2x.
      //anton: meest logisch is om WIDTH en HEIGHT als constanten te bewaren binnen de klasse zelf.
      //ze worden 3 keer gebruikt, en 1 x geinitialiseerd. Dat kun je allemaal binnen visualisation doen. Spaart aanmaken van lokale variabelen.
      VisualisationJsModule.camera.position.y = containerHEIGHT/2;
      VisualisationJsModule.camera.position.x = containerWIDTH/2;			
      VisualisationJsModule.camera.position.z =  Math.pow((containerHEIGHT*containerHEIGHT + containerWIDTH*containerWIDTH), 1/4);			
      VisualisationJsModule.scene.add(VisualisationJsModule.camera);
		      
      createLightingForScene();
      if (typeof window.sliderObject == 'undefined')//TODO this is a hack. Check why sliderObject can be created more than once
      window.sliderObject=createSlider(initialiseDrawingSequence,changeDepth, currentPageName,VisualisationJsModule.depth); //creates the slider for the depth
      initialiseDrawingSequence(currentPageName,VisualisationJsModule.depth);
  }


	function setDivIdFromWiki(string1, string2){
		console.log("het doorgegeven ID is =");
		console.log(string1);
		console.log(string2);
	}

  

	
  return  {
		//these properties can be asked by: Visualisation.propertyname
		drawHTMLElements : drawHTMLElements,
		setDivIdFromWiki : setDivIdFromWiki,
		drawModel : drawTotalModel,
		getStyle: getStyle,
		//getStyleAttr:getStyleAttr,
		getStyleAttrInt:getStyleAttrInt

  }
});

var visualisationInstance = new Visualisation();//TODO not used, can be omitted. Find out if an instance can be created that can be used in global space
//var window.visualisationInstance= new Visualisation(); // . is unidentified token?


