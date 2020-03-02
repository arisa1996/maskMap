function ajax(){
    // AJAX 物件
    let xhr = new XMLHttpRequest();
    // 準備資料
    // GET POST OPTION
    xhr.open(`GET`, `https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json`, true);
    // 送出
    xhr.send();
    // 準備狀態碼 readystate 1234
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                //將資料字串轉物件
                window.__g_data = JSON.parse(xhr.responseText).features;
                //console.log(__g_data);
                sortData();
                //console.log(__g_data);
                renderIcon();
            } else {
                console.log(`NOT FOUND`);
            }
        }
    
    }
}


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



