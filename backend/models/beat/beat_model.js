const mongoose = require('mongoose')

const beat_method = require('../beat/beat_model_method') 

const beatSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    strength: {type: Array, required: true},
    instrument: {type: String, required: true},
    beat: {type: Boolean, required: true},
    bpm: {type: Number, required: true}
}, {
    timestamps: true,
    collection: 'beats'
})

beatSchema.statics.insertBeat = function(req, res){
    const dup = this.findOne({userId: req.session.userId, name: req.body.name})

    dup.then(result => {
        const beat = new this({userId: req.session.userId, ...req.body})

        beat_method.checkDuplicatedBeatSuccess(result, req, res, beat, this)
    }).catch(err => {
        beat_method.checkDuplicatedBeatFail(res)
    })
}

beatSchema.statics.getModel = function(){
    return this
}

beatSchema.statics.deleteScore = function(req, res, ObjectId){
    const {score} = req.body, userId = req.session.userId
    const _id = score.map(e => new ObjectId(e))

    this.deleteMany({userId: userId, _id: {$in: _id}})
    .then(result => {
        beat_method.deleteScoreSuccess(res, this, userId)
    }).catch(err => {
        beat_method.deleteScoreFail(res)
    })
}

module.exports = mongoose.model('beat', beatSchema)