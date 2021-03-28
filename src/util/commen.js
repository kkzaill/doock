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
  throttle
}  