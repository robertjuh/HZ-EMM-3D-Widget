/*
 * @author robert w
 * stylesheet in json
 */

var JSONStyleSheet = (function () {	

//css -> json -> var json

	
	var json ='{"THREEColourScheme":{"nodes":{"centerNode":"rgb(76,151,214)","surroundingNode":"rgb(191,172,136)","deeperLevelNodes":"rgb(255,255,36)"},"layout":{"backGround":"rgb(229,222,205)","labelTextColor":"rgb(34,34,34)","nodeLabelFont":"Bold 30px Arial","nodeLabelFont2":"Bold 30px Open_Sans"},"slider":{"backGround":"rgb(229,222,205)","sliderColor":"rgb:(191,172,136)","polygonColor":"rgb(237,231,220)","sliderBorderColor": "rgb(37,37,37)"},"arrows":{"defaultArrow":"rgb(34,34,34)","broaderArrow":"rgb(191,172,136)","narrowArrow":"rgb(255,255,36)","relatedArrow":"rgb(255,255,36)"}}}'
	
	var jsonStyle = JSON.parse(json);
	
	return{	
		jsonStyle : jsonStyle
	};
	
}


()
);

