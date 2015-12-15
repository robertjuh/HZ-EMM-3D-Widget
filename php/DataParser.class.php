<?php
require_once (__DIR__ . '/visitor/SKOSConcept.class.php');

class PriorityQueue extends SplPriorityQueue
{
    public function compare($a, $b)
    {
        if ($a === $b) return 0;
        return $a > $b ? -1 : 1;
    }
}
 
class DataParser {
	private $data;

	function __construct($input) {
		$this -> data = $input;
	}
	
	/*function parseDataRDF1() {//not used right now; likely obsolete?
		
					
	    //Hashmap met subject -> hashmap[relation(s), object(s)]
		
		$items = array();

		if (!isset($this -> data['@graph'])){
			return $items;
		}
		
		
		
		
		foreach ($this->data['@graph'] as $item) {
			$obj = new SKOSConcept($item['@id']);
			foreach ($item as $key => $value) {
				if (!$this -> isRelation($key)) {
					$obj -> addProperty($key, $value);
				}
			}
			$items[$item['@id']] = $obj;
		}



		return $items;
	}*/

	function parseDataRDF() {
		
		
		$items = array();

		if (!isset($this -> data['@graph']))
			return $items;
		//first create all objects; without relations
		//these items are described in the array of the result-set
		foreach ($this->data['@graph'] as $item) {
			$obj = new SKOSConcept($item['@id']);
			foreach ($item as $key => $value) {
				if (!$this -> isRelation($key)) {
					$obj -> addProperty($key, $value);
				}
			}
			$items[$item['@id']] = $obj;
		}

		//now add relations. Only add relation if item is created by previous loop
		foreach ($this->data['@graph'] as $item) {
			$obj = $items[$item['@id']];
			foreach ($item as $key => $value) {
				if ($this -> isRelation($key)) {
					if (is_array($value)) {
						foreach ($value as $relation) {
							if (array_key_exists($relation, $items))//object is created
								$obj -> addRelation($key, $items[$relation]);
						}
					} else {
						if (array_key_exists($value, $items))
							$obj -> addRelation($key, $items[$value]);
					}
				}
			}
		}

		return $items;
	}

	function parseDataJSON() {

	}

	function parseDataXML() {

	}

	function setData($data) {
		$this -> data = $data;
	}

	function getData() {
		return $this -> data;
	}

	function isRelation($key) {
		$relationKeys = array("broader", "narrower", "related", "partof");

		foreach ($relationKeys as $relation) {
			if (strpos($key, $relation))
				return true;
		}

		return false;

		// return array_filter($relationKeys, function($haystack) use ($key) {
		// return (strpos($haystack, $key) !== false);
		// });
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
	      //uri is at start of itemName; remove it
	      $itemName=str_replace("_"," ",str_replace("Uri:","",str_replace("uri:","",str_replace("-3A",":",$item->getName()))));//TODO -3A does not have to be replaced anymore; done already at start
	      if((strcmp($itemName,$concept)==0))
	      $start=$item;
	    }
	    
	    return $start;
	}
}
?>