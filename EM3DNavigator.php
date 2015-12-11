<?php
//global $SMWServerURLForSPARQLQuery;
//$SMWServerURLForSPARQLQuery = 'http://192.168.238.133/index.php/Speciaal:URIResolver';
/*
call within a widget with javascript:
<script type="text/javascript">

mw.loader.using( ['jquery.makeCollapsible','ext.EM3DNavigator']).done( function () {
//makeCollapsible gives error. Side-effect: error concerning makeCollapsible disappears

$(document).ready(function() {
startVisualisation("<!--{$currentPageName|default:'Pagename niet doorgekregen'}-->"); 
}
);//document.ready

});//mw.loader
</script>
*/
$wgResourceModules['ext.EM3DNavigator'] = array(
	'scripts' =>  array(//'js/jquery-2.1.1.min.js'
//, 'js/jquery.cookie.js'
//, 
'js/bootstrap.min.js'
//, 'js/cola.min.js'
, 'js/three.min.js', 'js/d3.v3.js',  'js/OrbitControls.js'//, 'js/OrthographicTrackballControls.js', 'js/TrackballControls.js'
,  'js/default.js', 'js/visualisation.js', 'js/slider.js', 'js/visualisationJsModule.js', 'js/JSONStyleSheet.js'),
	'styles' => array ('css/bootstrap.min.css', 'css/bootstrap-theme.min.css', 'css/highlight.css', 'css/style.css', 'css/navigatorStyle.css'),
	'messages' => array(
		'EM3DNavigator-foo-label',
	),
	/*'dependencies' => array(
		'jquery.cookie',
		'jquery.tabIndex',
	),*/
	'position' => 'top',

	'localBasePath' => __DIR__,
	'remoteExtPath' => 'EM3DNavigator',
);


$wgAutoloadClasses['VisualisationScript'] = __DIR__.'/php/VisualisationScript.php';
$wgAutoloadClasses['EM3DNavigatorHooks'] = __DIR__.'/EM3DNavigator.Hooks.php';
global $wgEM3DNavigatorUri;

$wgEM3DNavigatorUri='http://127.0.0.1/mediawiki2/index.php/Speciaal:URIResolver';
global $wgFusekiDataset;
$wgFusekiDataset='http://localhost:3030/ds';

//can be used in javascript like:
//console.log(mw.config.get('wgEM3DNavigator').eM3DNavigatorUri);//contains the uri to be passed to QueryBuilder
$wgHooks['ResourceLoaderGetConfigVars'][]='EM3DNavigatorHooks::onResourceLoaderGetConfigVars';



?>




