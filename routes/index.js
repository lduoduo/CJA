var express = require('express');
var router = express.Router();
var fs = require('fs');
/* 首页. */
router.get('/', function(req, res, next) {
    console.log(2344)
    res.render('index', {
        list: (function() {
            var res = fs.readFileSync('./public/library/list.json', 'utf8');
            return JSON.parse(res);
        })()
    });
});


/* 详情页. */
router.get('/detail', function(req, res, next) {
    // 获取插件， 读取json文件
    var folderName = req.query.name;
    var loadPath = './public/library/' + folderName + '/index.json';
    var myjson = (function() {
        var res = fs.readFileSync(loadPath, 'utf8');
        return JSON.parse(res);
    })();
    myjson.path = 'library/' + folderName + '/' + myjson.index;
    res.render('detail', {
        data: myjson
    });

});

module.exports = router;