/**
 * Created by yejiaming on 2017/10/14.
 * Scroll自定义滚动事件
 */
export function Scroll(el) {
    var me = this;
    me.init(el);
    me.forbiddenScroll(me.getStyleTargetDom(me.$el, 'overflowY', ['scroll', 'auto']));
    me.setMaxValue();
    me.createRequestAnimFrame();
    me.$el.addEventListener('touchstart', me.handleTouchStart.bind(me), false);
    me.$el.addEventListener('touchmove', me.handleTouchMove.bind(me), false);
    me.$el.addEventListener('touchend', me.handleTouchEnd.bind(me), false);
}

Scroll.prototype = {
    // 初始化参数
    init(el){
        this.$el = el;
        this.startTime = 0;
        this.startY = 0;
        this.oldY = null;
        this.$event = this.createEvent();
        this.currentY = null;
        this.distance = null;
        this.deceleration = 0.0006;
        this.minValue = 0;
        this.resetY = null;
        this.slowMotionFlag = false;
        this.maxValue = null;
        this.currentTime = null;
        this.lastY = 0;
        this.lastTime = 0;
        this.timer = null;
        el.style['position'] = 'absolute';
        el.style['width'] = '100%';
    },
    // requestAnimFrame重绘监听初始化
    createRequestAnimFrame(){
        /**
         * 监听页面重绘的监听兼容性写法，一般配合动画效果
         */
        window.requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
        /**
         * 取消页面重绘监听的兼容性写法
         */
        window.cancelAnimationFrame = (function () {
            return window.cancelAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.mozCancelAnimationFrame ||
                window.oCancelAnimationFrame ||
                function (timer) {
                    window.clearTimeout(timer);
                };
        })();
    },
    // 禁用原生滚动
    forbiddenScroll(scrollTarge){
        var me = this;
        // IE和webkit下鼠标滚动事件
        scrollTarge.addEventListener('mousewheel', function (e) {
            me.scrollFunc(e);
        });
        //火狐下的鼠标滚动事件
        scrollTarge.addEventListener('DOMMouseScroll', function (e) {
            me.scrollFunc(e);
        });
        document.documentElement.style['overflow'] = 'hidden';  // 禁用根节点（html）的滚动条
    },
    // 设置最大值
    setMaxValue(){
        var me = this;
        var hiddenDom = me.getStyleTargetDom(me.$el, 'overflowY', 'hidden');
        var hdHight = me.getPxValue(document.defaultView.getComputedStyle(hiddenDom)['height']);
        var clientHeight = Math.abs(hdHight) > 0 ? Math.abs(hdHight) : document.documentElement.clientHeight;
        me.maxValue = me.$el.clientHeight - clientHeight;
    },
    // 获取想要的参数的目标节点，并指定属性以及属性值
    getStyleTargetDom: function (element, attr, value) {
        let currentNode = element;
        while (currentNode && currentNode.tagName !== 'HTML' &&
        currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
            let target = document.defaultView.getComputedStyle(currentNode)[attr];
            if (value && value.indexOf(target) > -1) {
                return currentNode;
            }
            currentNode = currentNode.parentNode;
        }
        return window;
    },
    // 阻止事件的冒泡
    scrollFunc: function (e) {
        e = e || window.event;
        if (e && e.stopPropagation) {
            // e.preventDefault();
            e.stopPropagation();
        } else {
            e.returnvalue = false;
            return false;
        }
    },
    // 获取dom节点的top的值
    getTop(dom){
        var transformString = dom.style.top;
        if (transformString) {
            return this.getPxValue(transformString);
        } else {
            return 0;
        }
    },
    // 获取100px中100的值
    getPxValue(str){
        return Number(String(str).match(/\+?\-?\d+/g)[0]);
    },
    // 创建事件
    createEvent(){
        return new Event('y-scroll');
    },
    // 分发事件循环
    dispatchEventLoop(){
        this.timer = window.requestAnimFrame(()=> {
            this.dispatchEvent();
            this.dispatchEventLoop();
        });
    },
    // 分发事件
    dispatchEvent(){
        this.$event.scrollTop = this.$el.getBoundingClientRect().top;
        this.$el.dispatchEvent(this.$event);
    },
    // 计算缓动值
    computeSlowMotion(temDis){
        var duration = new Date().getTime() - this.startTime;
        // 300毫秒是判断间隔的最佳时间
        var resetDistance = this.currentY - this.resetY;
        if (duration < 300 && Math.abs(resetDistance) > 10) {
            var speed = Math.abs(resetDistance) / duration,
                destination;
            // 初速度为0 距离等于速度的平方除以2倍加速度
            destination = (speed * speed) / (2 * this.deceleration) * (resetDistance < 0 ? -1 : 1);
            this.slowMotionFlag = true;
            return temDis += destination;
        } else {
            this.slowMotionFlag = false;
            return temDis;
        }
    },
    handleTouchStart(event){
        this.lastTime = this.startTime = new Date().getTime();
        this.distance = 0;
        this.resetY = this.startY = event.targetTouches[0].screenY;
        /*每次移动开始时设置初始的oldY的值*/
        this.oldY = this.getTop(this.$el);
        this.$el.style["transitionDuration"] = '0ms';
        this.scrollFunc(event);
    },
    handleTouchMove(event){
        event.preventDefault();
        this.currentY = event.targetTouches[0].screenY;
        this.currentTime = new Date().getTime();
        // 二次及以上次数滚动（间歇性滚动）时间和路程重置计算，0.05是间歇性滚动的停顿位移和时间比
        if (Math.abs(this.currentY - this.lastY) / Math.abs(this.currentTime - this.lastTime) < 0.05) {
            this.startTime = new Date().getTime();
            this.resetY = this.currentY;
        }
        this.distance = this.currentY - this.startY;
        let temDis = this.distance + this.oldY;
        /*设置移动最小值*/
        temDis = temDis > this.minValue ? temDis * 1 / 3 : temDis;
        /*设置移动最大值*/
        temDis = temDis < -this.maxValue ? -this.maxValue + (temDis + this.maxValue) * 1 / 3 : temDis;
        this.$el.style["top"] = temDis + 'px';
        this.lastY = this.currentY;
        this.lastTime = this.currentTime;
        this.dispatchEvent();
        this.scrollFunc(event);
    },
    handleTouchEnd(event){
        /*点透事件允许通过*/
        if (!this.distance) return;
        event.preventDefault();
        let temDis = this.distance + this.oldY;
        /*计算缓动值*/
        temDis = this.computeSlowMotion(temDis);
        /*设置最小值*/
        temDis = temDis > this.minValue ? this.minValue : temDis;
        /*设置最大值*/
        temDis = temDis < -this.maxValue ? -this.maxValue : temDis;
        this.$el.style["transitionDuration"] = '500ms';
        this.$el.style["transitionTimingFunction"] = 'ease-out';
        /*确定最终的滚动位置*/
        setTimeout(()=> {
            this.$el.style["top"] = temDis + 'px';
        }, 0);
        // 判断使用哪一种监听事件
        if (this.slowMotionFlag) {
            this.dispatchEventLoop();
        } else {
            this.dispatchEvent();
        }
        this.$el.addEventListener('transitionend', ()=> {
            window.cancelAnimationFrame(this.timer);
        });
        this.scrollFunc(event);
    }
};