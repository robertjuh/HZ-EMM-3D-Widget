<?php

class QueryBuilder {

	private $depth;
	private $concept;
	private $heyhallo; //temp var, remove later
	
	private $SMWServer = "http://192.168.238.133/index.php/"; //moet een constante worden //zoek op get current namespace/host. (zoek uit: kan ik smwgnamespace uit localsettigns halen?) 
	
	function __construct($depth, $concept) {
		$this -> depth = $depth;
		$this -> concept = $concept;
	}

	function generateQuery($relations = "", $depth = "", $concept = "") {
		$relations = $relations == "" ? "broader,narrower" : $relations;
		$depth = $depth == "" ? $this -> depth : $depth;
		$concept = $concept == "" ? $this -> concept : $concept;

		$relation = "";
		$relations = explode(",", $relations);

//		for($i=0; i<=1; $i++){
		//for($i=0; i<=count($relations); $i++){
			//if ($i != 0){$relations .= "|"};
			
//	foreach($relations as $rel){
//			if ($relations == 0) {
//				$relation .= "<>|!<>";			
//			}
file_put_contents('php://stderr', print_r($relations, TRUE));

//		if (($relations[0] === 'broader') && ($relations[1] === 'narrower')) {
//			$relation .= "<>|!<>";
//		} else if (($relations[0] === 'true')) {
//			$relation .= "skosem:broader";
//		} else if (($relations[1] === 'true')) {
//			$relation .= "skosem:narrower";
//		} else {
//			$relation .= "<>|!<>";
//		}
		
		//foreach($relations as $rel){
			//file_put_contents('php://stderr', print_r($rel, TRUE));
			
		$forEachIndex =0;
		foreach($relations as $rel){
			if($forEachIndex != 0){$relation .= "|";}
			switch ($rel) {
				case "broader":
					$relation .= "skosem:broader";	
					break;					
				case "narrower":
					$relation .= "skosem:narrower";
					break;
				case "related":
					$relation .= "skos:related";
					break;
				case "association":
					$relation .= "skosem:association";
					break;
				default:
				//slice first one and increment
				//array_shift($relations);
				break;
				//break
			}
		$forEachIndex++;
		}
			file_put_contents('php://stderr', print_r($relation, TRUE));
		file_put_contents('php://stderr', print_r($relation, TRUE));	
		//}


			
			
//			else if (in_array("broader", $relations)) {
//				$relation .= "skosem:broader";
//			} 
//			else if (in_array("narrower", $relations)) {
//				$relation .= "skosem:narrower";
//			} else if (in_array("related", $relations)) {
//				$relation .= "skos:related";
//			}
			
			
//			else {
//				$relation .= "<>|!<>";
//			}
//		}
//		}


		
	

	$heyhallo = sprintf('
			PREFIX uri: <http://192.168.238.133/index.php/Speciaal:URIResolver/>
            PREFIX localuri: <http://192.168.238.133/index.php/Speciaal:URIResolver/>
			PREFIX skos: <http://192.168.238.133/index.php/Speciaal:URIResolver/Eigenschap-3ASkos-3A>
			PREFIX skosem: <http://192.168.238.133/index.php/Speciaal:URIResolver/Eigenschap-3ASkosem-3A>
			PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>	
			
			construct { ?s ?p ?o }
			where {
			  ?c rdfs:label "%s" .
			  ?c (%s){,%d} ?s .
			  ?s ?p ?o
			  FILTER(EXISTS { ?s a uri:Categorie-3ASKOS_Concept } )
			}
		', $concept, $relation, $depth);		

		//	var_dump($heyhallo);
		file_put_contents('php://stderr', print_r($heyhallo, TRUE));
		
		
    return sprintf('
			PREFIX uri: <http://192.168.238.133/index.php/Speciaal:URIResolver/>
            PREFIX localuri: <http://192.168.238.133/index.php/Speciaal:URIResolver/>
			PREFIX skos: <http://192.168.238.133/index.php/Speciaal:URIResolver/Eigenschap-3ASkos-3A>
			PREFIX skosem: <http://192.168.238.133/index.php/Speciaal:URIResolver/Eigenschap-3ASkosem-3A>
			PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>	
			
			construct { ?s ?p ?o }
			where {
			  ?c rdfs:label "%s" .
			  ?c (%s){,%d} ?s .
			  ?s ?p ?o
			  FILTER(EXISTS { ?s a uri:Categorie-3ASKOS_Concept } )
			}
		', $concept, $relation, $depth);	


		
		

		
		
    return sprintf('
			PREFIX uri: <http://192.168.238.133/index.php/Speciaal:URIResolver/>
            PREFIX localuri: <http://192.168.238.133/index.php/Speciaal:URIResolver/>
			PREFIX skos: <http://192.168.238.133/index.php/Speciaal:URIResolver/Eigenschap-3ASkos-3A>
			PREFIX skosem: <http://192.168.238.133/index.php/Speciaal:URIResolver/Eigenschap-3ASkosem-3A>
			PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>	
			
			construct { ?s ?p ?o }
			where {
			  ?c rdfs:label "%s" .
			  ?c (%s){,%d} ?s .
			  ?s ?p ?o
			  FILTER(EXISTS { ?s a uri:Categorie-3ASKOS_Concept } )
			}
		', $concept, $relation, $depth);		
		
	
	}
		

	

}
?>