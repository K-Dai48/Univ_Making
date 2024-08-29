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
      map.setView([35.4297, 134.5185], 12); // 初期位置を小代村に設定
      
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
      const obj = {};
      const currentLine = lines[i].split(",");

      headers.forEach((header, j) => {
        obj[header.trim()] = currentLine[j].trim(); //ヘッダーをキー、データを値としてオブジェクトに
      });

      result.push(obj); //オブジェクトをリストに追加
    }

    return result;
  }

  function addpoint(map, points) {
    points.forEach(point => {
      const marker = L.marker([point.lat, point.lon]).addTo(map); //マーカーを追加

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


  loadCSVData('Tourism/map_resource/point.csv').then(points => {
    addpoint(map, points);
  });

}

// DOMが完全に読み込まれた後に `setting` 関数を実行
document.addEventListener("DOMContentLoaded", setting, false);
