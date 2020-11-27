var fs = require('fs');
var path = require('path');

function fileReader(fileName) {
  let filePath = path.resolve(__dirname, fileName);
  let data = fs.readFileSync(filePath);
  console.log('filePath', data);
  if (!data) return
  data = data.toString();
  let chapter = data.split(/第\d+章/img)
  console.log(chapter.length)
  chapter.forEach((txt, index) => {
    let indexName = `第${index + 1}章 `;
    txt = txt.replace('undefined', indexName);
    let newFileName = txt.match(/([^\n]*)/)[0];
    newFileName = `${indexName}${newFileName}`
    console.log('newFileName', newFileName);
    fs.appendFileSync(path.resolve(__dirname, `./fan-ren-xiu-xian/${newFileName}.txt`), txt);
  });
}

fileReader('fan-ren-xiu-xian-zhuan.txt')