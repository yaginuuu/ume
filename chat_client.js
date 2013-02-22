// WebSocketサーバに接続
var ws = new WebSocket('ws://172.20.10.6:8888/');
var dataArray = new Array();
var count = 0;
var gmap;
var maker;

var flag = false;

// エラー処理
ws.onerror = function(e) {
	$('#chat-area')
			.empty()
			.addClass('alert alert-error')
			.append(
					'<button type="button" class="close" data-dismiss="alert">×</button>',
					$('<i/>').addClass('icon-warning-sign'), 'サーバに接続できませんでした。');
};

// ユーザ名をランダムに生成
var userName = 'ゲスト' + Math.floor(Math.random() * 1000000);
// チャットボックスの前にユーザ名を表示
$('#user-name').append(userName);

// WebSocketサーバ接続イベント
ws.onopen = function() {
	$('#textbox').focus();
	// 入室情報を文字列に変換して送信
	ws.send(JSON.stringify({
		type : 'join',
		username : userName
	}));
};

// メッセージ受信イベントを処理
ws.onmessage = function(event) {
	// 受信したメッセージを復元
	var data = JSON.parse(event.data);
	if (data.type === 'join' || data.type === 'chat' || data.type === 'defect') {
		var item = $('<li/>').append(
				$('<div/>').append(
						$('<i/>').addClass('icon-user'),
						$('<small/>').addClass('meta chat-time').append(
								data.time)));

		// pushされたメッセージを解釈し、要素を生成する
		if (data.type === 'join') {
			item.addClass('alert alert-info').children('div').children('i')
					.after(data.username + 'が入室しました');
		} else if (data.type === 'chat') {
			item.addClass('well well-small')
					.append($('<div/>').text(data.text)).children('div')
					.children('i').after(data.username);
		} else if (data.type === 'defect') {
			item
					.addClass('alert')
					.children('div').children('i').after(data.username + 'が退室しました');
				console.log('overlap?...' + overlapNum(dataArray, data));	
			if (overlapNum(dataArray, data) != -1) {
				dataArray[overlapNum(dataArray, data)].marker.setMap(null);
				console.log('deleted');
			}
		} else {
			/*
			 * item.addClass('alert alert-error')
			 * .children('div').children('i').removeClass('icon-user').addClass('icon-warning-sign')
			 * .after('不正なメッセージを受信しました'); console.log(data.type);
			 */
		}
		$('#userNum').html(data.type);
		$('#chat-history').prepend(item).hide().fadeIn(500);
	} else if (data.type === 'mapdata') {
		var item = $('<li/>').append(
				data.lat + ',' + data.lng + ': ' + data.username);
		console.log(data.lat);

		// 名前に重複がなければ新しく追加, あれば更新
		if (!checkOverlap(dataArray, data)) {
			// マーカー追加
			dataArray.push({
				position : new google.maps.LatLng(data.lat, data.lng),
				username : data.username,
				marker : new google.maps.Marker({
					position : new google.maps.LatLng(data.lat, data.lng),
					map : gmap
				}),
			});
			attachMessage(dataArray[dataArray.length - 1].marker, dataArray[dataArray.length - 1].username);
			
			
			console.log('marker add: ' + data.username);
		} else if (checkOverlap(dataArray, data)) {
			var overlap = overlapNum(dataArray, data);
			// マーカー位置の緯度経度
	/*
		dataArray[overlap] = {
				lat : data.lat,
				lng : data.lng,
			};
*/
			dataArray[overlap].marker.setPosition(new google.maps.LatLng(data.lat, data.lng));
			console.log('update: ' + dataArray[overlap].username);
		}
	}
};

/**
 * マーカ用の配列の名前と送信されたマーカ用のデータに重複がないかどうか判定するメソッド
 *
 * @param checkArray
 *            判定する配列
 * @param checkData
 *            判定するデータ
 *
 * @return 重複していればtrue 重複していなければfalsed
 */
function checkOverlap(checkArray, checkData) {
	for ( var i = 0; i < checkArray.length; i++) {
		if (checkArray[i].username == checkData.username) {
			console.log('array: ' + checkArray[i]);
			console.log('checkData: ' + checkData.username);
			return true;
		} else {
			console.log(checkArray[i].username + ' != ' + checkData.username);
		}
	}
	return false;
}

/**
 * マーカ用の配列の名前と送信されたマーカ用のデータに重複している名前があればその要素番号を返すメソッド
 *
 * @param checkArray
 *            判定する配列
 * @param checkData
 *            判定するデータ
 *
 * @return 重複していれば重複している要素番号 重複していなければ-1
 */
function overlapNum(checkArray, checkData) {
	for ( var i = 0; i < checkArray.length; i++) {
		if (checkArray[i].username == checkData.username) {
			return i;
		}
	}
	return -1;
}

/**
 * 指定した名前のマーカーがある要素番号を取得するメソッド
 *
 * @param username ユーザ名
 *
 * @return ユーザ名の要素番号
 *         なければ -1
 */
function findMarker(username) {
	for ( var i = 0; i < checkArray.length; i++) {
		if (checkArray[i].username == username) {
			return i;
		}
		return -1;
	}	
}

// 発言イベント
textbox.onkeydown = function(event) {
	// エンターキーを押したとき EnterKeyは13
	if (event.keyCode === 13 && textbox.value.length > 0) {
		ws.send(JSON.stringify({
			type : 'chat',
			username : userName,
			text : textbox.value
		}));
		textbox.value = '';
	}
};

// ブラウザ終了イベント
window.onbeforeunload = function() {
	ws.send(JSON.stringify({
		type : 'defect',
		username : userName,
	}));
};

window.onpagehide = function() {
 	ws.send(JSON.stringify({
		type : 'defect',
		username : userName,
	}));
};

/*
 * マップ関係
 */
// watchPosion 現在位置を取得
window.onload = function() {
	navigator.geolocation.watchPosition(update);
};

// 位置が検出されたら経度、緯度、誤差と時間を表示
function update(position) {
	var lat = position.coords.latitude;
	var lng = position.coords.longitude;
	var alt = position.coords.altitude;
	var acc = position.coords.accuracy;
	var alc = position.coords.altitudeAccuracy;
	var hed = position.coords.heading;
	var spd = position.coords.speed;

	var htmlTxt = "緯度 = " + lat + " , " + "経度 = " + lng + " , " + "高度 = " + alt
			+ " , ";
	htmlTxt += "緯度経度の誤差 = " + acc + " , " + "高さの誤差 = " + alc + " , " + "方角 = "
			+ hed + " , " + "速度 = " + spd;
	htmlTxt += "<br>" + (new Date());

	/* document.getElementById("pos").innerHTML = htmlTxt; */

	var myLatlng = new google.maps.LatLng(lat, lng); // google map 呼び出し
	var myCenter = myLatlng; // mapの中央を変えたい場合任意の値を入れる
	var myOptions = {
		zoom : 15,
		center : myCenter,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	// , は付けないIEでエラーになる
	};
	try {
		ws.send(JSON.stringify({
			type : 'mapdata',
			lat : lat,
			lng : lng,
			username : userName
		}));
	} catch (e) {
		console.log(e);
	}
	if (!flag) {
		// 描画
		gmap = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		flag = true;
	}
}

function attachMessage(marker, msg) {
	google.maps.event.addListener(marker, 'click', function(event) {
		new google.maps.InfoWindow({
			content : msg
		}).open(marker.getMap(), marker);
	});
};