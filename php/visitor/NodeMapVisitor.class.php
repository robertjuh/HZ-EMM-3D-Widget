<?php
require (__DIR__ . '/Visitor.class.php');

class NodeMapVisitor extends Visitor {

	private $data = array();
	private $nodedata = array();

	function visit(SKOSConcept $concept) {
		//first add node-info to nodedata
		$arr = array();
		$item = array();
		//$item["type"] = "node";
		$item["name"] = ucfirst(str_replace("uri:TZW-3A", "", $concept -> getName()));
		$item["distance"] = $concept->distance;
		foreach ($concept -> getProperties() as $key => $property) {
		  $item[$key] = $property;
		}
		$item["url"] = $concept -> getProperty("page");
		$source = $item["name"];
		$this -> nodedata[$source]=$item;
		//now add relation-info to data
		$relations = $concept -> getRelations();
		if (count($relations) != 0) {

			foreach ($relations as $key => $relation) {
				foreach ($relation as $object) 
				    if (!strpos($key, "narrower")){//omit narrower because always broader equivalnet present
					$item = array();
					$item["type"] = $key;
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
		$temparray=array();

		$temparray["relations"]=$this -> data;
		$temparray["nodes"]=$this -> nodedata;
//code in javascript that processes this structure
/*
			var jsonResult = JSON.parse(result);
			var nodes = jsonResult.nodes;
			var nodelinks = jsonResult.relations;

			// replace the description of the source and target of the links with the actual nodes.
			nodelinks.forEach(function(link) {
			  {
				link.source = nodes[link.source] ;
				link.target = nodes[link.target];
			  }
			});
			VisualisationJsModule.camera.updateProjectionMatrix();
			visualize(nodes, [], nodelinks, []);

*/
		return json_encode($temparray);
	}

}
?>