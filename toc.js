##目录
var fs = require('fs')
var process = require('process')
var readDir = require('./readDir.js')


// readDir(process.cwd(), function (file) {
//   var data = fs.readFileSync(file);
//   console.log(data);
// },{
//   filters: [/\.git/g]
// })

var genToc = function (file,flag) {
  var data = fs.readFileSync(file) + ''; //转成字符串
  var newData = '';
  var reg = /^#+\s(.*)/gm;
  var match;
  var toc = '##目录\n';
  var firstLevel = 0;
  var lines = data.split('\n');
  lines.forEach(line => {
    //判断
    newData += line;
    if ((match = reg.exec(line)) !== null) {
      let reg2 = /^(#+)/g
      var title = line;
      var level = reg2.exec(title)[1].length;
      //确定第一个是几集标题
      if (!firstLevel) {
        firstLevel = level;
      }
      title = match[1];
      //github上的锚点规则，会把以下符号替换掉，并且把空格替换成-
      var url = title.replace(/[()（）：.]/g, '').replace(/\s/g, '-');
      //根据最高层级的情况进行缩进
      title = '  '.repeat(level - firstLevel) + `- [${title}](#${url})`;
      toc += title + '\n';

      //给每一个标题加上返回目录
      newData += '\t[↑](#目录)'
    }
    newData += '\n';
  })

  if(flag){
    newData = newData.replace(/\[TOC\]/g, toc);
  }
  else {
    newData = toc + newData;
  }
  fs.writeFileSync(file, newData);
}

module.exports = genToc;
