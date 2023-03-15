<template>
    <div class="account-page-component signin">
        <div class="account-alert signin-alert" :style="style.alert">
            <span>{{text.alert}}</span>
        </div>
        <div class="account-input-box signin-input-box">
            <div 
                v-for="i in element.signin"
                :key="i.id"
                :class="`input-box-text ${i.cls}`"
            >
                <span :style="i.style.span">{{i.text}}</span>
                <input :type="i.e === 'id' ? 'text' : 'password'" v-model="model[i.e]" @focus="onFocusInText(i.e)" @blur="onFocusOutText(i.e)">
            </div>
            <div class="input-box-button signin-button" :style="style.button.parent" @mouseenter="onMouseenter" @mouseleave="onMouseleave">
                <input type="button" id="signin-button-for-label" :disabled="disabled.button" @click="executeSignin">
                <label for="signin-button-for-label" :style="style.button.child">
                    <div></div>
                </label>
            </div>
        </div>
        <div class="account-next-page signin-next-page">
            <span @click="changeToSignup">Sign up</span>
            <span @click="moveToMain" class="to-main">As a Guest</span>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import axios from 'axios'
import qs from 'qs'
import param from '../../assets/js/account_page/param'
import account_method from '../../assets/js/account_page/account_page_method'

export default {
    name: 'signin',
    data(){
        return{
            element: {
                signin: account_method.createInputText(param.signin)
            },
            model: {
                id: '',
                pw: ''
            },
            style: {
                alert: {height: '0px'},
                button: {
                    parent: {opacity: '0.6'},
                    child: {background: 'rgba(255, 131, 0, 0)'}
                }
            },
            disabled: {
                button: true
            },
            text: {
                alert: ''
            }
        }
    },
    computed: {
        watchId(){
            return this.model.id
        },
        watchPw(){
            return this.model.pw
        }
    },
    watch: {
        watchId(){
           this.onTextFilled()
        },
        watchPw(){
            this.onTextFilled()
        }
    },
    methods: {
        // vuex
        ...mapActions([
            'changeToSignup'
        ]),



        // to main
        moveToMain(){
            axios.get('/api/drum/main')
            .then(res => {
                this.resultByThen(res.data)
            })
            .catch(err => {
                this.createErrorByCatch()
            })
        },
        // post signin info
        executeSignin(){
            const form = this.appendData()
            const options = {
                url: '/api/drum/signin',
                method: 'post',
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                data: qs.stringify(form)
            }
            
            axios(options)
            .then(res => {
                this.resultByThen(res.data)
            })
            .catch(err => {
                this.createErrorByCatch()
            })
        },
        appendData(){
            const form = {
                userId: this.model.id,
                userPw: this.model.pw
            }
            return form
        },
        resultByThen(result){
            if(result.success === true){
                this.$router.push({name: 'main'})
            }else{
                account_method.showAlert(this.style, this.text, result.msg)
            }
        },
        createErrorByCatch(){
            account_method.showAlert(this.style, this.text, 'Error: Please try Again later.')
        },




        // event
        onTextFilled(){
            account_method.clearAlert(this.style, this.text)

            if(this.watchId.length !== 0 && this.watchPw.length !== 0) {
                account_method.enableButton(this.style, this.disabled)
            }else{
                account_method.disableButton(this.style, this.disabled)
            }
        },
        onMouseenter(){
            if(this.disabled.button === false){
                this.style.button.child.background = 'rgba(255, 131, 0, 0.3)'
            }
        },
        onMouseleave(){
            if(this.disabled.button === false){
                this.style.button.child.background = 'rgba(255, 131, 0, 0)'
            }
        },
        onFocusInText(id){
            this.element.signin.forEach(e => {
                if(id === e.e) {
                    if(this.model[e.e].length === 0) account_method.changeTextToSmall(e.style.span)
                    account_method.changeTextToColor(e.style.span)
                }
            })
        },
        onFocusOutText(id){
            this.element.signin.forEach(e => {
                if(id === e.e) {
                    if(this.model[e.e].length === 0) account_method.changeTextToBig(e.style.span)
                    account_method.changeTextToTrans(e.style.span)
                }
            })
        }
    }
}
</script>

<style>
</style>