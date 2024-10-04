const url = 'https://dvxpxrfewrklfeutzgyf.supabase.co/rest/v1/Anotação'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2eHB4cmZld3JrbGZldXR6Z3lmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNzk2NDY3OSwiZXhwIjoyMDQzNTQwNjc5fQ.OGNyeGGWlIC6FtZUYViH8C0h4sVJFq_lXyBTyxM5M48'
var data;
var usuario = Number(localStorage.getItem('id_user'))
async function getData() {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });
    const tasks = await fetch('https://dvxpxrfewrklfeutzgyf.supabase.co/rest/v1/Tarefa',{
        method: 'GET',
        headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    })
    if(!tasks.ok){
        console.log("erro nas tarefas")
    }
    if (!response.ok) {
        throw new Error('Erro ao buscar dados de anotação');
    }
    const data = await response.json()
    const tarefa = await tasks.json()
    allAnotations = []
    for (let anotacao of data){
        if(anotacao.fk_user == usuario ){
            var object = {id:anotacao.id,nome: anotacao.Nome,task:[],fk:anotacao.fk_user}
            for (let t of tarefa){
                if(t.FK == anotacao.id){
                    object.task.push({id:t.id,t_name:t.Nome, complete: t.Completo,fk: t.FK})
                }
            }
            allAnotations.push(object)
        }
    }
    desenharAnotacoes()
    
}
var allAnotations = []
var anotacaoSelecionada
var deletado
getData()
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
        update =  update+`<div class= "ho" onclick="selectAnotacao(${index})" style="display: flex; align-items: center; justify-content:  space-between; border-bottom: 1px solid gray;">
        <button ><p>${obj.nome}</p> </button>
        <img onclick="removerAnotacao(event,${index})" style="width: 24px;margin-left: 10px; margin-top: 10px;" src="img/icons/lixeira.png" alt="">
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
    if (window.innerWidth < 860){
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
        
    }
    else{
       window.alert("Digite o nome da sua Nota") 
    }
    
}
//remover anotação
async function removerAnotacao(event,id){
    //apagar as tasks associadas
     allAnotations[id].task.forEach(async (tk,id)=>{
        const url_delete = `https://dvxpxrfewrklfeutzgyf.supabase.co/rest/v1/Tarefa?id=eq.${tk.id}`
        const deleteResponse = await fetch(url_delete,{
        method: 'DELETE',
        headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
            }
        })
        if(deleteResponse.ok){
            console.log("Apagou ")
        }
        else{
            console.log("deu ruim pra apagar")
        }
    })
    //apagar agora a anotação
    const url_del = `https://dvxpxrfewrklfeutzgyf.supabase.co/rest/v1/Anotação?id=eq.${allAnotations[id].id}`
    const deleteResponse = await fetch(url_del,{
    method: 'DELETE',
    headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json'
        }
    })
    if(deleteResponse.ok){
        console.log("Apagou ")
    }
    else{
        console.log("deu ruim pra apagar")
    }
    event.stopPropagation();
    if (anotacaoSelecionada == id){
        document.getElementById('title').innerText = 'Data'
        document.querySelector('main').style.display = 'none'
    }
    if (anotacaoSelecionada > id){
        anotacaoSelecionada--
    }
    console.log('apagou '+(id))
    console.log('selected '+(anotacaoSelecionada))
    allAnotations.splice(id,1)
    desenharAnotacoes()
    
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
}
function deletetask(name_t){
    allAnotations[anotacaoSelecionada].task.splice(name_t,1)
    desenharTasks(anotacaoSelecionada)
}


function exportData(){
    openOptions()
    var conteudo = JSON.stringify(allAnotations,null,2)
    var blob = new Blob([conteudo],{type: 'application/json'})
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'Notas'
    document.querySelector('body').appendChild(a)
    a.click()
}  
function openOptions(){
    console.log('abrir')
    var btn = document.getElementById('icon-user')
    var modal = document.getElementById('modal-Data')
    modal.classList.toggle('opened-Data')
}
