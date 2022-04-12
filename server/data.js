// Dependecies
let fsPromises = require('fs/promises');
let path = require('path');
let helpers = require('./helpers');


let lib = {};


lib.baseDirImage = path.join(__dirname,'/../public/images/');
lib.baseDir = path.join(__dirname,'/../database/');


lib.createImage = async function(dir,file,data,encoding){
    try{
        let fileData = await fsPromises.writeFile(lib.baseDirImage+dir+'/'+file,data,encoding);
        await fileData?.close();
        return true
    } catch(e){
        console.error(e);
    }
}


lib.create = async function(dir,file,data){
    try{
        let fileData = await fsPromises.open(lib.baseDir+dir+'/'+file+'.json','wx');
        await fileData.truncate();
        if(fileData){
            let stringData = JSON.stringify(data);
            await fsPromises.writeFile(fileData,stringData);
            await fileData?.close();
            return true;
        }
    } catch(e){
        console.error(e);
    }
}


module.exports = lib;
