//自动将fie发布到 tnpm

const fs = require('fs-extra');
const path = require('path');
const spawn = require('cross-spawn');

const fiePkgPath = path.join(__dirname,'../packages/fie-core/package.json');
const fiePkg = fs.readJsonSync(fiePkgPath);
//copy一份出来
const newFiePkg = Object.assign({},fiePkg);

//修改相关的内容
newFiePkg.name = '@ali/test-aaadddaa1';
newFiePkg.publishConfig = {
	"registry": "http://registry.npm.alibaba-inc.com"
};

fs.writeJsonSync(fiePkgPath,newFiePkg);

try{
	process.chdir(path.join(__dirname,'../packages/fie-core'));
	spawn.sync('tnpm', ['publish'], { stdio: 'inherit' });
	console.log(`${newFiePkg.name} 版本： ${newFiePkg.version} 发布到TNPM成功，查看地址：http://web.npm.alibaba-inc.com/package/${newFiePkg.name}`);

}catch (e){
	console.log('发布失败');
	console.log(e);
}

fs.writeJsonSync(fiePkgPath,fiePkg);
