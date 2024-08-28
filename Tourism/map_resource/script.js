// 地図を作成し、初期位置とズームレベルを設定
var map = L.map('mapset', {zoomControl: false });
    map.setView([35.4297, 134.5185], 11); // 初期位置を小代村に設定

//OpenStreetMapタイルレイヤーを追加
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

// ESRIマップのタイルレイヤを追加
var esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="https://www.esri.com/en-us/home">Esri</a>'
    });

//国土地理院地図のタイルレイヤを追加
var gsi = L.tileLayer('//cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://maps.gsi.go.jp">国土地理院地図</a> contributors'
    });

//ベースマップをまとめた関数
var basemaps = {
    "OpenStreetMap" : osm,
    "Esri World Imagery" : esri,
     "国土地理院地図": gsi
    };