const multer = require('multer');
const path = require('path');

const storage = (destination)=> multer.diskStorage({
    destination: destination,
    filename : (req,file,cb)=>{
        let filename = file.originalname.split('.')[0]
        return cb(null, `${filename}_${Date.now()}${path.extname(file.originalname)}`)
    }
})


const fileUpload = (destination)=> multer({
    storage: storage(destination),
    limits: {
        fileSize : 2 * 1024 * 1024, //2mb
    },

    fileFilter: (req,file,cb)=>{
        if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg'){
            cb(null,true)
        }else{
            cb(null,false)
            return cb(new Error('Only .jpeg, .jpg and .png are supported'))
        }
    },
    onError : (err,next)=>{
         return console.log(err, 'error');
        
    }
}).single('image')


// const fileUpload = multer({
//     storage: storage,
//     limits: { fileSize: '1000000' },
//     fileFilter: (req, file, cb) => {
//         const fileTypes = /jpeg|jpg|png|gif/
//         const mimeType = fileTypes.test(file.mimetype)  
//         const extname = fileTypes.test(path.extname(file.originalname))

//         if(mimeType && extname) {
//             return cb(null, true)
//         }
//         cb('Give proper files formate to upload')
//     }
// }).single('image')


module.exports = fileUpload