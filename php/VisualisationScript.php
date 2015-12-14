<?php
include_once (__DIR__ . '/QueryBuilder.class.php');
include_once (__DIR__ . '/DataParser.class.php');
include_once (__DIR__ . '/visitor/NodeMapVisitor.class.php');
include_once (__DIR__ . '/ChromePhp.php');
$concept=$_POST["concept"];
//called by javascript. Started in mediawiki-page by: {{#widget:EM3DNavigator| currentPageName={{PAGENAME}}}}
// Load data
$SMWServer = "http://127.0.0.1/mediawiki2/index.php/Speciaal:URIResolver"; //server of Nick Steijaart
//fuseki by default running on port 3030 on localhost
$fusekiDataset='http://localhost:3030/ds';
//values can be changed in LocalSettings: 
//example:
//$wgEM3DNavigatorUri='http://192.168.238.133/index.php/Speciaal:URIResolver';
//$wgFusekiDataset='http://localhost:3030/ds';
//replace with parameter from calling script, if passed
if (isset($_POST['uri']))
  $SMWServer=$_POST['uri'];
if (isset($_POST['fusekidataset']))
  $fusekiDataset=$_POST['fusekidataset'];
//TODO:check sanity of parameters depth,concept and relations
//otherwise use default values
$depth=intval ($_POST["depth"]);
$querybuilder = new QueryBuilder($depth, $concept,$SMWServer);
$query = $querybuilder -> generateQuery($_POST["relations"]);
//file_put_contents('php://stderr', print_r($query, TRUE));
//execute query
//replace url-encoded chars. Problem: % has been replaced with -
//this is a workaround. Possible problems occur with a %-sign.
//TODO alternative is to replace -3A with :, and -2D with -
//$result =  str_replace("%", "-", urldecode ( str_replace("-", "%", file_get_contents($fusekiDataset.'/query?output=json&query=' . urlencode($query)))));
$result =  str_replace("-27", "'", str_replace("-2D", "-", str_replace("-3A", ":", file_get_contents($fusekiDataset.'/query?output=json&query=' . urlencode($query)))));
						//file_put_contents('php://stderr', print_r('---result waar alle JSON data waarschijnlijk instaat is:', TRUE));
						//file_put_contents('php://stderr', print_r($result, TRUE));
// Parse data
$parser = new DataParser(json_decode($result, true));
$objects = $parser -> parseDataRDF();
//file_put_contents('php://stderr', print_r(json_decode($result, true), TRUE));
$parser -> calcDistances($parser -> getStart($concept,$objects));
// Handle data
$visitor = new NodeMapVisitor();
foreach ($objects as $object) {
					//file_put_contents('php://stderr', print_r('---objects:', TRUE));
					//file_put_contents('php://stderr', print_r($objects, TRUE));
	$object -> accept($visitor);
}

// Return JSON
echo $visitor -> getUsableJSON();
 
?>