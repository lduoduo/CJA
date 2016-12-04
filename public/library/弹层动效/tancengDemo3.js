/**
 * 目前只适合pc，但不兼容ie8，不适用手机
 */

var tanceng_demo3 = document.createElement('div');
var tanceng_title3 = document.createElement('div');
var tanceng_container3 = document.createElement('div');
var tanceng_footer3 = document.createElement('div');
var close3 = document.createElement('div');
window.tancengDemo3 = {
	//初始化弹层
    init: function() {
        tanceng_demo3.id = "tanceng_demo3";
        $(tanceng_demo3).addClass('tanceng-demo3');
        $(tanceng_title3).addClass('tanceng-title3');
        $(tanceng_container3).addClass('tanceng-container3');
        $(tanceng_footer3).addClass('tanceng-footer3');
        $(close3).html('foot');
        $(close3).addClass('close3');
        $(tanceng_footer3).append($(close3));
        $(tanceng_demo3).append($(tanceng_container3)).append($(tanceng_footer3));
        $('body').append($(tanceng_demo3));
        tancengDemo3.initEvent();
    },
    //绑定弹层事件
    initEvent: function() {
        // $(tanceng_demo3).on('click', '.close3', function() {//关闭弹层
        //     $(tanceng_title).html('');
        //     $(tanceng_container).html('');
        //     $(close3).html('');
        // })
    },
    //打开弹层并显示内容
    showTanCeng: function(html, title) {
        $('#tanceng_demo2').remove();
        if ($('#tanceng_demo3').length == 0) {
            tancengDemo3.init();
        }
        $(tanceng_container3).html(html);
        if (title) {
            $(tanceng_title3).insertBefore($(tanceng_container3));
            $(".tanceng-title3").text(title);
        }
        $('body').mouseenter(function(event) {//鼠标滑上body元素展示动画
			$(this).addClass('active');
		}).mouseleave(function(){
	    	$(this).removeClass('active');
		});  
    }
}