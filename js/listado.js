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
console.log(token);
history.pushState(null, "", "listado");

home.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/home.html?token='+token;
    window.location = direccion;
})
admin.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/admin.html?token='+token;
    window.location = direccion;
})
calidad.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/calidad.html?token='+token;
    window.location = direccion;
})
contacto.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/contacto.html?token='+token;
    window.location = direccion;
})
logout.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/logout.html?token='+token;
    window.location = direccion;
})


button1.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/documentos.html?token='+token;
    window.location = direccion;
})
button2.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/quejas.html?token='+token;
    window.location = direccion;
})
button3.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/nocon.html?token='+token;
    window.location = direccion;
})
button4.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/kpi.html?token='+token;
    window.location = direccion;
})
button5.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/gestion.html?token='+token;
    window.location = direccion;
})
button6.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/puestos.html?token='+token;
    window.location = direccion;
})
