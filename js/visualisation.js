/**
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

//CSS constants (integers!)
var CSSmaxDepth_order=3;
var CSScontainerAttributes_width=400;
var CSScontainerAttributes_height=400;	
//size of labels of spheres
var LABELSIZE = 400;
// Set camera attributes
var VIEW_ANGLE = 20, //field of view
    NEAR = 10,
    FAR = 10000;

 
//main class Visualisation
window.Visualisation = (function () {//CSS constants
var CSScontainerAttributes_width=400;
var CSScontainerAttributes_height=400;	
  var SELECTEDSPHERECOLOR="rgb(128,0,128)";
  var CSSsphere_color="rgb(191,172,136)";
  var CSSsphere_colors=["rgb(76,151,214)","rgb(191,172,136)","rgb(191,172,136)","rgb(191,172,136)","rgb(191,172,136)","rgb(191,172,136)","rgb(191,172,136)"];
  var CSSarrow_related_color="red";
  var CSSarrow_broader_color="black";
  var CSSarrowColors={"Eigenschap:Skos:related":{css:".arrow.related",color:CSSarrow_related_color,arrow:false},
		      "Eigenschap:Skosem:broader":{css:".arrow.broader",color:CSSarrow_broader_color,arrow:true}};
  var CSScontainerAttributes_fontsize="20px";
  var CSScontainerAttributes_fontfamily="Times";
  var CSScontainerAttributes_fontweight="normal";
	//These variables determine the initial state of the visualisation, depth = the depth that will be loaded initially.
   var DEPTH=CSSmaxDepth_order;
  var WIDTH=CSScontainerAttributes_width;
  var HEIGHT=CSScontainerAttributes_height;
	var VIEW_ANGLE = 20, //field of view
	    ASPECT = WIDTH / HEIGHT, 
	    NEAR = 10,
	    FAR = 10000;
	var camera =  new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  //variables for drawing
  var renderer;//global
  var	mouse;//global
  var	raycaster;//global
  var camera;
  var controls;
  var scene;
  //following vars contain data for nodes and model
  var nodes;//array of all nodex
  var nodelinks;//array of all links
  var sphereArray=[]; //Array will be filled with spheres; the objects that will be intersected through on mouse events
  var threeDObjects=[];//Array will be filled with all visible objects, all contain property distance
  
  
  var sliderObject;
  var valuesHaveBeenShown=false;
  var currentPageName;//current concept
  var GLOBALDEPTH;//global
  //scaling of coordinates
  var xScale,yScale,zScale;
  var pressedkey="";
  var selectedSphere;

	  
  /**
  * @author NJK @author robertjuh @author Anton Bil
  * This script is responsible for drawing the 3d objects to the canvas and initialising an ajax call. 
  */

  function initGlobalVariables(CONTAINERDIV){
      //initalise global variables
      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();
	  console.log("mouse");
	  console.log(mouse);
      DEPTH=getStyleAttrInt(".maxDepth","order",CSSmaxDepth_order);
      WIDTH=getStyleAttrInt('.containerAttributes',"width",CSScontainerAttributes_width);
      HEIGHT=getStyleAttrInt('.containerAttributes',"height",CSScontainerAttributes_height);

      var containervar=document.getElementById( CONTAINERDIV );
	  var d3containervar = d3.select("#containerDiv"); 
      var ASPECT = WIDTH / HEIGHT;
      camera =  new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);	
      controls = new THREE.OrbitControls(camera, containervar);
      scene = new THREE.Scene;

      //set width and height of divs. Can only be done here because css is not read earlier
      $("#"+EMMCONTAINERDIV).css("height",""+HEIGHT+ "px").css("width",""+WIDTH+ "px");
      $("#"+SLIDERDIVID).css("position","absolute").css("left",""+(WIDTH-$("#"+SLIDERDIVID).width())+"px")
	      .css("background", getStyleAttr(".sliderAttributes.background","background","rgb(229,222,205)") );

      SELECTEDSPHERECOLOR=getStyleAttr(".sphere.selected","color",SELECTEDSPHERECOLOR);
      // Create Renderer
      renderer = new THREE.WebGLRenderer({
	      alpha : true,
	      antialiasing : true
      });

      renderer.setClearColor(0x000000, 0);
      renderer.setSize(WIDTH, HEIGHT);
      //set scaling, only has to be done once.
      setScaling();

      $("#"+CONTAINERDIV).empty();
      //add renderer to container
      containervar.appendChild(renderer.domElement);
      //add listeners
      //containervar.addEventListener( 'mouseup', onDocumentMouseUp, false );
      containervar.addEventListener( 'touchstart', onDocumentTouchStart, false );
      //containervar.addEventListener( 'mousedown', onDocumentMouseDown, false );	
      window.addEventListener('keydown', keydown, false);
      window.addEventListener('keyup', keyup, false);
	 		
	  	d3containervar.on( 'contextmenu', onDocumentRightMouseDown, false );	
	  	//d3containervar.on( 'mouseup', onDocumentMouseUp, false );	
	    d3containervar.on( 'click', onDocumentMouseDown, false );	

	  
  }//initGlobalVariables
  
	
  var keyup=function(event) {
    pressedkey="";
  };
  var getAllowedKey=function(key){
    var char=String.fromCharCode(key);
    //TODO allowedkeys in constant, combined with choices.
    if ("ASXEDF".indexOf(char)>=0){return char;console.log(char);} else return "";
  }
  var keydown=function(event) {
    var key = event.keyCode;
    //TODO: up and down also move the screen up and down. see if key-events can be split up. Otherwise stick to xsedaf
    //better: use shift-arrows. Already implemented.
    if (key==37) pressedkey="left";else
    if (key==38) pressedkey="up";else
    if (key==39) pressedkey="right";else
    if (key==40) pressedkey="down";else
    if (key==33) pressedkey="pgup";else
    if (key==34) pressedkey="pgdn";else
    pressedkey=getAllowedKey(key);
    if (event.shiftKey&&selectedSphere&&pressedkey.length>0)moveIntersectedSphere(selectedSphere)
  };
  var keyIsPressed=function(){
    if (pressedkey.length>0) return pressedkey; else return false;
  }
	  
	  	//uses d3.mouse(this)[0],[1] to find the mouse coordinates on the current element
		//uses the mouse variable which is a THREE.Vector2
		function normalizeCurrentMouseCoordinates(e, mouse){
			mouse.x = (  (e[0])  / renderer.domElement.width ) * 2 - 1;			
			mouse.y = - (  (e[1]) / renderer.domElement.height ) * 2 + 1;			
		}

  function initGlobalVariables(CONTAINERDIV){
      //initalise global variables
      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();
      DEPTH=getStyleAttrInt(".maxDepth","order",CSSmaxDepth_order);
      WIDTH=getStyleAttrInt('.containerAttributes',"width",CSScontainerAttributes_width);
      HEIGHT=getStyleAttrInt('.containerAttributes',"height",CSScontainerAttributes_height);
	  var d3containervar = d3.select("#containerDiv"); 
      var containervar=document.getElementById( CONTAINERDIV );
      var ASPECT = WIDTH / HEIGHT;
      camera =  new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);	
      controls = new THREE.OrbitControls(camera, containervar);
      scene = new THREE.Scene;

      //set width and height of divs. Can only be done here because css is not read earlier
      $("#"+EMMCONTAINERDIV).css("height",""+HEIGHT+ "px").css("width",""+WIDTH+ "px");
      $("#"+SLIDERDIVID).css("position","absolute").css("left",""+(WIDTH-$("#"+SLIDERDIVID).width())+"px")
	      .css("background", getStyleAttr(".sliderAttributes.background","background","rgb(229,222,205)") );

      SELECTEDSPHERECOLOR=getStyleAttr(".sphere.selected","color",SELECTEDSPHERECOLOR);
      // Create Renderer
      renderer = new THREE.WebGLRenderer({
	      alpha : true,
	      antialiasing : true
      });

      renderer.setClearColor(0x000000, 0);
      renderer.setSize(WIDTH, HEIGHT);
      //set scaling, only has to be done once.
      setScaling();

      $("#"+CONTAINERDIV).empty();
      //add renderer to container
      containervar.appendChild(renderer.domElement);
      //add listeners
     // containervar.addEventListener( 'mouseup', onDocumentMouseUp, false );
     // containervar.addEventListener( 'touchstart', onDocumentTouchStart, false );
     // containervar.addEventListener( 'mousedown', onDocumentMouseDown, false );	
	  d3containervar.on( 'contextmenu', onDocumentRightMouseDown, false );	
	  //d3containervar.on( 'mouseup', onDocumentMouseUp, false );	
	  d3containervar.on( 'click', onDocumentMouseDown, false );	    

	  window.addEventListener('keydown', keydown, false);
      window.addEventListener('keyup', keyup, false);
	  
  }//initGlobalVariables
  
	
  var keyup=function(event) {
    pressedkey="";
  };
  var getAllowedKey=function(key){
    var char=String.fromCharCode(key);
    //TODO allowedkeys in constant, combined with choices.
    if ("ASXEDF".indexOf(char)>=0){return char;console.log(char);} else return "";
  }
  var keydown=function(event) {
    var key = event.keyCode;
    //TODO: up and down also move the screen up and down. see if key-events can be split up. Otherwise stick to xsedaf
    //better: use shift-arrows. Already implemented.
    if (key==37) pressedkey="left";else
    if (key==38) pressedkey="up";else
    if (key==39) pressedkey="right";else
    if (key==40) pressedkey="down";else
    if (key==33) pressedkey="pgup";else
    if (key==34) pressedkey="pgdn";else
    pressedkey=getAllowedKey(key);
    if (event.shiftKey&&selectedSphere&&pressedkey.length>0)moveIntersectedSphere(selectedSphere)
  };
  var keyIsPressed=function(){
    if (pressedkey.length>0) return pressedkey; else return false;
  }
	  
	  
	  function colorSelectedSphere(event, mouse){
		  normalizeCurrentMouseCoordinates(event,mouse);
		  
		  raycaster.setFromCamera( mouse, camera );
		  
		  var intersects = raycaster.intersectObjects( sphereArray); 	

		  checkGeometryTypeAndSlice(intersects);	

		  return checkGeometryTypeAndSlice(intersects,event)	
	  }	
	  
	  function checkGeometryTypeAndSlice(intersects){
			var intersectLength = intersects.length;
			//If there is an intersection, and it is a sphere, apply click event.
			//Loops through each intersected object and cuts off the planeGeometries so that the sphere will be clicked even though there is something in front of it.
			for (var i = 0; i <= intersectLength; i++) {
				if(intersects == 0 || intersects[0].object.geometry.type == null){	
					return;
				}else{			 
					intersects[0].object.callback(intersects[0].object);
				}		
			}
		}
		  



  
  		//create a callback function for each sphere, after clicking on a sphere the canvas will be cleared and the selected sphere will be the center point
		//Clickevents on objects on the canvas are registered here
		function createCallbackFunctionForSphere(sphere, nodelinks, three_links){		
			try{
			//sphere.callback = function(conceptNameString){
			sphere.callback = function(intersectedObject){
				//if user leftclicked a sphere
				if(d3.event.type == 'click'){
					clearCanvas();
					window.location = window.location.href.getFirstPartOfUrl() + intersectedObject.urlName; //navigate to the clicked object
				}				

				//if user rightclicked a sphere
				if(d3.event.type == 'contextmenu'){			
					moveIntersectedSphere(intersectedObject);					
				}		
			}		
		
			}catch( e ){console.log("error create callbackfunction"+e)}}
	

	
  function changePosition(node,move,first){
	  node.x=node.x+move[0];//v3.x;//
	  node.y=node.y+move[1];//v3.y;//
	  node.z=node.z+move[2];//v3.z;//
	  var newPosition=scale(node);
	  var _x = newPosition.x;
	  var _y = newPosition.y;
	  var _z = newPosition.z;
	  if (!first){//do not change position of first node, it must be animated....
	    node.sphere.position.x=_x;
	    node.sphere.position.y=_y;
	    node.sphere.position.z=_z;
	    node.label.position.x=_x;
	    node.label.position.y=_y+5;
	    node.label.position.z=_z;
	  }
				  
	  //moves the sphere to _x, _y, _z
	  try{
	  node.sourcelist.forEach(function(link) {
	    if (link.distance>node.distance){changePosition(link.target,move,false)}
	    var visible=link.visible;
	    link.visible=false;
	    setArrowSourceTarget(link.arrow);
	    link.visible=visible;
	  });
	  }catch(e){/*console.log(e.stack);*/}
	  //TODO looks like a relation gets twice the length as a broader relation. 
	  //Perhaps it is part of two lists? Check this out!
	  try{
	  node.targetlist.forEach(function(link) {
	    if (link.distance>node.distance){changePosition(link.source,move,false)}
	    var visible=link.visible;
	    link.visible=false;
	    setArrowSourceTarget(link.arrow);
	    link.visible=visible;
	  });
	  }catch(e){/*console.log(e.stack);*/}
	  return newPosition;
  }

		//This function is experimental and can move a selected sphere.
		//This function is an implementation of moving objects I.e moving surrounding nodes aside later.
		function moveIntersectedSphere(intersectedObject){
		  //problem with following approach is, that it comes inbetween mousedown and mouseup. This breaks mouse propagation
			      if (!(intersectedObject==selectedSphere))
				try{
				  selectedSphere.material.color=new THREE.Color(getSphereColor(selectedSphere.node.distance));
				}catch(e){}
			      selectedSphere=intersectedObject;
			      selectedSphere.material.color=new THREE.Color(SELECTEDSPHERECOLOR);
			      //TODO move moveKeys to top (they are constants).
			      var moveKeys={"E":[0,100,0],"X":[0,-100,0],"S":[-100,0,0],"D":[100,0,0],"A":[0,0,100],"F":[0,0,-100],
				"up":[0,100,0],"down":[0,-100,0],"left":[-100,0,0],"right":[100,0,0],"pgup":[0,0,100],"pgdn":[0,0,-100]
			      };
			      var move=moveKeys[pressedkey];
				if ( typeof move === 'undefined' ){
				  //var v3=randomVector(100);
				  //move=[v3.x,v3.y,v3.z];
				  move=[0,0,0];//do nothing
				}
				
				var newPosition=changePosition(intersectedObject.node,move,true);
				
				//animate object;
				new TWEEN.Tween( intersectedObject.position).to( {
						x: newPosition.x,
						y: newPosition.y,
						z: newPosition.z }, 2000 )
					.easing( TWEEN.Easing.Elastic.Out).start();		

				//moves the label along
				new TWEEN.Tween( intersectedObject.node.label.position).to( {
						x: newPosition.x,
						y: newPosition.y + 5,
						z: newPosition.z  }, 2000 )
					.easing( TWEEN.Easing.Elastic.Out).start();
				//update arrows to new position node
				changePosition(intersectedObject.node,[0,0,0]);
	      //animate the arrows, not implemented yet. find out a way to animate relations also.
				/*new TWEEN.Tween( VisualisationJsModule.threeDObjects[1].position).to( {
						x: _x,
						y: _y,
						z: _z  }, 2000 )
					.easing( TWEEN.Easing.Elastic.Out).start();	*/
  //  }
		};
					
		
  //functions for arrows			
  function setArrowSourceTarget(arrow) {
    try{
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
    }catch( e ){console.log("error setarrowsourcetarget"+e)}
  }
  //end of functions for arrows -----======-----
  
  
  /*
   * setScaling
   * done only once
   */
  function setScaling(){
	  var min=-100;
	  var max=50;
	  xScale = d3.scale.linear().domain([0, HEIGHT+1]).range([min, max]);
	      yScale = d3.scale.linear().domain([0, HEIGHT+1]).range([min, max]);
	      zScale = d3.scale.linear().domain([0, HEIGHT+1]).range([min, max]);
  }
  
  function scale(node){
    //first see what the new position of base-node will be, because that is positioned on 0,0,0
    return new THREE.Vector3(xScale(node.x)-xScale(0), yScale(node.y)-yScale(0) , zScale(node.z)-zScale(0));
  }
  // Initializes calculations and spaces nodes according to a forced layout
  // takes variables from the startvisualisation method
  //scales the nodes according to their initial postions, and sets the position of the arrows
  function scaleNodesAndArrows(nodes) {

			  
	  for (var key in nodes) {
		  //scale to new location and do a translation to place nodes in the middle
		  var v=scale(nodes[key]);
		  nodes[key].sphere.position.set(v.x, v.y , v.z );
		  nodes[key].label.position.set(v.x, v.y+5 , v.z-5 );				
	  }
	  
	  //set arrow for every nodelink
	  
	  for (var j = 0; j < nodelinks.length; j++) {		  
		  setArrowSourceTarget(nodelinks[j].three_link);
	  }

	  renderer.render(scene, camera);
  }//scaleNodesAndArrows
  
  
  //MouseEvents start -----====-----		
  //touchevent will trigger the mouse event, this is for mobile users.
  function onDocumentTouchStart(event){
		  event.preventDefault();
		  event.clientX = event.touches[0].clientX;
		  event.clientY = event.touches[0].clientY;
		  onDocumentMouseDown( event );
  }

  //colors the ball that is being clicked, serves no real purpose yet.
  function onDocumentMouseDown(){
	  colorSelectedSphere(d3.mouse(this), mouse); //Mouse and camera are global variables.
  }
  
  function onDocumentRightMouseDown(){
		colorSelectedSphere(d3.mouse(this), mouse); //Mouse and camera are global variables.
  }
  
  //end of functions for mouseEvents -----======-----
  
	    function randomVector(grootte){
	      var x = Math.floor((Math.random() * 100) + 1-50);
	      var y = Math.floor((Math.random() * 100) + 1-50);
	      var z = Math.floor((Math.random() * 100) + 1-50);
	      var v1 = new THREE.Vector3(x, y, z);
	      
	      v1=v1.normalize ();//vector is now size 1
	      
	      
	      return new THREE.Vector3(v1.x*grootte, v1.y*grootte, v1.z*grootte);//v3 has now size grootte
	    }
  /*
   * setCoordinatesNodes
   * sets base coordinates for all nodes
   */
  function setCoordinatesNodes(baseLevel,nodes,nodelinks) {
    try{
    var grootte= Math.pow((HEIGHT*HEIGHT + WIDTH*WIDTH), 1/2)*0.9 ;

    //- bepaal het maximum niveau van alle nodes
    var root=null;
    var max=0;
    for (var key in nodes) {
      try{
      if(nodes[key].distance>max)max=nodes[key].distance;
    //- zoek op node met niveau 0 (er is er maar 1!)
      if(nodes[key].distance==0)root=key;
      }catch( e ){console.log("error for (var key in nodes) 1"+e)}
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
	  try{
	  if (nodes[key].distance==currentniveau){
	      //genereer een random vector v van lengte = grootte
	      //possible negative values give better dispersion
	      var v3=randomVector(grootte);
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
      }catch( e ){console.log("error for (var key in nodes) 2"+e)}
      if (currentniveau<3){//otherwise spheres get too close
		  grootte=Math.floor(grootte/1.5); 
	  }
    }
  }catch( e ){console.log("error setcoordinatesspheres"+e)}
  }//setCoordinatesSpheres
  
	  
  // Visualize RDF data
  //will create nodes(spheres), labels and arrows and positions them.
  function createSpheresAndArrowsBasedOnNodesAndLinks(baseLevel,nodes, nodelinks) {
    try{
	  setCoordinatesNodes(baseLevel,nodes,nodelinks);
	  // Create spheres based on nodes.
	  createSpheresBasedOnNodes(nodes,baseLevel);

	  //create arrows based on nodelinks
	  createArrows(nodelinks);
	  scaleNodesAndArrows(nodes);
  }catch( e ){console.log("error visualize"+e)}
  }//visualize

  function getSphereColor(distance){
    var color = CSSsphere_color;
    try{
      color=getStyleAttr(".sphere.level"+distance,"color",CSSsphere_colors[distance])
    }
      catch (e){//if level is too high, set default
	color = getStyleAttr(".sphere","color",CSSsphere_color)
      }
      return color;
  }


  /*
   * createSpheresBasedOnNodes
   * create sphere for every node, and saves it within a node
   */
  function createSpheresBasedOnNodes(nodes,baseLevel){
    try{
    for (var key in nodes) {
	    if (nodes.hasOwnProperty(key) && nodes[key].distance>=baseLevel) { 
		    var val = nodes[key];
		    
		    // set up the sphere vars
		    var radius = 5 - (nodes[key].distance)*0.93, //nodes get smaller as their depth increases
			segments = 32,
			rings = 32;

		    // create the sphere's material and color
		    var sphereColor=getSphereColor(nodes[key].distance);
		    var sphereMaterial = new THREE.MeshPhongMaterial({
				    color : sphereColor
			    });												

		    //create the sphere
		    try {
		      var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), sphereMaterial);
		      sphere.name = nodes[key].name;
		      sphere.node = nodes[key];
		      sphere.urlName = nodes[key].url.getLastPartOfUrl();
		      nodes[key].sphere=sphere;
		      add3DObject(sphere,nodes[key].distance);
		      //spheres[key] = sphere;	
		      sphereArray.push(sphere);

		      // add the sphere to the scene
		      scene.add(sphere);
		      
		      //modify node. uses array, so there's no need to return value from function

		      nodes[key].label=createLabelWithSprite( key ,nodes[key]["uri:Eigenschap:Heading"] ,nodes[key].distance);
		      
		      
		      createCallbackFunctionForSphere(sphere); 
		    } catch(e){console.log("error creating node for"+nodes[key]);}
	    }
    }
  }catch( e ){console.log("error createSpheresBasedOnNodes"+e)}
  }
  
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
	  //console.log(textWidth);
	  
	  var canvas = document.createElement('canvas');
	  //TODO make width of sprite dependant on width of text
	  //could it be it can be calculated using textWidth and fontsize?
	  canvas.width = LABELSIZE;
	  canvas.height = LABELSIZE;
	  var context = canvas.getContext('2d');
	  context.fillStyle = '#990000';
	  context.textAlign = 'center';
	  context.font = getStyleAttr(".containerAttributes","font-weight",CSScontainerAttributes_fontweight)+" "+
	    getStyleAttr(".containerAttributes","font-size",CSScontainerAttributes_fontsize)+" "+
	    getStyleAttr(".containerAttributes","font-family",CSScontainerAttributes_fontfamily);
	  context.fillText(text, LABELSIZE / 2, LABELSIZE / 2);

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
	  nodes[key].label = sprite;
	  sprite.position.set(10,10,0);
	  scene.add( sprite );
	  add3DObject(sprite,distance);		
	  //node.label=sprite;
	  
	  
	  return sprite;	
	  
  }//createLabelWithSprite
	  
  
  function createArrows(nodelinks){	
	  for (var i = 0; i < nodelinks.length; i++) {
	    try{
			    var link=setArrowData(getStyleAttr(CSSarrowColors[nodelinks[i].type].css,"color",CSSarrowColors[nodelinks[i].type].color), nodelinks[i]);
			    nodelinks[i].three_link=link;
	    }catch(e){console.log("ik heb geen nodelinks kunnen vinden dus heb de arrow geen kleurtje kunnen geven");}
	    									  
	  }			
  }
  
  
  /*
  * Function for adding an arrow to the visualisation scene, the given parameters will determine the color and the source and target of the arrows.
  * Note: the arrows are added to the scene first, and after that they will get their positions assigned in the initialiseconstraints() function by the nodelinks.three_link data.
  *
  */
  //function for setting the data and creating the new arrow
  function setArrowData(arrowColor, currentNodeLink){
    try{
	  if (currentNodeLink.hasOwnProperty('arrow'))return;//do not draw more than one arrow for relation/link
	  var origin = new THREE.Vector3(50, 100, 50);
	  var terminus = new THREE.Vector3(75, 75, 75);
	  var direction = new THREE.Vector3().subVectors(terminus, origin).normalize();
	  var distance = origin.distanceTo(terminus);
	  if (CSSarrowColors[currentNodeLink.type].arrow)
	    var arrow = new THREE.ArrowHelper(direction, origin, distance, arrowColor);
	  else{
	    //introduced a copy of THREE.ArrowHelper which draws lines without arrows
	    var arrow = new THREE.ArrowHelper2(direction, origin, distance, arrowColor,0,0);
	  }
	  arrow.userData = {
				  target : currentNodeLink.target.name,
				  source : currentNodeLink.source.name
	  };
	  arrow.source=currentNodeLink.source;
	  arrow.target=currentNodeLink.target;
	  arrow.distance=currentNodeLink.distance;
	  currentNodeLink.arrow=arrow;//keep connection between nodelink and arrow. Arrow is made for nodelink
	  add3DObject(arrow,currentNodeLink.distance);
	  
	  scene.add(arrow);	
	  return arrow;
  }catch( e ){console.log("error setarrowdata"+e)}
  }//setArrowData
  
  //adds lightsources to the scene, for aesthetic purposes
  function createLightingForScene() {
	  // Instantiate light sources
	  var pointLight1 = new THREE.PointLight(0xFFFFFF);
	  pointLight1.position.set(0,50,500);
	  scene.add(pointLight1);
	  var pointLight2 = new THREE.PointLight(0xFFFFFF);
	  pointLight2.position.set(0,500,-500);
	  scene.add(pointLight2);
	  var pointLight3 = new THREE.PointLight(0xFFFFFF);
	  pointLight3.position.set(500,500,0);
	  scene.add(pointLight3);
	  var pointLight4 = new THREE.PointLight(0xFFFFFF);
	  pointLight4.position.set(-500,50,0);
	  scene.add(pointLight4);
	  var pointLight5 = new THREE.PointLight(0xFFFFFF);
	  pointLight5.position.set(0,-100,0);
	  scene.add(pointLight5);
  }

  function clearCanvas(){
		  for( var i = scene.children.length - 1; i >= 0; i--) {						
			  //does it have a geometry or is it an Object3D? remove it. This just deletes the spheres and arrows and not the lighting and camera.
			  if(scene.children[i].geometry != null | scene.children[i].type == "Object3D"){
				  scene.remove(scene.children[i]);	
			  }
		  };			
  }	
  function changeDepth(depth){
    //make objects visible yes/no depending on depth
    var links=threeDObjects;
    try{
    links.forEach(function(link){
	link.visible=link.distance<=depth;
    });
    }catch( e ){console.log("error changedepth"+e)}
  }
  
  function getNodeAndNodelinksFromMemory(jsonResult,baseLevel) {
    try{
      //produces nodes, nodelinks and baseLevel when nodes are already on screen while ajax is called
      //gets nodes and nodelinks from memory
      //var nodes=globalnodes;
      //var nodelinks=globalnodelinks;

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
	baseLevel=DEPTH;

      //add new nodelinks to old ones
      //var nodelinks=globalnodelinks;
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
  }catch( e ){console.log("error getnodesandlinksfrommemory"+e)}
  }//getNodeAndNodelinksFromMemory

	//gets called after the ajax call
  var drawNewObjectsWithAjaxData = function (result) {
    try{
    //end loading icon
    $("body").toggleClass("wait");
    //TODO: wait icon is changed to a "finger"; change it to arrow.

    if (result.length==0) {
      //TODO change to new ip-address, and see if this can be done cleaner
      result='{"relations":[],"nodes":{"'+currentPageName+'":{"name":"'+currentPageName+
      '","distance":0,"url":"http:\/\/195.93.238.56\/wiki\/hzportfolio\/wiki\/index.php\/KNKR_Oncologen"}}}';
      console.log("no result; panic: what should be displayed? Just do something...");
    }

    //init3DObjects();

    var baseLevel=0;

    var jsonResult = JSON.parse(result);
    console.log(jsonResult);
    //check if first time to draw
    if (!valuesHaveBeenShown){
      //first time to draw nodes and arrows.
      //init nodes, nodelinks and labels
	  
	  nodes = jsonResult.nodes;
	  nodelinks = jsonResult.relations;
    } else {
      //read nodes from memory
      var ret=getNodeAndNodelinksFromMemory(jsonResult,baseLevel);
      //parse return value
      nodes=ret.nodes,nodelinks=ret.nodelinks;
      baseLevel=ret.baseLevel;
    }
    //next time read from memory
    valuesHaveBeenShown=true;

    // replace the description of the source and target of the links with the actual nodes.
    nodelinks.forEach(function(link) {
      {
	//check if link-description already replaced with corresponding object
	try{
	if (typeof link.source == "string"){
	  //replace link-desccription with corresponding object
	    var source=nodes[link.source];
	    if (!(source.hasOwnProperty('sourcelist'))) {
	      source.sourcelist=[];
	    }
				source.sourcelist.forEach(function(nlink) {
				  if (nlink.source==source && nlink.target==nodes[link.target]&&nlink.type==link.type)
				  {console.log("dubbele relatie");console.log(link);}
				});
	    
	    link.source = source ;
	    source.sourcelist.push(link);
	    link.distance=link.source.distance;
	    var target=nodes[link.target];
	    link.target = target;
	    if (!(target.hasOwnProperty('targetlist'))) {
	      target.targetlist=[];
	    }
	    target.targetlist.push(link);
	    //distance is smallest from target and source
	    if (link.distance<link.target.distance) link.distance=link.target.distance;
	};
	}catch( e ){console.log("error replace source and target of links")}
      }
    });

    camera.updateProjectionMatrix();
    createSpheresAndArrowsBasedOnNodesAndLinks(baseLevel,nodes, nodelinks);
    //will omit all nodes with distance < baseLevel
    changeDepth(GLOBALDEPTH);//initial position in depth-slider is 1
    console.log("initialized all");

    animate();
    

  }catch( e ){console.log("error drawnewobjectswithajaxdata"+e)}
  
  // Animate the webGL objects for rendering
    function animate() {
	    requestAnimationFrame(animate);
	    renderer.render(scene, camera);
	    controls.update();
	    TWEEN.update();

	    for (var key in nodes) {
		    nodes[key].label.lookAt(camera.position); //makes the labels spin around to try to look at the camera
	    }
    }
  };//drawNewObjectsWithAjaxData

		  
  /*
   * initialiseDrawingSequence
   * can be called from init, and from slider.
   * if called from slider, newDepth is defined, otherwise it is undefined
   */
  function initialiseDrawingSequence(concept, depth, newdepth){
	  concept=concept.replace(/&#39;/g, "'");//hack-workaround. It appears ' is coded as &#39; in mediawiki........
	  if ( typeof concept === 'undefined' || concept === '') {
		  throw "Concept is undefined";
	  }		

	  //var depth = typeof depth !== 'undefined' ? depth : 2 ;
	  var mydepth =1 ;	
	  if (typeof newdepth !== 'undefined'){
	    mydepth = newdepth;
	    DEPTH=depth;
	  }
	  else 
	    clearCanvas();//first time, clear canvas   
	  GLOBALDEPTH=mydepth;
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
			  fusekidataset : mw.config.get('wgEM3DNavigator').eM3DFusekiDataset,
			  fusekilanguage : mw.config.get('wgEM3DNavigator').eM3DFusekiLanguage
		  },
		  success:function(result)//we got the response
		  {
		  },
		  error:function(exception){console.log('Exeption: '+exception);}	   
	    }).done(drawNewObjectsWithAjaxData);
  }//initialiseDrawingSequence
				    

  function drawModel(initcurrentPageName){
      if (typeof initcurrentPageName == 'undefined'){
	initcurrentPageName=mw.config.get( 'wgPageName' );
      }
      currentPageName=initcurrentPageName;//save in class-variable so it can be used outside function
      initGlobalVariables(CONTAINERDIV);
      camera.position.y = HEIGHT/2;
      camera.position.x = WIDTH/2;			
      camera.position.z =  Math.pow((HEIGHT*HEIGHT + WIDTH*WIDTH), 1/4);			
      scene.add(camera);
		      
      createLightingForScene();
      if (typeof sliderObject == 'undefined')//TODO this is a hack. Check why sliderObject can be created more than once
	sliderObject=createSlider(initialiseDrawingSequence,changeDepth, currentPageName,DEPTH); //creates the slider for the depth
      initialiseDrawingSequence(currentPageName,DEPTH);
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
	    drawModel(currentPageNameFromMw);
	    timeout=1000;
	  }
	  showdiv.html(checkIfEmpty(mw.message( 'collapsible-collapse' ).text(),"Collapse"));
	  //slide down after one second; smooth animation
	  setTimeout(function(){$( '#'+EMMCONTAINERDIV ).slideDown( "slow" );}, timeout);
	} else {
	  //valuesHaveBeenShown=true;
	  $( '#'+EMMCONTAINERDIV ).slideUp( "slow" );
	  showdiv.html(checkIfEmpty(mw.message( 'collapsible-expand' ).text(),"Expand"));
	}
      });
  }//drawHTMLElements


	function setDivIdFromWiki(string1, string2){
		console.log("het doorgegeven ID is =");
		console.log(string1);
		console.log(string2);
	}

		function init3DObjects(){
		  threeDObjects=[];
		};
		//functions to set distance for visible yes/no
		function add3DObject(object,distance){
		  object.distance=distance;
		  threeDObjects.push(object);
		};
  

	
  return  {
		//these properties can be asked by: Visualisation.propertyname
		drawHTMLElements : drawHTMLElements,
		setDivIdFromWiki : setDivIdFromWiki,
		drawModel : drawModel,
		getStyle: getStyle,
		getStyleAttrInt:getStyleAttrInt

  }
});

var visualisationInstance = new Visualisation();//TODO not used, can be omitted. Find out if an instance can be created that can be used in global space
//var window.visualisationInstance= new Visualisation(); // . is unidentified token?

