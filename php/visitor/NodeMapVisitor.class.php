<?php
require (__DIR__ . '/Visitor.class.php');

class NodeMapVisitor extends Visitor {

	private $data = array();
	private $nodedata = array();

	function visit(SKOSConcept $concept) {
		$relations = $concept -> getRelations();
		if (count($relations) != 0) {
			//first add node-info to nodedata
			$arr = array();
			$item = array();
			//$item["type"] = "node";
			$item["name"] = ucfirst(str_replace("uri:TZW-3A", "", $concept -> getName()));
			$item["distance"] = $concept->distance;
			foreach ($concept -> getProperties() as $key => $property) {
			  $item[$key] = $property;
			}
			array_push($this -> nodedata, $item);
			//TODO make javascript able to receive type: node
			//in visualisation.js add
			//line 302: 		if (nodelinks[i].source)
			//line 415 (or 416 if previous line added):if (link.source)

			//now add relation-info to data
			foreach ($relations as $key => $relation) {
				foreach ($relation as $object) 
				    if (!strpos($key, "narrower")){//omit narrower because always broader equivalnet present
					$item = array();
					$item["type"] = $key;
					$item["distance"] = $object->distance;//TODO if nodevalues are passed, this can be removed
					switch (true) {					
						case strpos($key, "broader") :
							$item["urlsource"] = $concept -> getProperty("page");
							$item["urltarget"] = $object -> getProperty("page");
							$item["source"] = ucfirst(str_replace("uri:TZW-3A", "", $concept -> getName()));
							$item["target"] = ucfirst(str_replace("uri:TZW-3A", "", $object -> getName()));
							break;
						case strpos($key, "narrower") ://TODO omit next lines; never reached, because narrower relations are omitted
							$item["urlsource"] = $object -> getProperty("page");
							$item["urltarget"] = $concept -> getProperty("page");
							$item["source"] = ucfirst(str_replace("uri:TZW-3A", "", $object -> getName()));
							$item["target"] = ucfirst(str_replace("uri:TZW-3A", "", $concept -> getName()));
							break;
						case strpos($key, "related") :
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
					
				}
			}
			$this -> data = array_merge($this -> data, $arr);
		}
	}

	function getUsableJSON() {
		$nodeitem=array();
		$nodeitem["nodes"]=$this -> nodedata;

		//TODO make javascript able to receive type: node
		//then uncomment next line
		//array_push($this -> data, $nodeitem);
		return json_encode($this -> data);
	}

}
?>