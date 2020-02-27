//畫面重置size ,觸發事件(rem)
window.onresize = function () {
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 32 + 'px';
}

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

