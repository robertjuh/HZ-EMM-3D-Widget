<?php
class EM3DNavigatorHooks {
	public static function onResourceLoaderGetConfigVars( array &$vars ) {
		global $wgEM3DNavigatorUri;
		global $wgFusekiDataset;

		//$wgEM3DNavigatorUri='http://192.168.238.132/index.php/Speciaal:URIResolver';
		$vars['wgEM3DNavigator'] = array(
			'eM3DNavigatorUri' => $wgEM3DNavigatorUri,//$wgFusekiDataset
			'eM3DFusekiDataset' => $wgFusekiDataset,//
		);
//can be used in javascript like:
//console.log(mw.config.get('wgEM3DNavigator').eM3DNavigatorUri);//contains the uri to be passed to QueryBuilder
//and can be changed in Localsettings.php
		return true;
	}
}
