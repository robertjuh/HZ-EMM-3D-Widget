<?php

class QueryBuilder {
    //basic sparql-query, to be processed by QueryBuilder to get working query
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
			  FILTER(EXISTS { ?s a uri:Categorie-3ASKOS_Concept }  || EXISTS{ ?s a  uri:Categorie-3ASocKrt_Concept} )
			}
			limit 4000
		';

	//TODO: limit 4000 is hack. Replace this with other algorithm:
	//introduce queue
	//while queue not empty and number of nodes < ...
	//get all nodes for first member of queue, and add them to list.
	//if new node not in queue, add it to queue.
	//parameters passed by calling javascript
	private $depth;
	private $concept;
	private $uri;
	
	
	
	function __construct($depth, $concept, $uri) {
		$this -> depth = $depth;
		$this -> concept = $concept;
		$this -> uri = $uri;
	}

	function generateQuery($relations = "", $depth = "", $concept = "") {
		$relations = $relations == "" ? "broader,narrower" : $relations;
		$depth = $depth == "" ? $this -> depth : $depth;
		$concept = $concept == "" ? $this -> concept : $concept;

		$relation = "";
		$relations = explode(",", $relations);


			
		//replace each term with right skos-term
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



		//inject concept, relation and depth into sparql-query
		$resultRDFQuery = sprintf(self::RDFQuery, $concept, $relation, $depth);	
		//now replace dummyuri with correct uri-path of smw-resources

		$resultRDFQuery=str_replace ( "dummyuri",$this -> uri,$resultRDFQuery );
		
		return $resultRDFQuery;	


		
		
	
	}
		

	

}
?>