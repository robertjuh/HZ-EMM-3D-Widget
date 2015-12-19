# HZ-EMM-3D-Widget
Continuing the following project: https://github.com/nsteijaert/HZ-EMM-3D

deze code werkt als widget. 

1: Plaats alle bestanden in deze repository naar de volgende directory:
\htdocs\mediawiki2\extensions\EM3DNavigator

2: in localsettings.php voeg toe: 
require_once "$IP/extensions/EM3DNavigator/EM3DNavigator.php";

3: Maak een Widget pagina aan met als naam:EM3DNavigator, met daarin de volgende code:
call within a widget with javascript:
<noinclude>
Dit is de EM3DNavigator Widget.
You have to include the script d3.v3.js with the script-tag because it is used in document.ready
</noinclude>
<includeonly>
<script src="../extensions/EM3DNavigator/js/d3.v3.js" charset="utf-8"></script>
<script type="text/javascript">
$(document).ready(function() {
mw.loader.using( ['ext.EM3DNavigator']).done( function () {
      var visualisationInstance= new Visualisation();
      visualisationInstance.drawHTMLElements("<!--{$baseDiv|default:'bodyContent'}-->","<!--{$currentPageName|default:'Pagename niet doorgekregen'}-->");
}
);//mw.loader

});//document.ready
</script>
</includeonly>

4: roep de widget aan op een wikipagina met de volgende code:
{{#widget:EM3DNavigator| currentPageName={{PAGENAME}} }}
