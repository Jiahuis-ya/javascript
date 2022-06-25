;(function(data) {
  let idx = 0,
      $list = $('.container .list'),
      colorArr = ['#d94447', '#ea7f50', '#f5aa4b'],
      total = (data.length / 5).toFixed();
  
  function init() {
    bindEvent();
    renderData(data);
  }
  
  function bindEvent() {
    // $('.container .list .tpl').css('display', 'flex');
    $('.container .hd .change').on('click', onChange)
  }

  function renderData(data) {
    let len = (data.length - idx * 5) >= 5 ? 5 : (data.length - idx * 5);

    $('.container .list .data-item').remove();
    $list.hide();
    
    for(let i = 0; i < len; i++) {
      let $cloneDOM = $list.find('.tpl').clone().removeClass('tpl').addClass('data-item'),
          index = (i + idx * 5 + 1);
          
      let { title = '', number= '', prevNumber = '' } = data[index - 1] || {},
          iconClass = number > prevNumber ? 'up' : 'low';

      $cloneDOM.find('.left .serial_num').eq(0).css('background', idx == 0 && colorArr[i])
        .text(index)
        .next()
        .text(title)

      $cloneDOM.find('.right .number')
        .text(`${number}万`)
        .next()
        .addClass(iconClass)

      $cloneDOM.appendTo($list)
    }

    $list.fadeIn()
  }

  function onChange () {
    idx = ++idx % total;
    // if(idx >= 2) {
    //   idx = 0;
    // } else {
    //   ++idx;
      
    // }
    renderData(data)
  }

  init();


})(srcData);