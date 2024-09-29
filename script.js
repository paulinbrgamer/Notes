var allAnotations = [{nome: 'Uepa',task:[]}]








desenharAnotacoes()


function desenharAnotacoes(){
    let update = ''
    
    var container = document.getElementById('container-anotacoes')
    allAnotations.forEach(obj=>{
        update =  update+`<button><p>${obj.nome}</p> </button>`
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
function addAnotacao(){
    var barra = document.getElementById('Anotation-name')
    var object = {nome: barra.value,task:[]}
    barra.value = ''
    allAnotations.push(object)
    console.log(allAnotations)
    desenharAnotacoes()
}