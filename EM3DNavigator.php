<?php
global $SMWServerURLForSPARQLQuery;
$SMWServerURLForSPARQLQuery = 'http://192.168.238.133/index.php/Speciaal:URIResolver';
$wgResourceModules['ext.EM3DNavigator'] = array(
	'scripts' =>  array('js/jquery-2.1.1.min.js', 'js/jquery.cookie.js', 'js/bootstrap.min.js', 'js/cola.min.js', 'js/three.min.js', 'js/d3.v3.js',  'js/default.js',  'js/OrbitControls.js', 'js/OrthographicTrackballControls.js', 'js/PointerLockControls.js','js/TrackballControls.js', 'js/visualisation.js', 'js/slider.js', 'js/visualisationJsModule.js', 'js/JSONStyleSheet.js'),
	'styles' => array ('css/bootstrap.min.css', 'css/bootstrap-theme.min.css', 'css/highlight.css', 'css/style.css'),
	'messages' => array(
		'EM3DNavigator-foo-label',
	),
	'dependencies' => array(
		'jquery.cookie',
		'jquery.tabIndex',
	),
	'position' => 'top',

	'localBasePath' => __DIR__,
	'remoteExtPath' => 'EM3DNavigator',
);


$wgAutoloadClasses['VisualisationScript'] = __DIR__.'/php/VisualisationScript.php';
$wgAutoloadClasses['QueryBuilder'] = __DIR__.'/php/QueryBuilder.class.php';





?>




