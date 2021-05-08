const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

module.exports ={

    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'), 
    storage: multer.diskStorage({
        destination: (req, file, cb) =>{
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (erro, hash) =>{
                if(erro) {
                    cb(erro);
                }

                const filename = `${hash.toString('hex')}-${file.name}`
                cb(null, filename)
            })

        }

    }),
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    filefilter: (req, file, cb) =>{

        const allowedMimesTypes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif'
        ]

        if(allowedMimesTypes.includes(file.mimesType)){
            cb(null, true)
        }else{
            cb(new Error('Invalid file type'))
        }
    }

}