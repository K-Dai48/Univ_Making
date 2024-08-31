function setting() {

// 地図を作成し、初期位置とズームレベルを設定
  function base() {
      //OpenStreetMapタイルレイヤーを追加
      var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

      // ESRIマップのタイルレイヤを追加
      var esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="https://www.esri.com/en-us/home">Esri</a> contributors'
      });

      //国土地理院地図のタイルレイヤを追加
      var gsi = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://maps.gsi.go.jp">国土地理院地図</a> contributors'
      });

      //マップオブジェクトを作成
      var map = L.map('mapset', {zoomControl: false });
      osm.addTo(map); //オープンストリートマップをメインに設定
      map.setView([35.4297, 134.5185], 11); // 初期位置を小代村に設定
      
      //ベースマップをまとめた関数
      var basemaps = {
        "OpenStreetMap" : osm,
        "Esri World Imagery" : esri,
        "地理院地図": gsi
      };

      //ベースマップの表示をコントロールする関数
      L.control.layers(basemaps).addTo(map);

      return map; // `map` オブジェクトを返す

  }

  //ポリゴン追加の関数
  function addpolygon(map) {
      // 小代区のポリゴンを追加
      var Ojiro = L.geoJson(ojiro, {
        color: "#008000", // 外線の色
        weight: 5,
        fill: false,   
        fillopacity: 0
    });

    Ojiro.addTo(map);
  }

  // マップオブジェクトを取得して初期化
  var map = base();
  addpolygon(map);

  function loadCSVData(url) {
    return fetch(url)
      .then(response => response.text()) //csvファイルの内容をテキストとして取得
      .then(data => {
        return parseCSVData(data); //csvのテキストデータをオブジェクト形式に変換
      });
  }

  function parseCSVData(data) { //JavaScriptオブジェクトのリストに変換
    const lines = data.split("\n"); //csvを行ごとに分割
    const headers = lines[0].split(","); //ヘッダー行を分割して配列に
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() ==="") continue; //空行をスキップ
      const obj = {};
      const currentLine = lines[i].split(",");
      headers.forEach((header, j) => {
        obj[header.trim()] = currentLine[j].trim(); //ヘッダーをキー、データを値としてオブジェクトに
      });
      result.push(obj); //オブジェクトをリストに追加
    }

    return result;
  }

  var iconTypes = {
    'meal': L.icon({ iconUrl: 'https://github.com/K-Dai48/Univ_Making/raw/main/Tourism/photo/icon1.png', iconSize: [25, 25] }),
    'local': L.icon({ iconUrl: 'https://github.com/K-Dai48/Univ_Making/raw/main/Tourism/photo/icon2.png', iconSize: [25, 25] }),
    'sight': L.icon({ iconUrl: 'https://github.com/K-Dai48/Univ_Making/raw/main/Tourism/photo/icon3.png', iconSize: [25, 25] })
  };

  function addpoint(map, points) {
    points.forEach(point => {
      const marker = L.marker([point.lat, point.lon], {
          icon: iconTypes[point.type] || iconTypes['sight']
      }).addTo(map); //マーカーを追加

      marker.bindTooltip(point.name, {
        permanent: false, // 常に表示する場合はtrue、ホバー時のみ表示する場合はfalse
        direction: 'top'  // ツールチップの表示位置
      });

      marker.on('click', () => {
        //ピンをクリックしたらスライド表示
        document.getElementById('info-title').innerText = point.name;
        document.getElementById('info-dsc').innerHTML = point.dsc;
        document.getElementById('info-img').src = point.img;
        // スライドを表示
        document.getElementById('info-slide').style.bottom = '0';
      });
    });

    document.getElementById('close-slide').addEventListener('click', () => {
      document.getElementById('info-slide').style.bottom = '-100%';
    });
  }

  // ポップアップ関連のコード
  const popup = document.querySelector('#popup');
  const navLink = document.querySelector('#nav-link');
  const closeButton = document.querySelector('#close-popup');

  navLink.addEventListener('click', function () {
    popup.style.display = 'flex'; // ポップアップを表示
  });

  closeButton.addEventListener('click', function () {
      popup.style.display = 'none'; // ポップアップを閉じる
  });

  function setupLocationButton(points) {
    const getLocationButton = document.getElementById('get-location');
    const currentLocationText = document.getElementById('current-location');
    const nearestSiteText = document.getElementById('nearest-site');

    getLocationButton.addEventListener('click', async () => {
        try {
            const [currentLat, currentLon] = await getCurrentLocation();
            document.getElementById('current-lat').innerText = currentLat.toFixed(6) + '  ';
            document.getElementById('current-lon').innerText = currentLon.toFixed(6);

            const { closestPoint, minDistance } = findNearestSpot(currentLat, currentLon, points);
            const nearestSiteText = document.querySelector("#nearest-site span");
            nearestSiteText.innerHTML = `<span class="emphasized-text">${closestPoint.name}</span>（距離: ${minDistance.toFixed(2)} km）`;

        } catch (error) {
            console.error(error);
            currentLocationText.innerText = '位置情報の取得に失敗しました。';
            nearestSiteText.innerText = '';
        }
    });
}

// 位置情報を取得する関数
async function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject('Geolocation is not supported by this browser.');
        }
        navigator.geolocation.getCurrentPosition(
            position => resolve([position.coords.latitude, position.coords.longitude]),
            error => reject(error)
        );
    });
}

// 最も近いポイントを見つける関数
function findNearestSpot(lat, lon, points) {
    let closestPoint = null;
    let minDistance = Infinity;

    points.forEach(point => {
        const distance = calculateDistance(lat, lon, point.lat, point.lon);
        if (distance < minDistance) {
            minDistance = distance;
            closestPoint = point;
        }
    });

    return { closestPoint, minDistance };
}

// 緯度経度間の距離を計算する関数
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球の半径（キロメートル）
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// 度をラジアンに変換する関数
function toRad(deg) {
    return deg * (Math.PI / 180);
}
  
  // 地図作成後にボタンの設定を行う
  loadCSVData('Tourism/map_resource/point.csv').then(points => {
    addpoint(map, points);
    setupLocationButton(points); // ボタンの設定
  });

}

// DOMが完全に読み込まれた後に `setting` 関数を実行
document.addEventListener("DOMContentLoaded", setting, false);