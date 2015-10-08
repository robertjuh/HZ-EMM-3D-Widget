/*
 * This code is listen for triggers when loading is complete.
 */
$(document).ready(function() {

	if (window.location.hash != "") {
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


});

function getQuery(concept, depth, run, selection) {
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

/*
 * This function runs a query on your local fuseki server
 */
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


