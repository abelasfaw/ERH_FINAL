const fs = require('fs')
var path = require('path')
var options = {root: path.normalize(__dirname).replace('\\controllers', '')};
function fileExists(file_path) {
   return new Promise((resolve, reject) => {
     fs.access(file_path, fs.constants.F_OK, err => {
       if (err) {
         resolve(false);
       } else {
         resolve(true);
       }
     });
   });
}


const getResource = async (req, res) => {
   console.log("inside resource handler")
   const filepath = 'public\\' + req.params['image_name'];
   const dir = path.dirname(require.main.filename || process.mainModule.filename);
   console.log("dir ", dir)
   const absolute_path = dir + '\\' + filepath;
   console.log("absolute ", absolute_path)
   try {
   var file_exists = await fileExists(absolute_path);
   } catch (err) {
   return res.staus(400).json({
      success: false,
      data: {
         message: 'Server error',
      },
   });
   }

   if (file_exists) {
   res.sendFile(filepath, options);
   } else {
   return res.json({
      success: false,
      data: {
         message: 'Resource not found',
      },
   });
   }

}


module.exports = {getResource}