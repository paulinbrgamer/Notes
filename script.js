//interação do hambuerguer
function  abrirMenu(){
    console.log('click')
    var menu = document.getElementById('menu')
    menu.classList.toggle('menuextendido')
    document.getElementById('ant').classList.toggle('delete')
    document.getElementById('hb-button').classList.toggle('border')
}
