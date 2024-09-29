//varivel que guarda todos os objetos anotaçoes
var allAnotations = []
desenharAnotacoes()





function selectAnotacao(id){
    toggleMenu()
    var title = document.getElementById('title')
    title.innerText = allAnotations[id].nome
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

//função que verifica se usuario apertou enter no campo de texto
function Enterkey(event,func){
    if (event.key == 'Enter'){
        func()
    }

}