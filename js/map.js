let map;
//客製化地標軸顏色
var goldIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var greyIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var myIcon = new L.Icon({
    iconUrl: 'https://upload.cc/i1/2020/02/26/2ras6W.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function myMap() {
    map = L.map('map', {
        center: [22.639602, 120.302546], //預設中心點的經緯度[高雄火車站]
        zoom: 16 //地圖縮放等級
    });

    //用openstreetmap的圖資
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
    }).addTo(map);
    ajax();
}

function renderIcon() {
    let markers = new L.MarkerClusterGroup().addTo(map);
    let data = __g_data;
    for(let i =0;data.length>i;i++){  
        let map_adult_mask;
        let map_child_mask;
        let maskAdult = data[i].properties.mask_adult;
        let maskChild = data[i].properties.mask_child;

        //判斷地標軸顏色
        if(data[i].properties.mask_adult ==0 && data[i].properties.mask_child ==0){
            mask = greyIcon;

        }else if(data[i].properties.mask_adult <50 || data[i].properties.mask_child <50){
            mask = goldIcon;
        }
        else{
            mask = myIcon;
        }   
        
        //判斷口罩的樣式
        if(maskAdult >0){
            map_adult_mask = 'map_adult_mask';
        }else{
            map_adult_mask = 'map_adult_mask_zero';
        }

        if(maskChild >0){
            map_child_mask = 'child_mask';
        }else{
            map_child_mask = 'child_mask_zero';
        }
        // 地標軸的座標/顏色
        let eachIcon = L.marker([data[i].geometry.coordinates[1],data[i].geometry.coordinates[0]],{icon: mask})
        eachIcon.bindPopup(
            `    
            <div class="map_itemText-area">
                <div class="itemText">
                    <h4 class="map_shopName">${data[i].properties.name}</h4>  
                    <p class="map_time js_openTime">營業時間：${data[i].properties.todayOpen}</p>
                </div>
                <div class="map_iconArea">
                    <a href="javascript:;" class="star map_star" dataID=${data[i].properties.id}></a>
                    <a href="https://www.google.com.tw/maps/place/${data[i].properties.address}" target= "_blank" class="range map_range"></a>
                </div>
            </div>
            <div class="map_update">${data[i].properties.updated}</div>
            <div class="item-mask js_mask">
                <div class="map_mask ${map_adult_mask}">
                    <p>成人</p>
                    <span>${data[i].properties.mask_adult}</span>
                </div>
                <div class="map_mask ${map_child_mask}">
                    <p>兒童</p>
                    <span>${data[i].properties.mask_child}</span>
                </div>
            </div> `
        )
        //彈出bindPopup事件
        .on(`popupopen`, function (ev) {
            // popupStart();
            // console.log(ev);
            starShine();
        })
        //關閉bindPopup事件
        .on(`popupclose`, function () {
            
        });
        //將icon塞進原始數據
        data[i].icon = eachIcon;
        //將地標軸事件放進 markers群組裡
        markers.addLayer(eachIcon);
    }
    //把群組丟到地圖裡
    map.addLayer(markers);
}



//讓地圖視窗的星星發亮
function starShine() {
    let map_star = document.querySelector(`.map_star`);
    let data = window.__g_data;
    let mapID = map_star.getAttribute(`dataID`);
    // console.log(map_star);
    for (let i = 0 ;i < data.length; i++) {
        if (data[i].properties.id == mapID) {
            if (data[i].selectData) {
                map_star.id = 'map_selscted';
            }
            break
        }
    }
}
