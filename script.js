//varivel que guarda todos os objetos anotaçoes, se tiver algo no local storage
if ( localStorage.getItem('dados')){
    var parcer = localStorage.getItem('dados')
    var allAnotations = JSON.parse(parcer)
}
else{
    var allAnotations = []
}
var anotacaoSelecionada
var deletado
desenharAnotacoes()
function selectAnotacao(id){
    toggleMenu()
    var title = document.getElementById('title')
    title.innerText = allAnotations[id].nome
    anotacaoSelecionada = id
    console.log('selecionou '+(id+1))
    desenharTasks(id)
    document.querySelector('main').style.display = 'flex'
}
//função que desenha as anotaçoes
function desenharAnotacoes(){
    let update = ''
    
    var container = document.getElementById('container-anotacoes')
    allAnotations.forEach((obj,index)=>{
        update =  update+`<div style="display: flex; align-items: center; justify-content:  space-between;flex-wrap: wrap;">
        <button onclick="selectAnotacao(${index})"><p>${obj.nome}</p> </button>
        <img onclick="removerAnotacao(${index})" style="width: 24px;margin-left: 10px;" src="img/icons/lixeira.png" alt="">
        </div>`
        
        
    })
    container.innerHTML = update

}
//desenhar as tarefas da anotação
function desenharTasks(id){
    let tasks = ''
    var selected = allAnotations[id].task
    var container = document.getElementById('content-task')
    selected.forEach((tk,index)=>{
        if (tk.complete == false){
            tasks = tasks +`
            <div class="task">
            <div style="flex: 1; ">
                <p style=" font-weight: 400;">${tk.t_name}</p>
            </div>
            <div id="options">
                <button onclick = "CompleteTask(${index})" class="complete-task"></button>
                <button onclick = "deletetask(${index})"  class="remove-task"></button>
            </div>
            </div>`
        }
        else{
            tasks = tasks +`
            <div class="task-checked">
            <div style="flex: 1; ">
                <p style=" font-weight: 400;">${tk.t_name}</p>
            </div>
            <div id="options">
                <button onclick = "deletetask(${index})"  class="remove-task"></button>
            </div>
            </div>`
        }

    })
    container.innerHTML = tasks
}
//interação do hambuerguer
function  toggleMenu(){
    if (window.innerWidth < 820){
       var menu = document.getElementById('menu')
    menu.classList.toggle('menuextendido')
    document.getElementById('ant').classList.toggle('delete')
    document.getElementById('hb-button').classList.toggle('border') 
    }

    
}
//adicionar anotação
function addAnotacao(){
    var barra = document.getElementById('Anotation-name')
    if (barra.value){
        var object = {nome: barra.value,task:[]}
        barra.value = ''
        allAnotations.push(object)
        desenharAnotacoes()
        updateStorage()
    }
    else{
       window.alert("Digite o nome da sua Nota") 
    }
    
}
//remover anotação
function removerAnotacao(id){
    if (anotacaoSelecionada == id){
        document.getElementById('title').innerText = 'Notes'
        document.querySelector('main').style.display = 'none'
    }
    if (anotacaoSelecionada > id){
        anotacaoSelecionada--
    }
    console.log('apagou '+(id+1))
    console.log('selected '+(anotacaoSelecionada+1))
    allAnotations.splice(id,1)
    desenharAnotacoes()
    updateStorage()
}
//adicionar task
function addTask(){
    var campo = document.getElementById('input-task')
    var anota = allAnotations[anotacaoSelecionada]
    if (campo.value){
        anota.task.push({t_name:campo.value, complete: false})
        campo.value = ''
    }
    else{
        window.alert("Digite o nome da tarefa") 
     }
    desenharTasks(anotacaoSelecionada)
    updateStorage()
}
//função que verifica se usuario apertou enter no campo de texto
function Enterkey(event,func){
    if (event.key == 'Enter'){
        func()
    }

}

//funcão que faz a task ser completada
function CompleteTask(name_t){
    allAnotations[anotacaoSelecionada].task[name_t].complete = true
    desenharTasks(anotacaoSelecionada)
    updateStorage()
}
function deletetask(name_t){
    allAnotations[anotacaoSelecionada].task.splice(name_t,1)
    desenharTasks(anotacaoSelecionada)
    updateStorage()
}
//funcçao atualizar localstorage
function updateStorage(){
    localStorage.setItem('dados',JSON.stringify(allAnotations))
    localStorage.setItem('atual',anotacaoSelecionada)
}
