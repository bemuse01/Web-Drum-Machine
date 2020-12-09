<template>
    <div id="account-page">
        <div id="account-page-box-wrap">
            <div id="account-page-box">
                <div id="account-page-logo"><div></div></div>
                <transition name="account-transition">
                    <signin key="signin" v-if="renderAccountPage"></signin>
                    <signup key="signup" v-else></signup>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import signin from '../components/account_page/account_page_signin'
import signup from '../components/account_page/account_page_signup'

export default {
    name: 'account',
    components: {
        'signin': signin,
        'signup': signup
    },
    computed: {
        ...mapGetters([
            'renderAccountPage'
        ])
    },
    created(){
        this.redirectBySession()
    },
    methods: {
        // vuex
        ...mapActions([
            'setElementScore'
        ]),



        // get root(/)
        redirectBySession(){
            axios.get('/api/drum/')
            .then(res => {
                this.resultByThen(res.data)
            })
            .catch(err => {
                this.createErrorByCatch()
            })
        },
        resultByThen(result){
            if(result.success){
                this.setElementScore(result.data)
                this.$router.push({name: 'main'}).catch(() => {})
            }
        },
        createErrorByCatch(){
            return
        }
    }
}
</script>

<style>
@import '../assets/css/account_page/account_page.css';
@import '../assets/css/account_page/account_page_mobile.css';
</style>
