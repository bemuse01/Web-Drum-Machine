const account_method = {
    createInputText(param){
        return param.len.map((e, i) => ({
            id: i,
            e: e,
            text: e[0].toUpperCase() + e.substring(1),
            cls: param.cls,
            style: {
                span: {top: '50%', transform: 'translate(0, -50%)', color: 'rgba(255, 146, 30, 0.5)'},
                div: {}
            }
        }))
    },
    changeTextToSmall(e){
        e.top = '0'
        e.transform = 'translate(0, -70%) scale(0.65)'
    },
    changeTextToBig(e){
        e.top = '50%'
        e.transform = 'translate(0, -50%) scale(1)'
    },
    changeTextToTrans(e){
        e.color = 'rgba(255, 146, 30, 0.5)'
    },
    changeTextToColor(e){
        e.color = 'rgba(255, 146, 30, 1)'
    },
    enableButton(style, disabled){
        style.button.parent.opacity = '1'
        disabled.button = false
    },
    disableButton(style, disabled){
        style.button.parent.opacity = '0.6'
        disabled.button = true
    },
    clearAlert(style, text){
        style.alert.height = '0px'
        text.alert = ''
    },
    showAlert(style, text, msg){
        style.alert.height = '40px'
        text.alert = msg
    },
    clearModel(model){
        for(let i in model) model[i] = ''
    },
    resetTextField(element){
        element.forEach(e => {
            this.changeTextToBig(e.style.span)
            this.changeTextToTrans(e.style.span)
        })
    }
}

export default account_method