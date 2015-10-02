/**
 * @author NJK @author robertjuh
 * This script is responsible for drawing the 3d objects to the canvas and initialising an ajax call. 
 *
 */
		//mouselocation variables
		var onClickPosition = new THREE.Vector2();
		var	raycaster = new THREE.Raycaster();
		var	mouse = new THREE.Vector2();
		
		//THREE drawing items
		var container;
		var scene;
		var renderer;
		var camera;
		
		//data
		var stringCurrentConcept = "TZW:ogen"; //TODO vast op dit moment, maar moet opgehaald worden uit de huidige wiki pagina later
		
//Wait for document to finish loading		
$(document).ready(function() {
	
	//Initialise the components that are relevant to the canvas/renderer
	initialiseTHREEComponents(); //TODO is hier geen betere constructie voor?
	function initialiseTHREEComponents(){
		console.log("initialise three components wordt hier aangeroepen");
		var HEIGHT = 600;
		var WIDTH = 600;
				
		//creating the canvas everything is drawn on
		container = document.getElementById( 'canvasje' );
		document.body.appendChild( container );
	
		//the style of the canvas
		d3.select("#canvasje").style("background", "steelblue")
			.style("width",WIDTH + "px")
			.style("height",HEIGHT + "px");
		
		// Create scene
		scene = new THREE.Scene();
		
		// Create Renderer
		renderer = new THREE.WebGLRenderer({
			alpha : true,
			antialiasing : true
		});
		renderer.setClearColor(0x000000, 0);
		renderer.setSize(WIDTH, HEIGHT);		
		container.appendChild(renderer.domElement);
				
		// Set camera attributes and create camera
		var VIEW_ANGLE = 45, //field of view
		    ASPECT = WIDTH / HEIGHT, 
			//ASPECT  = $container[0].clientWidth / $container[0].clientHeight,
		    NEAR = 0.1,
		    FAR = 10000;
		camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
		camera.position.z = 200;
		camera.position.y = 100;
		camera.position.x = WIDTH/2;					
		scene.add(camera);
		
		//will start to draw spheres, labels and arrows on the renderer
		startVisualisation(stringCurrentConcept);
	}
	

	function load() {
		$('.visualisationResult').append('<div class="bar"></div>'); //TODO is dit nog steeds nodig? uitzoeken wat dit doet?
		$bar = $('.bar');
		$bar.animate({
			width : '100%'
		}, 600, "swing", function() {
		});	
	}

	//Prepares the scene before drawing anything onto it
	function startVisualisation(concept, depth, relations) {
		console.log("startVisualisation met volgende 3 parameters:")
		console.log(concept);
		console.log(depth);
		console.log(relations);
	
		// Create controls (orbitcontrols)		
		var controls = new THREE.OrbitControls(camera);
	
		// Create arrays for spheres and links
		var spheres = [], //Contains spheres
		three_links = [];
		//Contains arrows
		labels = [];
		//Contains label sprites

		// Instantiate light sources
		var pointLight1 = new THREE.PointLight(0xFFFFFF);
		pointLight1.position.x = 0;
		pointLight1.position.y = 50;
		pointLight1.position.z = 500;
		scene.add(pointLight1);
		var pointLight2 = new THREE.PointLight(0xFFFFFF);
		pointLight2.position.x = 0;
		pointLight2.position.y = 500;
		pointLight2.position.z = -500;
		scene.add(pointLight2);
		var pointLight3 = new THREE.PointLight(0xFFFFFF);
		pointLight3.position.x = 500;
		pointLight3.position.y = 500;
		pointLight3.position.z = 0;
		scene.add(pointLight3);
		var pointLight4 = new THREE.PointLight(0xFFFFFF);
		pointLight4.position.x = -500;
		pointLight4.position.y = 50;
		pointLight4.position.z = 0;
		scene.add(pointLight4);
		var pointLight5 = new THREE.PointLight(0xFFFFFF);
		pointLight5.position.x = 0;
		pointLight5.position.y = -100;
		pointLight5.position.z = 0;
		scene.add(pointLight5);

		if ( typeof concept === 'undefined' || concept === '') {
			throw "Concept is undefined";
		}
		var depth = typeof depth !== 'undefined' ? depth : 2 ;
		var relations = typeof relations !== 'undefined' ? relations : "true,true";

		//var ajaxCall = $.ajax({
		$.ajax({
			type : "POST",
			cache : false,
			url : "php/VisualisationScript.php",
			async : true,
			data : {
				concept : stringCurrentConcept,
				depth : depth.toString(),
				relations : relations
			},
       success:function(result)//we got the response
       {
		console.log("ajax is gelukt ");
       },
       error:function(exception){alert('Exeption: '+exception);}	   
		}).done(function(result) {
		console.log("DATA");
		console.log(result);

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

			camera.updateProjectionMatrix();
			visualize();
			animate();

			// Visualize RDF data
			//will create nodes(spheres), labels and arrpws and positions them.
			function visualize() {

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
						var sphereMaterial;						
						if(nodes[key].name == "Gezicht"){ //TODO color nodes according to their nodes[key].relationtype I.e: if relation = broader, color = red, currentnode=green
							sphereMaterial = new THREE.MeshPhongMaterial({
								color : "red"
							});												
						}
						else{
							sphereMaterial = new THREE.MeshPhongMaterial({
								color : "steelblue"
							});
						}

						//create the sphere
						var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), sphereMaterial);
						sphere.name = nodes[key].name;
						spheres[key] = sphere;						

						// add the sphere to the scene
						scene.add(sphere);				

						// Create label mesh
						var canvas1 = document.createElement('canvas');
						var context1 = canvas1.getContext('2d');
						context1.font = "Bold 30px Arial";
						context1.fillStyle = "rba(0,0,0,0.95)";
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
						scene.add(mesh1);						
						
						createCallbackFunctionForSphere(sphere); 
					}
				}

				// Create arrows
				for (var i = 0; i < nodelinks.length; i++) {
					var origin = new THREE.Vector3(50, 100, 50);
					var terminus = new THREE.Vector3(75, 75, 75);
					var direction = new THREE.Vector3().subVectors(terminus, origin).normalize();
					var distance = origin.distanceTo(terminus);
					var arrow = new THREE.ArrowHelper(direction, origin, distance, 0x000000);
					arrow.userData = {
						target : nodes[nodelinks[i].target.name].name,
						source : nodes[nodelinks[i].source.name].name
					};
					scene.add(arrow);
					three_links.push(arrow);

				}
				initialiseConstraints();
				
				container.addEventListener( 'mouseup', onDocumentMouseUp, false );
				container.addEventListener( 'touchstart', onDocumentTouchStart, false );
				container.addEventListener( 'mousedown', onDocumentMouseDown, false );			
			}

			// Initializes calculations and spaces nodes according to a forced layout
			function initialiseConstraints() {
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
								setArrowOrigin(arrow, vectOrigin);
							}
							if (vi == 1) {
								var vectTarget = new THREE.Vector3(spheres[key].position.x, spheres[key].position.y, spheres[key].position.z);
								setArrowTarget(arrow, vectTarget);
							}
						}
					}
				}
				renderer.render(scene, camera);
			}

			// Animate the webGL objects for rendering
			function animate() {
				requestAnimationFrame(animate);
				renderer.render(scene, camera);
				controls.update();

				for (var label in labels) {
					labels[label].lookAt(camera.position); //makes the labels spin around to try to look at the camera
				}
				render();
			}

			// Extension of default render function, runs continuously, add code here if nessesary
			function render() {
			}

			// Construction method for arrowhelpers
			function constructArrowHelper(source, target) {
				// Instantiate origin and target in Vector3 format
				var origin = new THREE.Vector3(10, 10, 10);
				var terminus = new THREE.Vector3(0, 0, 0);
				
				// Calculate terminus vectors
				var direction = new THREE.Vector3().subVectors(terminus, origin).normalize();
				var distance = origin.distanceTo(terminus);
				var arrow = new THREE.ArrowHelper(direction, origin, distance, 0x000000);

				// Set node data associated with the arrow
				arrow.userData = {
					target : nodes[nodelinks[i].target.name].name,
					source : nodes[nodelinks[i].source.name].name
				};
				scene.add(arrow);
			}

			function setArrowOrigin(arrow, origin) {
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
			
			d3.selection.prototype.moveToFront = function() {
				return this.each(function() {
					this.parentNode.appendChild(this);
				});
			};

			d3.selection.prototype.first = function() {
				return d3.select(this[0][0]);
			};
		});	
	}

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
			normalizeCurrentMouseCoordinates(event);			
			
			raycaster.setFromCamera( mouse, camera );
			
			var intersects = raycaster.intersectObjects( scene.children ); 
			
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
		
		//calls the callback function on mouse up, on the appointed sphere.
		function onDocumentMouseUp(event){
			event.preventDefault();	
			
			normalizeCurrentMouseCoordinates(event);						
			raycaster.setFromCamera( mouse, camera );
			
			var intersects = raycaster.intersectObjects( scene.children ); 
			
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

		//function for normalising mouse coordinates to prevent duplicate code. This will take offset and scrolled position into account and the renderer width/height.
		function normalizeCurrentMouseCoordinates(e){
			mouse.x = ( ( (e.clientX+$(document).scrollLeft()) - renderer.domElement.offsetLeft ) / renderer.domElement.width ) * 2 - 1;
			mouse.y = - ( ( (e.clientY+$(document).scrollTop()) - renderer.domElement.offsetTop) / renderer.domElement.height ) * 2 + 1;			
		}
		
		//create a callback function for each sphere
		function createCallbackFunctionForSphere(sphere){		
			sphere.callback = function(conceptNameString){
				for( var i = scene.children.length - 1; i >= 0; i--) {						
					//does it have a geometry or is it an Object3D? remove it. This just deletes the spheres and arrows and not the lighting and camera.
					if(scene.children[i].geometry != null | scene.children[i].type == "Object3D"){
						scene.remove(scene.children[i]);	
					}
				};
														
			stringCurrentConcept = "TZW:" + conceptNameString;		
			console.log("callback is aangeroepen een geeft conceptstring:");
			console.log(stringCurrentConcept);	
		}		
	}
	
});