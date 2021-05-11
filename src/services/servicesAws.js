const AWS = require('aws-sdk');
const storageS3 = new AWS.S3()
const clenteSendEmail = new AWS.SES({apiVersion: '2010-12-01', region: 'sa-east-1'})

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

        //const fileNameBase64 = new Buffer(`${file.name}`).toString("base64")

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${file.name}.${type}`, // type is not required
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
    
    },

    sendEmail: async (email = {}) => {

        if(!email.AddressesTo && !Array.isArray(email.AddressesTo))
            return {error: 'Endereços de emails destinatario não inforamdos', messageId: null}

        const params = {
            Source: process.env.AWS_EMAIL_SOURCE,
            Destination: { /* required */
                ToAddresses: email.AddressesTo
              },
              Message: { /* required */
                Body: { /* required */
                  Html: {
                   Charset: "UTF-8",
                   Data: email.Message
                  },
                //   Text: {
                //    Charset: "UTF-8",
                //    Data: "Olá mundo"
                //   }
                 },
                 Subject: {
                  Charset: 'UTF-8',
                  Data: email.Subject
                 }
                },
            //   ReplyToAddresses: [
            //      email.ReplyToAddresses | '',
            //     /* more items */
            //   ],
            // CcAddresses: [

            // ]
        }

        if(email.ReplyToAddresses && Array.isArray(email.ReplyToAddresses)){
            params.ReplyToAddresses = email.ReplyToAddresses
        }

        if(email.CcAddresses && Array.isArray(email.CcAddresses)){
            params.CcAddresses = email.CcAddresses
        }

        let messageId = ''
        try {

            messageId =  await clenteSendEmail.sendEmail(params).promise();

        }catch(error){
            return {error, messageId}
        }

        return {error: null, messageId}
    
    }
}