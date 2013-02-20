// // 位置情報
// window.addEventListener('load',
// 　　function() {
// 　　　　if (navigator.geolocation) {　　　　　　　　　　　//ポイント①
// 　　　　　　navigator.geolocation.getCurrentPosition(　　//ポイント②
// 　　　　　　　　function (pos) {
// 　　　　　　　　　　var pt = new google.maps.LatLng(
// 　　　　　　　　　　pos.coords.latitude, pos.coords.longitude);
// 　　　　　　　　　　var gmap = new google.maps.Map(
// 　　　　　　　　　　document.getElementById('result'),
// 　　　　　　　　{
// 　　　　　　　　zoom: 14,
// 　　　　　　　　center: pt,
// 　　　　　　　　mapTypeId: google.maps.MapTypeId.ROADMAP
// 　　　　　　}
// 　　　　　　);

// 　　　　　　var mark = new google.maps.Marker({
// 　　　　　　　　map: gmap,
// 　　　　　　　　position: pt,
// 　　　　　　　　title: '現在地はココです！'
// 　　　　　　});
// 　　　　　　//msg = '<li>緯度：' + pos.coords.latitude + '</li>' +
// 　　　　　　// '<li>経度：' + pos.coords.longitude + '</li>';
// 　　　　　　//document.getElementById('result').innerHTML = msg;
// 　　　　　},
// 　　　　　function (err) {
// 　　　　　　　var msgs = [
// 　　　　　　　err.message,
// 　　　　　　　'Geolocation利用の権限がありません。',
// 　　　　　　　'位置情報を取得できません。',
// 　　　　　　　'位置情報の取得がタイムアウトしました。'
// 　　　　　　　];
// 　　　　　　　document.getElementById('result').innerHTML = msgs[err.code];
// 　　　　　},
// 　　　　　{
// 　　　　　　　timeout : 60000,　　　//ポイント③
// 　　　　　　　maximumAge : 0,
// 　　　　　　　enableHighAccuracy: true
// 　　　　　}
// 　　　　);
// 　　　} else {
// 　　　　　window.alert('ブラウザがGeolocation APIに対応していません。');
// 　　　}
// 　}, true
// );

// window.addEventListener('load',
// 　　function() {
// 　　　　if (navigator.geolocation) {　　　　　　　　　　　//ポイント①
// 　　　　　　navigator.geolocation.getCurrentPosition(　　//ポイント②
// 　　　　　　　　function (pos) {
// 　　　　　　　　　　var pt = new google.maps.LatLng(
// 　　　　　　　　　　pos.coords.latitude, pos.coords.longitude);
// 　　　　　　　　　　var gmap = new google.maps.Map(
// 　　　　　　　　　　document.getElementById('result'),
// 　　　　　　　　{
// 　　　　　　　　zoom: 14,
// 　　　　　　　　center: pt,
// 　　　　　　　　mapTypeId: google.maps.MapTypeId.ROADMAP
// 　　　　　　}
// 　　　　　　);

// 　　　　　　var mark = new google.maps.Marker({
// 　　　　　　　　map: gmap,
// 　　　　　　　　position: pt,
// 　　　　　　　　title: '現在地はココです！'
// 　　　　　　});
// 　　　　　　//msg = '<li>緯度：' + pos.coords.latitude + '</li>' +
// 　　　　　　// '<li>経度：' + pos.coords.longitude + '</li>';
// 　　　　　　//document.getElementById('result').innerHTML = msg;
// 　　　　　},
// 　　　　　function (err) {
// 　　　　　　　var msgs = [
// 　　　　　　　err.message,
// 　　　　　　　'Geolocation利用の権限がありません。',
// 　　　　　　　'位置情報を取得できません。',
// 　　　　　　　'位置情報の取得がタイムアウトしました。'
// 　　　　　　　];
// 　　　　　　　document.getElementById('result').innerHTML = msgs[err.code];
// 　　　　　},
// 　　　　　{
// 　　　　　　　timeout : 60000,　　　//ポイント③
// 　　　　　　　maximumAge : 0,
// 　　　　　　　enableHighAccuracy: true
// 　　　　　}
// 　　　　);
// 　　　} else {
// 　　　　　window.alert('ブラウザがGeolocation APIに対応していません。');
// 　　　}
// 　}, true
// );

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

	function attachMessage(marker, msg) {
    google.maps.event.addListener(marker, 'click', function(event) {
      new google.maps.InfoWindow({
        content: msg
      }).open(marker.getMap(), marker);
    });
  }

	var data = new Array();//マーカー位置の緯度経度
	data.push({position: new google.maps.LatLng(lat, lng), content: '君だよ！'});
  data.push({position: new google.maps.LatLng(35.681382, 139.766084), content: '東京駅'});
  data.push({position: new google.maps.LatLng(35.690921, 139.700258), content: '新宿駅'});

  for (i = 0; i < data.length; i++) {
    var myMarker = new google.maps.Marker({
      position: data[i].position, 
      map: gmap
    });
    attachMessage(myMarker, data[i].content);
  }
	// //マーカーの設定
	// var marker = new google.maps.Marker({ 
	//   position: myLatlng, 
	//   map: gmap

	
	// }); 
 
 
  }