// watchPosion 現在位置を取得
window.onload = function(){
	navigator.geolocation.watchPosition(update);
}
 
// 位置が検出されたら経度、緯度、誤差と時間を表示
function update(position){
	var lat = position.coords.latitude;
	var lng = position.coords.longitude;
	var alt = position.coords.altitude;
	var acc = position.coords.accuracy;
	var alc = position.coords.altitudeAccuracy;
	var hed = position.coords.heading;
	var spd = position.coords.speed;
 
	var htmlTxt = "緯度 = "+lat+" , "+"経度 = "+lng+" , "+"高度 = "+alt+" , ";
		htmlTxt += "緯度経度の誤差 = "+acc+" , "+"高さの誤差 = "+alc+" , "+"方角 = "+hed+" , "+"速度 = "+spd;
		htmlTxt += "<br>"+(new Date());
 
	document.getElementById("pos").innerHTML = htmlTxt;
 
    var myLatlng = new google.maps.LatLng( lat , lng ); //google map 呼び出し
    var myCenter = myLatlng; //mapの中央を変えたい場合任意の値を入れる
    var myOptions = {
      zoom: 15,
      center: myCenter, 
      mapTypeId: google.maps.MapTypeId.ROADMAP // , は付けないIEでエラーになる
    };	
 
	// 描画
	var gmap = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	//マーカーの設定
	var marker = new google.maps.Marker({ 
	  position: myLatlng, 
	  map: gmap
	}); 
  }
  
  function getLat() {
	  return lat;
  }