// fnResize()
// window.addEventListener('resize', throttle(fnResize, 500));
// function fnResize() {
//   var deviceWidth = document.documentElement.clientWidth || window.innerWidth
//   if (deviceWidth >= 750) {
//     deviceWidth = 750
//   }
//   if (deviceWidth <= 320) {
//     deviceWidth = 320
//   }
//   if (deviceWidth < 750){
//     document.documentElement.style.fontSize = (deviceWidth / 3.75) + 'px'
//   }else{
//     document.documentElement.style.fontSize = '14px'
//   }
// }
// 防抖
function debounce(fun,delay){
  let timer = null;
  return function () {
    clearTimeout(timer); 
    timer = setTimeout(() => { 
      fun.apply(this, arguments);
    }, delay);
  }
}
// 节流
function throttle(fun,delay){
  let last,timer;
  return function(){
    const now = +new Date()
    if(last && now < last + delay){
      clearTimeout(timer)
      timer = setTimeout(() => { 
        fun.apply(this, arguments);
      }, delay);
    }else{
      last = now
      fun.apply(this, arguments);
    }
  }
}

export {
  throttle,
  debounce,
} 
