module.exports = {
    testAuth : async (req, res) =>{
        res.status(200).json({auth: true, userId : req.userId});
    }
}