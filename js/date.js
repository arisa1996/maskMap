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