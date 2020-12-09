require('dotenv').config()

const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const multer = require('multer')

const upload = multer()
const router = express.Router()

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))
app.use(router)

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})

const OjbectId = mongoose.Types.ObjectId
const user_model = require('../models/user/user_model')
const beat_model = require('../models/beat/beat_model')

router.get('/', (req, res, next) => {
    user_model.redirectBySession(req, res)
})
router.get('/main', (req, res, next) => {
    user_model.redirectBySession(req, res)
})
router.post('/signin', (req, res, next) => {
    user_model.signin(req, res)
})
router.post('/signup', (req, res, next) => {
    user_model.signup(req, res)
})
router.get('/logout', (req, res, next) => {
    user_model.logout(req, res)
})
router.post('/savebeat', (req, res, next) => {
    beat_model.insertBeat(req, res)
})
router.post('/deleteScore', upload.none(), (req, res, next) => {
    beat_model.deleteScore(req, res, OjbectId)
})

module.exports = app
