/**
 * Created by wd14931 on 2016/3/21.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var datalist = require('../public/library/list.json');

var tmp = {
    "name": "test",
    "filename": "test.html",
    "folder": "test",
    "imgUrl": "../img/product1.jpg",
    "css": false,
    "js": false,
    "des": "这是描述",
    "download": "download",
    "detail": "detail"
};

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        tmp.folder = req.body.name;
        tmp.name = req.body.name;
        var destDir = './public/library/' + req.body.name;

        if ((/application\/javascript/).exec(file.mimetype)) {
            tmp.js = true;
        }
        if ((/text\/css/).exec(file.mimetype)) {
            tmp.css = true;
        }
        if ((/text\/html/).exec(file.mimetype)) {
            tmp.filename = file.originalname;
        }
        // 判断文件夹是否存在
        fs.stat(destDir, function(err) {
            if (err) {
                // 创建文件夹
                fs.mkdir(destDir, function(err) {
                    cb(null, destDir);
                });
            } else {
                cb(null, destDir);
            }
        });

    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});


var upload = multer({
    storage: storage
});

var cpUpload = upload.fields([{
    name: 'a',
    maxCount: 1
}, {
    name: 'file',
    maxCount: 10
}]);

router.post('/', cpUpload, function(req, res) {
    saveJson(req);
    res.send({
        status: true,
        msg: 'success!'
    });

});

module.exports = router;

function saveJson(req) {
    datalist[tmp.folder] = {};
    Object.assign(datalist[tmp.folder], tmp);
    var tmpJson = JSON.stringify(datalist);
    fs.writeFile(__dirname + '/../public/library/list.json', tmpJson, (err) => {
        if (err) throw err;

        console.log('It\'s saved!');
    });
}