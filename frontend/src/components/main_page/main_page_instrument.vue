<template>
    <div class="main-page-component instrument" :style="changeStyleByBeat.instrument">
        <div class="instrument-container panel-container">
            <div class="instrument-panel-wrap panel-flex-wrap" :style="changeStyleByBeat.panelWrap">
                <div
                    class="instrument-panel"
                    v-for="i in getElementInst"
                    :key="i.id"
                >
                    <div class="instrument-element-wrap panel-element-wrap">
                        <div class="icon-element icon-in-panel" :style="i.style"></div>
                        <div 
                            class="instrument-element panel-element"
                            v-for="j in i.panel"
                            :key="j.key"
                            :style="j.style.panel"
                        >
                        </div>
                    </div>
                </div>
            </div>
            <div class="instrument-panel-wrap progress-flex-wrap" :style="changeStyleByBeat.panelWrap">
                <div
                    class="instrument-panel"
                    v-for="i in getElementInst"
                    :key="i.id"
                >
                    <div class="instrument-element-wrap progress-element-wrap">
                        <div class="icon-element icon-in-progress"></div>
                        <div
                            class="instrument-element progress-element"
                            v-for="j in i.panel"
                            :key="j.key"
                            :style="j.style.progress"
                            @click="clickSoundPanel(i.id, j.key)"
                        >
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="instrument-container button-container" :style="changeStyleByBeat.buttonContainer">
            <div class="instrument-button-wrap" :style="style.buttonWrap">
                <div class="instrument-button play-button" @click="toggleSoundInterval">
                    <div :style="style.button.play"></div>
                </div>
                <div class="instrument-button reset-button" @click="resetSoundPanel">
                    <div :style="style.button.reset"></div>
                </div>
                <div class="instrument-button random-button" @click="randSoundPanel">
                    <div :style="style.button.random"></div>
                </div>
                <div class="instrument-button bpm-button">
                    <div><span>{{getBpm}} bpm</span></div>
                    <div>
                        <div @click="increaseBpm"></div>
                        <div @click="decreaseBpm"></div>
                    </div>
                </div>
                <div class="instrument-button side-menu-button" @click="toggleMainMenu">
                    <div :style="style.button.menu"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import param from '../../assets/js/main_page/param'
import main_method from '../../assets/js/main_page/main_page_method'

export default {
    data(){
        return{
            element: {
                inst: main_method.createInstrument(param.instrument),
                progress: main_method.createProgress(param.progress)
            },
            model: {
                bpm: 100,
            },
            sound: {
                minToSec: 60000,
                interval: null,
                beat: 4,
                progress: 0,
                pad: 0,
                chance: 0.9,
                hslStep: 15,
                maxBpm: 197,
                minBpm: 53
            },
            util: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            css: {
                button: { // vh
                    size: 0.07,
                    margin: 0.01, 
                    wrap: 0.88
                }
            },
            style: {
                buttonWrap: {},
                button: {
                    play: {background: `url('./assets/src/image/play.png') no-repeat center center / cover`},
                    reset: {background: `url('./assets/src/image/reset.png') no-repeat center center / cover`},
                    random: {background: `url('./assets/src/image/random.png') no-repeat center center / cover`},
                    menu: {background: `url('./assets/src/image/menu.png') no-repeat center center / cover`}
                }
            }
        }
    },
    beforeDestroy(){
        this.destroyElements()
    },
    computed: {
        // vuex
        ...mapGetters([
            'getSoundInterval',
            'getElementInst',
            'getStrength',
            'getBpm',
            'getBeat'
        ]),




        // calc bpm
        loopTime(){
            return this.sound.minToSec / this.getBpm / this.sound.beat
        },

        // change style by beat
        changeStyleByBeat(){
            if(this.getBeat){
                if(this.util.width > 1342){
                    return{
                        instrument: {width: 'var(--instrument-container-long-width)'},
                        buttonContainer: {width: 'var(--button-container-long-width)'},
                        panelWrap: {width: 'var(--panel-wrap-long-width)'}
                    }
                }else{
                    return{
                        instrument: {},
                        buttonContainer: {},
                        panelWrap: {}
                    }
                }
            }else{
                if(this.util.width > 1342){
                    return{
                        instrument: {width: 'var(--instrument-container-short-width)'},
                        buttonContainer: {width: 'var(--button-container-short-width)'},
                        panelWrap: {width: 'var(--panel-wrap-short-width)'}
                    }
                }else{
                    return{
                        instrument: {},
                        buttonContainer: {},
                        panelWrap: {}
                    }
                }
            }
        },
    },
    watch: {
        getBpm(){
            if(this.getBpm > 197) this.setBpm(this.sound.maxBpm)
            else if(this.getBpm < 53) this.setBpm(this.sound.minBpm)
        },
        getSoundInterval(){
            if(this.getSoundInterval) this.playInterval()
            else this.stopInterval()
        }
    },
    created(){
        // screen.orientation.lock('landscape')
        this.init()
    },
    methods: {
        // vuex
        ...mapActions([
            'toggleSoundInterval',
            'toggleMainMenu',
            'initElementInst',
            'changeStrength',
            'changeColor',
            'resetPanelParam',
            'changeProgress',
            'resetProgress',
            'randStrength',
            'increaseBpm',
            'decreaseBpm',
            'setBpm'
        ]),




        // interval

        // toggle interval
        playInterval(){
            setTimeout(this.playSound, this.loopTime)
            this.changeButtonToStop()
        },
        stopInterval(){
            let progress = this.sound.progress

            clearTimeout(this.sound.interval)
            this.resetProgressByAll(true)
            this.resetSoundValue()
            this.changeButtonToPlay()
        },
        changeButtonToPlay(){
            this.style.button.play.background = `url('./assets/src/image/play.png') no-repeat center center / cover`
        },
        changeButtonToStop(){
            this.style.button.play.background = `url('./assets/src/image/stop.png') no-repeat center center / cover`
        },

        // interval main function
        playSound(){

            this.resetProgressByAll(false)
            this.playProgress()
            this.playSoundByStrength()

            this.sound.interval = setTimeout(this.playSound, this.loopTime)
        },
        playSoundByStrength(){
            let audios = []
            this.getElementInst.forEach(e => {
                if(e.panel[this.sound.pad].strength !== 0){
                    audios.push(e.panel[this.sound.pad])
                }
            })

            audios.forEach(e => {
                let audio = new Audio()
                audio.src = './assets/src/sound/'+ e.src +'/' + e.src + ' ('+ (e.param.inst + 1) +').WAV'
                audio.volume = 0.4 + (e.strength - 1) * 0.3
                audio.play()
            })
            
            this.sound.pad++
            if(this.sound.pad === this.getElementInst[0].panel.length) {
                this.sound.pad = 0
            }
        },

        // interval progress
        playProgress(){
            let progress = this.sound.progress
            this.changeProgress({progress})

            this.sound.progress++
            if(this.sound.progress === this.getElementInst[0].panel.length) {
                this.sound.progress = 0
            }
        },
        resetProgressByAll(all){
            let progress = this.sound.progress

            this.resetProgress({all, progress})
        },
        resetSoundValue(){
            this.sound.pad = 0
            this.sound.progress = 0
        },




        // media query
        initCss(){
            this.initButtonWrap()
        },
        initButtonWrap(){
            this.resizeButtonWrap()
        },
        resizeButtonWrap(){
            if(this.util.width <= 1024 && this.util.width < this.util.height){
                let buttonWrap = this.util.width * this.css.button.wrap,
                    menuSize = this.util.height * this.css.button.size * 6 + this.util.height * this.css.button.margin * 4

                if(buttonWrap > menuSize){
                    this.style.buttonWrap = {width: `100%`}
                }else{
                    // this.style.buttonWrap = {width: `calc(var(--button-mobile-portrait-height) * 6 + var(--pad-mobile-margin) * 4)`}
                    this.style.buttonWrap = {width: `108vw`}
                }
            }else{
                this.style.buttonWrap = {}
            }
        },




        // event
        clickSoundPanel(inst, panel){
            this.changeStrength({inst, panel})
            const strength = this.getStrength({inst, panel})

            this.changeColorSoundPanel(inst, panel, strength)
        },
        changeColorSoundPanel(inst, panel, strength){
            let hslStep = this.sound.hslStep

            this.changeColor({inst, panel, strength, hslStep})
        },
        onWindowResize(){
            this.util.width = window.innerWidth
            this.util.height = window.innerHeight
            
            this.resizeButtonWrap()
        },




        // button

        // reset button
        resetSoundPanel(){
            this.stopInterval()
            this.resetPanelParam()
            if(this.getSoundInterval) this.toggleSoundInterval()
        },

        // random button
        randSoundPanel(){
            this.resetSoundPanel()
            this.randPanelStrength()
        },
        randPanelStrength(){
            let chance = this.sound.chance, hslStep = this.sound.hslStep

            this.randStrength({chance, hslStep})
        },




        // on created
        init(){
            this.initElementInst()
            this.initCss()

            window.addEventListener('resize', this.onWindowResize, false)
        },




        // before destroy
        destroyElements(){
            this.resetSoundPanel()
        }
    }
}
</script>

<style>
</style>