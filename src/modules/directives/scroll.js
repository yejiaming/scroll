/**
 * Created by yejiaming on 2017/9/28.
 */
/**
 * Created by yejiaming on 2017/2/23.
 */
var startTime, startY, oldY, $el, $event, currentY, distance, deceleration = 0.0006, minValue = 0, resetY, maxValue, currentTime, lastY = 0, lastTime;

var getTranslateY = function (dom) {
    var transformString = dom.style.transform;
    if (transformString) {
        return Number(transformString.match(/\+?\-?\d+/g)[0]);
    } else {
        return 0;
    }
};
var getScrollEventTarget = function (element) {
    let currentNode = element;
    while (currentNode && currentNode.tagName !== 'HTML' &&
    currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
        let overflowY = document.defaultView.getComputedStyle(currentNode).overflowY;
        if (overflowY === 'scroll' || overflowY === 'auto') {
            return currentNode;
        }
        currentNode = currentNode.parentNode;
    }
    return window;
};

var handleTouchStart = function (event) {
    lastTime = startTime = new Date().getTime();
    distance = 0;
    resetY = startY = event.targetTouches[0].screenY;
    /*每次移动开始时设置初始的oldY的值*/
    oldY = getTranslateY($el);
    $el.style["transitionDuration"] = '0ms';
};

var handleTouchMove = function (event) {
    event.preventDefault();
    currentY = event.targetTouches[0].screenY;
    currentTime = new Date().getTime();
    // 二次及以上次数滚动（间歇性滚动）时间和路程重置计算，0.05是间歇性滚动的停顿位移和时间比
    if (Math.abs(currentY - lastY) / Math.abs(currentTime - lastTime) < 0.05) {
        startTime = new Date().getTime();
        resetY = currentY;
    }
    distance = currentY - startY;
    let temDis = distance + oldY;
    $el.style["-webkit-transform"] = 'translateY(' + temDis + 'px)';
    lastY = currentY;
    lastTime = currentTime;
    $el.dispatchEvent($event);
};

var handleTouchEnd = function (event) {
    /*点透事件允许通过*/
    if (!distance) {
        return;
    }
    event.preventDefault();
    let temDis = distance + oldY;
    /*计算缓动值*/
    var duration = new Date().getTime() - startTime;
    // 300毫秒是判断间隔的最佳时间
    var resetDistance = currentY - resetY;
    if (duration < 300 && Math.abs(resetDistance) > 10) {
        var speed = Math.abs(resetDistance) / duration,
            destination;  // 加速度因子
        // 初速度为0 距离等于速度的平方除以2倍加速度
        destination = (speed * speed) / (2 * deceleration) * (resetDistance < 0 ? -1 : 1);
        temDis += destination;
    }
    /*设置最小值*/
    if (temDis > minValue) {
        temDis = minValue;
    }
    /*设置最大值*/
    if (temDis < -maxValue) {
        temDis = -maxValue;
    }
    $el.style["transitionDuration"] = '1000ms';
    $el.style["transitionTimingFunction"] = 'ease-out';
    /*确定最终的滚动位置*/
    setTimeout(()=> {
        $el.style["-webkit-transform"] = 'translateY(' + temDis + 'px)';
    }, 0);
    $el.dispatchEvent($event);
};
// 禁用滚轮滚动
var scrollFunc = function (e) {
    e = e || window.event;
    if (e && e.preventDefault) {
        e.preventDefault();
        e.stopPropagation();
    } else {
        e.returnvalue = false;
        return false;
    }
}

export var scroll = {
    // 当绑定元素插入到 DOM 中。
    bind: function (el, binding, vnode) {
        // console.log('首次加载挂载到DOM节点中——一次挂载之运行一次');
    },
    inserted: function (el, binding) {
        $el = el;
        maxValue = $el.clientHeight - document.documentElement.clientHeight;
        var scrollTarge = getScrollEventTarget($el);
        // IE和webkit下鼠标滚动事件
        scrollTarge.addEventListener('mousewheel', function (e) {
            scrollFunc(e);
        });
        //火狐下的鼠标滚动事件
        scrollTarge.addEventListener('DOMMouseScroll', function (e) {
            scrollFunc(e);
        });

        document.documentElement.style['overflow'] = 'hidden';  // 禁用根节点（html）的滚动条
        // console.log('DOM节点挂载到完毕——一次挂载之运行一次');
        $event = new Event('y-scroll');
        el.addEventListener('touchstart', handleTouchStart);
        el.addEventListener('touchmove', handleTouchMove);
        el.addEventListener('touchend', handleTouchEnd);
    },
    update: function (el, binding) {
        // console.log('更新DOM节点或者绑定数据——一次挂载之运行多次');
    },
    componentUpdated: function (el, binding) {
        // console.log('完成更新DOM节点或者绑定数据——一次挂载之运行多次');
    },
    unbind: function (el, binding) {
        // console.log('取消该节点的挂载——一次挂载之运行一次');
    }
};
