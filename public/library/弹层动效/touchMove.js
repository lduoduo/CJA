/**
 * 由弹出层引发对滚动原理的讨论(弹层时，底层元素还是在滚动)
 * Created By zyl11854@ly.com
 * 使用方法：
 * 在目标页按照如下格式引入该文件,路径可能会有所不同：
 *     touchmove = require('../../../common/js/touchmove.js');
 * 调用时：
 *     -  允许滚动的区域进行滚动，同时禁止背景滚动
 *        touchmove.moveScroll($('selector'));
 *     -  放开背景滚动
 *        touchmove.enableScroll();
 * 注意：
 *     需要滚动的区域样式一定要设置：
 *        overflow: auto;
 *        max-height: xxx;
 * 更新日志：
 * 2016/6/7 创建 --zyl11854
 * 页面滚动原理
 *     在PC上网页滚动主要靠鼠标滚轮，其次按“上”“下”键也能滚动页面，还可以按“空格”“Page Down/Up”以及“HOME”键，或者直接点击或拖动滚动条也能滚动页面。
 * 当通过鼠标滚轮时，mousewheel事件会先触发，然后才是scroll。而事件的listener默认是遵循冒泡的，所以绑在document上的函数会先触发，然后才是window上的。
 * 同理，当通过按特定的键去滚动页面时，keydown事件会先触发，然后也是scroll。
 *
 */

window.touchmove = {

    preventDefault: function(e) {
        e = e || window.event;
        e.preventDefault && e.preventDefault();
        e.returnValue = false;
    },

    stopPropagation: function(e) {
        e = e || window.event;
        e.stopPropagation && e.stopPropagation();
        e.cancelBubble = false;
    },

    innerScroll: function(e) {
        // 阻止冒泡到document
        // document上已经preventDefault
        touchmove.stopPropagation(e);

        var delta = e.wheelDelta || e.detail || 0;
        var box = $(this).get(0);

        // 当滚动到达bottom和top时，就阻止滚动
        if ($(box).height() + box.scrollTop >= box.scrollHeight) {
            if (delta < 0) {
                touchmove.preventDefault(e);
                return false;
            }
        }
        if (box.scrollTop === 0) {
            if (delta > 0) {
                touchmove.preventDefault(e);
                return false;
            }
        }
        // 会阻止原生滚动
        // return false;
    },
    //背部禁止滚动
    disableScroll: function() {
        $(document).on('mousewheel', touchmove.preventDefault);
        $(document).on('touchmove', touchmove.preventDefault);
    },
    //背部放开滚动
    enableScroll: function() {
        $(document).off('mousewheel', touchmove.preventDefault);
        $(document).off('touchmove', touchmove.preventDefault);
    },
    // 移动端touch重写
    moveScroll: function(_thisDiv) {

        var startX, startY, $this = _thisDiv;
        $this.on('touchstart', function(e) {
            startX = e.changedTouches[0].pageX;
            startY = e.changedTouches[0].pageY;
        });

        // 仿innerScroll方法
        $this.on('touchmove', function(e) {
            e.stopPropagation();

            var deltaX = e.changedTouches[0].pageX - startX;
            var deltaY = e.changedTouches[0].pageY - startY;

            // 只能纵向滚
            // 弹出层内部的滚动只能纵向滚，即 deltaY 要大于 deltaX。当没有这条判断时，弹出层内部可以横向滚，滚出的都是空白
            if (Math.abs(deltaY) < Math.abs(deltaX)) {
                e.preventDefault();
                return false;
            }

            var box = $(this).get(0);

            if ($(box).height() + box.scrollTop >= box.scrollHeight) {
                if (deltaY < 0) {
                    e.preventDefault();
                    return false;
                }
            }
            if (box.scrollTop === 0) {
                if (deltaY > 0) {
                    e.preventDefault();
                    return false;
                }
            }
            // 会阻止原生滚动
            // return false;
        });
        //添加可可滚动
        _thisDiv.on('mousewheel', touchmove.innerScroll);
        //禁止外部滚动
        touchmove.disableScroll();
    }
};
