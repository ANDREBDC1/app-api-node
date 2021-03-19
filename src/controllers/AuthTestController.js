module.exports = {
    testAuth : async (req, res) =>{
        res.send({auth: true, userId : req.userId});
    }
}