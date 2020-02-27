let input = document.querySelector('.js_loSerch');
let search = document.querySelector('.fa-search');


search.addEventListener(`click`, function () {
    searchFn();
}, false)

input.addEventListener(`keyup`, function (ev) {
    if (ev.keyCode == 13) {
        searchFn();
    }
}, false);



function searchFn() {
    if (window.__g_data) {
        if (input.value !== '') {
            let correct = filterData();
            renderData(correct);


            bigBtn(correct);
            smallBtn(correct);
            
            
            input.value = '';
        }
    }
}



function filterData() {
    let data = __g_data;
    let item = input.value;
    let correct = data.filter(v=>v.properties.address.search(item) != -1);
    return correct;
}

function renderData(correct) {
    let data = __g_data;
    let list = document.querySelector('.sm-shopItems');
    let arr = [];
    list.innerHTML = '';
    for (let i = 0; i< correct.length; i++) {
        
        let oLi = document.createElement(`li`);
        oLi.innerHTML = `
            <div class="itemText-area">
                <div class="itemText">
                    <h4 class="shopName">${correct[i].properties.name}</h4>  
                    <p class="address">${correct[i].properties.address}</p>
                    <p class="phone">${correct[i].properties.phone}</p>
                    <p class="time js_openTime">今日營業時間：${correct[i].properties.todayOpen}</p>
                </div>
                <div class="iconArea">
                    <a href="javascript:;" class="star liStar" dataID=${correct[i].properties.id}></a>
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
        `;
        oLi.className = `item`;
        oLi.setAttribute(`mapId`, correct[i].geometry.coordinates);
        correct[i].li = oLi
        list.appendChild(oLi);
    }
    
    //console.log(correct);

   maskStyle();


   clickLi(correct);
   clickStar(correct);
   
}


//判斷口罩樣式
function maskStyle() {
    let mask_adult = document.querySelectorAll(`.adult_mask`);
    let mask_child =  document.querySelectorAll(`.child_mask`);
    // console.log(mask_adult, mask_child);
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

function clickLi(correct) {
    
    //拿li: 點擊li後找出地圖上的位置
   let oItem =document.querySelectorAll('.item');
   // console.log(oItem);
   oItem.forEach(li=>{
       li.addEventListener('click',function(e){

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
}


function clickStar(correct){
    correct.forEach(d=>{
        if (d.selectData) {
            let star = d.li.children[0].children[1].children[0];
            star.id = 'selected';
        }
    });


    let oStar = document.getElementsByClassName(`liStar`);
    Array.from(oStar).forEach(v=>{

        v.addEventListener('click', function (ev) {

            if (this.id == '') {
                this.id = 'selected';
                let dataId = this.getAttribute(`dataid`);
                recordSelec(correct, dataId, true);

            } else {

                this.id = '';
                let dataId = this.getAttribute(`dataid`);
                recordSelec(correct, dataId, false);
            }
            ev.cancelBubble = true;
        })
    })
}



function recordSelec(correct, dataId, boolean) {
    for (let i = 0; i < correct.length; i++) {

        if (correct[i].properties.id == dataId) {
            correct[i].selectData = boolean;
            
            break
        }
    }
}


//點擊已標星號後,資料傳入
function allStars(){
    let data = __g_data;
    let oJs_star = document.querySelector(`.js_star`);
    let oStar = document.getElementsByClassName(`liStar`);
    //console.log(data);
    oJs_star.addEventListener('click',function () {


        let newItem = [];
        data.forEach(d=>{
            if (d.selectData) {
                newItem.push(d);
            }
        })
        
        renderData(newItem)
    },false) 
}


function bigBtn(correct) {
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
                renderData(haveMask);
            }
            else if (i == 2) {
                let haveMask = correct.filter(v=>v.properties.mask_child > 0);
                renderData(haveMask);
            }
            else if (i == 0) {
                renderData(correct);
            }

        },false)
        
    }
}


function smallBtn(correct) {

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
    stock(correct);
    allStars();
}


function stock(correct) {
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
        renderData(correct);
    },false)
}







