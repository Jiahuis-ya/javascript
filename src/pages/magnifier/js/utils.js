// 添加监听事件
function addEvent(el, type, fn) {
    if (el.addEventListener) {
        el.addEventListener(type, fn, false);
    } else if (el.attachEvent) {
        el.attachEvent('on' + type, function () {
            fn.call(el);
        })
    } else {
        el['on' + type] = fn;
    }
}

// 取消监听事件
function removeEvent(elem, type, fn) {
    if (elem.addEventListener) {
        elem.removeEventListener(type, fn, false);
    } else if (elem.attachEvent) {
        elem.detachEvent('on' + type, fn);
    } else {
        elem['on' + 'type'] = null;
    }
}

// 取消冒泡
function cancelBubble(e) {
    var e = e || window.event;

    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.canceBubble = true;
    }
}

// 取消阻止默认事件
function preventDefaultEvent(e) {
    var e = e || window.event;

    if (e.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
}

// 获取滚动条距离
function getScrollOffset() {
    if (window.pageXOffset) {
        return {
            left: window.pageXOffset,
            top: window.pageYOffset
        }
    } else {
        return {
            left: document.body.scrollLeft + document.documentElement.scrollLeft,
            top: document.body.scrollTop + document.documentElement.scrollTop
        }
    }
}

// 获取样式属性/DOM属性  attr要加''
function getStyles(el, attr) {
    if (window.getComputedStyle) {
        if (attr) {
            return parseInt(window.getComputedStyle(el, null)[attr]);
        } else {
            return window.getComputedStyle(el, null);
        }
    } else {
        if (attr) {
            return parseInt(el.currentStyle[attr]);
        } else {
            return el.currentStyle;
        }
    }
}

//获取pageX pageY距离
function pagePos(e){
    var sLeft = getScrollOffset().left,
        sTop = getScrollOffset().top,
        cLeft = document.documentElement.clientLeft || 0;
        cTop = document.documentElement.clientTop || 0;

    return {
        X: e.clientX + sLeft - cLeft,
        Y: e.clientY + sTop - cTop
    }
}

// 获取可视区域/窗口大小
function getViewportSize() {
    if (window.innerWidth) {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    } else {
        if (document.compatMode === 'BackCompat') {
            return {
                width: document.body.clientWidth,
                height: document.body.clientHeight
            }
        } else {
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            }
        }
    }
}


//拖拽元素
function elemDrag(elem){
    var x,
        y;

    addEvent(elem, 'mousedown', function(e){
        var e = e || window.event;
        x = pagePos(e).X - getStyles(elem, 'left');
        y = pagePos(e).Y - getStyles(elem, 'top');

        addEvent(document, 'mousemove', mouseMove);
        addEvent(document, 'mouseup', mouseUp);
        cancelBubble(e);
        preventDefaultEvent(e);
    });

    function mouseMove(e){
       var e = e || window.event;
       elem.style.top = pagePos(e).Y - y + 'px';
       elem.style.left = pagePos(e).X - x + 'px';
    }

    function mouseUp(e){
        var e = e || window.event;
        removeEvent(document, 'mousemove', mouseMove);
        removeEvent(document, 'mouseup', mouseUp);
    }
}

//叉乘公式 和 向量 的集合
//判断是否在三角形之内
function vec(a, b){
    return {
        x: b.x - a.x,
        y: b.y = a.y
    }
}

function vecProduct(v1, v2){
    return v1.x * v2.y - v2.x * v1.y;
}

function sameSymbols(a, b){
    return (a ^ b) >= 0;
}

function pointInTriangle(p, a, b, c){
    var PA = vec(p, a),
        PB = vec(p, b),
        PC = vec(p, c),
        R1 = vecProduct(PA, PB),
        R2 = vecProduct(PB, PC),
        R3 = vecProduct(PC, PA);

    return sameSymbols(R1, R2) && sameSymbols(R2, R3);
}









