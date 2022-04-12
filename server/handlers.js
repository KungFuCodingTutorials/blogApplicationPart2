const helpers = require("./helpers");
const _data = require('./data');

// Create the container
let handlers = {};

handlers.index = async function(data){
    try{
        if(data.method == 'get'){ 
            let templateData = {};
            let stringData = await helpers.getTemplate('index',templateData);
            if(stringData){
                let universalString = await helpers.addHeaderFooter(stringData,templateData);
                if(universalString){
                    return{
                        'statusCode' : 200,
                        'payload' : universalString,
                        'contentType' : 'html',
                    }
                } else {
                    return{
                        'statusCode' : 500,
                        'payload' : {'Error' : 'Error merging the files'},
                    }
                }
            } else {
                return{
                    'statusCode' : 500,
                    'payload' : {'Error' : 'Error reading the file'},
                }
            }
        } else {
            return{
                'statusCode' : 500,
                'payload' : {'Error' : 'Only GET method are allowed'},
            }
        }
    } catch(e){
        console.error(e);
    }
}

handlers.notFound = async function(){
    return{
        'statusCode' : 404,
        'payload' : 'Not found page',
        'contentType' : 'plain'
    }
}

handlers.public = async function(data){
    try{
        if(data.method == 'get'){
            let fileName = data.cleanedPath.replace('public','').trim();
            if(fileName.length > 0){
                let staticAssetData = await helpers.getStaticAsset(fileName);
                if(staticAssetData){
                    let contentType = 'plain';
                    if(fileName.indexOf('.css') > -1){
                        contentType = 'css';
                    }
                    if(fileName.indexOf('.png') > -1){
                        contentType = 'png';
                    }
                    if(fileName.indexOf('.jpg') > -1){
                        contentType = 'jpg';
                    }
                    if(fileName.indexOf('favicon') > -1){
                        contentType = 'favicon';
                    }
                    if(fileName.indexOf('.js') > -1){
                        contentType = 'javascript';
                    }
                    return{
                        'statusCode' : 200,
                        'payload' : staticAssetData,
                        'contentType' : contentType
                    }
                }
            }
        }
    } catch(e){
        console.error(e);
    }
}


handlers.postCreate = async function(data){
    try{
        if(data.method == 'get'){ 
            let templateData = {};
            let stringData = await helpers.getTemplate('postCreate',templateData);
            if(stringData){
                let universalString = await helpers.addHeaderFooter(stringData,templateData);
                if(universalString){
                    return{
                        'statusCode' : 200,
                        'payload' : universalString,
                        'contentType' : 'html',
                    }
                }else {
                    return{
                        'statusCode' : 500,
                        'payload' : {'Error' : 'Error merging the files'},
                    }
                }
            } else {
                return{
                    'statusCode' : 500,
                    'payload' : {'Error' : 'Error reading the file'},
                }
            }
        } else {
            return{
                'statusCode' : 500,
                'payload' : {'Error' : 'Only GET method are allowed'},
            }
        }
    } catch(e){
        console.error(e);
    }
}


handlers.blogPost = async function(data){
    let acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
      return await handlers._blogPost[data.method](data);
    } else {
      return{
        'statusCode':405,
        'payload':{}
      }
    }
  }
  
  handlers._blogPost = {};
  
  
  handlers._blogPost.post = async function(data){
    try{
      let title = typeof(data.payload.title) == 'string' && data.payload.title.trim().length > 0 ? data.payload.title.trim() : false;
      let tag = typeof(data.payload.tag) == 'object' ? data.payload.tag : [];
      let readingMinutes = typeof(data.payload.readingMinutes) == 'number' && data.payload.readingMinutes > 0 ? data.payload.readingMinutes : false;
      let fileName = typeof(data.payload.fileName) == 'string' && data.payload.fileName.trim().length > 0 ? data.payload.fileName.trim() : false;
      let mainContent = typeof(data.payload.mainContent) == 'string' && data.payload.mainContent.trim().length > 0 ? data.payload.mainContent.trim() : false;
      let fileExtension = typeof(data.payload.fileExtension) == 'string' && data.payload.fileExtension.trim().length > 0 ? data.payload.fileExtension.trim() : false;
      let fileContent = typeof(data.payload.fileContent) == 'string' && data.payload.fileContent.trim().length > 0 ? data.payload.fileContent.trim() : false;
  
      if(title && tag && readingMinutes){
        let postId = helpers.createRandomString(20);
        if(fileName){
            let imageFileName = helpers.createRandomString(10);
            let allPostImagesName = [];
            let allPostImagesExtensions = [];
            allPostImagesName.push(imageFileName);
            allPostImagesExtensions.push(fileExtension);
            let imageData = await _data.createImage('upload',imageFileName+'.'+fileExtension,fileContent ,{encoding:'base64'});
            if(imageData){
                let postObject = {
                    "id" : postId,
                    "title" : title.toLocaleLowerCase(),
                    "tag" : tag,
                    "readingMinutes" : readingMinutes,
                    "fileName" : imageFileName,
                    "fileExtension" : fileExtension ,
                    "mainContent" : mainContent,
                    "allPostImagesName" : allPostImagesName,
                    "allPostImagesExtension" : allPostImagesExtensions,

                }

                let postObjectData = await _data.create('posts',postId,postObject);
                if(postObjectData){
                    return{
                        'statusCode' : 200,
                        'payload' : {'Success' : 'Post created!'}
                    }
                }

            } else {
                return{
                    'statusCode' : 400,
                    'payload' : {'Error' : 'Missing inputs'}
                }
            }
        } else {
            return{
                'statusCode' : 400,
                'payload' : {'Error' : 'Missing inputs'}
            }
        }
      } else {
        return{
          'statusCode' : 400,
          'payload' : {'Error' : 'Missing inputs'}
        }
      }
    } catch(e){
      console.error(e);
    }
    
  }
  



module.exports = handlers;