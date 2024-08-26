// 地図を作成し、初期位置とズームレベルを設定
var map = L.map('map').setView([35.6895, 139.6917], 13); // 初期位置を東京に設定

// OpenStreetMapタイルレイヤーを追加
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// マーカーを追加
L.marker([35.6895, 139.6917]).addTo(map)
    .bindPopup('Tokyo')
    .openPopup();