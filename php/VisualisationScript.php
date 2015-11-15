<?php
include_once (__DIR__ . '/QueryBuilder.class.php');
include_once (__DIR__ . '/DataParser.class.php');
include_once (__DIR__ . '/visitor/NodeMapVisitor.class.php');
include_once (__DIR__ . '/ChromePhp.php');

$concept=$_POST["concept"];

//TODO code for distance-calculation in separate class
//start code for calculation of distances
class PriorityQueue extends SplPriorityQueue
{
    public function compare($a, $b)
    {
        if ($a === $b) return 0;
        return $a > $b ? -1 : 1;
    }
}
 
function calcDistances($start)
{
    // define an empty queue
    $q = new PriorityQueue();
 
    // push the starting vertex into the queue
    $q->insert($start, 0);
    $q->rewind();
 
    // mark the distance to it 0
    $start->distance = 0;
 
    while ($q->valid()) {
        $t = $q->extract();
        $t->visited = 1;
 
    foreach ($t->getRelations() as $key => $relation) {
	foreach ($relation as $object) {
            if (!$object->visited) {
                if ($object->distance > $t->distance + 1) {
                    $object->distance = $t->distance + 1;
                    $object->parent = $t;
                }
 
 
                $q->insert($object, $object->distance);
            }
	}
      }
      $q->recoverFromCorruption();
      $q->rewind();
    }
}
/*
get starting node of list of objects
*/
function getStart($concept,$objects){
    $start=null;
    foreach ($objects as $item) {
      $itemName=str_replace("-3A",":",$item->getName());
      if(strpos($itemName,$concept)>0)
      $start=$item;
    }
    
    return $start;
}
/*
print all distances
*/
function printDistances($objects){
    foreach ($objects as $item) {
      $itemName=str_replace("-3A",":",$item->getName());
      file_put_contents('php://stderr', $itemName."-".$item->distance."\n");
    }
}
//end code for calculation of distances

//called by javascript. Started in mediawiki-page by: {{#widget:EM3DNavigator| currentPageName={{PAGENAME}}}}

// Load data
$SMWServer = "http://192.168.238.133/index.php/Speciaal:URIResolver"; //server of Nick Steijaart
//fuseki by default running on port 3030 on localhost
$fusekiDataset='http://localhost:3030/ds';
//values can be changed in LocalSettings: 
//example:
//$wgEM3DNavigatorUri='http://192.168.238.133/index.php/Speciaal:URIResolver';
//$wgFusekiDataset='http://localhost:3030/ds';

//@Robert: vervang met je eigen server-gegevens!?$SMWServer = "http://192.168.238.133/index.php/Speciaal:URIResolver";

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

//execute query
$result = file_get_contents($fusekiDataset.'/query?output=json&query=' . urlencode($query));

						//file_put_contents('php://stderr', print_r('---result waar alle JSON data waarschijnlijk instaat is:', TRUE));
						//file_put_contents('php://stderr', print_r($result, TRUE));

// Parse data

$parser = new DataParser(json_decode($result, true));
$objects = $parser -> parseDataRDF();
//file_put_contents('php://stderr', print_r(json_decode($result, true), TRUE));

calcDistances(getStart($concept,$objects));
printDistances($objects);
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