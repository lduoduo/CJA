
window.onload=function(){ 
	// $('.demo1').click(function() {
	// 	var message = '123';
	// 	var title = 'demo1';
	// 	tanceng.showTanCeng(message,title); 
	// });

	$('.demo2').click(function() {
		console.log(1);
		var message = '123';
		var title = 'demo2';
		tancengDemo2.showTanCeng(message,title); 
	});  
	$('.demo3').click(function() {
		console.log(2);
		var message = '456';
		var title = 'demo3';
		tancengDemo3.showTanCeng(message,title); 
	}); 

	//平台、设备和操作系统
	var system ={
		win : false,
		mac : false,
		xll : false
	};
	//检测平台
	var p = navigator.platform;
	system.win = p.indexOf("Win") == 0 ;
	system.mac = p.indexOf("Mac") == 0 ;
	system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
	//跳转语句，如果是手机访问就自动跳转到wap.baidu.com页面
	if(system.win || system.mac || system.win || system.x11){
		$('.demo3').show();
	}else{
		$('.demo3').hide();
	}

} 

       