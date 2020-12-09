const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)

const beat_model = require('../beat/beat_model')
const user_method = require('./user_model_method')

const userSchema = new mongoose.Schema({
    userId: {type: String, required: true, unique: true},
    userPw: {type: String, required: true}
}, {
    timestamps: true,
    collection: 'users'
})

// redirect
userSchema.statics.redirectBySession = function(req, res){
    const {userId} = req.session

    if(userId === undefined) user_method.redirectFail(res)
    else user_method.redirectSuccess(userId, res, beat_model.getModel())
}

// signin
userSchema.statics.signin = function(req, res){
    const user = this.findOne(req.body)

    user
    .then(result => {user_method.signinSuccess(result, req, res, beat_model.getModel())})
    .catch(err => {user_method.signinFail(res)})
}

// signup
userSchema.statics.signup = function(req, res){
    const user = new this(req.body)

    user.save()
    .then(result => {user_method.signupSuccess(res)})
    .catch(err => {user_method.signupFail(err, res)})
}

// logout
userSchema.statics.logout = function(req, res){
    req.session.userId = undefined

    if(req.session.userId === undefined) user_method.logoutSuccess(res)
    else user_method.logoutFail(res)
}

module.exports = mongoose.model('user', userSchema)