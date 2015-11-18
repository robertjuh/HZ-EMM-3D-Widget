console.log("Het programma is gestart");



	//targetDivId kan een element op de mediawiki zijn. andere regels zijn voor debuggen van het plaatsen van de canvas etc
	var targetDivId = 'bodyContent'; //bodyContent
	var containerDiv = d3.select("div").append("div:div").attr("id", "containerDiv").style("display", "inline-block");	
	var containerDivId = containerDiv[0][0].id;
	
	console.log("target class ");
	console.log(d3.select('.' + d3.select('#' + targetDivId)[0][0].className)[0][0]);
	
	//set the position to inherit instead of relative, or the nodes won't be clickable	
	d3.select('.' + d3.select('#' + targetDivId)[0][0].className ).style("position", "inherit");
	
	//dat oranje stuk moet genormaliseerd worden
	console.log(document.getElementById("content"));   //goed resultaat
	console.log(document.getElementById("catlinks"));	//klikt niet goe
	console.log(document.getElementById("firstheading"));	//niks
	console.log(document.getElementById('mw-content-text'));	//werkt niet / scheve klik
	console.log(document.getElementById('mw-navigation'));	//goed! onderaan pagina
/**
 * @author NJK @author robertjuh
 * This script is responsible for drawing the 3d objects to the canvas and initialising an ajax call. 
 * 
 * VisualisationJsModule (located in visualisationJsModule.js) contains all global variables that are relevant to the THREEjs drawing sequence.
 */
 var startVisualisation = (function(currentPageName){

	 
	 console.log("startvisualisation is opgeroepen");

		//mouselocation variables
		var onClickPosition = new THREE.Vector2();
		var	raycaster = new THREE.Raycaster();
		var	mouse = new THREE.Vector2();
		
		var currentPage = currentPageName;
		
		//data
		var stringCurrentConcept = currentPage; //TODO vast op dit moment, maar moet opgehaald worden uit de huidige wiki pagina later
		
					
		//pakt de sphere die als eerste getroffen wordt door de ray, negeert labels en arrows.
		function filterFirstSpheregeometryWithRay(event, mouse){			
			normalizeCurrentMouseCoordinates(event, mouse);						
			raycaster.setFromCamera( mouse, VisualisationJsModule.camera);

			var intersects = raycaster.intersectObjects( VisualisationJsModule.scene.children ); 
			
			//If there is an intersection, and it is a sphere, apply click event.
			if ( intersects.length > 0 ) {					
				//Loops through each intersected object and cuts off the planeGeometries so that the sphere will be clicked even though there is something in front of it.
				for (var i = 0; i < intersects.length; i++) {	
					switch(intersects[0].object.geometry.type){
						case 'SphereGeometry':
						intersects[0].object.material.color.setHex( Math.random() * 0xffffff ); 
							intersects[0].object.callback(intersects[0].object.urlName); //calls the callback function on the chosen geometry item
							console.log("de naam van het aangeklikte object = ");
							console.log(intersects[0].object.urlName);
							return;
						case 'PlaneGeometry':
							intersects = intersects.slice(1); //cut off the first element(a plane) and check if the next one is a sphere
							break;
						default:
							break;
					}
				}
			}			
		}
		
		//Colors the selected sphere a random color, serves no real purpose yet. 
		function colorSelectedSphere(event, mouse){
			normalizeCurrentMouseCoordinates(event,mouse);
			
			raycaster.setFromCamera( mouse, VisualisationJsModule.camera );
			
			var intersects = raycaster.intersectObjects( VisualisationJsModule.scene.children ); 			
			
			//If there is an intersection, and it is a sphere, apply click event.
			if ( intersects.length > 0 ) {					
				//Loops through each intersected object and cuts off the planeGeometries so that the sphere will be clicked even though there is something in front of it.
				for (var i = 0; i < intersects.length; i++) {	
						switch(intersects[0].object.geometry.type){
							case 'SphereGeometry':
							intersects[0].object.material.color.setHex( Math.random() * 0xffffff ); 
								break;
							case 'PlaneGeometry':
								intersects = intersects.slice(1); //cut off the first element(a plane) and check if the next one is a sphere
								break;
							default:
								break;
						}
				}
			}	
			
		}
		
		//function for normalising mouse coordinates to prevent duplicate code. This will take offset and scrolled position into account and the renderer width/height.
		//uses the mouse variable which is a THREE.Vector2
		function normalizeCurrentMouseCoordinates(e, mouse){
			mouse.x = ( ( (e.clientX+$(document).scrollLeft()) - renderer.domElement.offsetLeft ) / renderer.domElement.width ) * 2 - 1;			
			mouse.y = - ( ( (e.clientY+$(document).scrollTop()) - renderer.domElement.offsetTop) / renderer.domElement.height ) * 2 + 1;			
		}


		//create a callback function for each sphere, after clicking on a sphere the canvas will be cleared and the selected sphere will be the center point
		function createCallbackFunctionForSphere(sphere){		
			sphere.callback = function(conceptNameString){
			clearCanvas();
			//stringCurrentConcept = "TZW:" + conceptNameString.removeSpecialCharacters().lowerCaseFirstLetter(); //TODO formats so SPARQL can read, this is just for the testing environment
			//currentConcept = stringCurrentConcept;
			
			 window.location = window.location.href.getFirstPartOfUrl() + conceptNameString;			
			}		
		}
		

		
		//functions for arrows
		function setArrowOrigin(arrow, origin, spheres) {
			//Get current position from sphere array
			vectTarget = spheres[arrow.userData.target].position;

			// Set arrow origin 
			arrow.position.x = origin.x;
			arrow.position.y = origin.y;
			arrow.position.z = origin.z;

			// Calculate new terminus vectors and set length
			arrow.setLength(arrow.position.distanceTo(vectTarget) - 5, 7, 3);
			arrow.setDirection(new THREE.Vector3().subVectors(vectTarget, arrow.position).normalize());
		}
			
		function setArrowTarget(arrow, target) {
				// Cast function argument to Vector3 format
				var newTarget = new THREE.Vector3(target.x, target.y, target.z);
				
				//Calculate new terminus vectors and set length (initlal size: arrow.setLength(arrow.position.distanceTo(newTarget) - 5, 10, 5);
				arrow.setLength(arrow.position.distanceTo(newTarget) - 5, 7, 3);
				//arrow.setLength(55,4, 100);
				arrow.setDirection(new THREE.Vector3().subVectors(newTarget, arrow.position).normalize());
		}
		//end of functions for arrows -----======-----
		
			// Initializes calculations and spaces nodes according to a forced layout
			//takes variables from the startvisualisation method
		function initialiseConstraints(nodes, spheres, three_links) {
			//suggestion: depth of nodes determines the range: domain[10(minimum distance of nodes), depth*50]
			var x = d3.scale.linear().domain([0, 300]).range([1, 10]),
			    y = d3.scale.linear().domain([0, 300]).range([-1, 15]),
			    z = d3.scale.linear().domain([0, 300]).range([1, 10]);
				
			

			for (var key in nodes) {
				spheres[key].position.set(x(nodes[key].x) * 40 - 40, y(nodes[key].y) * 40 - 40, z(nodes[key].z) * 40 - 40);
				labels[key].position.set(x(nodes[key].x) * 40 - 40, y(nodes[key].y) * 40 - 40, z(nodes[key].z) * 40 - 40);

				//place current node in the center of the canvas
				if(spheres[key].urlName == stringCurrentConcept){
					spheres[key].position.set(0, 0, 0);
					labels[key].position.set(0, 0, 0);	
				}

					
				for (var j = 0; j < three_links.length; j++) {
					var arrow = three_links[j];
					var vi = null;
					if (arrow.userData.source === key) {
							vi = 0;
					}
					if (arrow.userData.target === key) {
						vi = 1;
					}
					if (vi >= 0 ) {
						if (vi == 0 ) {
							var vectOrigin = new THREE.Vector3(spheres[key].position.x, spheres[key].position.y, spheres[key].position.z);
							setArrowOrigin(arrow, vectOrigin, spheres);
						}
						if (vi == 1 ) {
							var vectTarget = new THREE.Vector3(spheres[key].position.x, spheres[key].position.y, spheres[key].position.z);
							setArrowTarget(arrow, vectTarget);
						}
					}
				}

			}
			
					console.log("spheres");
					console.log(spheres);
					
					console.log("nodes array");
					console.log(nodes);
						
			renderer.render(VisualisationJsModule.scene, VisualisationJsModule.camera);
		}
		
		
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
			filterFirstSpheregeometryWithRay(event, mouse);
		}
		//end of functions for mouseEvents -----======-----
		
		
			
		// Visualize RDF data
		//will create nodes(spheres), labels and arrows and positions them.
		function visualize(nodes, nodelinks) {
		  //grootte = grootte scherm
		  var grootte=200;
		  //nodes =array met nodes

		  //- bepaal het maximum niveau van alle nodes
		  var root=null;
		  var max=0;
		  for (var key in nodes) {
		    if(nodes[key].distance>max)max=nodes[key].distance;
		  //- zoek op node met niveau 0 (er is er maar 1!)
		    if(nodes[key].distance==0)root=nodes[key];
		  }
		  //zet root in het midden
		  root.x=grootte/2;root.y=grootte/2;root.z=grootte/2;
		  //- voor alle niveaus (van 1 tot max):
		  for (var currentniveau=1;currentniveau<max+1;currentniveau++) {
		    //volgend niveau staat iedere keer minder dan de helft verder weg
		    grootte=Math.floor(grootte/2);
		    for (var key in nodes) 
		    if (nodes[key].distance==currentniveau){
			//genereer een random vector v van lengte = grootte
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
		  }
			var three_links = [];
			var spheres = [];
				// Create nodes and randomize default position
				for (var key in nodes) {
					if (nodes.hasOwnProperty(key)) {
						var val = nodes[key];
						//nodes[key].x = Math.floor((Math.random() * 100) + 1);
						//nodes[key].y = Math.floor((Math.random() * 100) + 1);
						//nodes[key].z = Math.floor((Math.random() * 100) + 1);
						
						// set up the sphere vars
						var radius = 5,
						    segments = 32,
						    rings = 32;
	
						// create the sphere's material and color
						var sphereMaterial; //TODO onderstaande line zal aangepast moeten worden als deze op andere thesauri (dan tzw:) toegepast moet worden
						if(nodes[key].name.compareStrings(stringCurrentConcept.slice(4), true, true)){ //TODO color nodes according to their nodes[key].relationtype I.e: if relation = broader, color = red, currentnode=green //TODO split.pop(:)?
							sphereMaterial = new THREE.MeshPhongMaterial({
								color : VisualisationJsModule.getStyle(".sphere.centersphere").style.color
							});												
						}
						else{
							sphereMaterial = new THREE.MeshPhongMaterial({
								color : VisualisationJsModule.getStyle(".sphere").style.color
							});
						}

						//create the sphere
						var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), sphereMaterial);
						sphere.name = nodes[key].name;
						sphere.urlName = nodes[key].url.getLastPartOfUrl();
						spheres[key] = sphere;						

						// add the sphere to the scene
						VisualisationJsModule.scene.add(sphere);				

						// Create label mesh //TODO functie maken
						var canvas1 = document.createElement('canvas');
						var context1 = canvas1.getContext('2d');
						context1.font = VisualisationJsModule.getStyle(".containerAttributes").style.font;
						context1.fillStyle = VisualisationJsModule.getStyle(".nodeTextLabel").style.color;
						context1.fillText(nodes[key].name, 10, 30);
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
						
						createCallbackFunctionForSphere(sphere); 		

						//TODO is this another way for label?
						var spritey = makeTextSprite( " ander labeltje ", 
							{ fontsize: 24, borderColor: {r:11, g:41, b:23, a:1.0}, backgroundColor: {r:10, g:30, b:254, a:1.5} } );
						spritey.position.set(0,10,0);
						VisualisationJsModule.scene.add( spritey );


						
					}
				}

				createArrows(three_links, nodelinks, nodes);
				initialiseConstraints(nodes, spheres, three_links);
				
				VisualisationJsModule.container.addEventListener( 'mouseup', onDocumentMouseUp, false );
				VisualisationJsModule.container.addEventListener( 'touchstart', onDocumentTouchStart, false );
				VisualisationJsModule.container.addEventListener( 'mousedown', onDocumentMouseDown, false );			
		}
		
		
		
	//hoort bij ander labeltje	
	function makeTextSprite( message, parameters ){
		if ( parameters === undefined ) parameters = {};
		
		var fontface = parameters.hasOwnProperty("fontface") ? 
			parameters["fontface"] : "Arial";
		
		var fontsize = parameters.hasOwnProperty("fontsize") ? 
			parameters["fontsize"] : 18;
		
		var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
			parameters["borderThickness"] : 4;
		
		var borderColor = parameters.hasOwnProperty("borderColor") ?
			parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
		
		var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
			parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
			
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		context.font = "Bold " + fontsize + "px " + fontface;
		
		// get size data (height depends only on font size)
		var metrics = context.measureText( message );
		var textWidth = metrics.width;
		
		// background color
		context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
									  + backgroundColor.b + "," + backgroundColor.a + ")";
		// border color
		context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
									  + borderColor.b + "," + borderColor.a + ")";

		context.lineWidth = borderThickness;
		roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.2 + borderThickness, 3);
		// 1.4 is extra height factor for text below baseline: g,j,p,q.
		
		// text color
		context.fillStyle = "rgba(0, 0, 0, 1.0)";

		context.fillText( message, borderThickness, fontsize + borderThickness);
		
		// canvas contents will be used for a texture
		var texture = new THREE.Texture(canvas) 
		texture.needsUpdate = true;

		var spriteMaterial = new THREE.SpriteMaterial( 
			{ map: texture, side : THREE.DoubleSide } );
			spriteMaterial.transparant = true;
		var sprite = new THREE.Sprite( spriteMaterial );
		sprite.scale.set(50,25,1.0);
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
		
		
		
		
		
		
	
	function createArrows(three_links, nodelinks, nodes){
		console.log(" nodelinks array");
		console.log( nodelinks);		
		
		for (var i = 0; i < nodelinks.length; i++) {
				var origin = new THREE.Vector3(50, 100, 50);
				var terminus = new THREE.Vector3(75, 75, 75);
				var direction = new THREE.Vector3().subVectors(terminus, origin).normalize();
				var distance = origin.distanceTo(terminus);
										
				if(nodelinks[i].type.compareStrings("Eigenschap:Skos:related", true, true)){
					//var arrow = new THREE.ArrowHelper(direction, origin, distance, d3.select('.arrow.related').style('color')); //TODO	
					setArrowData(three_links, direction, origin, distance, VisualisationJsModule.getStyle(".arrow.related").style.color, nodes, nodelinks[i]);					
				}                             
				else if((nodelinks[i].type === "Eigenschap:Skosem:broader") && ("TZW:" + nodelinks[i].source.name.compareStrings(currentPageName, true, true))){
					//var arrow = new THREE.ArrowHelper(direction, origin, distance, d3.select('.arrow.broader').style('color')); //TODO		
					console.log(' deze pijl is broader dan de center node');	
					setArrowData(three_links, direction, origin, distance, VisualisationJsModule.getStyle(".arrow.broader").style.color, nodes, nodelinks[i]);			
				}				 //if(nodelinks[i].type === "Eigenschap:Skosem:narrower"  &&& nodelinks[i].source.name == currentPageName);
				//TODO onderstaande code werkt niet meer sinds de implementatie van Anton, andere oplossing?
				else if((nodelinks[i].type.compareStrings("Eigenschap:Skosem-3Narrower", true, true)) && ("TZW:" + nodelinks[i].source.name.compareStrings(currentPageName, true, true))){
					//var arrow = new THREE.ArrowHelper(direction, origin, distance, d3.select('.arrow.narrower').style('color')); //TODO		
					console.log(' deze pijl is narrower dan de center node');
					setArrowData(three_links, direction, origin, distance, VisualisationJsModule.getStyle(".arrow.narrower").style.color , nodes, nodelinks[i]);
				}
				else{
					console.log("ik heb geen nodelinks kunnen vinden dus heb de errow geen kleurtje kunnen geven");
					//var arrow = new THREE.ArrowHelper(direction, origin, distance, "green"); //TODO
					return;
					//setArrowData(three_links, direction, origin, distance, "orange", nodes, nodelinks[i]);
				};
			
		}	
		
		console.log(" thee links");
		console.log( three_links);
						
	}
	
	
	/*
	* Function for adding arrows to the visualisation scene, the given parameters will determine the color and the source and target of the arrows.
	* Note: the arrows are added to the scene first, and after that they will get their positions assigned in the initialiseconstraints() function by the three_links data.
	*
	* @param three_links: array which is used in initialiseconstraints() for determining the targets and sources of each arrow that is made here.
	* @param direction, origin, distance, arrowColor: these are standart THREE.arrowhelper parameters for setting the data of the arrow.
	* @param nodes: the array of nodes that will be searched and matches the current given node to produce the right target and source for the given node.
	*/
	//function for setting the data and creating the new arrow
	function setArrowData(three_links, direction, origin, distance, arrowColor, nodes, currentNodeLink){
		var arrow = new THREE.ArrowHelper(direction, origin, distance, arrowColor); //TODO		
		arrow.userData = {
					target : nodes[currentNodeLink.target.name].name,
					source : nodes[currentNodeLink.source.name].name
		};
		
		VisualisationJsModule.scene.add(arrow);			
		three_links.push(arrow);
	}
	
	//adds lightsources to the scene, for aesthetic purposes
	function createLightingForScene() {
		// Instantiate light sources
		var pointLight1 = new THREE.PointLight(0xFFFFFF);
		pointLight1.position.x = 0;
		pointLight1.position.y = 50;
		pointLight1.position.z = 500;
		VisualisationJsModule.scene.add(pointLight1);
		var pointLight2 = new THREE.PointLight(0xFFFFFF);
		pointLight2.position.x = 0;
		pointLight2.position.y = 500;
		pointLight2.position.z = -500;
		VisualisationJsModule.scene.add(pointLight2);
		var pointLight3 = new THREE.PointLight(0xFFFFFF);
		pointLight3.position.x = 500;
		pointLight3.position.y = 500;
		pointLight3.position.z = 0;
		VisualisationJsModule.scene.add(pointLight3);
		var pointLight4 = new THREE.PointLight(0xFFFFFF);
		pointLight4.position.x = -500;
		pointLight4.position.y = 50;
		pointLight4.position.z = 0;
		VisualisationJsModule.scene.add(pointLight4);
		var pointLight5 = new THREE.PointLight(0xFFFFFF);
		pointLight5.position.x = 0;
		pointLight5.position.y = -100;
		pointLight5.position.z = 0;
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
			
	function initialiseDrawingSequence(concept, depth){ //can pass "currentconcept" with this
	clearCanvas();
	  //TODO:clear het canvas
	  //geef zoveel mogelijk parameters door via ajaxCall(.......), en documenteer hier vervolgens van welke andere globale variabelen gebruik wordt gemaakt.
		//var concept = stringCurrentConcept;
		//var concept = stringCurrentConcept;
				
		if ( typeof concept === 'undefined' || concept === '') {
			throw "Concept is undefined";
		}
		

		var depth = typeof depth !== 'undefined' ? depth : 1 ;
		
		
		var relations = typeof relations !== 'undefined' ? relations : "broader,narrower,related";
			
		$.ajax({
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
		console.log("ajax is gelukt ");
       },
       error:function(exception){alert('Exeption: '+exception);}	   
		}).done(drawNewObjectsWithAjaxData);
	}
		
		//gets called after the ajax call
	var drawNewObjectsWithAjaxData = function (result) {
		console.log("DATA");
		//console.log(result);
			
			// Create arrays for spheres and links
			//var spheres = [], //Contains spheres
			
			//Contains arrows
			labels = [];
			//Contains label sprites

			
			var jsonResult = JSON.parse(result);
			var nodes = jsonResult.nodes;
			var nodelinks = jsonResult.relations;
			console.log(jsonResult);
			console.log(nodes);
			console.log(nodelinks);

			// replace the description of the source and target of the links with the actual nodes.
			nodelinks.forEach(function(link) {
			  {
				link.source = nodes[link.source] ;
				link.target = nodes[link.target];
			  }
			});

			VisualisationJsModule.camera.updateProjectionMatrix();
			visualize(nodes, nodelinks);
			animate(); 				
			
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
		}
		
		console.log("visualisationJsModule print");
				console.log(VisualisationJsModule);
		
//Wait for document to finish loading		
$(document).ready(function() {
	
	initialiseTHREEComponents(); 
	/**
   	*Initialise the components that are relevant to the canvas/renderer
	*/	
	function initialiseTHREEComponents(){ //current page name als concept meen
		VisualisationJsModule= new VisualisationJsModule(); //creates a module with most THREE components so they will be accesible throughout the class
		console.log("initialise three components wordt hier aangeroepen");
		var containerHEIGHT = VisualisationJsModule.height;
		var containerWIDTH = VisualisationJsModule.width; //afmetingen staan in de module gedefinieert
		
		
		console.log("currentpage");		
		console.log(currentPage);

		document.getElementById(targetDivId).appendChild( VisualisationJsModule.container);
	
		
		//todo dit is tijdelijke code
		d3.select("body").append("text")         // append text
			.style("fill", "black")   // fill the text with the colour black
			.attr("x", 200)           // set x position of left side of text
			.attr("y", 100)           // set y position of bottom of text 
			.text("DEZE PAGINA GAAT OVER: " + currentPageName);     // define the text to display 
				
		// Create Renderer
		renderer = new THREE.WebGLRenderer({
			alpha : true,
			antialiasing : true
		});

		VisualisationJsModule.camera.position.y = containerHEIGHT/2;
		VisualisationJsModule.camera.position.x = containerWIDTH/2;					
		VisualisationJsModule.scene.add(VisualisationJsModule.camera);
				

		renderer.setClearColor(0x000000, 0);
		renderer.setSize(containerWIDTH, containerHEIGHT);		
		VisualisationJsModule.container.appendChild(renderer.domElement);
				

		
		//controls = new THREE.OrbitControls(camera);	
		
		
		createExtraFunctions(); //creates extra functions, they only have to be made once.
		createLightingForScene();
		
		initialiseDrawingSequence(currentPageName);
		
		createSlider(containerHEIGHT, initialiseDrawingSequence, stringCurrentConcept); //creates the slider for the depth	
	}
	

	function load() {
		$('.visualisationResult').append('<div class="bar"></div>'); //TODO is dit nog steeds nodig? uitzoeken wat dit doet? verschil tussen document.ready en function load
		$bar = $('.bar');
		$bar.animate({
			width : '100%'
		}, 600, "swing", function() {
		});	
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
				return joinedString; //returns http://127.0.0.1/mediawiki2/index.php/ format
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
//hallo
});
