<?php
require (__DIR__ . '/Visitor.class.php');

class NodeMapVisitor extends Visitor {

	private $data = array();

	function visit(SKOSConcept $concept) {
		$relations = $concept -> getRelations();
		if (count($relations) != 0) {
			$arr = array();
			$item = array();
			$item["type"] = "node";
			$item["name"] = ucfirst(str_replace("uri:TZW-3A", "", $concept -> getName()));
			$item["distance"] = $concept->distance;
			foreach ($concept -> getProperties() as $key => $property) {
			  $item[$key] = $property;
			}
			//array_push($arr, $item);//TODO make javascript able to receive type: node
			foreach ($relations as $key => $relation) {
				foreach ($relation as $object) {
					$item = array();
					$item["type"] = $key;
					$item["distance"] = $object->distance;//TODO if nodevalues are passed, this can be removed
//file_put_contents('php://stderr', print_r($object -> getName().$key.$concept -> getName()."\n", TRUE));
					switch (true) {					
						case strpos($key, "broader") :
							$item["urlsource"] = $concept -> getProperty("page");
							$item["urltarget"] = $object -> getProperty("page");
							$item["source"] = ucfirst(str_replace("uri:TZW-3A", "", $concept -> getName()));
							$item["target"] = ucfirst(str_replace("uri:TZW-3A", "", $object -> getName()));
							break;
						case strpos($key, "narrower") :
							$item["urlsource"] = $object -> getProperty("page");
							$item["urltarget"] = $concept -> getProperty("page");
							$item["source"] = ucfirst(str_replace("uri:TZW-3A", "", $object -> getName()));
							$item["target"] = ucfirst(str_replace("uri:TZW-3A", "", $concept -> getName()));
							break;
						case strpos($key, "related") :
//file_put_contents('php://stderr', print_r($object -> getName()."---related with ".$concept -> getName(), TRUE));
							$item["urlsource"] = $object -> getProperty("page");
							$item["urltarget"] = $concept -> getProperty("page");
							$item["source"] = ucfirst(str_replace("uri:TZW-3A", "", $object -> getName()));
							$item["target"] = ucfirst(str_replace("uri:TZW-3A", "", $concept -> getName()));
							break;		
									//narrower is toegevoegd maar functioneert niet;Anton: volgens mij nu wel!

						default :
							return;
							break;
					}
					array_push($arr, $item);
					
						/*file_put_contents('php://stderr', print_r('---relations is:', TRUE));
						file_put_contents('php://stderr', print_r($relations, TRUE));
						file_put_contents('php://stderr', print_r("---concept", TRUE));
						file_put_contents('php://stderr', print_r($concept, TRUE));
						file_put_contents('php://stderr', print_r("---object", TRUE));
						file_put_contents('php://stderr', print_r($object, TRUE));
						file_put_contents('php://stderr', print_r("---key", TRUE));
						file_put_contents('php://stderr', print_r($key, TRUE));
						file_put_contents('php://stderr', print_r("---arr", TRUE));
						file_put_contents('php://stderr', print_r($arr, TRUE));
						file_put_contents('php://stderr', print_r("---relation", TRUE));
						file_put_contents('php://stderr', print_r($relation, TRUE));*/
						
				}
			}
			$this -> data = array_merge($this -> data, $arr);
		}
	}

	function getUsableJSON() {
		return json_encode($this -> data);
	}

}
?>