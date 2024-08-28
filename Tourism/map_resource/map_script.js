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
}

// DOMが完全に読み込まれた後に `setting` 関数を実行
document.addEventListener("DOMContentLoaded", setting, false);
