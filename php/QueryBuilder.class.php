<?php

class QueryBuilder {
    const SMWServer = "http://192.168.238.133/index.php/Speciaal:URIResolver"; //moet een constante worden //zoek op get current namespace/host. (zoek uit: kan ik smwgnamespace uit localsettigns halen?) 
    const RDFQuery='
			PREFIX uri: <dummyuri/>
			PREFIX localuri: <dummyuri>
			PREFIX skos: <dummyuri/Eigenschap-3ASkos-3A>
			PREFIX skosem: <dummyuri/Eigenschap-3ASkosem-3A>
			PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>	
			
			construct { ?s ?p ?o }
			where {
			  ?c rdfs:label "%s" .
			  ?c (%s){,%d} ?s .
			  ?s ?p ?o
			  FILTER(EXISTS { ?s a uri:Categorie-3ASKOS_Concept } )
			}
		';

	private $depth;
	private $concept;
	
	
	
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
				break;
			}
			$forEachIndex++;
		}



		
	
	$resultRDFQuery = sprintf(self::RDFQuery, $concept, $relation, $depth);		

	$resultRDFQuery=str_replace ( "dummyuri",self::SMWServer,$resultRDFQuery );
		
    return $resultRDFQuery;	


		
		
	
	}
		

	

}
?>