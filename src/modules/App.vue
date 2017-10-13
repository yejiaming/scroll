<template>
    <div id="app">
        <div class="pages">

            <transition name="fade" mode="out-in">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </transition>
        </div>
    </div>
</template>

<style lang="less" rel="stylesheet/less">
    @import '../assets/less/app.less';

    #app {
        width: 100%;
        height: 100%;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: all .2s ease;
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }
</style>
