# JS实现一个scroll自定义滚动效果
在公司开发项目的时候，原生滚动条中有些东西没办法自定义去精细的控制，于是开发一个类似于better-scroll一样的浏览器滚动监听的JS实现，下面我们就来探究一下自定义滚动需要考虑哪些东西，经过哪些过程。
##选择滚动监听的事件
因为是自定义手机端的滚动事件，那我选择的是监听手机端的三个touch事件来实现监听，并实现了两种滚动效果，一种是通过-webkit-transform，一种是通过top属性。两种实现对于滚动的基本效果够能达到，可是top的不适合滚动中还存在滚动，可是能解决滚动中存在postion:fixed属性的问题；而transform可以实现滚动中有滚动，可是又不能解决postion:fixed的问题，所以，最后选择性考虑使用哪一种实现方式，用法一样。
##主要的实现业务逻辑

```js
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
```
**代码解读：**这是监听touchmove事件的回调，其中主要计算出目标节点**this.$el**的**top**或者-webkit-transform中**translateY**的值，而计算的参考主要以事件节点的screenY的垂直移动距离为参考，当然其中还要判断一下最大值和最小值，为了保证移动可以的超出最大值小值一定的距离所以加了一个**1/3**的移动计算。这里可能主要到了有一个**间歇性滚动**的判断和计算，主要是服务于**惯性滚动**的，目的是让惯性滚动的值更加精确。


```js
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
```
**代码解读：**这是touchend事件监听的回调，其中这里要判断是否要拦截click和tap事件，并且这里还要计算**惯性缓动值**，设置最终的最大最小值，以及设置动画效果和缓动效果。下面来谈一下滚性滚动的计算：

```js
// 计算惯性滚动值
computeSlowMotion(temDis){
    var duration = new Date().getTime() - this.startTime;
    // 300毫秒是判断间隔的最佳时间
    var resetDistance = this.currentY - this.resetY;
    if (duration < 300 && Math.abs(resetDistance) > 10) {
        var speed = Math.abs(resetDistance) / duration,
            destination;
        // 末速度为0 距离等于初速度的平方除以2倍加速度
        destination = (speed * speed) / (2 * this.deceleration) * (resetDistance < 0 ? -1 : 1);
        this.slowMotionFlag = true;
        return temDis += destination;
    } else {
        this.slowMotionFlag = false;
        return temDis;
    }
},
```
**代码解读**：滚性滚动的算法主要是根据一个路程和时间计算出初速度，以及原生滚动的加速度的大于值0.006来计算滚动的总位移。这里主要还要判断一下一个300ms的经验值。

##总结
大概的流程和思考就是这样了，后续还会增加更多的功能进行扩展，下面附上git地址：[https://github.com/yejiaming/scroll](https://github.com/yejiaming/scroll)


