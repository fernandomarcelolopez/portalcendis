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
var codeid="";
const token = obtenerValorParametro("token");  
if (token === null || token === "") {
    var direccion = '../index.html';
    window.location = direccion;
} 
else {
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
			if (data.respcode=="200") {
				codeid= data.respdat;
				//console.log(codeid);
				if (codeid=== "2"){
					tarjeta1=document.getElementById('tarjeta-kpiad1');
					tarjeta1.style.display="";
					tarjeta1=document.getElementById('tarjeta-kpiad2');
					tarjeta1.style.display="";
					tarjeta1=document.getElementById('tarjeta-kpiad3');
					tarjeta1.style.display="";
				}	
			} 
			if (data.respcode=="201") {
				var direccion = '../index.html';
        		window.location = direccion;
			} 
		})
} 

/*console.log(token);
history.pushState(null, "", "home");*/

contra.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = '../api/contra.php?token='+token;
    window.location = direccion;
})
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
kpiad1.addEventListener('click',(e) => {
	e.preventDefault()
	var direccion = '../front/kpiad.html?token='+token;
	window.location = direccion;
})
