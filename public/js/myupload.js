// var Dropzone = require("./dropzone.js");
// var reg = /\.(html|js|css|jpg|png)$/i;
// Dropzone.options.myAwesomeDropzone = {
// 	paramName: "file", // The name that will be used to transfer the file
// 	maxFilesize: 2, // MB
// 	accept: function(file, done) {
// 		if (reg(file.name)) {
// 			console.log('1');
// 		} else {
// 			console.log('2');
// 		}
// 	}
// };


// var myDropzone = new Dropzone("div#uuu", {
// 	function: "/file/post"
// });

// myDropzone.on("addedfile", function(file) {
// 	console.log(file);
// 	/* Maybe display some more file information on your page */
// });

// function postfile() {
// 	console.log('post file');
// }
// var filelist = {};
// var mu = document.querySelector('#multipleUpload');
// mu.addEventListener('change', function(e) {
// 	var me = this,
// 		obj = event.target,
// 		files = obj.files,
// 		fr = new FileReader;
// 	fl = files.length;
// 	for (var i = 0; i < fl; i++) {
// 		fr.readAsDataURL(files[i]), fr.onload = function(e) {
// 			console.log(e);
// 			filelist[files[i].name] = fr.result;
// 		}
// 	}
// });

// var fu = {
// 	//获取选择文件，file控件或拖放
// 	funGetFiles: function(e) {
// 		// 取消鼠标经过样式
// 		this.funDragHover(e);

// 		// 获取文件列表对象
// 		var files = e.target.files || e.dataTransfer.files;
// 		//继续添加文件
// 		this.fileFilter = this.fileFilter.concat(this.filter(files));
// 		this.funDealFiles();
// 		return this;
// 	},
// }

var Mt = {
    alert: (option) => {
        //type, title, msg, btnMsg, cb, isLoading
        swal({
            title: option.title,
            text: option.msg,
            type: option.type,
            showCancelButton: option.cancelBtnMsg,
            cancelButtonText: option.cancelBtnMsg || "在犹豫一下",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: option.btnMsg || "好哒",
            showLoaderOnConfirm: option.isLoading,
            timer: option.timer,
            closeOnConfirm: false
        }, option.cb);
    }
};

var reg = /\.(html|js|css|jpg|png|json)$/i;
var tick = false; //fileread是否占用
var params = {
    fileInput: $('#multipleUpload')[0],
    dragDrop: $("#drag")[0],
    upButton: $("#uploadBtn")[0],
    url: '/upload',
    //list为已经上传的文件
    filter: function(files, listobj) {
        var arrFiles = [];
        var errors = '';

        if (files.length > 10) {
            Mt.alert({
                title: '上传文件超过10个上限了，你好贪心哦！',
                type: 'error'
            });
            return {
                list: arrFiles,
                obj: listobj
            }
        }
        for (var i = 0, file; file = files[i]; i++) {
            if (listobj[file.name]) {
                errors += file.name + ' 已经在你的口袋里了，你是不是忘了!' + '\n';
            } else if (!reg.test(file.name)) {
                errors += file.name + ' 不接受支持，无法上传!' + '\n';
            } else {
                arrFiles.push(file);
                listobj[file.name] = file.name;
            }
        }
        if (errors) {
            Mt.alert({
                title: '呃。。。！',
                type: 'error',
                msg: errors
            });
        }
        return {
            list: arrFiles,
            obj: listobj
        }
    },
    onSelect: function(files) {

        // $("#preview").html('<div class="upload_loading"></div>');

        fileHandle(files);
    },
    onDelete: function(name) {
        $('.J-upload-delete[data-name="'+name+'"]').closest('.upload_append_list').remove();
    },
    onDragOver: function() {
        $(this).addClass("upload_drag_hover");
    },
    onDragLeave: function() {
        $(this).removeClass("upload_drag_hover");
    },
    onProgress: function(file, loaded, total) {
        var eleProgress = $("#uploadProgress_" + file.index),
            percent = (loaded / total * 100).toFixed(2) + '%';
        eleProgress.show().html(percent);
    },
    beforeUpload: function(listObj) {
        var tmp = !!listObj['index.json'];
        if (!tmp) {
            Mt.alert({
                type: 'error',
                title: '缺少配置文件index.json, 无法进行上传'
            });
        }
        return listObj['index.json'];
    },
    onSuccess: function(res) {
        Mt.alert({
            type: 'success',
            title: res.status ? '文件上传成功' : '文件上传失败：' + res.msg,
            cb: function () {
                window.location.reload();
            }
        });
        $('#projectname').val('');
        $('#multipleUpload').val('');
        $("#preview").html('');
    },
    onFailure: function(file) {
        $("#uploadInf").append("<p>图片" + file.name + "上传失败！</p>");
        $("#uploadImage_" + file.index).css("opacity", 0.2);
    },
    onComplete: function() {
        //提交按钮隐藏
        $("#fileSubmit").hide();
        //file控件value置空
        $("#fileImage").val("");
        $("#uploadInf").append("<p>当前图片全部上传完毕，可继续添加上传。</p>");
    },
    onError: function(msg){
        Mt.alert({
            type: 'error',
            title: msg
        });
    }
};
ZXXFILE = $.extend(ZXXFILE, params);
ZXXFILE.init();

$('.J-uploadArea').on('click', function(e) {
    console.log(e.target);
    if (!$(e.target).hasClass('J-upload-delete')) {
        $('#multipleUpload').click();
        return;
    }
    //删除事件
    var name = $(e.target).data('name');
    ZXXFILE.funDeleteFile(name);
});

//处理
function fileHandle(files) {
    var type = "";
    $("#preview").html('');
    fileAppend(files, 0);
    if (1) {
        //删除方法
        $(".upload_delete").click(function() {
            ZXXFILE.funDeleteFile(files[parseInt($(this).attr("data-index"))]);
            return false;
        });
        //提交按钮显示
        $("#uploadBtn").show();
    } else {
        //提交按钮隐藏
        $("#uploadBtn").hide();
    }
};

//具体读取预览文件的方法
function fileAppend(files, i) {
    var file = files[i];
    var type = "";
    if (file) {
        tick = true;
        type = /\.(jpg|png)$/i.test(file.name) ? 'pic' : 'file';
        var reader = new FileReader();
        reader.onload = function(e) {
            renderHtml(file, i, type, e);
            i++;
            fileAppend(files, i);
        }
        reader.readAsDataURL(file);
    } else {
        tick = false;
    }
}

function renderHtml(file, i, type, e) {
    var html = '<div id="uploadList_' + i + '" class="upload_append_list ' + type + '">' +
        '<figure><img id="uploadImage_' + i + '" src="' + (type == 'pic' ? e.target.result : "") + '" class="upload_image" /></figure>' +
        '<figcaption><p><span>' + file.name + '</span></p>' +
        '<a class="J-upload-delete" title="删除" data-index="' + i + '" data-name=' + file.name + '>删除</a></figcaption>' +
        '<span id="uploadProgress_' + i + '" class="upload_progress"></span>' +
        '</div>';
    $("#preview").append(html);
};