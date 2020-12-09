const user_method = {
    // redirect
    // redirectBySession(req, res){
    //     const {userId} = req.session

    //     if(userId === undefined) this.redirectFail(res)
    //     else this.redirectSuccess(userId, res)
    // },
    async redirectSuccess(userId, res, model){
        const data = await this.getScoreByUserId(model, userId)

        res.send({success: true, data: data})
    },
    redirectFail(res){
        res.send({success: false})
    },




    // signin
    async signinSuccess(result, req, res, model){
        if(result === null) {
            res.send({success: false, msg: 'Incorrect username or password.'})
        }else{
            const {userId} = result
            // const data = {
            //     beat: this.getScoreByUserId(model, userId)
            // }
            const data = await this.getScoreByUserId(model, userId)

            req.session.userId = userId

            res.send({success: true, data: data})
        }
    },
    signinFail(res){
        res.send({success: false, msg: 'Error: Please try again later.'})
    },




    // signup
    signupSuccess(res){
        res.send({success: true, msg: 'Done!'})
    },
    signupFail(err, res){
        const code = err.code

        if(code === 11000) res.send({success: false, msg: 'The id is not available.'})
        else res.send({success: false, msg: 'Error: Please try again later.'})
    },




    // logout
    logoutSuccess(res){
        res.send({success: true})
    },
    logoutFail(res){
        res.send({success: false})
    },




    // get score
    async getScoreByUserId(model, userId){
        const data = await model.find({userId: userId}).exec()
        return data
    }
}

module.exports = user_method