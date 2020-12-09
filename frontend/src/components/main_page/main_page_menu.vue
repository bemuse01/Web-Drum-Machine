<template>
    <div class="main-page-component menu">
        <div class="menu-overlay" @click="toggleMainMenu"></div>
        <div class="menu-container-wrap" :style="toggleMenuWrapStyle">
            <div class="menu-container-box">
                <div class="menu-hide" @click="toggleMainMenu"><div></div></div>
                <div class="menu-container set-menu-container">
                    <div class="set-menu-button select-inst-button">
                        <span>Instrument: </span>
                        <select v-model="instrument">
                            <option
                                v-for="i in element.inst"
                                :key="i.id"
                                :value="i.name"
                            >{{i.text}}
                            </option>
                        </select>
                    </div>
                    <div class="set-menu-button select-beat-button">
                        <span>Beat: </span>
                        <input type="checkbox" id="select-beat" v-model="beat">
                        <label for="select-beat">
                            <div :style="beatButtonStyle.style"><span>{{beatButtonStyle.text}}</span></div>
                        </label>
                    </div>
                    <div class="set-menu-button select-saved-button">
                        <span>Score: </span>
                        <select v-model="score">
                            <option disabled value="Select Score">Select Score</option>
                            <option
                                v-for="i in getElementScore"
                                :key="i._id"
                                :value="i.name"
                            >{{i.name}}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="menu-containter account-menu-container">
                    <div class="account-menu-button logout-button" @click="executeLogout">
                        <div></div>
                    </div>
                    <div class="account-menu-button save-button" @click="toggleSave">
                        <div></div>
                    </div>
                    <div class="account-menu-button delete-button" @click="toggleDelete">
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import param from '../../assets/js/main_page/param'
import main_method from '../../assets/js/main_page/main_page_method'

export default {
    data(){
        return{
            element: {
                inst: main_method.createSelectButton(param.select.inst)
            },
            util: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            sound: {
                hslStep: 15
            }
        }
    },
    beforeDestroy(){
        this.hideMenu()
    },
    created(){
        window.addEventListener('resize', this.onWindowResize, false)
    },
    computed: {
        // vuex
        ...mapGetters([
            'renderMainMenu',
            'getInst',
            'getBeat',
            'getElementInst',
            'getScore',
            'getElementScore',
            'getSoundInterval'
        ]),




        instrument: {
            get(){
                return this.getInst
            },
            set(value){
                this.setInst(value)
            }
        },
        beat: {
            get(){
                return this.getBeat
            },
            set(){
                this.toggleBeat()
            }
        },
        score: {
            get(){
                return this.getScore
            },
            set(value){
                this.setScore(value)
            }
        },
        beatButtonStyle(){
            if(this.getBeat){
                return {style: {transform: 'translate(0, 0)'}, text: '4/4'}
            }else{
                return {style: {transform: 'translate(100%, 0)'}, text: '3/4'}
            }
        },
        toggleMenuWrapStyle(){
            if(this.getBeat){
                if(this.util.width > 1342) return {width: 'var(--menu-container-wrap-desktop-long-width)'}
                else return {}
            }else{
                if(this.util.width > 1342) return {width: 'var(--menu-container-wrap-desktop-short-width)'}
                else return {}
            }
        }
    },
    watch: {
        getInst(){
            // change instrument element src
            this.changeInstrumentSrc(this.getInst)
        },
        getBeat(){
            this.togglePanelByBeat()
        },
        getScore(){
            this.setPanelByScore()
        }
    },
    methods: {
        // vuex
        ...mapActions([
            'toggleMainMenu',
            'toggleSave',
            'setInst',
            'changeInstrumentSrc',
            'toggleBeat',
            'removePanel',
            'addPanel',
            'setScore',
            'setBpm',
            'changeStrength',
            'changeColor',
            'setStrength',
            'setBeat',
            'toggleSoundInterval',
            'toggleDelete'
        ]),




        // event
        onWindowResize(){
            this.util.width = window.innerWidth
            this.util.height = window.innerHeight
        },




        // logout
        executeLogout(){
            axios.get('/api/drum/logout')
            .then(res => {
                this.resultByThen(res.data)
            })
            .catch(err => {
                this.createErrorByCatch()
            })
        },
        resultByThen(result){
            if(result.success){
                this.$router.push({name: 'account'})
            }
        },
        createErrorByCatch(){
            return
        },




        // by changing beat
        togglePanelByBeat(){
            if(this.getBeat && this.getElementInst[0].panel.length != 16){
                this.addPanel(this.getInst)
            }else{
                this.removePanel()
            }
        },




        // set panel
        async setPanelByScore(){
            if(this.getSoundInterval) await this.toggleSoundInterval()

            const item = this.getElementScore.find(x => x.name === this.getScore)

            if(item === undefined) return

            await this.setBeat(item.beat)
            await this.setStrength(item.strength)

            this.changeColorSoundPanel()
            this.setBpm(item.bpm)
            this.setInst(item.instrument)

            this.setScore('Select Score')
        },
        changeColorSoundPanel(){
            const hslStep = this.sound.hslStep

            this.getElementInst.forEach(e => {
                const inst = e.id
                e.panel.forEach(c => {
                    const strength = c.strength, panel = c.key
                    this.changeColor({inst, panel, strength, hslStep})
                })
            })
        },
        // clickSoundPanel(inst, panel){
        //     this.changeStrength({inst, panel})
        //     const strength = this.getStrength({inst, panel})

        //     this.changeColorSoundPanel(inst, panel, strength)
        // },
        // changeColorSoundPanel(inst, panel, strength){
        //     let hslStep = this.sound.hslStep

        //     this.changeColor({inst, panel, strength, hslStep})
        // },
        // onWindowResize(){
        //     this.util.width = window.innerWidth
        //     this.util.height = window.innerHeight
            
        //     this.resizeButtonWrap()
        // },



        // before destory
        hideMenu(){
            if(this.renderMainMenu) this.toggleMainMenu()
        }
    }
}
</script>

<style>
</style>