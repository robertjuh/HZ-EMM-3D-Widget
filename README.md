# HZ-EMM-3D-Widget
Continuing the following project: https://github.com/nsteijaert/HZ-EMM-3D

deze code werkt als widget. 

1: Plaats alle bestanden in deze repository naar de volgende directory:
\htdocs\mediawiki2\extensions\EM3DNavigator

2: in localsettings.php voeg toe: 
require_once "$IP/extensions/EM3DNavigator/EM3DNavigator.php";

3: Maak een Widget pagina aan met als naam:EM3DNavigator, met daarin de volgende code:
<noinclude>
Dit is het commentaar waarin beschreven wordt waar deze widget over gaat.
</noinclude>
<includeonly>
		<!-- libraries/css - other (load first for jquery onload)-->
                <script src="//code.jquery.com/jquery-1.11.3.min.js"></script> 
            		<script src="js/jquery.cookie.js"></script>

<div id="canvasje"></div>
<script type="text/javascript">
mw.loader.using( 'ext.EM3DNavigator' ).done( function () {

$(document).ready(function() {

startVisualisation("<!--{$currentPageName|default:'Pagename niet doorgekregen'}-->"); //roept alle js code aan en geeft currentpage als parameter door

});

});

</script>

</includeonly>



4: roep de widget aan op een wikipagina met de volgende code:
{{#widget:EM3DNavigator| currentPageName={{PAGENAME}} }}
