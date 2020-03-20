function loader () {
    document.querySelector('body').style.visibility = 'hidden';
    document.querySelector('body').style.overflow = 'hidden';
    document.querySelector('#js_loader').style.visibility = 'visible';
    document.querySelector('.js_sideMenu').style.display = 'none';
}
function loaderon () {
    document.querySelector('body').style.visibility = 'visible';
    document.querySelector('body').style.overflow = 'auto';
    document.querySelector('#js_loader').style.visibility = 'hidden';
    document.querySelector('.js_sideMenu').style.display = 'block';
}

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

