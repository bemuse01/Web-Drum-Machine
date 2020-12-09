<template>
    <div class="main-page-component delete">
        <div class="delete-overlay" @click="toggleDelete"></div>
        <div class="delete-container">
            <div class="delete-search">
                <input type="text" placeholder="Search..." v-model="model.search">
                <input type="button" :value="button.delete" :disabled="disabled.delete" @click="executeDeleteScore">
            </div>
            <div class="delete-selected-number" :style="style.selected">
                <span>Selected: {{model.selected.length}}</span>
            </div>
            <div class="delete-alert" :style="style.alert">
                <span>{{text.alert}}</span>
            </div>
            <div class="delete-score-list">
                <div class="scores"
                    v-for="i in score"
                    :key="i._id"
                    :style="i.style"
                >
                    <input type="checkbox" :id="`delete-checkbox-${i._id}`" :value="i._id" v-model="model.selected">
                    <label :for="`delete-checkbox-${i._id}`">
                        <p>Title: {{i.name}}</p>
                        <p>Instrument: {{i.instrument}}</p>
                        <p>Beat: {{i.beat === true ? '4/4' : '3/4'}}</p>
                        <p>BPM: {{i.bpm}}</p>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import qs from 'qs'

export default {
    data(){
        return{
            style: {
                selected: {height: '0rem'},
                alert: {height: '0rem'}
            },
            text: {
                alert: ''
            },
            model: {
                selected: [],
                search: ''
            },
            button: {
                delete: 'Delete'
            },
            disabled: {
                delete: true 
            }
        }
    },
    computed: {
        // vuex
        ...mapGetters([
            'getElementScore',
            'searchedScore'
        ]),




        // selected
        selected(){
            return this.model.selected
        },




        // search
        search(){
            return this.model.search
        },




        // score
        score(){
            return this.searchedScore(this.search)
        }
    },
    watch: {
        selected(){
            this.hideAlert()
            this.toggleSelected()
        },
        search(){
            this.searchScore()
        }
    },
    created(){
    },
    methods: {
        // vuex
        ...mapActions([
            'toggleDelete',
            'setElementScore',
            'showElementScore',
            'hideElementScore'
        ]),




        // selected
        clearSelected(){
            this.model.selected = []
        },
        toggleSelected(){
            if(this.selected.length !== 0){
                this.style.selected.height = '2.4rem'
                this.disableDeleteButton(false)
            }else{
                this.style.selected.height = '0rem'
                this.disableDeleteButton(true)
            }
        },




        // delete score
        executeDeleteScore(){
            const form = this.appendData()
            const options = {
                url: '/api/drum/deleteScore',
                method: 'post',
                headers: { 'content-type': 'multipart/form-data' },
                data: form
            }

            // this.clearText()
            // this.loadButton()
            this.changeDeleteText('Deleting...')

            axios(options)
            .then(res => {
                this.resultByThen(res.data)
            })
            .catch(err => {
                this.createErrorByCatch()
            })
        },
        appendData(){
            const form = new FormData()

            this.model.selected.forEach(e => {
                form.append('score[]', e)
            })

            return form
        },
        async resultByThen(result){
            if(result.success){
                await this.clearSelected()
                this.showAlert(result.msg)
                this.setElementScore(result.data)
                this.changeDeleteText('Delete')
            }else{
                this.showAlert('Error: Please try again later.')
            }
        },
        createErrorByCatch(){
            this.showAlert('Error: Please try again later.')
        },




        // delete button
        changeDeleteText(text){
            this.button.delete = text
        },
        disableDeleteButton(disable){
            this.disabled.delete = disable
        },




        // search
        searchScore(){
        },




        // alert
        showAlert(msg){
            this.text.alert = msg
            this.style.alert.height = '2.4rem'
        },
        hideAlert(){
            this.text.alert = ''
            this.style.alert.height = '0rem'
        },




        test(){
            if(this.text.alert === '') this.showAlert('Error: Please try again later.')
            else this.hideAlert()
        }
    }
}
</script>

<style>

</style>