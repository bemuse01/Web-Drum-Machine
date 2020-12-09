<template>
    <div class="account-page-component signup">
        <div class="account-alert signup-alert" :style="style.alert">
            <span>{{text.alert}}</span>
        </div>
        <div class="account-input-box signup-input-box">
            <div 
                v-for="i in element.signup"
                :key="i.id"
                :class="`input-box-text ${i.cls}`"
            >
                <span :style="i.style.span">{{i.text}}</span>
                <input :type="i.e === 'id' ? 'text' : 'password'" v-model="model[i.e]" @focus="onFocusInText(i.e)" @blur="onFocusOutText(i.e)">
            </div>
            <div class="input-box-button signup-button" :style="style.button.parent" @mouseenter="onMouseenter" @mouseleave="onMouseleave">
                <input type="button" id="signup-button-for-label" :disabled="disabled.button" @click="executeSignup">
                <label for="signup-button-for-label" :style="style.button.child">
                    <div></div>
                </label>
            </div>
        </div>
        <div class="account-next-page signup-next-page">
            <span @click="changeToSignin">Sign in</span>
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
    data(){
        return{
            element: {
                signup: account_method.createInputText(param.signup)
            },
            model: {
                id: '',
                pw: '',
                cpw: ''
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
        },
        watchCpw(){
            return this.model.cpw
        }
    },
    watch: {
        watchId(){
           this.onTextFilled()
        },
        watchPw(){
            this.onTextFilled()
        },
        watchCpw(){
            this.onTextFilled()
        }
    },
    methods: {
        // vuex
        ...mapActions([
           'changeToSignin' 
        ]),




        // post signup info
        executeSignup(){
            const form = this.appendData()
            const options = {
                url: '/api/drum/signup',
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
                userPw: this.model.cpw
            }
            return form
        },
        async resultByThen(result){
            if(result.success){
                await account_method.clearModel(this.model)
                account_method.resetTextField(this.element.signup)
                account_method.showAlert(this.style, this.text, result.msg)
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

            if(this.watchId.length !== 0 && this.watchPw.length !== 0 && this.watchCpw.length !== 0) {
                if(this.watchPw === this.watchCpw){
                    account_method.enableButton(this.style, this.disabled)
                    account_method.clearAlert(this.style, this.text)
                }else{
                    account_method.disableButton(this.style, this.disabled)
                    account_method.showAlert(this.style, this.text, 'Confirm password.')
                }
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
            this.element.signup.forEach(e => {
                if(id === e.e) {
                    if(this.model[e.e].length === 0) account_method.changeTextToSmall(e.style.span)
                    account_method.changeTextToColor(e.style.span)
                }
            })
        },
        onFocusOutText(id){
            this.element.signup.forEach(e => {
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