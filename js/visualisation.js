console.log("en we gaan beginnen vent");

/**
 * @author NJK @author robertjuh
 * This script is responsible for drawing the 3d objects to the canvas and initialising an ajax call. 
 * 
 * VisualisationJsModule (located in visualisationJsModule.js) contains all global variables that are relevant to the THREEjs drawing sequence.
 */
 var startVisualisation = (function(currentPageName){
	 
	 console.log("startvisualisation is opgeroepee");

		//mouselocation variables
		var onClickPosition = new THREE.Vector2();
		var	raycaster = new THREE.Raycaster();
		var	mouse = new THREE.Vector2();
		
		//THREE drawing items
		//var VisualisationJsModule.container;
		//var scene;
		//var renderer;
		//var camera;		
		
		var currentPage = currentPageName;
		
		//data
		var stringCurrentConcept = currentPage; //TODO vast op dit moment, maar moet opgehaald worden uit de huidige wiki pagina later
		
					
		//pakt de sphere die als eerste getroffen wordt door de ray, negeert labels en arrows.
		function filterFirstSpheregeometryWithRay(event, mouse){			
			normalizeCurrentMouseCoordinates(event);						
			raycaster.setFromCamera( mouse, VisualisationJsModule.camera);

			var intersects = raycaster.intersectObjects( VisualisationJsModule.scene.children ); 
			
			//If there is an intersection, and it is a sphere, apply click event.
			if ( intersects.length > 0 ) {					
				//Loops through each intersected object and cuts off the planeGeometries so that the sphere will be clicked even though there is something in front of it.
				for (var i = 0; i < intersects.length; i++) {	
					switch(intersects[0].object.geometry.type){
						case 'SphereGeometry':
						intersects[0].object.material.color.setHex( Math.random() * 0xffffff ); 
							intersects[0].object.callback(intersects[0].object.name); //calls the callback function on the chosen geometry item
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
			normalizeCurrentMouseCoordinates(event);
			
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
		function normalizeCurrentMouseCoordinates(e){
			mouse.x = ( ( (e.clientX+$(document).scrollLeft()) - renderer.domElement.offsetLeft ) / renderer.domElement.width ) * 2 - 1;
			mouse.y = - ( ( (e.clientY+$(document).scrollTop()) - renderer.domElement.offsetTop) / renderer.domElement.height ) * 2 + 1;			
		}		
		
		//create a callback function for each sphere, after clicking on a sphere the canvas will be cleared and the selected sphere will be the center point
		function createCallbackFunctionForSphere(sphere){		
			sphere.callback = function(conceptNameString){
//				for( var i = VisualisationJsModule.scene.children.length - 1; i >= 0; i--) {						
//					//does it have a geometry or is it an Object3D? remove it. This just deletes the spheres and arrows and not the lighting and camera.
//					if(VisualisationJsModule.scene.children[i].geometry != null | VisualisationJsModule.scene.children[i].type == "Object3D"){
//						VisualisationJsModule.scene.remove(VisualisationJsModule.scene.children[i]);	
//					}
//				};
			clearCanvas();
			stringCurrentConcept = "TZW:" + conceptNameString.removeSpecialCharacters().lowerCaseFirstLetter(); //TODO formats so SPARQL can read, this is just for the testing environment
			currentConcept = stringCurrentConcept;

			initialiseDrawingSequence(currentConcept); 
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
			arrow.setLength(arrow.position.distanceTo(vectTarget) - 5, 10, 5);
			arrow.setDirection(new THREE.Vector3().subVectors(vectTarget, arrow.position).normalize());
		}
			
		function setArrowTarget(arrow, target) {
				// Cast function argument to Vector3 format
				var newTarget = new THREE.Vector3(target.x, target.y, target.z);
				
				//Calculate new terminus vectors and set length
				arrow.setLength(arrow.position.distanceTo(newTarget) - 5, 10, 5);
				arrow.setDirection(new THREE.Vector3().subVectors(newTarget, arrow.position).normalize());
		}
		//end of functions for arrows -----======-----
		
			// Initializes calculations and spaces nodes according to a forced layout
			//takes variables from the startvisualisation method
		function initialiseConstraints(nodes, spheres, three_links) {
			// set up the axes
			var x = d3.scale.linear().domain([0, 300]).range([0, 10]),
			    y = d3.scale.linear().domain([0, 300]).range([0, 10]),
			    z = d3.scale.linear().domain([0, 300]).range([0, 10]);

			for (var key in nodes) {
				spheres[key].position.set(x(nodes[key].x) * 40 - 40, y(nodes[key].y) * 40 - 40, z(nodes[key].z) * 40 - 40);
				labels[key].position.set(x(nodes[key].x) * 40 - 40, y(nodes[key].y) * 40 - 40, z(nodes[key].z) * 40 - 40);
					
				for (var j = 0; j < three_links.length; j++) {
					var arrow = three_links[j];
					var vi = null;
					if (arrow.userData.source === key) {
							vi = 0;
					}
					if (arrow.userData.target === key) {
						vi = 1;
					}
					if (vi >= 0) {
						if (vi == 0) {
							var vectOrigin = new THREE.Vector3(spheres[key].position.x, spheres[key].position.y, spheres[key].position.z);
							setArrowOrigin(arrow, vectOrigin, spheres);
						}
						if (vi == 1) {
							var vectTarget = new THREE.Vector3(spheres[key].position.x, spheres[key].position.y, spheres[key].position.z);
							setArrowTarget(arrow, vectTarget);
						}
					}
				}
			}
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
			
console.log("SNAPT HIJ DIT NIETTTT");
console.log(VisualisationJsModule.camera);
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
		function visualize(nodes, spheres, nodelinks, three_links) {
				// Create nodes and randomize default position
				for (var key in nodes) {
					if (nodes.hasOwnProperty(key)) {
						var val = nodes[key];
						nodes[key].x = Math.floor((Math.random() * 100) + 1);
						nodes[key].y = Math.floor((Math.random() * 100) + 1);
						nodes[key].z = Math.floor((Math.random() * 100) + 1);
						
						// set up the sphere vars
						var radius = 5,
						    segments = 32,
						    rings = 32;

						// create the sphere's material and color
						var sphereMaterial; //TODO onderstaande line zal aangepast moeten worden als deze op andere thesauri (dan tzw:) toegepast moet worden
						if(nodes[key].name.removeSpecialCharacters().lowerCaseFirstLetter() === stringCurrentConcept.slice(4)){ //TODO color nodes according to their nodes[key].relationtype I.e: if relation = broader, color = red, currentnode=green
							sphereMaterial = new THREE.MeshPhongMaterial({
								color : JSONStyleSheet.jsonStyle.THREEColourScheme.nodes.centerNode
							});												
						}
						else{
							sphereMaterial = new THREE.MeshPhongMaterial({
								color : JSONStyleSheet.jsonStyle.THREEColourScheme.nodes.surroundingNode
							});
						}

						//create the sphere
						var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), sphereMaterial);
						sphere.name = nodes[key].name;
						spheres[key] = sphere;						

						// add the sphere to the scene
						VisualisationJsModule.scene.add(sphere);				

						// Create label mesh //TODO functie maken
						var canvas1 = document.createElement('canvas');
						var context1 = canvas1.getContext('2d');
						context1.font = JSONStyleSheet.jsonStyle.THREEColourScheme.layout.nodeLabelFont2;
						//context1.fillStyle = "rba(0,0,0,0.95)";
						context1.fillStyle = JSONStyleSheet.jsonStyle.THREEColourScheme.layout.labelTextColor;
						context1.fillText(nodes[key].name, 0, 20);
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
						var mesh1 = new THREE.Mesh(new THREE.PlaneGeometry(40, 15), material1);						
						
						labels[key] = mesh1;
						VisualisationJsModule.scene.add(mesh1);						
						
						createCallbackFunctionForSphere(sphere); 						
					}
				}

				createArrows(three_links, nodelinks, nodes);
				initialiseConstraints(nodes, spheres, three_links);
				
				VisualisationJsModule.container.addEventListener( 'mouseup', onDocumentMouseUp, false );
				VisualisationJsModule.container.addEventListener( 'touchstart', onDocumentTouchStart, false );
				VisualisationJsModule.container.addEventListener( 'mousedown', onDocumentMouseDown, false );			
		}
	
	function createArrows(three_links, nodelinks, nodes){
		for (var i = 0; i < nodelinks.length; i++) {
				var origin = new THREE.Vector3(50, 100, 50);
				var terminus = new THREE.Vector3(75, 75, 75);
				var direction = new THREE.Vector3().subVectors(terminus, origin).normalize();
				var distance = origin.distanceTo(terminus);
				var arrow = new THREE.ArrowHelper(direction, origin, distance, JSONStyleSheet.jsonStyle.THREEColourScheme.arrows.defaultArrow);
				arrow.userData = {
					target : nodes[nodelinks[i].target.name].name,
					source : nodes[nodelinks[i].source.name].name
				};
				
				VisualisationJsModule.scene.add(arrow);
				three_links.push(arrow);
		}		
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
		
		
		var relations = typeof relations !== 'undefined' ? relations : "true,true";
			
		$.ajax({
			type : "POST",
			cache : false,
			//url : "php/VisualisationScript.php",
			url : mw.config.get('wgExtensionAssetsPath')+"/EM3DNavigator/php/VisualisationScript.php", //refer to the path where the PHP class resides
			async : true,
			data : {
				concept : concept,
				depth : depth.toString(),
				relations : relations
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
		console.log(result);
		//console.log(currentPageq);
		console.log(currentPageName);
	console.log(currentPage);
		
			// Create controls (orbitcontrols)		
			//var controls = new THREE.OrbitControls(camera);		//TODO kan controls verplaatst worden? maak nu naar ieder call nieuwe controls..
			//var controls = new THREE.OrthographicTrackballControls(camera);	
			//var controls = new THREE.PointerLockControls(camera);	
			
			
			// Create arrays for spheres and links
			//var spheres = [], //Contains spheres
			three_links = [];
			//Contains arrows
			labels = [];
			//Contains label sprites

			var spheres = [];
			var nodelinks = JSON.parse(result);
			var nodes = [];

			// Compute the distinct nodes from the links.
			nodelinks.forEach(function(link) {
				link.source = nodes[link.source] || (nodes[link.source] = {
					name : link.source,
					url : link.urlsource
				});
				link.target = nodes[link.target] || (nodes[link.target] = {
					name : link.target,
					url : link.urltarget
				});
			});

			VisualisationJsModule.camera.updateProjectionMatrix();
			visualize(nodes, spheres, nodelinks, three_links);
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
		

		//document.getElementById("content").appendChild( VisualisationJsModule.container ); //This code will decide where on the wiki page this 
		document.body.appendChild( VisualisationJsModule.container ); //als ik dit doe lukt het wel in chrome en FF, bovenstaande methode lijkt hij geen element te kunnen pakken uit de huidige wiki pagina

	
		//the style of the canvas
		d3.select("#canvasje").style("background", JSONStyleSheet.jsonStyle.THREEColourScheme.layout.backGround)
			.style("width",containerWIDTH + "px")
			.style("height",containerHEIGHT + "px");
		
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
		
		initialiseDrawingSequence("TZW:hoofd");
		
		//slidertje = new createSlider(containerHEIGHT);
		createSlider(containerHEIGHT, initialiseDrawingSequence, stringCurrentConcept); //creates the slider for the depth

		console.log("depth jongeen wtfff");
		//console.log(depth);
		
		//depth = createSlider.HEIGHT;
		//console.log(slidertje.sliderDepth);
		
		
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

			String.prototype.removeSpecialCharacters = function() {
				return this.replace(/[_-]/g, " ");
			}
	}		
});

});
