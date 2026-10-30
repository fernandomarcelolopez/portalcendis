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
const finicio = obtenerValorParametro("finicio");  
const ffinal = obtenerValorParametro("ffinal");  
if (finicio === null) {
	const hoy=new Date();
	const anio = hoy.getFullYear();
	const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
	const dia = String(hoy.getDate()).padStart(2, '0');
	const fechaFormateada = `${anio}-${mes}-${dia}`;
	document.getElementById('inicio').value=fechaFormateada;
	document.getElementById('final').value=fechaFormateada;
} 
else {
	document.getElementById('inicio').value=finicio;
	document.getElementById('final').value=ffinal;
}
/*console.log(token);
history.pushState(null, "", "home");*/

volver.addEventListener('click',(e) => {
    e.preventDefault()
    var direccion = 'home.html?token='+token;
    window.location = direccion;
})
actualizar.addEventListener('click',(e) => {
    e.preventDefault()
	const finicial=document.getElementById('inicio').value;
	const ffinal=document.getElementById('final').value;
	var direccion = '../front/kpiad.html?token='+token+'&finicio='+finicial+'&ffinal='+ffinal;
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

const fechaInicio = document.getElementById('inicio').value;
const fechaFinal = document.getElementById('final').value;

/* Cargar datos de la tarjeta 1 */ 
const myInit = { method: 'GET' };
var dire = '../api/proxy_tarjeta1.php?tkn=' + token + '&finicio=' + fechaInicio + '&ffinal=' + fechaFinal;
const myRequest = new Request(dire, myInit);

fetch(myRequest)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.error('Estado HTTP:', response.status);
            throw new Error("Respuesta incorrecta del servidor");
        }
    })
    .then(data => {
        const operaciones = data.operaciones || [];

        // Agrupar y procesar los datos por propietario
        const resumen = operaciones.reduce((acc, op) => {
            const propietarios = op.x_studio_propietarios;
            
            // Odoo suele retornar relacionales M2O/M2M como arrays [ID, "Nombre"] o listas de IDs
            let propietarioId = 'Sin Propietario';
            if (Array.isArray(propietarios) && propietarios.length > 0) {
                propietarioId = propietarios[0];
            } else if (propietarios) {
                propietarioId = propietarios;
            }

            // Validar el campo de IDs / líneas
            const lineas = op.x_operaciones_agrupada_line_ids_06594;
            const totalLineas = Array.isArray(lineas) ? lineas.length : 0;

            if (!acc[propietarioId]) {
                acc[propietarioId] = {
                    cantidadRegistros: 0,
                    sumaLineasIds: 0
                };
            }

            acc[propietarioId].cantidadRegistros += 1;
            acc[propietarioId].sumaLineasIds += totalLineas;

            return acc;
        }, {});

        // Diccionario de nombres
        const NOMBRES_PROPIETARIOS = {
            '68': 'CATERING DE ALTURA SAS',
            '712': 'DIA ARGENTINA SA',
            '6380': 'ARAMARK SERVICIOS SRL',
            '7958': 'WORLEY ARGENTINA SA',
            '4921': 'JSC MINNING SAS',
            '4833': 'INVERSORA JURAMENTO SA',
            '6287': 'MAYORISTA-JURAMENTO SA',
            '6376': 'BUNTECH DEL LAGO SA'
        };

        let filasHTML = '';

        Object.entries(resumen).forEach(([propietarioId, datos]) => {
            const propietarioNombre = NOMBRES_PROPIETARIOS[propietarioId] || `PROPIETARIO ${propietarioId}`;

            filasHTML += `
                <tr>
					<td></td>
					<td>${propietarioNombre}</td>
					<td>${datos.cantidadRegistros}</td>
                    <td>${datos.sumaLineasIds}</td>
                </tr>
            `;
        });

        const contenedorTabla = document.getElementById('contenido-tabla');
        if (filasHTML === '') {
            contenedorTabla.innerHTML = '<tr><td colspan="3">No se encontraron datos en el rango de fechas.</td></tr>';
        } else {
            contenedorTabla.innerHTML = filasHTML;
        }
		var propFinal=[];
		var cantFinal=[];
		Object.entries(resumen).forEach(([propietarioId, datos]) => {
            const propietarioNombre = NOMBRES_PROPIETARIOS[propietarioId] || `PROPIETARIO ${propietarioId}`;
			propFinal.push(propietarioNombre);
			cantFinal.push(datos.cantidadRegistros);
        });
		const ctx = document.getElementById('grafico0').getContext('2d');

		const miGrafico = new Chart(ctx, {
		  type: 'doughnut', 
		  data: {
			labels: propFinal,
			datasets: [{
			  label: 'Recepciones',
			  data: cantFinal, 
			  backgroundColor: [
				'rgba(0, 145, 218, 0.7)',   // Azul
				'rgba(154, 203, 58, 0.7)',  // Verde
				'rgba(115, 60, 140, 0.7)',  // Púrpura
				'rgba(235, 110, 50, 0.7)',   // Naranja
				'rgba(255, 206, 86, 0.7)',  // Amarillo
				'rgba(75, 192, 192, 0.7)',  // Turquesa
				'rgba(54, 162, 235, 0.7)',   // Celeste
				'rgba(220, 53, 69, 0.7)',   // Rojo carmesí
				'rgba(233, 30, 99, 0.7)',   // Rosa / Magenta
				'rgba(121, 85, 72, 0.7)',   // Marrón / Café				
			  ],
			  borderWidth: 1,
			  borderColor: '#ffffff'
			}]
		  },
		  options: {
				plugins: {
					// Ocultamos la leyenda inferior tradicional
					legend: {
						display: false
					},
					// Configuramos los textos en cada porción
					datalabels: {
						color: '#fff', // Color del texto (blanco para que contraste con el fondo)
						textAlign: 'center',
						font: {
							weight: 'bold',
							size: 11
						},
						formatter: function(value, context) {
							// Ocultar etiquetas en sectores diminutos para que no se superpongan
							if (value <= 2) {
								return ''; 
							}
							
							// Obtenemos el nombre del propietario
							const label = context.chart.data.labels[context.dataIndex];
							
							// Retorna un array para que Chart.js cree un salto de línea:
							// Línea 1: Nombre (o resumen)
							// Línea 2: Valor
							return [label, value];
						}
					}
				}
			}
		});
    })
    .catch(error => {
        console.error('Error al generar la tabla:', error);
    });


// crear grafico de la tarjeta 3
const myInit3 = { method: 'GET' };
var dire = '../api/proxy_tarjeta3.php?tkn=' + token + '&finicio=' + fechaInicio + '&ffinal=' + fechaFinal;
const myRequest3 = new Request(dire, myInit3);

fetch(myRequest3)
	.then(response => {
		if (response.ok) {
			return response.json();
		} else {
			console.error('Estado HTTP:', response.status);
			throw new Error("Respuesta incorrecta del servidor");
		}
	})
	.then(data => {
        const operaciones = data.operaciones || [];
        // Mapeo de IDs de propietarios a nombres
        const NOMBRES_PROPIETARIOS = {
            '68': 'CATERING DE ALTURA SAS',
            '712': 'DIA ARGENTINA SA',
            '6380': 'ARAMARK SERVICIOS SRL',
            '7958': 'WORLEY ARGENTINA SA',
            '4921': 'JSC MINNING SAS',
            '4833': 'INVERSORA JURAMENTO SA',
            '6287': 'MAYORISTA-JURAMENTO SA',
            '6376': 'BUNTECH DEL LAGO SA'
        };
        // 1. Agrupar y sumar por propietario
        const resumen = operaciones.reduce((acc, op) => {
            const propietarios = op.x_studio_propietarios;
            // Extraer el ID del propietario (asumiendo formato [id, "Nombre"] de Odoo)
            const primerId = (Array.isArray(propietarios) && propietarios.length > 0) 
                ? (typeof propietarios[0] === 'object' ? propietarios[0].id : propietarios[0])
                : 'Sin Propietario';

            if (!acc[primerId]) {
                acc[primerId] = {
                    pallets: 0,
                    combis: 0
                };
            }
            const cantidadPallets = Array.isArray(op.x_studio_cant_palletsemipallet_recibidos) 
                ? op.x_studio_cant_palletsemipallet_recibidos[0] 
                : (Number(op.x_studio_cant_palletsemipallet_recibidos) || 0);
            const cantidadCombis = Array.isArray(op.x_studio_cant_combis_recibidas) 
                ? op.x_studio_cant_combis_recibidas[0] 
                : (Number(op.x_studio_cant_combis_recibidas) || 0);
            acc[primerId].pallets += cantidadPallets;
            acc[primerId].combis += cantidadCombis;
            return acc;
        }, {});
        // 2. Construir los arreglos finales
        const categorias1 = [];
        const pallets = [];
        const combis = [];
        Object.entries(resumen).forEach(([propietarioId, datos]) => {
            const nombrePropietario = NOMBRES_PROPIETARIOS[propietarioId] || `PROPIETARIO ${propietarioId}`;
            
            categorias1.push(nombrePropietario);
            pallets.push(datos.pallets);
            combis.push(datos.combis);
        });
		
		//armar grafico
		const ctx1 = document.getElementById('grafico1').getContext('2d');
		new Chart(ctx1, {
		  type: 'bar',
		  plugins: [ChartDataLabels], // 1. Registras el plugin aquí
		  data: {
			labels: categorias1, // Eje Y (Categorías)
			datasets: [
			  {
				label: 'Pallets',
				data: pallets,
				backgroundColor: 'rgba(0, 145, 218, 0.7)'
			  },
			  {
				label: 'Combis',
				data: combis,
				backgroundColor: 'rgba(154, 203, 58, 0.7)'
			  }
			]
		  },
		  options: {
			indexAxis: 'y', // Hace que el gráfico sea vertical
			layout:{
				padding:{
					right:40
				}
			},
			maintainAspectRatio: false,
			responsive: true,
			plugins: {
			  legend: { position: 'bottom' },
			  title: {
				display: false,
				text: 'Comparativa de Ventas por Mes'
			  },
				// 2. Agregas esta configuración para formatear y posicionar las etiquetas
				datalabels: {
					anchor: 'end', // Posición en la punta de la barra: 'start', 'center', 'end'
					align: 'end',   // Alineación respecto a la punta: 'start', 'center', 'end', 'right'
					color: '#333',  // Color del texto
					font: {
					weight: 'bold',
					size: 11
					},
				formatter: (value) => {
					// Oculta el número en la barra si el valor es 0
					return value > 0 ? value : '';
					}
					}
				},
			},
			scales: {
			  x: {
				beginAtZero: true,
				// Agregamos un margen superior al eje X para que los números del final no se corten
				grace: '10%',
			  }
			}
		  });
		})
    .catch(error => {
        console.error('Error al procesar los datos:', error);
    });

// crear grafico de la tarjeta 4
const myInit1 = { method: 'GET' };
var dire = '../api/proxy_tarjeta4.php?tkn=' + token + '&finicio=' + fechaInicio + '&ffinal=' + fechaFinal;
const myRequest1 = new Request(dire, myInit1);

fetch(myRequest1)
    .then(response => {
        if (response.status == 200) {
            return response.json();
        } else {
            console.log(response.status);
            throw "Respuesta incorrecta del servidor";
        }
    })
    .then(data => {
        const operaciones = data.operaciones || [];
        // Mapeo de IDs de propietarios a nombres
        const NOMBRES_PROPIETARIOS = {
            '68': 'CATERING DE ALTURA SAS',
            '712': 'DIA ARGENTINA SA',
            '6380': 'ARAMARK SERVICIOS SRL',
            '7958': 'WORLEY ARGENTINA SA',
            '4921': 'JSC MINNING SAS',
            '4833': 'INVERSORA JURAMENTO SA',
            '6287': 'MAYORISTA-JURAMENTO SA',
            '6376': 'BUNTECH DEL LAGO SA'
        };
        // 1. Agrupar y sumar por propietario
        const resumen = operaciones.reduce((acc, op) => {
            const propietarios = op.x_studio_propietarios;
            // Extraer el ID del propietario (asumiendo formato [id, "Nombre"] de Odoo)
            const primerId = (Array.isArray(propietarios) && propietarios.length > 0) 
                ? (typeof propietarios[0] === 'object' ? propietarios[0].id : propietarios[0])
                : 'Sin Propietario';

            if (!acc[primerId]) {
                acc[primerId] = {
                    pallets: 0,
                    combis: 0
                };
            }
            const cantidadPallets = Array.isArray(op.x_studio_cant_pallets) 
                ? op.x_studio_cant_pallets[0] 
                : (Number(op.x_studio_cant_pallets) || 0);
            const cantidadCombis = Array.isArray(op.x_studio_cant_combis) 
                ? op.x_studio_cant_combis[0] 
                : (Number(op.x_studio_cant_combis) || 0);
            acc[primerId].pallets += cantidadPallets;
            acc[primerId].combis += cantidadCombis;
            return acc;
        }, {});
        // 2. Construir los arreglos finales
        const categorias1 = [];
        const pallets = [];
        const combis = [];
        Object.entries(resumen).forEach(([propietarioId, datos]) => {
            const nombrePropietario = NOMBRES_PROPIETARIOS[propietarioId] || `PROPIETARIO ${propietarioId}`;
            
            categorias1.push(nombrePropietario);
            pallets.push(datos.pallets);
            combis.push(datos.combis);
        });
		//armar grafico
		const ctx1 = document.getElementById('grafico2').getContext('2d');
		new Chart(ctx1, {
		  type: 'bar',
		  plugins: [ChartDataLabels], // 1. Registras el plugin aquí
		  data: {
			labels: categorias1, // Eje Y (Categorías)
			datasets: [
			  {
				label: 'Pallets',
				data: pallets,
				backgroundColor: 'rgba(0, 145, 218, 0.7)'
			  },
			  {
				label: 'Combis',
				data: combis,
				backgroundColor: 'rgba(154, 203, 58, 0.7)'
			  }
			]
		  },
		  options: {
			indexAxis: 'y', // Hace que el gráfico sea vertical
			layout:{
				padding:{
					right:40
				}
			},
			maintainAspectRatio: false,
			responsive: true,
			plugins: {
			  legend: { position: 'bottom' },
			  title: {
				display: false,
				text: 'Comparativa de Ventas por Mes'
			  },
				// 2. Agregas esta configuración para formatear y posicionar las etiquetas
				datalabels: {
					anchor: 'end', // Posición en la punta de la barra: 'start', 'center', 'end'
					align: 'end',   // Alineación respecto a la punta: 'start', 'center', 'end', 'right'
					color: '#333',  // Color del texto
					font: {
					weight: 'bold',
					size: 11
					},
				formatter: (value) => {
					// Oculta el número en la barra si el valor es 0
					return value > 0 ? value : '';
					}
					}
				},
			},
			scales: {
			  x: {
				beginAtZero: true,
				// Agregamos un margen superior al eje X para que los números del final no se corten
				grace: '10%',
			  }
			}
		  });
		})
    .catch(error => {
        console.error('Error al procesar los datos:', error);
    });

// crear grafico de la tarjeta 5
const myInit2 = { method: 'GET' };
var dire = '../api/proxy_tarjeta5.php?tkn=' + token + '&finicio=' + fechaInicio + '&ffinal=' + fechaFinal;
const myRequest2 = new Request(dire, myInit2);

fetch(myRequest2)
	.then(response => {
		if (response.status == 200) {
			return response.json();
		} else {
			console.log(response.status);
			throw "Respuesta incorrecta del servidor";
		}
	})
	.then(data => {
		const operaciones = data.resumen_propietarios || [];

		// 1. Sumar cantidades acumuladas por (Propietario -> Servicio) a partir de operaciones
		const mapaAgrupado = {};
		const setPropietarios = new Set();
		const setServicios = new Set();

		operaciones.forEach(op => {
			const propietarios = Array.isArray(op.propietario) 
			? (op.propietario.length ? op.propietario : ['Sin Propietario'])
			: (op.propietario ? [op.propietario] : ['Sin Propietario']);
		const servicios = op.servicios || [];

		propietarios.forEach(prop => {
			setPropietarios.add(prop);

			if (!mapaAgrupado[prop]) {
			mapaAgrupado[prop] = {};
			}

			servicios.forEach(s => {
			const nombreSrv = s.servicio.slice(10) || 'Sin Servicio';
			const cantidad = Number(s.total_cantidad) || 0;

			setServicios.add(nombreSrv);
			mapaAgrupado[prop][nombreSrv] = (mapaAgrupado[prop][nombreSrv] || 0) + cantidad;
			});
		});
		});

		// 2. Definir categorias2 (Array de propietarios únicos)
		const categorias2 = Array.from(setPropietarios);

		// 3. Construir los arrays de datos para cada servicio alineados con categorias2
		const seriesServicios = {};

		Array.from(setServicios).forEach(nombreServicio => {
		seriesServicios[nombreServicio] = categorias2.map(prop => {
			return mapaAgrupado[prop]?.[nombreServicio] || 0;
		});
		});
		const colores = [
			'rgba(0, 145, 218, 0.7)',   // Azul
			'rgba(154, 203, 58, 0.7)',  // Verde
			'rgba(115, 60, 140, 0.7)',  // Púrpura
			'rgba(235, 110, 50, 0.7)',   // Naranja
			'rgba(255, 206, 86, 0.7)',  // Amarillo
			'rgba(75, 192, 192, 0.7)',  // Turquesa
			'rgba(54, 162, 235, 0.7)',   // Celeste
			'rgba(220, 53, 69, 0.7)',   // Rojo carmesí
			'rgba(233, 30, 99, 0.7)',   // Rosa / Magenta
			'rgba(121, 85, 72, 0.7)',   // Marrón / Café
		  ];
		const ctx2 = document.getElementById('grafico3').getContext('2d');
		
		new Chart(ctx2, {
		type: 'bar',
		plugins: [ChartDataLabels],
		data: {
			labels: categorias2,
			datasets: Object.keys(seriesServicios).map((nombreServicio, index) => {
			return {
				label: nombreServicio,
				data: seriesServicios[nombreServicio],
				backgroundColor: colores[index % colores.length]
			};
			})
		},
		options: {
			indexAxis: 'x', // Gráfico horizontal
			maintainAspectRatio: false,
			responsive: true,
			plugins: {
			legend: { position: 'top', display: false },
			title: {
				display: false,
				text: 'Comparativa por Propietario y Servicio'
			},
			datalabels: {
				anchor: 'end',
				align: 'end',
				color: '#333',
				font: {
				weight: 'bold',
				size: 8
				},
				formatter: (value) => {
				// Oculta el número en la barra si el valor es 0
				return value > 0 ? value : '';
				}
			}
			},
			scales: {
			x: {
				beginAtZero: true,
				grace: '10%'
			}
			}
		}
		});
		})
	.catch(error => {
		console.error('Error al procesar los datos:', error);
	});
