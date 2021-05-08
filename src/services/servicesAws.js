const AWS = require('aws-sdk');
const storageS3 = new AWS.S3()

module.exports ={
    uploadFile: async (file = {}) => {

        const base64Data = new Buffer.from(file.base64.replace(/^data:image\/\w+;base64,/, ""), 'base64')
        const type = file.base64.split(';')[0].split('/')[1]
    
        const mimesType = `image/${type}`
    
        const allowedMimesTypes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif'
        ]

        let location = '';
        let key = '';
    
    
        if(!allowedMimesTypes.includes(mimesType)){
            return {error: 'Invalid file type', location, key}
        }

        const fileNameBase64 = new Buffer(`${file.name}`).toString("base64")

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `${fileNameBase64}.${type}`, // type is not required
            Body: base64Data,
            ACL: 'public-read',
            ContentEncoding: 'base64', // required
            ContentType: mimesType //required. Notice the back ticks
          }
    
       
        try {
            const { Location, Key } = await storageS3.upload(params).promise();
            location = Location;
            key = Key;
        } catch (error) {
            return {error, key, location};
        }

        
        return {error: null, key, location};
    
    }
}