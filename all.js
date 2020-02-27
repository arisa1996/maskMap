
//手機板漢堡選單
function hamBar(){
    let bar = document.querySelector('#js_bars');
    let sideMenu = document.querySelector('.sideMenu');
    let js_sideMenu = document.querySelector('.js_sideMenu');
    bar.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        sideMenu.classList.toggle('js_sideMenu');
        
    },false);
};
hamBar();

// 區分看診休診
function sortData () {
    let day = new Date().getDay();
    //console.log(day);
	let data = window.__g_data;
	// let day = window.__g_now.day;
	data.forEach(v1=>{
		let dataArr = v1.properties.available.split(`、`);
		let close = [];
		let open = dataArr.filter(v2=>{
			if (v2.search(`看診`) == -1) {
				close.push(v2);
			}
			return v2.search(`看診`) != -1
		})
        open = distinDay(open)
        
		switch (day) {
			case 1:
				v1.properties.todayOpen = open.mon;
				break
			case 2:
				v1.properties.todayOpen = open.tue;
				break
			case 3:
				v1.properties.todayOpen = open.wen;
				break
			case 4:
				v1.properties.todayOpen = open.tur;
				break
			case 5:
				v1.properties.todayOpen = open.fri;
				break
			case 6:
				v1.properties.todayOpen = open.sat;
				break
			case 7:
				v1.properties.todayOpen = open.sun;
				break
		}
		if (v1.properties.todayOpen.length == 0) {
			v1.properties.todayOpen = '今日公休';
        }
        
       
		v1.properties.available = {
			open: open,
			close: close
		}
	});
}
// 區分每天
function distinDay (data) {
	let mon = [],
		tue = [],
		wen = [],
		tur = [],
		fri = [],
		sat = [],
		sun = [];
	data.forEach(time=>{
		if (time.search(`星期一`) != -1) {
			mon.push(time.substr(3,2));
		} else if (time.search(`星期二`) != -1) {
			tue.push(time.substr(3,2));
		} else if (time.search(`星期三`) != -1) {
			wen.push(time.substr(3,2));
		} else if (time.search(`星期四`) != -1) {
			tur.push(time.substr(3,2));
		} else if (time.search(`星期五`) != -1) {
			fri.push(time.substr(3,2));
		} else if (time.search(`星期六`) != -1) {
			sat.push(time.substr(3,2));
		} else if (time.search(`星期日`) != -1) {
			sun.push(time.substr(3,2));
		}
	})
	return {
		mon: mon,
		tue: tue,
		wen: wen,
		tur: tur,
		fri: fri,
		sat: sat,
		sun: sun
	}
}




// AJAX 物件
let xhr = new XMLHttpRequest();
//1
// 準備資料
// GET POST OPTION
xhr.open(`GET`, `https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json`, true);
//2
// 送出
xhr.send();
//3
let data;

// 準備狀態碼 readystate 1234
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
            //將資料字串轉物件
            window.__g_data = JSON.parse(xhr.responseText).features;
            //console.log(__g_data);
            sortData();
            //console.log(__g_data);

                   
        } else {
            console.log(`NOT FOUND`);
        }
    }

}

//畫面重置size ,觸發事件(rem)
window.onresize = function () {
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 32 + 'px';
}
//手動調用
window.onresize();

//-----------------------//

//拿input.value (關鍵字)
//聲明

let input = document.querySelector('.js_loSerch');
let search = document.querySelector('.fa-search');
let list = document.querySelector('.sm-shopItems');
//動態集合
let oStar = document.getElementsByClassName(`star`);

//input.value丟入此陣列
let correct;
//連動用的陣列
let latLng = [];
//星星:被選取的陣列
let selectData = [];
//防呆用
input.value = '';

//塞入li的item
function inputData(correct) {  
    //如果input沒有輸入東西(防呆!)
    if(input.value ===''){
        return false;
    }
 
    let str ='';
    // console.log(correct);
    for(let i = 0; i<correct.length ; i++){
    //塞資料      
       str += `
           <li class="item" mapId=${correct[i].geometry.coordinates}>
               <div class="itemText-area">
                   <div class="itemText">
                       <h4 class="shopName">${correct[i].properties.name}</h4>  
                       <p class="address">${correct[i].properties.address}</p>
                       <p class="phone">${correct[i].properties.phone}</p>
                       <p class="time js_openTime">今日營業時間：營業中</p>
                   </div>
                   <div class="iconArea">
                       <a href="javascript:;" class="star" dataID=${correct[i].properties.id}></a>
                       <a href="https://www.google.com.tw/maps/place/${correct[i].properties.address}" target= "_blank" class="range"></a>
                   </div>
               </div>
               <div class="item-mask js_mask">
                   <div class="mask adult_mask">
                       <p>成人</p>
                       <span>${correct[i].properties.mask_adult}</span>
                   </div>
                   <div class="mask child_mask">
                       <p>兒童</p>
                       <span>${correct[i].properties.mask_child}</span>
                   </div>
               </div>
               <div class="update">${correct[i].properties.updated}</div>
           </li>  `
       ;
   }
   //塞完資料
   list.innerHTML = str ;
   //改樣式
   maskStyle();
     
   //拿li: 點擊li後找出地圖上的位置
   let oItem =document.querySelectorAll('.item');
   oItem.forEach(li=>{
       li.addEventListener('click',function(e){
           //console.log(this, correct);
        //    console.log(li.getAttribute(`mapId`));
           let arr = li.getAttribute(`mapId`).split(`,`);
           let lng = arr[1];
           let lat= arr[0];
        //    console.log(arr);
           map.setView([lng,lat],18);
            for (let i = 0; i < correct.length; i++) {
                let [lat2, lng2] = correct[i].geometry.coordinates;
                if (lng2 == lng && lat2 == lat) {
                    correct[i].icon.openPopup();
                    break
                }
            }
       },false)
   })

   //點擊改星星樣式
   //Array.from:偽陣列轉陣列
   Array.from(oStar).forEach(v=>{
       v.addEventListener('click', function () {
            if (v.id=='') {
                v.id='selected';
                               //取得自定義的屬性值(藥局id)
                selectData.push(v.getAttribute(`dataID`));
            } else {
                v.id='';
                selectData.splice(selectData.indexOf(v.getAttribute(`dataID`)),1);
            }                    
        },false)
   })

}

//按下放大鏡後篩出li
function searchData(){
    let data = __g_data;
    let item = input.value;
                                                              //!= -1代表有
    correct = data.filter(v=>v.properties.address.search(item) != -1);
    // console.log(correct);

    //low出陣列
    inputData(correct);
    
    //口罩btn亮色
    let btn = document.querySelectorAll('.js_btn');
    //第一個口罩btn加上css樣式
    btn[0].id = `btnFocus`;
    

     //口罩btn監聽事件
     for (let i = 0; i < btn.length; i++) {
         btn[i].addEventListener('click',function () {
             //沒被點擊時樣式是空的
             for(let i = 0; i < btn.length; i++) {
                btn[i].id = ``;
            }
             btn[i].id = 'btnFocus';
             // console.log(i);

             //篩選口罩btn的li條件
             if (i == 1) {
                let haveMask = correct.filter(v=>v.properties.mask_adult > 0);
                inputData(haveMask);
            }
             else if (i == 2) {
                let haveMask = correct.filter(v=>v.properties.mask_child > 0);
                inputData(haveMask);
             }
             else if (i == 0) {
                inputData(correct);
            }

        },false)
        
        //要清空第一個,才能再塞入新的資料
        latLng = [];
        //地圖連動的i
        latLng.push(correct[i]);       
    }

    //找出search過後的第一個經緯度的位置
    // console.log(latLng);
    if(latLng.length != null){
        let lng = latLng[0].geometry.coordinates[0]; //經度
        let lat = latLng[0].geometry.coordinates[1]; //緯度
        //console.log(lng, lat)
        map.setView([lat,lng],20);
    }
}


//判斷口罩樣式
function maskStyle() {
    let mask_adult = document.querySelectorAll(`.adult_mask`);
    let mask_child =  document.querySelectorAll(`.child_mask`);
    
    // 判斷成人口罩
    for (let i =0; i<mask_adult.length;i++){
      let adultNode = mask_adult[i].innerText.slice(2) //slice() 方法提取某个字符串的一部分，并返回一个新的字符串，且不会改动原字符串
      if(adultNode > 0){
        mask_adult[i].className = 'mask adult_mask';
      }else if(adultNode == 0){  
      mask_adult[i].className = 'mask adult_mask_zero';
      }
    }
    // 判斷小孩口罩
    for (let i =0; i<mask_child.length;i++){
      let childNode = mask_child[i].innerText.slice(2) 
      if(childNode > 0){
        mask_child[i].className = 'mask child_mask';
      }else if(childNode == 0){
      mask_child[i].className = 'mask child_mask_zero';
      }
    }
        
}


//控制日期
function showDate(){
    let today = new Date();
    let day_list = ['日', '一', '二', '三', '四', '五', '六']; 
    let day = today.getDay();
    let lastId = document.querySelector('.js_lastId');
    document.querySelector('.js_todayDate').innerHTML= today.getFullYear()+"年"+ (today.getMonth()+1) + "月" + today.getDate() + "日";
    document.querySelector('.js_today').innerHTML= "星期"+ day_list[day];    

    //二.四.六.日:偶數 一.三.五.日:基數 
    switch(day_list[day]){
        case '一':
        case '三':
        case '五':    
        lastId.innerHTML="1.3.5.7.9";
            break;
        case '二': 
        case '四':
        case '六':
        lastId.innerHTML="2.4.6.8.0";
            break;
        case '日':
        lastId.innerHTML="不限號碼"; 
            break;
        default:
            console.log('none');
            break;          
    }
    
}

 //smBtn改樣式
 let smBtn = document.querySelectorAll('.js_smBtn');
 smBtn.forEach(v=>{
     v.addEventListener(`click`, function () {
         smBtn.forEach(v2=>{
             v2.id = '';
         })
         v.id = 'btnFocus';
     })
 })


//點擊存量最多後,資料傳入
let oJs_stock = document.querySelector(`.js_stock`);
oJs_stock.addEventListener('click',function(){
    // console.log(correct);
    correct.sort((a,b)=>{
        // console.log(a.properties.name, b.properties.name)
        let total1 = a.properties.mask_adult+a.properties.mask_child;
        let total2 = b.properties.mask_adult+b.properties.mask_child;
        return total2-total1;
    })
    inputData(correct);
},false)

//點擊已標星號後,資料傳入
function allStars(){
    let oJs_star = document.querySelector(`.js_star`);
    oJs_star.addEventListener('click',function () {
    // console.log(selectData);

    //找到真正數據的資料後存入此陣列
    let newItem = [];
   
    selectData.forEach(selectID=>{
        for (let i = 0; i < data.length; i++) {
            if (selectID == data[i].properties.id) {
                newItem.push(data[i]);
                continue
            }
        }
    })
    // console.log(newItem);
    //重新渲染li並加上樣式
    inputData(newItem)
    // console.log(oStar);

    Array.from(oStar).forEach(v=>{
        v.id = 'selected';
    })
    
    },false) 
}

//地圖
let map;
function mapLoding(){  
    map = L.map('map', {
        center: [22.639602, 120.302546], //預設中心點的經緯度[高雄火車站]
        zoom: 16 //地圖縮放等級
    });
    //console.log(map);
    
    //用openstreetmap的圖資
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
    }).addTo(map);

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

    //載入藥局資料的地標軸
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
                        <p class="map_time js_openTime">營業時間：營業中</p>
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
            .on(`popupopen`, function () {
                popupStart();
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
        

         //點擊側邊欄的星星後地圖上也要變色
        function popupStart() {
            
            let oMapStar = document.querySelector(`.map_star`); 
            let clickID = oMapStar.getAttribute(`dataID`); 
            console.log(selectData, clickID)       
            for (let i = 0; i<selectData.length; i++) {   
                //如果ID與點擊的ID 一樣就套上map_selscted
                if (selectData[i] == clickID) {
                    oMapStar.id = `map_selscted`;
                    
                    break
                }
            }
        }   

        /*
           //每個圖層
        map.eachLayer(ev=>{    
                  //彈出事件
            ev.on(`popupopen`, popupStart)
        })
               //只要移動結束時
        map.on(`moveend`, (ev)=>{
            map.eachLayer(ev=>{
                ev.on(`popupopen`, popupStart)
            })
        })  
        */  
        
            
}



//載入遠端資料後做的事情
xhr.onload = function () {
    // document.querySelector('#loading').classList.add('loadingHide'); 
    //口罩btn被點擊後
    search.onclick = searchData;
    input.onkeydown = function (e) {
        if (e.keyCode == 13) {
            searchData();
        }

    }
    //控制日期
    showDate();
    setInterval(showDate(),1000); //每一秒鐘循環執行
    //已標星號
    allStars();
    console.log(__g_data)
    //載入地圖
    mapLoding();
}




