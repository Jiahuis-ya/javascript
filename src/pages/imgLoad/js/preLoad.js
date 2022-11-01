/**
 * 图片预加载
 * 
 */
let oDiv = document.getElementsByTagName('div')[0];
console.log(oDiv)
let data = [
  './imgs/picture.jpg',
  './imgs/picture.jpg',
  './imgs/picture.jpg',
  './imgs/picture.jpg',
  './imgs/picture.jpg',
  './imgs/picture.jpg'
]

data.forEach(url => {
  let oImg = new Image();
  oImg.src = url;

  oImg.onload = function() {
    oDiv.appendChild(oImg)
  }
})

