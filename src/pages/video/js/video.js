const MyVideo = (function(doc) {
  class MyVideo {
    constructor(dom, options) {
      const { src, autoplay, preload, loop, volume, poster } = options

      this.src = src
      this.autoplay = autoplay
      this.preload = preload
      this.loop = loop
      this.volume = volume
      this.poster = poster

      // defaultData
      this.isFullScreen = false
      this.canPlayTimer = null;
      this.muted = false
      this.isVolumeMoving = false // 正在调整音量
      this.duration = 0 // 总时长
      this.current = 0 // 当前播放时间
      this.currentTimer = null;
      this.pt = null; // 缓冲的标识

      // dom
      this.videoBox = $(dom)
      this.OVideoBox = $(dom).get(0)
      this.vid = $(dom).find('.video-tag')
      this.OVid = $(dom).find('.video-tag').get(0)
      
      this.oPlayBtn = $(dom).find('.play-img')
      this.headerArea = $(dom).find('.vid-hd')
      // 倍速
      this.oRateArea = $(dom).find('.playrate-area')
      this.oRateBtn = $(dom).find('.playrate')
      this.oRateList = $(dom).find('.playrate-list')
      // 全屏
      this.oFullscreenBtn = $(dom).find('.fullscreen-img')
      // 音量
      this.oVolumeArea = $(dom).find('.volume-area')
      this.oVolumeBtn = $(dom).find('.volume-img')
      this.oVolumeBar = $(dom).find('.volume-bar')
      this.oVolumeGreyBar = $(dom).find('.slide-bar')
      this.oVolumeActiveBar = $(dom).find('.slide-bar .volume-slide')
      this.oVolumeNum = $(dom).find('.volume-area .volume-num')
      this.oVolumeSlide = $(dom).find('.volume-slide')
      this.oVolumeRound = $(dom).find('.volume-slide .round')
      // 时间
      this.oDuration = $(dom).find('.time-area .duration')
      this.oCurrent = $(dom).find('.time-area .current-time')
      // 播放进度条
      this.oProgressBar = $(dom).find('.progress-bar')
      this.oPlayProgress = $(dom).find('.progress-bar .play-progress')
      this.oPlayRound = this.oPlayProgress.find('.round')
      this.oPreloadProgress = $(dom).find('.progress-bar .preload-progress')

      this.init();
    }

    init() {
      this.setOptions()
      this.bindEvent()
      this.autoplay && this.addVideoTip(this.OVideoBox, 'loading')
      
    }

    bindEvent() {
      const _this = this
      // 大盒子
      this.videoBox
        .attr('unselectable', 'on') // 禁用文本选择
        .css('user-select', 'none')
        // .on('selectstart', false); // 禁止可以选择文字
        .on({
          'selectstart': () => false, // 禁止可以选择文字
          'mouseenter': this.videoBoxEnter.bind(this),
          'mouseleave': this.videoBoxLeave.bind(this) 
        });

        this.OVid.addEventListener('canplay', this._canplay.bind(this), false)
        this.OVid.addEventListener('ended', this._ended.bind(this), false)
        this.OVid.addEventListener('playing', this._playing.bind(this), false)
        this.OVid.addEventListener('waiting', this._waiting.bind(this), false)
        this.OVid.addEventListener('error', this._error.bind(this), false)
        this.OVid.addEventListener('loadstart', this._loadstart.bind(this), false)
      
      // 播放区域单双击
      this.vid.click(this.handlePlay.bind(this))
      this.vid.dblclick(this.setFullScreen.bind(this))

      // 播放
      this.oPlayBtn.click(this.playBtnClick.bind(this, 'clickWithBtn'))

      $(document).keyup(function(e) {
        if(e.keyCode == 32) {
          _this.playBtnClick()
        }
      })
      // 音量
      this.oVolumeArea.on({
        'mouseenter': this.volumeAreaEnter.bind(this),
        'mouseleave': this.volumeAreaLeave.bind(this)
      })
      this.oVolumeBtn.click(this.volumeBtnClick.bind(this))
      // 音量拖动设置
      this.oVolumeRound.on({
        'mousedown': this.volumeRoundDown.bind(this, this.oVolumeRound)
      })

      // 倍速start========================
      this.oRateArea.hover(this.oRateBtnHover.bind(this))
      this.oRateArea.find('.item').hover(this.oRateItemHover)

      this.oRateList.on('click', '.item', function(e) {
        //  _this.oRateItemClick.call(this)
        //  _this.setPlayRate(this)
         
        const ids = $(this).index(this.oRateList) // item在list中的索引
         _this.oRateItemClick2.call(_this, ids)
      })

      // 倍速end========================
      // 全屏
      this.oFullscreenBtn.click(this.setFullScreen.bind(this))

      // 点击进度条
      this.oProgressBar.click(this.oProgressBarClick.bind(this))
      // 播放视频拖动
      this.oPlayRound.on({
        'mousedown': this.onPlayRoundClick.bind(this)
      })
    }

    oProgressBarClick(e) {
      this.setPlayProgress(e.pageX)
    }

    // 播放视频拖动
    onPlayRoundClick(e) {
      let 
          // startX = e.pageX,
          // disX = 0,
          // totalWidth = this.oProgressBar.outerWidth(), // 总宽度
          // currentWidth = this.oPlayProgress.outerWidth(), // 当前播放的宽度
          // setWidth = 0, // 最后要设置的宽度
          _mousemove = _move.bind(this),
          _mouseup = _up.bind(this);

          
      $(doc).on({
        'mousemove': _mousemove,
        'mouseup': _mouseup
      })
     

      function _move(e) {
        this.setPlayProgress(e.pageX)
      }

      function _up() {
        $(doc).off({
          'mousemove': _mousemove,
          'mouseup': _mouseup
        })
      }
    }

    setPlayProgress(pageX) {
      let totalWidth = this.oProgressBar.outerWidth(), // 总宽度
          setWidth = pageX - this.videoBox.offset().left, // 需要设置的宽度
          ratio = 0,
          duration = this.OVid.duration;
          
      // 判断边界情况
      // if(setWidth >= totalWidth) {
      //   setWidth = totalWidth
      // } else if(setWidth <= 0) {
      //   setWidth = 0
      // }
      // this.oPlayProgress.outerWidth(setWidth)
      // // 设置播放时间
      // this.OVid.currentTime = setWidth / totalWidth * this.duration
      // this.setTime()
      // this.videoPlay.call(this, true)


      if(setWidth >= totalWidth) {
        ratio = 1
      } else if(setWidth <= 0) {
        ratio = 0
      } else {
        ratio = setWidth / totalWidth
      }

     
        
        this.OVid.currentTime = ratio * duration;
        this.setTime()
        this.oPlayProgress.outerWidth(`${ratio * 100}%`)
        this.videoPlay.call(this, true)
    }

    videoBoxEnter() {
      this.headerArea.fadeToggle(200)
    }

    videoBoxLeave() {
      this.headerArea.fadeToggle(350)
    }

    // 音量 start========================================================================

    volumeAreaEnter() {
      // this.volumeAreaHover()
      this.oVolumeNum.fadeIn(300)
      this.oVolumeBar.fadeIn(300)
    }

    volumeAreaLeave() {
      // 正在调整音量
      if(this.isVolumeMoving) {
        return
      }
      // this.volumeAreaHover()
      this.oVolumeNum.fadeOut(300)
      this.oVolumeBar.fadeOut(300)
    }

    volumeAreaHover() {
      this.oVolumeNum.fadeToggle(300)
      this.oVolumeBar.fadeToggle(300)
      // this.oVolumeNum.fadeIn(300)
      // this.oVolumeBar.fadeIn(300)
     
    }

    /**
     * @description: 拖拽函数  // 2次pageY相减 + 橙色当前高度
     * @param {*} _this current
     * @param {*} e event
     * @return {*}
     */
    volumeRoundDown(_this, e) {
      var dy = e.pageY, // 按下鼠标记录的y值
          my = 0, // 移动时的y值
          disY = 0, // 移动时动态计算2个y之间的差值
          sHeight = 0, // 动态滚动后的高度
          slideHeight = this.oVolumeActiveBar.outerHeight(), // 橙色条高度
          volumeBarHeight = this.oVolumeGreyBar.outerHeight(), // 灰色条高度
          // left = this.oVolumeRound.offset().left,
          _mousemove = _move.bind(this),
          _mouseup = _up.bind(this);

      $(doc).on('mousemove', _mousemove)
      $(doc).on('mouseup', _mouseup)

      function _move(e) {
        this.isVolumeMoving = true // 开始调整音量
        my = e.pageY// 相差距离
        disY = dy - my // 圆点移动的距离
        sHeight = slideHeight + disY

        if(sHeight < volumeBarHeight && sHeight > 0) {
          this.oVolumeActiveBar.outerHeight(sHeight)
          this.setMuted(false)

        } else if(sHeight >= volumeBarHeight){
          this.oVolumeActiveBar.outerHeight(volumeBarHeight)
          sHeight = volumeBarHeight
          this.setMuted(false)

        } else if(sHeight <= 0) {
          this.oVolumeActiveBar.outerHeight(0)
          sHeight = 0
          this.setMuted(true)
          
        }
          this.volume = (sHeight / volumeBarHeight * 100).toFixed(0);
          this.setVolume(this.volume)
          
          this.volume = Number(this.volume) == 0 ? 50 : this.volume // 下一次点击喇叭，如果是静音的话，就将声音设置为50%
        // 设置圆点位置  不需要特意设置原点位置，只需要设置音量条高度就可以，原点是绝对定位的
        // this.oVolumeRound.offset({
        //   left,
        //   top: my,
        // })

      }

      function _up() {
        this.isVolumeMoving = false // 调整音量完毕
        const mouseInArea =
          checkIn(this.oVolumeArea[0]) || 
          checkIn(this.oVolumeBar[0]) || 
          checkIn(this.oVolumeNum[0])
        // 不在音量区域，关闭盒子  
        !mouseInArea && this.volumeAreaLeave.call(this) // 立即执行
        // 解除绑定
        $(doc).off('mousemove', _mousemove);
        $(doc).off('mouseup', _mouseup);
      }

      return false // 解决任意拖动的时候出现框选文本的情况
      
      
    }

    /**
     * @description: 点击音量键
     * @return {*}
     */
    volumeBtnClick() {
      // 点击: 静音 -> 非静音
      if(this.OVid.muted) {
        this.setMuted(false)
        this.setVolume(50)
      } else {
      // 点击: 非静音 -> 静音
        this.setMuted(true)
        this.setVolume(0)
      }
      
    }

    /**
     * @description: 设置静音 
     * @param {*} status true 静音 false 取消静音
     * @return {*}
     */
    setMuted(status) {
      this.muted = status
      this.OVid.muted = status
      this.oVolumeBtn.attr('src', `img/${status ? 'volume-off' : 'volume'}.png`)
    }

    /**
     * @description: 设置音量
     * @param {*} volume 0~100  number 
     * @return {*}
     */
    setVolume(volume) {
      this.OVid.volume = volume / 100
      this.oVolumeActiveBar.height(`${volume}%`)
      this.oVolumeNum.text(volume) // 修改数字
      
    }

    // 音量 start========================================================================

    // 倍速start========================
    oRateBtnHover() {
      this.oRateList.fadeToggle(300)
      this.oRateBtn.toggleClass('active')
    }

    oRateItemHover() {
      $(this).find('.rate-btn').toggleClass('grey')
    }

    /**
     * @description: 选择倍速子项
     * @return {*}
     */
    oRateItemClick() {
      $(this).parent().find('.item .rate-btn').removeClass('current')
      $(this).find('.rate-btn').addClass('current')
    }

    /**
     * @description: 设置倍速
     * @param {*} item
     * @return {*}
     */
    setPlayRate (item) {
      const rate = $(item).find('.rate-btn').attr('data-rate')
      this.OVid.playbackRate = rate;
  	}

    oRateItemClick2(idx) {
      this.oRateList.find('.item .rate-btn').removeClass('current')
      this.oRateList.find('.item .rate-btn').eq(idx).addClass('current')
      const rate = this.oRateList.find('.item .rate-btn').eq(idx).attr('data-rate')
      this.setPlayRate2(rate)
    }

    setPlayRate2 (rate) {
      this.OVid.playbackRate = rate;
  	}
    // 倍速end========================

    /**
     * @description: 全屏播放
     * @return {*}
     */    
    setFullScreen() {
      clearTimeout(this.canPlayTimer)
      this.canPlayTimer = null;

      if (!this.isFullScreen) {
        _setFullscreen(this.OVideoBox)

      	this.isFullScreen = true;
        $(this.oFullscreenBtn).attr('src', 'img/fullscreen-exit.png')
      } else {
      	_exitFullscreen(doc)

      	this.isFullScreen = false;
        $(this.oFullscreenBtn).attr('src', 'img/fullscreen.png')
      }
  	}

    /**
     * @description: 视频播放前设置防抖
     * @return {*}
     */
    handlePlay() {
      const status = !!this.OVid.paused
      clearTimeout(this.canPlayTimer)

      this.setTime()
      this.canPlayTimer = setTimeout(() => {
        this.videoPlay(status)
        this.canPlayTimer = null;
      }, 300);
     
      
    }

    playBtnClick() {
      const status = !!this.OVid.paused
      this.setTime()
      this.videoPlay(status)
    }

    /**
     * @description: 视频播放控制
     * @params status 是否需要播放
     * @return {*}
     */
    videoPlay(status) {
      clearInterval(this.currentTimer)
      this.currentTimer = null;
      this.setTime()

      if(status) {
        this.OVid.play()
        this.setPlayBtnImg(false)
        
      } else {
        this.OVid.pause()
        this.setPlayBtnImg(true)
        
      }
    }

    setTime() {
      this.oCurrent.text(timeFormat(this.OVid.currentTime))
    }

    // video canplay 事件
    _canplay() {
      this.setTime()
      this.removeVideoTip(this.OVideoBox);

      this.duration = this.OVid.duration
      const time = timeFormat(this.duration),
            totalWidth = this.oProgressBar.outerWidth();

      if (time.match(/:/g).length === 1) {
        // this.oCurrent.text('00:00') // 同步显示
      }
      this.oDuration.text(timeFormat(this.OVid.duration))
      
      this.pt = setInterval(() => {
        try {
          let preWidth = `${(this.OVid.buffered.end(0) / this.duration) * 100}%` //buffered.end(0)有时候会出错
          this.oPreloadProgress.outerWidth(preWidth)
        } catch (e) {
          
        }

        if(this.oPreloadProgress.outerWidth() >= totalWidth) {
          clearInterval(this.pt)
          this.pt = null;
        }
        
      }, 1000);
      

      
    }
    // video ended 事件
    _ended() {
      this.removeVideoTip(this.OVideoBox);
      this.addVideoTip(this.OVideoBox, 'ended');

      clearInterval(this.currentTimer)
      this.currentTimer = null;
      this.setTime() // 防止播放完成之后时间显示不同步
    }

    _playing() {
      this.removeVideoTip(this.OVideoBox);
      let totalWidth = this.oProgressBar.outerWidth(),
          playWidth = this.oPlayProgress.outerWidth()
      
      this.currentTimer = setInterval(() => {
        this.setTime()
        this.oPlayProgress.outerWidth(`${this.OVid.currentTime / this.OVid.duration * 100}%`)
      
        if(playWidth >= totalWidth) {
          clearInterval(this.currentTimer)
          this.currentTimer = null;
        }
      }, 1000);
    }

    _waiting() {
      this.addVideoTip(this.OVideoBox, 'loading');
    }

    _error() {
      this.removeVideoTip(this.OVideoBox);
      this.addVideoTip(this.OVideoBox, 'error');

      clearInterval(this.currentTimer)
      this.currentTimer = null;
    }

    _loadstart() {
      this.removeVideoTip(this.OVideoBox);
      this.addVideoTip(this.OVideoBox, 'loading');
    }

    /**
     * @description: 初始化参数
     * @return {*}
     */    
    setOptions() {
      const { src, autoplay, preload, loop, volume, poster } = this
      this.OVid.autoplay = autoplay
      autoplay && this.setPlayBtnImg(false)
      this.OVid.preload = preload
      this.OVid.loop = loop
      this.OVid.poster = poster
      this.OVid.src = src
      // this.setSrc(src)
      this.setVolume(volume)

      
    }

    setSrc(src) {
      this.OVid.src = src
      this.OVid.load() // 重载
      setTimeout(() => {

      }, 500);

    }

    /**
     * @description: 播放按钮图片
     * @param {*} play
     * @return {*}
     */
    setPlayBtnImg(play) {
      this.oPlayBtn.attr('src', `img/${play ? 'play' : 'pause'}.png`)
    }

    /**
     * @description: 加载提示
     * @param {*} dom
     * @param {*} type
     * @return {*}
     */    
    addVideoTip (dom, type) {
      var icon = '',
          text = '';
  
      switch (type) {
        case 'loading':
          icon = 'img/loading.gif';
          text = '加载中';
          break;
        case 'error':
          icon = 'img/error.png';
          text = '播放错误';
          break;
        case 'ended':
          icon = 'img/ended.png';
          text = '播放完成';
          break;
        default:
          break;
      }
  
      var oTip = doc.createElement('div');
      oTip.className = 'video-tip';
      oTip.innerHTML = '<img src ="' + icon + '" /><p>' + text + '</p>';
      dom.appendChild(oTip);
    }

    removeVideoTip (dom) {
      var oTip = doc.getElementsByClassName('video-tip')[0];
      oTip && dom.removeChild(oTip);
    }

  }

  /**
   * @description: 判断鼠标是否落在一个块级元素内部 https://blog.csdn.net/xiecheng1995/article/details/107089661/
   * @return {*}
   */
  function checkIn(obj) {
    var x = Number(window.event.clientX) // 鼠标相对屏幕横坐标
    var y = Number(window.event.clientY) // 鼠标相对屏幕纵坐标

    var div_x = Number(obj.getBoundingClientRect().left) // obj相对屏幕的横坐标
    var div_x_width = Number(
        obj.getBoundingClientRect().left + obj.clientWidth
    ) // obj相对屏幕的横坐标+width

    var div_y = Number(obj.getBoundingClientRect().top) // obj相对屏幕的纵坐标
    var div_y_height = Number(
        obj.getBoundingClientRect().top + obj.clientHeight
    ) // obj相对屏幕的纵坐标+height

    if (x > div_x && x < div_x_width && y > div_y && y < div_y_height) {
        return true
    } else {
        return false
    }
  }


  /**
   * @description: 格式化时间
   * @param second: 秒
   * @return {*}
   */
    function timeFormat(second) {
      var h = parseInt(second / 3600), // 秒数转小时 1小时= 3600秒
          m = parseInt(parseInt(second % 3600) / 60), // 剩余小时去转分钟 1小时=60分钟
          s = parseInt(parseInt(second % 3600) % 60),
          _h = `${h}`.padStart(2, 0),
          _m = `${m}`.padStart(2, 0),
          _s = `${s}`.padStart(2, 0);

      // if(h <= 0) {
      //   return `${_m}:${_s}`
      // }
      return `${_h}:${_m}:${_s}`

    }

    /**
     * @description: 设置全屏(惰性函数封装)
     * @return {*}
     */
    function _setFullscreen(dom) {
      if(dom.requestFullscreen) {
        _setFullscreen = function(dom) {
          dom.requestFullscreen()
        }
      } else if(dom.mozRequestFullscreen) {
          _setFullscreen = function(dom) {
            dom.mozRequestFullscreen()
          }
      } else if(dom.msRequestFullscreen) {
          _setFullscreen = function(dom) {
            dom.msRequestFullscreen()
          }
      } else if(dom.oRequestFullscreen) {
          _setFullscreen = function(dom) {
            dom.oRequestFullscreen()
          }
      } else if(dom.webkitRequestFullscreen) {
          _setFullscreen = function(dom) {
            dom.webkitRequestFullscreen()
          }
      }

      _setFullscreen(dom)
    }

    /**
     * @description: 退出全屏(惰性函数封装)
     * @return {*}
     */
    function _exitFullscreen(dom) {
      if (dom.exitFullscreen) {
        _exitFullscreen = function(dom) {
          dom.exitFullscreen();
        }
      } else if (dom.mozExitFullscreen) {
        _exitFullscreen = function(dom) {
          dom.mozExitFullscreen();
        }
      } else if (dom.msExitFullscreen) {
        _exitFullscreen = function(dom) {
          dom.msExitFullscreen();
        }
      } else if (dom.oExitFullscreen) {
        _exitFullscreen = function(dom) {
          dom.oExitFullscreen();
        }
      } else if (dom.webkitExitFullscreen) {
        _exitFullscreen = function(dom) {
          dom.webkitExitFullscreen();
        }
      }

      _exitFullscreen(dom)
    }



  return MyVideo
})(document);



// 如果300ms之内没有双击就播放