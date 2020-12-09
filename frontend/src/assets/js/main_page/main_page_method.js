const main_method = {
    createInstrument(param){
        const arr = []
        for(let i = 0; i < param.len; i++){
            arr[i] = {
                id: i,
                panel: this.createPanel(param, i),
                style: {
                    background: `url('./assets/src/image/${param.img}${i + 1}.png') no-repeat center center / cover`
                }
            }
        }
        return arr
    },
    createPanel(param, index){
        const arr = []
        for(let i = 0; i < param.panel; i++){
            arr[i] = {
                key: i, 
                strength: 0,
                param: {
                    inst: index,
                    panel: i
                },
                src: 'jazz',
                style: {
                    panel: {},
                    progress: {}
                }
            }
        }
        return arr
    },
    createProgress(param){
        const arr = []
        for(let i = 0; i < param.len; i++){
            arr[i] = {
                id: i,
                style: {
                    background: 'rgba(50, 60, 70, 0.75)'
                }
            }
        }
        return arr
    },
    createSelectButton(param){
        return param.list.map((e, i) => ({
            id: i,
            name: e,
            text: e[0].toUpperCase() + e.substring(1, e.length)
        }))
    }
}

export default main_method