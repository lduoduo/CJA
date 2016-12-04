/**
 * 目前适用pc和手机，但不兼容ie8
 */
var tanceng_wrap2 = document.createElement('div');
var tanceng_demo2 = document.createElement('div');
var tanceng_title2 = document.createElement('div');
var tanceng_container2 = document.createElement('div');
var tanceng_footer2 = document.createElement('div');
var close2 = document.createElement('div');
window.tancengDemo2 = {
	//初始化弹层
    init: function() {
        tanceng_demo2.id = "tanceng_demo2";
        $(tanceng_wrap2).addClass('tanceng-wrap2');
        $(tanceng_demo2).addClass('tanceng-demo2');
        $(tanceng_title2).addClass('tanceng-title2');
        $(tanceng_container2).addClass('tanceng-container2');
        $(tanceng_footer2).addClass('tanceng-footer2');
        $(close2).html('×');
        $(close2).addClass('close2');
        $(tanceng_footer2).append($(close2));
        $(tanceng_demo2).append($(tanceng_container2)).append($(tanceng_footer2));
        $(tanceng_wrap2).append($(tanceng_demo2));
        $('body').append($(tanceng_wrap2));
        tancengDemo2.initEvent();
    },
    //绑定弹层事件
    initEvent: function() {
        $(tanceng_demo2).on('click', '.close2', function() {//关闭弹层
            $(tanceng_title2).html('');
            $(tanceng_container2).html('');
            $('.container').removeClass('active');
            // $('body').removeClass('active');
            $('.tanceng-demo2').removeClass('active');
        })
    },
    //打开弹层并显示内容
    showTanCeng: function(html, title) {
        $('#tanceng_demo3').remove();
        if ($('#tanceng_demo2').length == 0) {
            tancengDemo2.init();
        }
        $(tanceng_container2).html(html);
        if (title) {
            $(tanceng_title2).insertBefore($(tanceng_container2));
            $(".tanceng-title2").text(title);
        }
        $('.container').addClass('active');
        // $('body').addClass('active');
        $('.tanceng-wrap2').show();
		$('.tanceng-demo2').addClass('active'); 
    }
}