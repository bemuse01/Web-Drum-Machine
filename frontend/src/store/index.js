import Vue from 'vue'
import Vuex from 'vuex'
import main_param from '../assets/js/main_page/param'
import main_method from '../assets/js/main_page/main_page_method'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        render: {
            account: true,
            main: {
                menu: false,
                save: false,
                delete: false
            }
        },
        sound: {
            interval: false,
            instrument: 'jazz',
            beat: true,
            bpm: 100,
            score: 'Select Score'
        },
        element: {
            inst: [],
            score: []
        }
    },
    getters: {
        // account
        renderAccountPage: state => state.render.account,




        // instrument
        getSoundInterval: state => state.sound.interval,
        getElementInst: state => state.element.inst,
        getStrength: state => ({inst, panel}) => state.element.inst[inst].panel[panel].strength,
        getBpm: state => state.sound.bpm,
        getInst: state => state.sound.instrument,
        getBeat: state => state.sound.beat,
        getElementScore: state => state.element.score,
        getScore: state => state.sound.score,




        // main menu
        renderMainMenu: state => state.render.main.menu,




        // save
        renderSave: state => state.render.main.save,




        // delete
        renderDelete: state => state.render.main.delete,
        searchedScore: state => text => {
            if(text !== ''){
                return state.element.score.filter(e => {
                    if(e.name.search(text) !== -1 || e.instrument.search(text) !== -1) return true
                    return false
                })
            }else return state.element.score
        }
    },
    mutations: {
        // account
        changeToSignup(state){
            state.render.account = false
        },
        changeToSignin(state){
            state.render.account = true
        },




        // instrument
        toggleSoundInterval(state){
            state.sound.interval = !state.sound.interval
        },
        initElementInst(state){
            state.element.inst = main_method.createInstrument(main_param.instrument)
        },
        changeStrength(state, {inst, panel}){
            state.element.inst[inst].panel[panel].strength = (state.element.inst[inst].panel[panel].strength + 1) % 4
        },
        randStrength(state, {chance, hslStep}){
            state.element.inst.forEach(e => {
                e.panel.forEach(c => {
                    if(Math.random() > chance){
                        c.strength = Math.floor(Math.random() * 3 + 1)
                        c.style.panel = {
                            background: `hsl(${40 + (c.strength - 1) * hslStep}, 100%, 60%)`
                        }
                    }
                })
            })
        },
        setStrength(state, strength){
            state.element.inst.forEach((e, i) => {
                e.panel.forEach((c, j) => {
                    c.strength = strength[i][j]
                })
            })
        },
        resetPanelStyle(state, {inst, panel}){
            state.element.inst[inst].panel[panel].style.panel = {}
        },
        setPanelStyle(state, {inst, panel, strength, hslStep}){
            state.element.inst[inst].panel[panel].style.panel = {
                background: `hsl(${40 + (strength - 1) * hslStep}, 100%, 60%)`
            }
        },
        resetPanelParam(state){
            state.element.inst.forEach(e => {
                e.panel.forEach(c => {
                    c.strength = 0
                    c.style.panel = {}
                })
            })
        },
        changeProgress(state, {progress}){
            state.element.inst.forEach(e => {
                e.panel[progress].style.progress = {
                    background: 'rgba(0, 155, 254, 0.8)'
                } 
            })
        },
        resetProgress(state, {all, progress}){
            if(all === false){
                if(progress !== 0){
                    state.element.inst.forEach(e => {
                        e.panel[progress - 1].style.progress = {}
                    })
                }else{
                    state.element.inst.forEach(e => {
                        e.panel[e.panel.length - 1].style.progress = {} 
                    })
                }
            }else{
                state.element.inst.forEach(e => {
                    e.panel.forEach(c => {
                        c.style.progress = {}
                    })
                })
            }
        },
        increaseBpm(state){
            state.sound.bpm += 1
        },
        decreaseBpm(state){
            state.sound.bpm -= 1
        },
        setBpm(state, bpm){
            state.sound.bpm = bpm
        },
        setInst(state, value){
            state.sound.instrument = value
        },
        setElementScore(state, score){
            state.element.score = score
        },
        setScore(state, score){
            state.sound.score = score
        },
        changeInstrumentSrc(state, src){
            state.element.inst.forEach(e => {
                e.panel.forEach(c => {
                    c.src = src
                })
            })
        },
        toggleBeat(state){
            state.sound.beat = !state.sound.beat
        },
        setBeat(state, beat){
            state.sound.beat = beat
        },
        removePanel(state){
            state.element.inst.forEach(e => {
                e.panel = e.panel.slice(0, e.panel.length - 4)
            })
        },
        addPanel(state, inst){
            state.element.inst.forEach((e, index) => {
                for(let i = 0; i < 4; i++){
                    e.panel.push({
                        key: e.panel.length, 
                        strength: 0,
                        param: {
                            inst: index,
                            panel: e.panel.length
                        },
                        src: inst,
                        style: {
                            panel: {},
                            progress: {}
                        }
                    })
                }
            })
        },




        // main menu
        toggleMainMenu(state){
            state.render.main.menu = !state.render.main.menu
        },




        // save
        toggleSave(state){
            state.render.main.save = !state.render.main.save
        },




        // delete
        toggleDelete(state){
            state.render.main.delete = !state.render.main.delete
        },
        showElementScore(state, i){
            state.element.score[i].style.display = 'block'
        },
        hideElementScore(state, i){
            state.element.score[i].style.display = 'none'
        }
    },
    actions: {
        // account
        changeToSignup({commit}){
            commit('changeToSignup')
        },
        changeToSignin({commit}){
            commit('changeToSignin')
        },




        // instrument
        toggleSoundInterval({commit}){
            commit('toggleSoundInterval')
        },
        initElementInst({commit}){
            commit('initElementInst')
        },
        changeStrength({commit}, {inst, panel}){
            commit('changeStrength', {inst, panel})
        },
        randStrength({commit}, {chance, hslStep}){
            commit('randStrength', {chance, hslStep})
        },
        setStrength({commit}, strength){
            commit('setStrength', strength)
        },
        changeColor({commit}, {inst, panel, strength, hslStep}){
            if(strength === 0) commit('resetPanelStyle', {inst, panel})
            else commit('setPanelStyle', {inst, panel, strength, hslStep})
        },
        resetPanelParam({commit}){
            commit('resetPanelParam')
        },
        changeProgress({commit}, {progress}){
            commit('changeProgress', {progress})
        },
        resetProgress({commit}, {all, progress}){
            commit('resetProgress', {all, progress})
        },
        increaseBpm({commit}){
            commit('increaseBpm')
        },
        decreaseBpm({commit}){
            commit('decreaseBpm')
        },
        setBpm({commit}, bpm){
            commit('setBpm', bpm)
        },
        setInst({commit}, value){
            commit('setInst', value)
        },
        setElementScore({commit}, score){
            commit('setElementScore', score)
        },
        setScore({commit}, score){
            commit('setScore', score)
        },
        changeInstrumentSrc({commit}, src){
            commit('changeInstrumentSrc', src)
        },
        toggleBeat({commit}){
            commit('toggleBeat')
        },
        setBeat({commit}, beat){
            commit('setBeat', beat)
        },
        removePanel({commit}){
            commit('removePanel')
        },
        addPanel({commit}, inst){
            commit('addPanel', inst)
        },




        // main menu 
        toggleMainMenu({commit}){
            commit('toggleMainMenu')
        },




        // save
        toggleSave({commit}){
            commit('toggleSave')
        },




        // delete
        toggleDelete({commit}){
            commit('toggleDelete')
        },
        showElementScore({commit}, i){
            commit('showElementScore', i)
        },
        hideElementScore({commit}, i){
            commit('hideElementScore', i)
        }
    },
    modules: {

    }
})
