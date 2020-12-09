<template>
    <div class="main-page-component save">
        <div class="save-overlay" @click="toggleSave"></div>
        <div class="save-hide"></div>
        <div class="save-container">
            <div class="save-text save-title"><span>SAVE BEAT</span></div>
            <div class="save-text save-alert" :style="style.alert"><span>{{text.alert}}</span></div>
            <div class="save-input save-beat-name"><input type="text" placeholder="Beat Name" v-model="model.name"></div>
            <div class="save-input save-button">
                <input type="button" :value="text.ok" :disabled="disabled.ok" @click="executeSavebeat">
                <input type="button" value="Cancel" :disabled="disabled.cancel" @click="toggleSave">
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'

export default {
    data(){
        return{
            model: {
                name: ''
            },
            style: {
                alert: {height: '0rem'}
            },
            text: {
                alert: '',
                ok: 'OK'
            },
            disabled: {
                ok: true,
                cancel: false
            }
        }
    },
    computed: {
        // vuex
        ...mapGetters([
            'getElementInst',
            'getBpm',
            'getInst',
            'getBeat'
        ]),




        watchBeat(){
            return this.model.name
        }
    },
    watch: {
        watchBeat(){
            this.onBeatNameFilled()
        }
    },
    methods: {
        // vuex
        ...mapActions([
            'toggleSave',
            'setElementScore'
        ]),




        // event
        onBeatNameFilled(){
            this.hideAlert()

            if(this.model.name !== '') {
                this.disabled.ok = false
            }else{
                this.disabled.ok = true
            }
        },




        // post beat
        executeSavebeat(){
            const form = this.appendData()
            const options = {
                url: '/api/drum/savebeat',
                method: 'post',
                data: form
            }

            this.clearText()
            this.loadButton()
            
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
                name: this.model.name,
                strength: this.getInstrumentStrength(),
                instrument: this.getInst, // 악기 세트 종류 ex) jazz drum
                beat: this.getBeat, // 박자 ex) 4/3, 4/4
                bpm: this.getBpm
            }
            return form
        },
        resultByThen(result){
            if(result.success === true){
                this.showAlert(result.msg)
            }else{
                this.showAlert(result.msg)
            }
            this.setElementScore(result.data)
            console.log(result.data)
            this.resetButton()
        },
        createErrorByCatch(){
            this.showAlert('Error: Please try again later.')
            this.resetButton()
        },

        // ok button
        loadButton(){
            this.text.ok = 'Wait...'
        },
        resetButton(){
            this.text.ok = 'OK'
        },

        // clear model name
        clearText(){
            this.model.name = ''
        },

        // alert
        showAlert(msg){
            this.text.alert = msg
            this.style.alert.height = '4rem'
        },
        hideAlert(){
            this.text.alert = ''
            this.style.alert.height = '0rem'
        },

        // get instrument strength
        getInstrumentStrength(){
            const arr = []
            this.getElementInst.forEach(e => {
                const temp = []
                e.panel.forEach(c => {
                    temp.push(c.strength)
                })
                arr.push(temp)
            })
            return arr
        },
    }
}
</script>

<style>
</style>