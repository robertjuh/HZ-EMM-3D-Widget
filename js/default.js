/*
 * This code is listen for triggers when loading is complete.
 */
//TODO: check which function in this library is used; otherwise they can be removed
//$(document).ready(function() {

/*	if (window.location.hash != "") {
		if (window.location.hash == "#runQuery") {
			$('#visualisation').fadeOut(function() {
				$(this).html('');
				$('#runQuery').fadeIn();
			});
		} else {
			var str = window.location.hash.replace("#", "");
			$('#visualisation').load(str).hide();
			$('#runQuery').fadeOut(function() {
				$('#visualisation').fadeIn();
			});
		}
	} else {
		$('#visualisation').fadeOut(function() {
			$(this).html('');
			$('#runQuery').fadeIn();
		});
	}

	$('form').submit(function() {
		var query = $('#query').val();
		var selection = $('#selection').val();
		var depth = $('#depth').val();

		if (query != "") {
			$('.result').html('<div style="text-align:center"><i class="fa fa-spinner fa-spin fa-3x"></i><br/><span>Loading data...</span></div>');
			if (depth != "") {
				getQuery(query, depth, true, selection);
			} else {
				runQuery(query, selection);
			}
		} else {
			console.log("No given query");
		}
	});

	$('nav').on('click', 'a', function() {
		if ($(this).attr('href') == "#runQuery") {
			$('#visualisation').fadeOut(function() {
				$(this).html('');
				$('#runQuery').fadeIn();
			});
		} else {
			var str = $(this).attr('href').replace("#", "");
			$('#visualisation').load(str).hide();
			$('#runQuery').fadeOut(function() {
				$('#visualisation').fadeIn();
			});
		}
	});*/
//});

/*function getQuery(concept, depth, run, selection) {
	$.ajax({
		type : "POST",
		cache : false,
		url : "php/VisualisationScript.php",
		async : true,
		data : {
			do : "generate",
			concept : concept,
			depth : depth
		}
	}).done(function(result) {
		if ( typeof run === 'undefined')
			return result;
		else
			console.log(runQuery(result, selection));
	});
}

//This function runs a query on your local fuseki server

function runQuery(query, selection) {
	$.ajax({
		type : "GET",
		cache : false,
		url : "http://localhost:3030/ds/query",
		async : true,
		data : {
			query : query,
			output : selection
		}
	}).done(function(result) {

		if (selection == "json") {
			$('.result').html("<span>" + new Date() + "</span><pre><code class='json'>" + JSON.stringify(result, undefined, 4) + "</code></pre>");
		} else if (selection == "xml") {
			var xmlText = new XMLSerializer().serializeToString(result);
			var xmlTextNode = document.createTextNode(xmlText);
			$('.result').html("<span>" + new Date() + "</span><pre><code class='xml'></code></pre>");
			$('.result pre code').append(xmlTextNode);
		} else {
			$('.result').html("<span>" + new Date() + "</span><pre><code class='text'></code></pre>");
			$('.result pre code').text(result).append();
		}

		$('pre code').each(function(i, e) {
			//hljs.highlightBlock(e);
		});

		$.post("php/VisualisationScript.php", {
			do : "parse",
			data : result
		}, function(data) {
			return data;
		});
	}).fail(function(result) {
		$('.result').html("<p><b style='color:red'>Error retrieving data...</b></p><pre>" + result.responseText + "</pre>");
	});
}


// Show the json string with nice syntax.

function syntaxHighlight(json) {
	json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
		var cls = 'number';
		if (/^"/.test(match)) {
			if (/:$/.test(match)) {
				cls = 'key';
			} else {
				cls = 'string';
			}
		} else if (/true|false/.test(match)) {
			cls = 'boolean';
		} else if (/null/.test(match)) {
			cls = 'null';
		}
		return '<span class="' + cls + '">' + match + '</span>';
	});
}*/

//common functions. Transferred to util-file - default.js?) 
  
  function checkIfEmpty(text,alternative){
    if (text.isBlank||(text.length==0)||text.charAt(0)=="<") return alternative; else return text;
  }

  //get style based on definition in CSS
  var getStyle = function(CLASSname) {
    var styleSheets = window.document.styleSheets;
    var styleSheetsLength = styleSheets.length;
    for(var i = 0; i < styleSheetsLength; i++){
	    if (styleSheets[i].rules ) { var classes = styleSheets[i].rules; }
	    else { 
		    try {  if(!styleSheets[i].cssRules) {continue;} } 
		    //Note that SecurityError exception is specific to Firefox.
		    catch(e) { if(e.name == 'SecurityError') { console.log("SecurityError. Cant readd: "+ styleSheets[i].href);  continue; }}
		    var classes = styleSheets[i].cssRules ;
	    }
	    for (var x = 0; x < classes.length; x++) {
		    if (classes[x].selectorText == CLASSname) {
			    return classes[x];
			    /*var ret = (classes[x].cssText) ? classes[x].cssText : classes[x].style.cssText ;
			    if(ret.indexOf(classes[x].selectorText) == -1){ret = classes[x].selectorText + "{" + ret + "}";}
			    return ret;*/
		    }
	    }
    }
    return null;			
  }
  /*
    * get attribute in style, if not available return defaultValue
    */ 
  var getStyleAttr = function(CLASSname,attr,defaultValue) {
    try {
      var text=getStyle(CLASSname).cssText;
      //if (CLASSname=='#sliderDiv')console.log(text);
      //parse css, get text inbetween brackets
      var p=text.indexOf("{");
      text=text.substring(p+1);
      var p=text.indexOf("}");
      text=text.substring(0,p-1);
      //split into parts
      var listattr = text.split(";");//list with all attributes
      var found=false;
      var value=null;
      for (var i = 0; i < listattr.length; i++) {
	  var attrn = listattr[i].split(":");//becomes key-value pair
	  var key=attrn[0].trim();
	  if (key==attr) {found=true;value=attrn[1].trim();}
	  //Do something
      }
      if (found) return value;else return defaultValue;
    }
    catch (e) {
      return defaultValue;
    }

  }
  
  /*
    * get attribute in style as in integer, if not available return defaultValue (must be int)
    */ 
  var getStyleAttrInt = function(CLASSname,attr,defaultValue) {
    try {
      return parseInt(getStyleAttr(CLASSname,attr,""+defaultValue));
    }
    catch (e) {
      return defaultValue;
    }
    
  }
	  
  //creates additional functions	
  function createExtraFunctions(){
		  d3.selection.prototype.moveToFront = function() {//not used
			  return this.each(function() {
				  this.parentNode.appendChild(this);
			  });
		  };

		  d3.selection.prototype.first = function() {//not used
			  return d3.select(this[0][0]);
		  };	
		  
		  String.prototype.isBlank = function(str) {
		      return (!str || /^\s*$/.test(str));
		  }
		  String.prototype.lowerCaseFirstLetter = function() {//not used
			  return this.charAt(0).toLowerCase() + this.slice(1);
		  };

		  String.prototype.getLastPartOfUrl= function() {
			  return this.split("/").pop();
		  };		
		  
		  String.prototype.getFirstPartOfUrl= function() {
			  var strArray = this.split("/");
			  strArray.splice(-1, 1); //remove last part of str
			  var joinedString = strArray.join("/")+"/";
			  return joinedString; //returns http://127.0.0.1/mediawiki2/index.php/ format
		  };
		  String.prototype.isEmpty = function() {//not used
		      return (this.length === 0 || !this.trim());
		  };
		  
		  //Compares 2 strings with each other, use ' "COMPARETHIS".compareStrings("CoMpAreThIs", true, true);" to receive true.
		  String.prototype.compareStrings = function (string2, ignoreCase, useLocale) {
			  var string1 = this;
			  if (ignoreCase) {
				  if (useLocale) {
					  string1 = string1.toLocaleLowerCase();
					  string2 = string2.toLocaleLowerCase();
				  }
				  else {
					  string1 = string1.toLowerCase();
					  string2 = string2.toLowerCase();
				  }
			  }
			  return string1 === string2;
		  };
  }

//create call to extrafunctions so they can be used
createExtraFunctions(); //creates extra functions, they only have to be made once.
