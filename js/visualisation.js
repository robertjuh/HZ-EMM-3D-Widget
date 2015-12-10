//CSS constants
var CSSarrow_related_color="red";
var CSSsphere_color="rgb(191,172,136)";
var CSSsphere_colors=["rgb(76,151,214)","rgb(191,172,136)","rgb(191,172,136)","rgb(191,172,136)","rgb(191,172,136)","rgb(191,172,136)","rgb(191,172,136)"];
var CSScontainerAttributes_fontsize="20px";
var CSScontainerAttributes_fontfamily="Times";
var CSScontainerAttributes_fontweight="normal";
var CSSarrow_related_color="red";
var CSSarrow_broader_color="black";
	//var targetDivId = 'bodyContent'; //bodyContent
//todo fix	//var containerDiv = d3.select("div").append("div:div").attr("id", "containerDiv").style("display", "inline-block");	
//	var containerDiv = d3.select("div").append("div:div").attr("id", VisualisationJsModule.containerDivId).style("display", "inline-block");	
	//var containerDivId = containerDiv[0][0].id;
//	var containerDivId = containerDiv[0][0].id;
	var EMMContainerDivId = "EMMContainerDiv";
	
	//console.log("target class ");
	//console.log(d3.select('.' + d3.select('#' + targetDivId)[0][0].className)[0][0]);
	
	
/**
 * @author NJK @author robertjuh
 * This script is responsible for drawing the 3d objects to the canvas and initialising an ajax call. 
 * 
 * VisualisationJsModule (located in visualisationJsModule.js) contains all global variables that are relevant to the THREEjs drawing sequence.
 */
 var startVisualisation = (function(currentPageName, targetDivPlacementElementId, targetButtonPlacementId){
		//mouselocation variables
		var onClickPosition = new THREE.Vector2();
		var	raycaster = new THREE.Raycaster();
		var	mouse = new THREE.Vector2();

		
	/*	
	* Functions for folding the visualisationcanvas
	* Take the target (cCanvas) and the desired widths the canvas would be transitioned into.
	*/
	function unfoldAnimation(cCanvas, containerWIDTH, containerHEIGHT){
		//TODO slider initial state = hidden
		//TODO slider.makevisible
		
//		 $( '#containerDiv').slideDown(700, 'linear', function() {
           //callback function after animation finished
//          $('#'+ EMMContainerDivId).slideDown( "slow" );
		   
		   


		

		cCanvas 
		//d3.select('#EMMContainerDiv')
			.transition()
				.duration(900)
				.style("width", containerWIDTH + "px")
						.transition()
							.duration(1300)
							.style("height", containerHEIGHT + "px")
								.each("end", function(){
									VisualisationJsModule.renderer.setSize(containerWIDTH, containerHEIGHT); //Zo wordt de visualisatie nog even scherp getekend.		
								});
		
		
		d3.select("#" + VisualisationJsModule.sliderDivId)
			.transition()
				.duration(900)
				.style("left", 	(VisualisationJsModule.containerDiv[0][0].offsetLeft + containerWIDTH - VisualisationJsModule.getStyleAttrInt('#'+VisualisationJsModule.sliderDivId,"width",30)) + "px")
					.transition()
						.duration(1300)
						.style("height", containerHEIGHT + "px");		//TODO fix de hoogte mee met het uitklappen van de div					

	
	
	
//		}); //end of the callback (after revealing the canvas, it will unfold)
	
					
					
					
					
	//	d3.select('#' + targetDivId)
		//transition .style("left", "200px") en 	.attr("height", divHeight) met de canvas mee
	}
	
	function foldBackAnimation(cCanvas, containerWIDTH, containerHEIGHT){
		cCanvas 
		//d3.select('#EMMContainerDiv')
			.transition()
			.duration(900)
			.style("height", containerHEIGHT + "px")
					.transition()
					.duration(1300)
					.style("width", containerWIDTH + "px")
				.each("end", function(){
//TODO is dit nog nodig?			//VisualisationJsModule.renderer.setSize(containerWIDTH, containerHEIGHT); //Zo wordt de visualisatie nog even scherp getekend.		
				//	$( '#'+VisualisationJsModule.containerDivId ).hide();
//					$( '#EMMContainerDiv' ).slideUp( "slow" );
//					$( '#containerDiv' ).slideUp( "slow" );
					//$( '#'+EMMContainerDivId ).hide();
				});
				
		d3.select("#" + VisualisationJsModule.sliderDivId)
			.transition()
				.duration(900)
				.style("height", 0 + "px") //TODO fix de hoogte mee met het uitklappen van de div
					.transition()
						.duration(1300)
						.style("left", 	(VisualisationJsModule.containerDiv[0][0].offsetLeft + (containerWIDTH - VisualisationJsModule.getStyleAttrInt('#'+VisualisationJsModule.sliderDivId,"width",30)))  + "px");		
	}
		
	
	function colorSelectedSphere(event, mouse){
			normalizeCurrentMouseCoordinates(event,mouse);
						
			raycaster.setFromCamera( mouse, VisualisationJsModule.camera );
		
			//var intersects = raycaster.intersectObjects( VisualisationJsModule.scene.children ); 	
			var intersects = raycaster.intersectObjects(VisualisationJsModule.sphereArray ); 	

			checkGeometryTypeAndSlice(intersects)	
	}	
		
		
		function checkGeometryTypeAndSlice(intersects){
			var intersectLength = intersects.length;
			//If there is an intersection, and it is a sphere, apply click event.
			//Loops through each intersected object and cuts off the planeGeometries so that the sphere will be clicked even though there is something in front of it.
			for (var i = 0; i <= intersectLength; i++) {
				if(intersects == 0 || intersects[0].object.geometry.type == null){	
					return;
				}else{			 
						intersects[0].object.material.color.setHex( Math.random() * 0xffffff );					
						intersects[0].object.callback(intersects[0].object.urlName);
				}
			}
		}		
			
		//uses d3.mouse(this)[0],[1] to find the mouse coordinates on the current element
		//uses the mouse variable which is a THREE.Vector2
		function normalizeCurrentMouseCoordinates(e, mouse){
			mouse.x = (  (e[0])  / VisualisationJsModule.renderer.domElement.width ) * 2 - 1;			
			mouse.y = - (  (e[1]) / VisualisationJsModule.renderer.domElement.height ) * 2 + 1;			
		}		

		//create a callback function for each sphere, after clicking on a sphere the canvas will be cleared and the selected sphere will be the center point
		function createCallbackFunctionForSphere(sphere){		
			sphere.callback = function(conceptNameString){
				clearCanvas();				
							//TODO experiment with this code, moving nodes is possible, dragging should be as well. Pushing nodes aside? next level
							console.log("sphere");
							console.log(sphere);
							//sphere.position.x=10;
						//	sphere.node.x=10;
				window.location = window.location.href.getFirstPartOfUrl() + conceptNameString; //navigate to the clicked object
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
		
		
		/*
		* Initializes calculations and spaces nodes according to a forced layout
		* takes variables from the startvisualisation method		
		*/
		function initialiseConstraints(nodes, spheres, three_links) {
			var min=-110;
			var max=60;
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
			
			for (var j = 0; j < three_links.length; j++) {			  
				setArrowSourceTarget(three_links[j]);
			}	
			VisualisationJsModule.renderer.render(VisualisationJsModule.scene, VisualisationJsModule.camera);
		}
		
		
		//MouseEvents start -----====-----		
		//touchevent will trigger the mouse event, this is for mobile users.
		function onDocumentTouchStart(event){
				event.preventDefault();
				event.clientX = event.touches[0].clientX;
				event.clientY = event.touches[0].clientY;
				onDocumentMouseDownD3();
				//onDocumentMouseUp( event );
		}
		


		//colors the ball that is being clicked, serves no real purpose yet.
		function onDocumentMouseDown(event){
			event.preventDefault();
			colorSelectedSphere(event, mouse); //Mouse and camera are global variables.
		}	

		//colors the ball that is being clicked, serves no real purpose yet. //TODO
		function onDocumentMouseDownD3(){
			colorSelectedSphere(d3.mouse(this), mouse); //Mouse and camera are global variables.
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
		}
		
			
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
								color : VisualisationJsModule.getStyleAttr(".sphere.level"+nodes[key].distance,"color",CSSsphere_colors[nodes[key].distance])
							});												
						}
						catch (e){//if level is too high, set default
							sphereMaterial = new THREE.MeshPhongMaterial({
								color : VisualisationJsModule.getStyleAttr(".sphere","color",CSSsphere_color)
							});
						}

						//create the sphere
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

						nodes[key].label=createLabelWithSprite( key , nodes[key].distance);
						
						
						createCallbackFunctionForSphere(sphere); 
					}
				}
				//save spheres to memory, so they can be recalled
				VisualisationJsModule.spheres=spheres;
			
				
				createArrows(three_links, nodelinks);
				initialiseConstraints(nodes, spheres, three_links);
				VisualisationJsModule.three_links=three_links;
				
				VisualisationJsModule.containerDiv.on( 'touchstart', onDocumentTouchStart, false );
				VisualisationJsModule.containerDiv.on( 'click', onDocumentMouseDownD3, false );	
				
		}
		
		
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
	function createLabelWithSprite( key, distance ){

		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		var textWidth = context.measureText( key ).width;
		
		//TODO make width of sprite dependant on width of text
		//size is now hard-coded!?
		var size = 350;
		canvas.width = size;
		canvas.height = size;
		//var context = canvas.getContext('2d');
		context.fillStyle = '#990000';
		context.textAlign = 'center';
		context.font = VisualisationJsModule.getStyleAttr(".containerAttributes","font-weight",CSScontainerAttributes_fontweight)+" "+
		  VisualisationJsModule.getStyleAttr(".containerAttributes","font-size",CSScontainerAttributes_fontsize)+" "+
		  VisualisationJsModule.getStyleAttr(".containerAttributes","font-family",CSScontainerAttributes_fontfamily);
		context.fillText(key, size / 2, size / 2);

		var amap = new THREE.Texture(canvas);
		amap.needsUpdate = true;

		var mat = new THREE.SpriteMaterial({
		    map: amap,
		    transparent: true,
		    color: 0x000000
		});

		var sprite = new THREE.Sprite(mat);
		//sprite.scale.set(50,50,1.2); //grootte van text
		sprite.scale.set(90,90,10); //grootte van text
		sprite.textWidth=textWidth;
		
		labels[key] = sprite;
		sprite.position.set(10,10,0);
		VisualisationJsModule.scene.add( sprite );
		VisualisationJsModule.add3DObject(sprite,distance);		
		
		return sprite;			
	}
		
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
					three_links.push(setArrowData(VisualisationJsModule.getStyleAttr(".arrow.related","color",CSSarrow_related_color), nodelinks[i]));					
				}
				else if(nodelinks[i].type.compareStrings("Eigenschap:Skosem:broader", true, true)){
					three_links.push(setArrowData(VisualisationJsModule.getStyleAttr(".arrow.broader","color",CSSarrow_broader_color), nodelinks[i]));			
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
		 //TODO: This code does not really do what it's meant to do, it just works, optimize this code!
			if(arrow.target.distance < arrow.source.distance && currentNodeLink.type != "Eigenschap:Skos:related"){	
			  //commented out by anton
			  //color red was arbitrarily added to some arrows
			  //TODO: see what next line does. If not necessary: omit it!

				arrow.setColor(VisualisationJsModule.getStyleAttr(".arrow.narrower","color"));
			}
				
		VisualisationJsModule.scene.add(arrow);	
		return arrow;
	}
	
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
	}

      //gets called after the ajax call
      var drawNewObjectsWithAjaxData = function (result) {
	//end loading icon
	$("body").toggleClass("wait");

	VisualisationJsModule.init3DObjects();

	var baseLevel=0;

	var jsonResult = JSON.parse(result);
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
	VisualisationJsModule.nodelinks=nodelinks;
	
	// Animate the webGL objects for rendering
	function animate() {
		requestAnimationFrame(animate);
		VisualisationJsModule.renderer.render(VisualisationJsModule.scene, VisualisationJsModule.camera);
		VisualisationJsModule.controls.update();

		for (var label in labels) {
			labels[label].lookAt(VisualisationJsModule.camera.position); //makes the labels spin around to try to look at the camera
		}
		render();
	}

	// Extension of default render function, runs continuously, add code here if needed
	function render() {

	}
  }//drawNewObjectsWithAjaxData

		
	function initialiseDrawingSequence(concept, depth, newdepth){
			
		if ( typeof concept === 'undefined' || concept === '') {
			throw "Concept is undefined";
		}		

		//var depth = typeof depth !== 'undefined' ? depth : 2 ;
		var mydepth =1 ;	
		if (typeof newdepth !== 'undefined'){
		  mydepth = newdepth;
		  VisualisationJsModule.depth=depth;
		}
		else
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
				concept : concept,
				depth : depth.toString(),
				relations : relations,
				uri : mw.config.get('wgEM3DNavigator').eM3DNavigatorUri,
				fusekidataset : mw.config.get('wgEM3DNavigator').eM3DFusekiDataset
			},
			success:function(result)//we got the response
			{
			},
			error:function(exception){alert('Exeption: '+exception);}	   
		  }).done(drawNewObjectsWithAjaxData);
	}//initialiseDrawingSequence
				  
/*
* When everything is loaded up, the visualisation and data loading will comence. The parameters provided by the widget will be used
* For reference, consult the em3d wiki page: http://195.93.238.56/wiki/hzdoc/wiki/index.php/HZ_3D_navigation_widget
* @param: targetDivPlacementElementId : div ID name given by the widget call where the visualisationcanvas will be placed
* @param: targetButtonPlacementId : div ID name given by the widget call where the button will be placed
*/
$(document).ready(function() {
	VisualisationJsModule= new VisualisationJsModule(targetDivPlacementElementId, targetButtonPlacementId); //creates a module with most THREE components so they will be accesible throughout the class
	
	initialiseTHREEComponents(); 
	/**
   	*Initialise the components that are relevant to the canvas/renderer
	*/	
	function initialiseTHREEComponents(){
	
	var containerHEIGHT;
	var containerWIDTH;

	containerHEIGHT = VisualisationJsModule.height;
	containerWIDTH = VisualisationJsModule.width; //afmetingen staan in de module gedefinieert
	
		//Try adding the visualisations on the wiki, depending on which target elements are chosen
		try{
			document.getElementById(VisualisationJsModule.targetDivId).appendChild(VisualisationJsModule.container);
		}
		catch(err){
			try{
				d3.select(VisualisationJsModule.targetDivId).append(function() { return VisualisationJsModule.container; });// van voorbeld
				alert("The slider isn't added because a wrong target element was chosen");
			}
			catch(err){				
				console.log(VisualisationJsModule.container);
				console.log(VisualisationJsModule.targetDivId);
				console.log(d3.select("#" + VisualisationJsModule.targetDivId));
				
				d3.select("#" + VisualisationJsModule.targetDivId).append(function() { return VisualisationJsModule.container; });// van voorbeld
			}			
		}
		

		//todo dit is tijdelijke code
		d3.select("body").append("text")         // append text
			.style("fill", "black")   // fill the text with the colour black
			.attr("x", 200)           // set x position of left side of text
			.attr("y", 100)           // set y position of bottom of text 
			.text("DEZE PAGINA GAAT OVER: " + currentPageName);     // define the text to display 
	
		VisualisationJsModule.renderer.setSize(containerWIDTH, containerHEIGHT);
	
		createSlider(containerHEIGHT, initialiseDrawingSequence,changeDepth, currentPageName,VisualisationJsModule.depth); //creates the slider for the depth	

		positionDivsOnScreen();		

		VisualisationJsModule.container.appendChild(VisualisationJsModule.renderer.domElement);
		VisualisationJsModule.containerCanvas = d3.select('#containerCanvas'); //So the general visualisation canvas will be global accisible via the VisualisationJSsModule namespace
		
		createButton();		

		VisualisationJsModule.scene.add(VisualisationJsModule.camera);
		
		createExtraFunctions(); //creates extra functions, they only have to be made once.
		createLightingForScene();
		
		VisualisationJsModule.camera.position.y = containerHEIGHT/2;
		VisualisationJsModule.camera.position.x = containerWIDTH/2;	
		VisualisationJsModule.camera.position.z =  600;	  //TODO: distance van camera increasen zodat alles op het scherm zichtbaar is, zelfs als dit betekend dat alles onleesbaar is, maar het totaaloverzicht blijft
		//VisualisationJsModule.camera.position.z =  Math.pow((VisualisationJsModule.height*VisualisationJsModule.height + VisualisationJsModule.width*VisualisationJsModule.width), 1/4);			

		initialiseDrawingSequence(currentPageName, VisualisationJsModule.depth);
				
	}
	
	function createButton(){
		

		
		
		var buttonsize = 22;
		
//		$("#"+EMMContainerDivId).css("position","relative").css("display","inline-block");
//		$("#containerDiv").css("position","relative").css("display","inline-block");		
//		$("#sliderDiv").css("position","absolute").css("left",""+($("#containerDiv").width()-$("#sliderDiv").width())+"px").css("vertical-align","top");
//		$( '#'+EMMContainerDivId ).hide();
		//$( '#containerDiv' ).hide();
		
		//$( '#'+EMMCONTAINERDIV ).hide();
	
	
		//TODO testing thing
//				jQuery('<div/>', {
//		 id: EMMContainerDivId,
//		}).prependTo('#' + VisualisationJsModule.targetDivId);
//		//$("#sliderDiv").appendTo('#' + EMMContainerDivId);
//		$("#" + VisualisationJsModule.sliderDivId).appendTo('#' + EMMContainerDivId);
//		$("#" + VisualisationJsModule.containerDivId).appendTo('#' + EMMContainerDivId);	
//		////$(VisualisationJsModule.containerDiv).appendTo('#' + EMMContainerDivId);	
		
//		$( '#'+VisualisationJsModule.containerDivId ).hide();
		
		
		var buttonGroup = d3.select('body').append('svg')
			.attr("id", "buttonSvg")
			.style("background-color", "rgb(191,172,136)")
			.style("background-color", VisualisationJsModule.getStyleAttr(".unfoldButton", "background-color",CSSsphere_color))
			.attr("height", buttonsize)
			.attr("width", buttonsize)
			//.style("border", "1px solid black")
				.append("g");
		
		buttonGroup.toggled = "false"; //property for the button so it can check wether to be folded or unfolded.
							
		var expandButtonImage = buttonGroup.append("svg:image")
				.attr("xlink:href", mw.config.get('wgExtensionAssetsPath')+"/EM3DNavigator/src/icon.png") 
				.attr("width", buttonsize)
				.attr("height", buttonsize);
   

		$("#buttonSvg").prependTo('#' + VisualisationJsModule.targetButtonId); //TODO dit moet ergens anders komen uiteindelijk EN een plaatje krijgen ipv text
		
		//buttonclick animation
		buttonGroup.on("click", function() {
			buttonGroup
				.transition()
				.duration(50)
				.attr("opacity", 0.3)
				.each("end", function(){buttonGroup.transition()
					.attr("opacity", 1);});
					
			buttonClickResizeCanvas(buttonGroup, VisualisationJsModule.containerCanvas);		
		});			
	}
	
	/*
	* check if the button is toggled so the canvas will be folded or unfolded.
	* @param: svg with a <g> element within
	* @param: containerCanvas is the container were the canvas div and other HTML elements are placed in that represent the visualisation.
	*/
	function buttonClickResizeCanvas(buttonGroup, containerCanvas){		
			if(buttonGroup.toggled == "false"){
				//$( '#'+VisualisationJsModule.containerDivId ).show();
//				containerCanvas.attr("hidden", false);
				unfoldAnimation(containerCanvas, 650,650); //TODO fixed height / window.innerwidth en innerheight?
				buttonGroup.toggled = "true";				
			}else if(buttonGroup.toggled == "true"){
				foldBackAnimation(containerCanvas, VisualisationJsModule.width,VisualisationJsModule.height);
//				 $( '#'+ EMMContainerDivId ).slideUp( "slow" );
//				containerCanvas.attr("hidden", true);
			
				buttonGroup.toggled = "false";				
			}else{
				return;
			}
	}
	
	function positionDivsOnScreen(){
		//TODO: met de volgende code extra, en het stuk in css, kun je de slider over het model heen laten vallen.
		//je moet dan echter dus het stuk voor het model (145px) bij de x optellen, en dat is skin-gevoelig. Dus een work-around.
		//daar moet dus over nagedacht worden. Sowieso is het handig om de twee elementen in een parent-html-element op te nemen.
		 
		jQuery('<div/>', {
		 id: EMMContainerDivId,
		}).prependTo('#' + VisualisationJsModule.targetDivId);
		//$("#sliderDiv").appendTo('#' + EMMContainerDivId);
		$("#" + VisualisationJsModule.sliderDivId).appendTo('#' + EMMContainerDivId);
		$("#" + VisualisationJsModule.containerDivId).appendTo('#' + EMMContainerDivId);	
		////$(VisualisationJsModule.containerDiv).appendTo('#' + EMMContainerDivId);	
	}
	
	//creates additional functions	
	function createExtraFunctions(){
			d3.selection.prototype.moveToFront = function() {
				return this.each(function() {
					this.parentNode.appendChild(this);
				});
			};

			d3.selection.prototype.first = function() {
				return d3.select(this[0][0]);
			};	
			
			String.prototype.lowerCaseFirstLetter = function() {
				return this.charAt(0).toLowerCase() + this.slice(1);
			}

			String.prototype.getLastPartOfUrl= function() {
				return this.split("/").pop();
			}		
			
			String.prototype.getFirstPartOfUrl= function() {
				var strArray = this.split("/");
				strArray.splice(-1, 1); //remove last part of str
				var joinedString = strArray.join("/")+"/";
				return joinedString; //returns the http://127.0.0.1/mediawiki2/index.php/ format
			}
			
			//Compares 2 strings with each other, use ' "COMPARETHIS".compareStrings("CoMpAreThIs", true, true);" to receive true.
			String.prototype.compareStrings = function (string2, ignoreCase, useLocale) {
				var string1 = this;
				if (ignoreCase) { 
					if (useLocale) {
						string1 = string1.toLocaleLowerCase();
						string2 = string2.toLocaleLowerCase();
					}
					else {
						string1 = string1.toLowerCase();
						string2 = string2.toLowerCase();
					}
				}
				return string1 === string2;
			}			
	}
});

});
