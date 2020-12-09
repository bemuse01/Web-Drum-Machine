<template>
    <div id="main-page">
        <div id="main-page-box-wrap" :style="boxWrapStyle">
            <div id="main-page-box">
                <instrument></instrument>
                <transition name="main-menu-transition">
                    <mainMenu v-if="renderMainMenu"></mainMenu>
                </transition>
                <transition name="save-transition">
                    <mainSave v-if="renderSave"></mainSave>
                </transition>
                <transition name="save-transition">
                    <mainDelete v-if="renderDelete"></mainDelete>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
import instrument from '../components/main_page/main_page_instrument'
import mainMenu from '../components/main_page/main_page_menu'
import mainSave from '../components/main_page/main_page_save'
import mainDelete from '../components/main_page/main_page_delete'

export default {
    components: {
        instrument,
        mainMenu,
        mainSave,
        mainDelete
    },
    data(){
        return{
            util: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        }   
    },
    computed: {
        // vuex
        ...mapGetters([
            'renderMainMenu',
            'renderSave',
            'getBeat',
            'renderDelete'
        ]),




        // box wrap style and media query
        boxWrapStyle(){
            if(this.getBeat){
                if(this.util.width > 1342) return {width: 'var(--box-desktop-long-width)'}
                else return {}
            }else{
                if(this.util.width > 1342) return {width: 'var(--box-desktop-short-width)'}
                else return {}
            }
        }
    },
    watch: {
    },
    created(){
        this.redirectBySession()
        window.addEventListener('resize', this.onWindowResize, false)
    },
    methods: {
        // vuex
        ...mapActions([
            'setElementScore'
        ]),




        // event
        onWindowResize(){
            this.util.width = window.innerWidth
            this.util.height = window.innerHeight
        },




        // get main(/main)
        redirectBySession(){
            axios.get('/api/drum/main')
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
            }else{
                this.$router.push({name: 'account'}).catch(() => {})
            }
        },
        createErrorByCatch(){
            return
        }
    }
}
</script>

<style>
@import '../assets/css/main_page/main_page.css';
@import '../assets/css/main_page/main_page_mobile.css';
@import '../assets/css/main_page/main_page_instrument.css';
@import '../assets/css/main_page/main_page_instrument_mobile.css';
@import '../assets/css/main_page/main_page_menu.css';
@import '../assets/css/main_page/main_page_menu_mobile.css';
@import '../assets/css/main_page/main_page_save.css';
@import '../assets/css/main_page/main_page_save_mobile.css';
@import '../assets/css/main_page/main_page_delete.css';
@import '../assets/css/main_page/main_page_delete_mobile.css';
</style>