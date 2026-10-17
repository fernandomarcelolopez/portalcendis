function obtenerValorParametro(sParametroNombre) {
    var sPaginaURL = window.location.search.substring(1);
     var sURLVariables = sPaginaURL.split('&');
      for (var i = 0; i < sURLVariables.length; i++) {
        var sParametro = sURLVariables[i].split('=');
        if (sParametro[0] == sParametroNombre) {
          return sParametro[1];
        }
      }
    return null;
}

const token = obtenerValorParametro("token");  
if (token==null) {
    var direccion = '../index.html';
    window.location = direccion;
} 

/*console.log(token);
history.pushState(null, "", "home");*/

/*home.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/home.html?token='+token;
    window.location = direccion;
})
admin.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/admin.html?token='+token;
    window.location = direccion;
})*/
const logout=document.getElementById('logout');
logout.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/logout.html?token='+token;
    console.log('registro boton');
    window.location = direccion;
})


/*button1.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/listado.html?token='+token;
    window.location = direccion;
})
button2.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/consulta.html?token='+token;
    window.location = direccion;
})
button3.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/cumples.html?token='+token;
    window.location = direccion;
})
button4.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/antecedentes.html?token='+token;
    window.location = direccion;
})
button5.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/home.html?token='+token;
    window.location = direccion;
})
button6.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/home.html?token='+token;
    window.location = direccion;
})*/
