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
if (token === null || token === "") {
    var direccion = '../index.html';
    window.location = direccion;
} 
else {
    console.log('token');
	const myInit = {method: 'GET'};
	var dire = '../api/validartoken.php?tkn='+ token;
	const myRequest = new Request(dire,myInit);
	
	var respuesta = fetch(myRequest)
		.then (response =>  {
			if(response.status == 200 || response.status == 201) {
				return response.json();
			} 
			else {
				console.log(response.status);
				throw "Respuesta incorrecta del servidor" ;
			}
		})
		.then (data => {
			if (data.respcode=="201") {
				var direccion = '../index.html';
        		window.location = direccion;
			} 
		})
} 

/*console.log(token);
history.pushState(null, "", "home");*/

kpiad.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/kpiad.html?token='+token;
    window.location = direccion;
})/*
admin.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../front/admin.html?token='+token;
    window.location = direccion;
})*/
const logout=document.getElementById('logout');
logout.addEventListener('click',(e) => {
    e.preventDefault()
	const myInit = {method: 'GET'};
	var dire = '../api/logout.php?tkn='+ token;
	const myRequest = new Request(dire,myInit);
	
	var respuesta = fetch(myRequest)
		.then (response =>  {
			if(response.status == 200) {
				return response.json();
			} 
			else {
				console.log(response.status);
				throw "Respuesta incorrecta del servidor" ;
			}
		})
		.then (data => {
			if (data.respcode=="200") {
				var direccion = '../index.html';
        		window.location = direccion;
			} 
		})
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
