;(function() {
  var filterList = document.getElementsByClassName('J_filterList')[0],
      filterItems = filterList.getElementsByClassName('J_filterItem'),
      coursesList = document.getElementsByClassName('courses-list')[0],
      itemTpl = document.getElementById('J_courseItemTpl').innerHTML,
      field = 7,
      cache = {};

  var init = function() {
    bindEvent();
    getDatas().then(res => {
      formatData(res);
      render(cache, field);
    })
  }
  function bindEvent() {
    filterList.addEventListener('click', tabClick, false);
  }

  function render(cache, field) {
    // let list = cache[field],
    //     content = '';
        
    // list.forEach(item => {
    //   content += 
    //       ` <li class="course-item">
    //           <div class="course-tip">
    //             <div class="content-block">${item.agency}</div>
    //             <div class="opacity-block"></div>
    //           </div>
    //           <a href="" class="course-link">
    //             <img src="${item.img_url}" alt="">
    //           </a>
    //           <h4 class="course-title">
    //             <a href="">${item.course_name}</a>
    //           </h4>
    //           <div class="course-info">
    //             <span class="info-free">免费</span>
    //             <span class="info-users">2750人 最近报名</span>
    //           </div>
    //         </li>
    //       `
    // })

    // coursesList.innerHTML = content;
    var list = '',
        fieldData = cache[field];
    
        fieldData.forEach(course => {
          list += itemTpl.replace(/{{(.*?)}}/gim, function(node, key) {
            return {
              link: course.link,
              img_url: course.img_url,
              course_name: course.course_name,
              is_vip: course.is_vip == 1 ? '' : 'free',
              cell_name: course.is_vip == 1 ? + course.price + '.00' : '免费',
              agency: course.agency
            }[key];
          });
        });

        coursesList.innerHTML = list;
  }

  function tabClick(e) {
    var e = e || window.event,
        tar = e.target || e.srcElement,
        className = tar.className;

    if(className === 'filter-lk') {
      var oParent = tar.parentNode,
          itemLen = filterItems.length,
          item;
      
          field = oParent.getAttribute('data-field');
          
          for(var i = 0; i < itemLen; i++) {
            item = filterItems[i];
            item.className = 'J_filterItem filter-item'
          }


          oParent.className += ' cur'

          // render();
          render(cache, field);
    }

        
  }

 

  async function getDatas() {
    // console.log(foodDatas)
    return foodDatas
  }

  function formatData(data) {
    const { course_data, course_field } = data;
    cache = sortData(course_field, course_data)('field', 'multi')

  }

  function sortData(fields, data){
    let cache = {};

    return function(mapping_field, sortType) {
      if(sortType !== 'single' && sortType !== 'multi') {
        console.log(new Error('Invalid sort type, Only "single" and "multi" is valid value.'))
        return;
      }

      fields.forEach(field => {
        var _id = field.id;

        cache[_id] = [];

        data.forEach(elem => {
          var mapping_val = elem[mapping_field];

          if(sortType === 'single') {
            if(mapping_val == _id) {
              cache[_id].push(elem);
            }
          } else if(sortType === 'multi') {
              var _arr = mapping_val.split(',');
              
              _arr.forEach(val => {
                if(val == _id) {
                    cache[_id].push(elem);
                }
              });
          }
          
        });
      });

      return cache;
    }

    
  }
  

  init();
})();