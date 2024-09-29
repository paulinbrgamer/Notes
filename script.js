//varivel que guarda todos os objetos anotaçoes
var allAnotations = []
var anotacaoSelecionada
desenharAnotacoes()





function selectAnotacao(id){
    toggleMenu()
    var title = document.getElementById('title')
    title.innerText = allAnotations[id].nome
    anotacaoSelecionada = id
    desenharTasks(id)
}
//função que desenha as anotaçoes
function desenharAnotacoes(){
    let update = ''
    
    var container = document.getElementById('container-anotacoes')
    allAnotations.forEach((obj,index)=>{
        update =  update+`<button onclick="selectAnotacao(${index})"><p>${obj.nome}</p> </button>`
        container.innerHTML = update
    })
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
    var menu = document.getElementById('menu')
    menu.classList.toggle('menuextendido')
    document.getElementById('ant').classList.toggle('delete')
    document.getElementById('hb-button').classList.toggle('border')
}
//adicionar anotação
function addAnotacao(){
    var barra = document.getElementById('Anotation-name')
    if (barra.value){
        var object = {nome: barra.value,task:[]}
        barra.value = ''
        allAnotations.push(object)
        desenharAnotacoes()
    }
    else{
       window.alert("Não pode ter anotação sem nome") 
    }
    
    console.log(allAnotations)
}
//adicionar task
function addTask(){
    var campo = document.getElementById('input-task')
    var anota = allAnotations[anotacaoSelecionada]
    if (campo.value || anotacaoSelecionada){
        anota.task.push({t_name:campo.value, complete: false})
        console.log(anota)
        campo.value = ''
    }
    desenharTasks(anotacaoSelecionada)
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
    console.log( allAnotations[anotacaoSelecionada].task[name_t])
    desenharTasks(anotacaoSelecionada)
}
function deletetask(name_t){
    console.log( allAnotations[anotacaoSelecionada].task[name_t])
    allAnotations[anotacaoSelecionada].task.splice(name_t,1)
    desenharTasks(anotacaoSelecionada)
}