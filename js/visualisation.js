/**
 * @author NJK
 */
//Wait for document to finish loading
		//var canvasje = document.getElementById("canvas-svg");
		var canvasje = document.getElementById("canvasje");

		var onClickPosition = new THREE.Vector2();
					//raycaster = new THREE.Raycaster(origin, direction, 0.1, 10000); //kan met deze params? TODO?
		var	raycaster = new THREE.Raycaster();
		var	mouse = new THREE.Vector2();
		
		var stringCurrentConcept = "TZW:ogen";
		
		
$(document).ready(function() {


	function load() {
		$('.visualisationResult').append('<div class="bar"></div>'); //TODO dit werkt zo niet meer he
		$bar = $('.bar');
		$bar.animate({
			width : '100%'
		}, 600, "swing", function() {
		});		


	}
	
	
//	if ($.cookie("depth") != "" && $.cookie("relations") != "")
//		visualize("TZW:gezicht", $.cookie("depth"), $.cookie("relations"));
//	else
		//visualize("TZW:menselijk lichaam");
		
		visualize2(stringCurrentConcept);
		
	function visualize2(concept, depth, relations) {
		console.log("WAT KRIJGEN WE NOU VISUALIZE WORT AANGEROEPEPEN MET DE VOLGENDE 3 PARAMERTERS:")
		console.log(concept);
		console.log(depth);
		console.log(relations);
		// Set visualisation variables		
		//var raycaster, mouse;
		var objectjes = [];
		//var WIDTH = 1000;
		var HEIGHT = 600;
		//var WIDTH = d3.select("#canvas-svg")[0][0].offsetWidth-10; //ja dit werkt maar probeer even fixed dan maar
		var WIDTH = 600;
		//var HEIGHT = d3.select("#canvas-svg")[0].clientHeigth;
		//var WIDTH = $(window).width(); // dit vervangen naar de widgetgrootte neem ik aan TODO
		//var HEIGHT = $(window).height();
		//document.getElementById('canvasje').style.width=WIDTH + "px";
		//document.getElementById('canvasje').style.height=HEIGHT + "px";
		console.log(d3.select("#canvasje"));
		
		//TODO the style of the canvas
		d3.select("#canvasje").style("background", "steelblue")
			.style("width",WIDTH + "px")
			.style("height",HEIGHT + "px");
			
			

		COLOR = "steelblue";
		LINK_COLOR = "#cccccc";
		
		var container = document.getElementById( 'canvasje' );
		document.body.appendChild( container );
	
		// Create scene
		var scene = new THREE.Scene();

		// Set camera attributes and create camera
		var VIEW_ANGLE = 45, //field of view
		    ASPECT = WIDTH / HEIGHT, 
			//ASPECT  = $container[0].clientWidth / $container[0].clientHeight,
		    NEAR = 0.1,
		    FAR = 10000;
		var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
			
		
		
		scene.add(camera);
		camera.position.z = 200;
		camera.position.y = 100;
		camera.position.x = WIDTH/2;

		// Create Renderer
		var renderer = new THREE.WebGLRenderer({
			alpha : true,
			antialiasing : true
		});
		renderer.setClearColor(0x000000, 0);
		renderer.setSize(WIDTH, HEIGHT);
		
		container.appendChild(renderer.domElement);
		
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
		var depth = typeof depth !== 'undefined' ? depth : 1 ;
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
        //alert('Successfully called');
		console.log(result);
       },
       error:function(exception){alert('Exeption:'+exception);}	   
		}).done(function(result) {
			initialiseerVisua
			
		}
		
		d3.selection.prototype.moveToFront = function() {
			return this.each(function() {
				this.parentNode.appendChild(this);
			});
		};

		d3.selection.prototype.first = function() {
			return d3.select(this[0][0]);
		};
				
		function onDocumentTouchStart(event){
				event.preventDefault();
				event.clientX = event.touches[0].clientX;
				event.clientY = event.touches[0].clientY;
				onDocumentMouseUp( event );
		}

		
					// Visualize RDF data
			function visualize() {
		console.log("WAT KRIJGEN WE NOU VISUALIZE WORT AANGEROEPEPEN MET DE VOLGENDE 3 PARAMERTERS:")
		console.log(concept);
		console.log(depth);
		console.log(relations);				

		

				// Create nodes and randomize default position
				for (var key in nodes) {
					if (nodes.hasOwnProperty(key)) {
						var val = nodes[key];
						nodes[key].x = Math.floor((Math.random() * 100) + 1);
						nodes[key].y = Math.floor((Math.random() * 100) + 1);
						nodes[key].z = Math.floor((Math.random() * 100) + 1);

						console.log("val, line 202");
						console.log(val);
						
						// set up the sphere vars
						var radius = 5,
						    segments = 32,
						    rings = 32;

						// create the sphere's material and color
						var sphereMaterial;						
						if(nodes[key].name == "Gezicht"){ //TODO color nodes according to theyr nodes[key].relationtype
							sphereMaterial = new THREE.MeshPhongMaterial({
								color : "red"
							});												
						}
						else{
							sphereMaterial = new THREE.MeshPhongMaterial({
								color : "steelblue"
							});
						}

						var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), sphereMaterial);
						sphere.name = nodes[key].name;
						spheres[key] = sphere;
						
			//			var axisHelper = new THREE.AxisHelper(200);
			//			scene.add(axisHelper);
												
						//create a callback function for each mesh
						sphere.callback = function(conceptNameString){
							console.log(scene.children);
							console.log(conceptNameString); 						
						console.log(scene);
								for( var i = scene.children.length - 1; i >= 0; i--) {
									console.log("scene.children[i]"); 
									console.log(scene.children[i]); 
									
									//does it have a geometry or is it an Object3D? remove it. This just deletes the spheres and arrows and not the lighting and camera.
									if(scene.children[i].geometry != null | scene.children[i].type == "Object3D"){
										scene.remove(scene.children[i]);	
									}
								};
																							
					stringCurrentConcept = "TZW:" + conceptNameString;
					visualize2(stringCurrentConcept, 2);					
					console.log(stringCurrentConcept);	
					}
						
					//objectjes.push(sphere); //TODO lol werkt dit

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
						//texture1.minFilter = THREE.LinearMipMapLinearFilter;
						texture1.minFilter = THREE.NearestFilter;
						var material1 = new THREE.MeshBasicMaterial({
							map : texture1,
							side : THREE.DoubleSide
						});
						material1.transparent = true;
						var mesh1 = new THREE.Mesh(new THREE.PlaneGeometry(40, 15), material1);

						labels[key] = mesh1;

						scene.add(mesh1);
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
				initCola();
				
				canvasje.addEventListener( 'mouseup', onDocumentMouseUp, false );
				//canvasje.addEventListener( 'touchstart', onDocumentTouchStart, false );
				canvasje.addEventListener( 'mousedown', onDocumentMouseDown, false );			
			}

		//colors the ball that is being clicked, follows the link on mouse release
		function onDocumentMouseDown(event){
			event.preventDefault();
			//ajaxCall();
			//normaliseren van muiscoords, zet de muis ook naar de relatieve positie ten opzichte van hoever er naar beneden/rechts gescrolled is
			//mouse.x = ( ( (event.clientX+$(document).scrollLeft()) - renderer.domElement.offsetLeft ) / renderer.domElement.width ) * 2 - 1;
			//mouse.y = - ( ( (event.clientY+$(document).scrollTop()) - renderer.domElement.offsetTop) / renderer.domElement.height ) * 2 + 1;
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
			
		function onDocumentMouseUp(event){
			event.preventDefault();	
			
			//normaliseren van muiscoords, zet de muis ook naar de relatieve positie ten opzichte van hoever er naar beneden/rechts gescrolled is
			//mouse.x = ( ( (event.clientX+$(document).scrollLeft()) - renderer.domElement.offsetLeft ) / renderer.domElement.width ) * 2 - 1;
			//mouse.y = - ( ( (event.clientY+$(document).scrollTop()) - renderer.domElement.offsetTop) / renderer.domElement.height ) * 2 + 1;
			
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
								intersects[0].object.csa
			
		}
		
		d3.selection.prototype.moveToFront = function() {
			return this.each(function() {
				this.parentNode.appendChild(this);
			});
		};

		d3.selection.prototype.first = function() {
			return d3.select(this[0][0]);
		};
				
		function onDocumentTouchStart(event){
				event.preventDefault();
				event.clientX = event.touches[0].clientX;
				event.clientY = event.touches[0].clientY;
				onDocumentMouseUp( event );
		}

		
					// Visualize RDF data
			function visualize() {
		console.log("WAT KRIJGEN WE NOU VISUALIZE WORT AANGEROEPEPEN MET DE VOLGENDE 3 PARAMERTERS:")
		console.log(concept);
		console.log(depth);
		console.log(r