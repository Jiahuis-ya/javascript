/**
 * 图片懒加载
 * 1. 默认src放的是占位图片，
 * 2. 渲染，将url存进data-src自定义属性里面
 * 3. window.onload后将data-src替换到src中。再删除data-src
 */

;(function(doc) {
  let container = doc.getElementsByClassName('container')[0];
  let data = JSON.parse(doc.getElementById('J_data').innerHTML);
  let templateTpl = document.getElementById('template');
  let oImgs = doc.getElementsByClassName('list-img');
  let oP = doc.getElementsByClassName('text');
  

  const init = () => {
    container.innerHTML = renderList(data);
    bindEvent()
    setTimeout(function() {
      window.scrollTo(0, 0);
    }, 150)
  }

  function bindEvent() {
    window.onload = window.onscroll = throttle(imgLazyLoad(oImgs), 150)
  }

  function renderList (data) {
    let list = '';
    data.map((elem) => {
      const template = createTemplate(elem)
      list += template;
    })
  
    return list
  }

  function createTemplate(elem) {
    const reg_template = /{{(.*?)}}/g;
  
    return templateTpl.innerHTML.replace(reg_template, (node, key) => {
      // return item[key.trim()]
      return {
        img: elem.img,
        name: elem.name
      }[key.trim()]
    })
  }

  

  init();
})(document);

function imgLazyLoad(images) {
  let imgLen = images.length,
      n = 0;

  return function() {
    let imgItem;

    for(var i = n; i < imgLen; i++) {
      imgItem = images[i];

      imgItem.onclick= function() {
        this.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
      }

      // 在可视区域内
      if(isElementAppearInView(imgItem)) {
        imgItem.src = imgItem.getAttribute('data-src');
        imgItem.removeAttribute('data-src');
        n++;
      }
    }
  }
}


function throttle(fn, delay){
  var t = null,
      begin = new Date().getTime();

  return function(){
    var _self = this,
        args = arguments,
        cur = new Date().getTime;

    clearTimeout(t);

    if(cur - begin >= delay){
      fn.apply(_self, args);
      begin = cur;
    }else{
      t = setTimeout(function(){
        fn.apply(_self, args);
      }, delay);
    }
  }
}


// 是否在可视区域1
function isElementAppearInView(elem) {
  let clientHeight = document.documentElement.clientHeight,
      elemTopFromView = elem.getBoundingClientRect().top;
      
  return elemTopFromView < clientHeight

}
