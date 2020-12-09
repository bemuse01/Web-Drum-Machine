const beat_method = {
    // insert beat
    checkDuplicatedBeatSuccess(result, req, res, beat, model){
        if(result !== null) {
            res.send({success: false, msg: 'Invalid Beat Name.'})
        }else{
            beat.save()
            .then(result => {this.insertBeatSuccess(req, res, model)})
            .catch(err => {this.insertBeatFail(res, err)})
        }
    },
    checkDuplicatedBeatFail(res){
        console.log('dup error')
        res.send({success: false, msg: 'Error: Please try again later.'})
    },
    async insertBeatSuccess(req, res, model){
        const data = await this.getScoreByUserId(model, req.session.userId)

        res.send({success: true, msg: 'Done!', data: data})
    },
    insertBeatFail(res, err){
        console.log('insert error', err)
        res.send({success: false, msg: 'Error: Please try again later.'})
    },




    // delete score
    async deleteScoreSuccess(res, model, userId){
        const data = await this.getScoreByUserId(model, userId)

        res.send({success: true, msg: 'Deleted.', data: data})
    },
    deleteScoreFail(res){
        res.send({success: false})
    },




    // get score
    async getScoreByUserId(model, userId){
        const data = await model.find({userId: userId}).exec()
        return data
    }
}

module.exports = beat_method