var usuario = Number(localStorage.getItem('id_user'))
const url = `https://dvxpxrfewrklfeutzgyf.supabase.co/rest/v1/Anotação?fk_user=eq.${usuario}`
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2eHB4cmZld3JrbGZldXR6Z3lmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNzk2NDY3OSwiZXhwIjoyMDQzNTQwNjc5fQ.OGNyeGGWlIC6FtZUYViH8C0h4sVJFq_lXyBTyxM5M48'
var data;
var allAnotations
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
    if (!response.ok) {
        throw new Error('Erro ao buscar dados de anotação');
    }
    const data = await response.json()
    allAnotations = []
    for (let a of data){
        var object = {id:a.id,Nome: a.Nome,task:[],fk:a.fk_user}
        const tasks = await fetch(`https://dvxpxrfewrklfeutzgyf.supabase.co/rest/v1/Tarefa?FK=eq.${a.id}`,{
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
        const tarefa = await tasks.json()
        for (let t of tarefa){
            object.task.push({id:t.id,t_name:t.Nome, complete: t.Completo,fk: t.FK})
        }
         allAnotations.push(object)
         desenharAnotacoes()
         console.log(allAnotations)
    }
   
    
}
var anotacaoSelecionada
var deletado
getData()
function selectAnotacao(id){
    toggleMenu()
    var anot = document.getElementById(id)
    var all = document.getElementsByClassName('selected')
    for(let el of all){
        if (el){
            el.classList.remove('selected')
        }
        
    }
    if (anot){
        anot.classList.add('selected')
    }
    
    var title = document.getElementById('title')
    if (allAnotations[id]){
        title.innerText = allAnotations[id].Nome
        anotacaoSelecionada = id
        document.querySelector('main').style.display = 'flex'
        desenharTasks(id)
    }

}
//função que desenha as anotaçoes
function desenharAnotacoes(){
    let update = ''
    var container = document.getElementById('container-anotacoes')
    allAnotations.forEach((obj,index)=>{
        update =  update+`<div id="${index}" class= "ho" onclick="selectAnotacao(${index})" style="display: flex; align-items: center; justify-content:  space-between; border-bottom: 1px solid gray;">
        <button ><p>${obj.Nome}</p> </button>
        <img onclick="removerAnotacao(event,${index})" style="width: 24px;margin-left: 10px; margin-top: 10px;" src="img/icons/lixeira.png" alt="">
        </div>`
        
        
    })
    container.innerHTML = update

}
//desenhar as tarefas da anotação
function desenharTasks(id){
    let tasks = ''
    if (allAnotations[anotacaoSelecionada]){
        var selected = allAnotations[anotacaoSelecionada].task
    }
    
    var container = document.getElementById('content-task')
    if(selected){
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
        
    }
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
async function addAnotacao(){
    var barra = document.getElementById('Anotation-name')
    if (barra.value){
        var object = {id:'',Nome: barra.value,task:[],fk:usuario}
        barra.value = ''
        const url_post = `https://dvxpxrfewrklfeutzgyf.supabase.co/rest/v1/Anotação`
        const note_post = await fetch(url_post,{
            method: 'POST',
            headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
            },
            body: JSON.stringify({Nome:object.Nome,fk_user:object.fk})
        })
        if(note_post){
            var s = await note_post.json()
            object.id = s[0].id
            allAnotations.push(object)
            desenharAnotacoes()
        }
        
        
    }
    else{
       window.alert("Digite o nome da sua Nota") 
    }
    
}
//remover anotação
async function removerAnotacao(event,idx){
    event.stopPropagation();
    //apagar agora a anotação
    const url_del = `https://dvxpxrfewrklfeutzgyf.supabase.co/rest/v1/Anotação?id=eq.${allAnotations[idx].id}`
    const deleteResponse = await fetch(url_del,{
    method: 'DELETE',
    headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json'
        }
    })
    if(deleteResponse.ok){
        if (anotacaoSelecionada == idx){
            document.getElementById('title').innerText = 'Data'
            document.querySelector('main').style.display = 'none'
        }
        if(anotacaoSelecionada > idx){
            anotacaoSelecionada--
        }
        allAnotations.splice(idx,1)
        desenharAnotacoes()   
         
    }
    else{
        console.log("deu ruim pra apagar")
    }
    

}
//adicionar task
async function addTask(){
    var campo = document.getElementById('input-task')
    var anota = allAnotations[anotacaoSelecionada]
    if (campo.value){
        var url_task =  `https://dvxpxrfewrklfeutzgyf.supabase.co/rest/v1/Tarefa`
        const task_add = await fetch(url_task,{
            method: 'POST',
            headers:{
                'apikey': key,
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation',
            },
            body: JSON.stringify({Nome:campo.value,Completo:false,FK:anota.id})
        })
        if(task_add){
            var data = await task_add.json()
            anota.task.push({id:data[0].id,t_name:campo.value, complete: false,fk:anota.id})
            console.log(allAnotations)
        }        
        

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
