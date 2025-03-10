// Variables de estado
let usuarioLogueado = null;
let listadoActividades = [];
let registrosDeUsuario = [];
let registrosUsuarioFiltrados = [];
let listaPaises = [];

let marcadorRegistros = null;
let marcadorRegistrosFiltrados = null;


let map = null;
let marcadorUsuario = null;
let listadoUsuariosPais = [];

//posicion del usuario

let posicionUsuario = {
  latitude: -34.903741603867076,
  longitude: -56.190701341802594
};
// Constantes
let apiBaseURL = "https://movetrack.develotion.com";
let urlImagen = "https://movetrack.develotion.com/imgs/";

const MENU = document.querySelector("#menu");
const ROUTER = document.querySelector("#ruteo");
const NAV = document.querySelector("#nav");
const HOME = document.querySelector("#pantalla-home");
const LOGIN = document.querySelector("#pantalla-login");
const REGISTRO = document.querySelector("#pantalla-registro");
const OBTENER_REGISTROS = document.querySelector("#pantalla-obtener-registros");
const AGREGAR_REGISTRO = document.querySelector("#pantalla-agregar-registro");
const SELECT_ACTIVIDADES = document.querySelector("#select-actividades");
const PAISES = document.querySelector("#pantalla-paises");
const SELECT_PAISES = document.querySelector("#select-paises");
const INFORMES = document.querySelector("#pantalla-informes");

//inicio
inicializar();

function inicializar() {
  suscripcionAEventos();
  cargarUbicacionUsuario();
}

function suscripcionAEventos() {
  // Routeo
  ROUTER.addEventListener("ionRouteDidChange", navegar);
  // Login
  document.querySelector("#btnLoginIngresar").addEventListener("click", Login);
  //Registro
  document
    .querySelector("#btnRegistroRegistrarse")
    .addEventListener("click", Registro);
  //Agregar Registro
  document.querySelector("#btnMenuAgregarRegistro").addEventListener("click", mostrarAgregarRegistro);
  document.querySelector("#btnGuardarRegistro")
    .addEventListener("click", guardarRegistroHandler);
  //ObtenerRegistros de usuario
  document
    .querySelector("#btnMenuObtenerRegistros")
    .addEventListener("click", mostrarObtenerPantallaRegistrosUsuario);
  //Agregar registro ir
  document
    .querySelector("#btnAgregarRegistroIr")
    .addEventListener("click", btnAgregarRegistroIr);
  //Agregar registro volver
  document
    .querySelector("#btnVolver")
    .addEventListener("click", btnVolver);
  SELECT_ACTIVIDADES.addEventListener("ionChange", actualizarSelectActividades);

  //Obtener Paises
  document
    .querySelector("#btnMenuPaises")
    .addEventListener("click", obtenerPaises);
  //Select Paises
  SELECT_PAISES.addEventListener("ionChange", actualizarSelectPaises);
  // Obtener informes
  document.querySelector("#btnMenuInformes").addEventListener("click", filtrarRegistrosPorPeriodo);
  document.querySelector("#btnFiltrarSemana").addEventListener("click",
    filtrarRegistrosPorPeriodo("semana"));
  document.querySelector("#btnFiltrarMes").addEventListener("click",
    filtrarRegistrosPorPeriodo("mes"));
  document.querySelector("#btnFiltrarHistorico").addEventListener("click",
    filtrarRegistrosPorPeriodo("historico"));

  //Cerrar Sesion
  document
    .querySelector("#btnMenuCerrarSesion")
    .addEventListener("click", cerrarSesion);
}

function actualizarUsuarioLogueadoDesdeLocalStorage() {
  let usuarioRecuperadoDeLocalstorage = localStorage.getItem(
    "UsuarioLogueadoObligatorio"
  );
  if (usuarioRecuperadoDeLocalstorage) {
    usuarioLogueado = JSON.parse(usuarioRecuperadoDeLocalstorage);
  }
}

function verificarInicio() {
  if (usuarioLogueado) {
    NAV.setRoot("page-obtener-registros");
    NAV.popToRoot();
  } else {
    NAV.setRoot("page-login");
    NAV.popToRoot();
  }
}
//ruteo
function navegar(evt) {
  actualizarUsuarioLogueadoDesdeLocalStorage();
  actualizarMenu();
  const pantallaDestino = evt.detail.to;
  switch (pantallaDestino) {
    case "/":
      verificarInicio();
      break;
    case "/login":
      mostrarLogin();
      break;
    case "/usuarios":
      mostrarRegistro();
      break;
    case "/registros":
      mostrarObtenerPantallaRegistrosUsuario();
      break;
    case "/paises":
      mostrarPaises();
      break;
    case "/agregar-registro":
      mostrarAgregarRegistro();
      break;
    case "/informes":
      mostrarInformes();
      break;

  }
}
//menu
function actualizarMenu() {
  document.querySelector("#btnMenuLogin").style.display = "none";
  document.querySelector("#btnMenuRegistro").style.display = "none";
  document.querySelector("#btnMenuAgregarRegistro").style.display = "none";
  document.querySelector("#btnMenuObtenerRegistros").style.display = "none";
  document.querySelector("#btnMenuPaises").style.display = "none";
  document.querySelector("#btnMenuInformes").style.display = "none";
  document.querySelector("#btnMenuCerrarSesion").style.display = "none";

  if (usuarioLogueado) {
    document.querySelector("#btnMenuAgregarRegistro").style.display = "block";
    document.querySelector("#btnMenuObtenerRegistros").style.display = "block";
    document.querySelector("#btnMenuPaises").style.display = "block";
    document.querySelector("#btnMenuInformes").style.display = "block";
    document.querySelector("#btnMenuCerrarSesion").style.display = "block";

  } else {
    document.querySelector("#btnMenuLogin").style.display = "block";
    document.querySelector("#btnMenuRegistro").style.display = "block";
  }
}

function ocultarPantallas() {
  HOME.style.display = "none";
  LOGIN.style.display = "none";
  REGISTRO.style.display = "none";
  AGREGAR_REGISTRO.style.display = "none";
  OBTENER_REGISTROS.style.display = "none";
  PAISES.style.display = "none";
  INFORMES.style.display = "none";
}

//Menu
function cerrarMenu() {
  MENU.close();
}
//pantallas
function mostrarLogin() {
  ocultarPantallas();
  LOGIN.style.display = "block";
}

function mostrarRegistro() {
  ocultarPantallas();
  REGISTRO.style.display = "block";
}

function mostrarAgregarRegistro() {
  ocultarPantallas();
  ObtenerActividades();
  AGREGAR_REGISTRO.style.display = "block";


}
function guardarRegistroHandler() {
  AgregarRegistro();
}

function mostrarObtenerPantallaRegistrosUsuario() {
  ocultarPantallas();
  OBTENER_REGISTROS.style.display = "block";
  ObtenerRegistrosUsuario();
}

function mostrarPaises() {
  ocultarPantallas();
  inicializarMapa();
  PAISES.style.display = "block";
  obtenerPaises();

}

//ir a Agregar registro
function btnAgregarRegistroIr() {
  NAV.push("page-agregar-registro");
}
//Agregar registro REGRESAR a pantalla de registros***

function btnVolver() {
  NAV.push("page-obtener-registros");
}
//pantalla informes
function mostrarInformes() {
  ocultarPantallas();
  completarTablaRegistrosUsuario();
  INFORMES.style.display = "block";

}

//Logout------------------
function cerrarSesion() {
  cerrarMenu();
  localStorage.clear();
  usuarioLogueado = null;
  NAV.setRoot("page-login");
  NAV.popToRoot();
}

// Registro------------------
function Registro() {
  let usuarioIngresado = document.querySelector("#txtRegistroUsuario").value;
  let passwordIngresado = document.querySelector("#txtRegistroPassword").value;
  let paisIngresado = document.querySelector("#txtRegistroPais").value;
  const idPais = parseInt(paisIngresado);

  document.querySelector("#pRegistroMensajes").innerHTML = "";

  if (usuarioIngresado && passwordIngresado && paisIngresado) {
    const url = apiBaseURL + "/usuarios.php";
    const bodyDeLaSolicitud = {
      usuario: usuarioIngresado,
      password: passwordIngresado,
      idPais: idPais,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyDeLaSolicitud),
    })
      .then((respuestaDeLaAPI) => {
        if (respuestaDeLaAPI.status != 200) {
          document.querySelector("#pRegistroMensajes").innerHTML =
            "Ha ocurrido un error, por favor intente nuevamente.";
        }
        return respuestaDeLaAPI.json(); // .Json es una promesa que devuelve el
        // bodyDeLaRespuesta con el then.
      })
      .then((bodyDeLaRespuesta) => {
        if (bodyDeLaRespuesta.error) {
          document.querySelector("#pRegistroMensajes").innerHTML =
            bodyDeLaRespuesta.error;
        }
        document.querySelector("#txtRegistroUsuario").value = "";
        document.querySelector("#txtRegistroPassword").value = "";
        document.querySelector("#txtRegistroPais").value = "";
        mostrarToast("SUCCESS", ":)", "Se ha registrado exitosamente.");
        token = bodyDeLaRespuesta.apikey;
        usuarioLogueado = Usuario.parse(bodyDeLaRespuesta);
        localStorage.setItem(
          "UsuarioLogueadoObligatorio",
          JSON.stringify(usuarioLogueado)
        );
        NAV.setRoot("page-obtener-registros");
        NAV.popToRoot(); // Limpio el stack de navegación
      })
      .catch((error) => {
        document.querySelector("#pRegistroMensajes").innerHTML =
          "Error al registrar usuario: " + error.message;
      });
  } else {
    document.querySelector("#pRegistroMensajes").innerHTML =
      "Todos los campos son obligatorios.";
  }
}

// Login------------------
function Login() {
  let usuarioIngresado = document.querySelector("#txtLoginUsuario").value;
  let passwordIngresado = document.querySelector("#txtLoginPassword").value;

  document.querySelector("#pLoginMensajes").innerHTML = "";

  if (usuarioIngresado && passwordIngresado) {
    const url = apiBaseURL + "/login.php";
    const bodyDeLaSolicitud = {
      usuario: usuarioIngresado,
      password: passwordIngresado,
    };
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyDeLaSolicitud),
    })
      .then((respuestaDeLaAPI) => {
        if (respuestaDeLaAPI.status !== 200) {
          mostrarToast(
            "ERROR",
            "Error",
            "Ha ocurrido un error, por favor intente nuevamente."
          );
        }
        return respuestaDeLaAPI.json(); // .Json devuelve una promesa en el body de la respuesta
      })
      .then((bodyDeLaRespuesta) => {
        if (bodyDeLaRespuesta.apiKey) {
          document.querySelector("#txtLoginUsuario").value = "";
          document.querySelector("#txtLoginPassword").value = "";
          usuarioLogueado = Usuario.parse(bodyDeLaRespuesta);
          localStorage.setItem(
            "UsuarioLogueadoObligatorio",
            JSON.stringify(usuarioLogueado)
          ); // Guardo el usuario en el local storage
          NAV.setRoot("page-obtener-registros"); // Cambio el stack y redirijo a Registro de Actividades
          NAV.popToRoot(); // Limpio el stack de navegación
        } else if (bodyDeLaRespuesta.mensaje) {
          document.querySelector("#pLoginMensajes").innerHTML = bodyDeLaRespuesta.mensaje;
        }
      }).catch((error) => console.log(error)); //cierra then

  } else {
    mostrarToast(
      "ERROR",
      "Datos incompletos",
      "Debe ingresar correo y contraseña"
    );
  }
}


// Registros de Usuario - Agregar------------------
function AgregarRegistro() {
  registrosDeUsuario = [];
  if (!usuarioLogueado) {
    document.querySelector("#pAgregarRegistroMensajes").innerHTML = "Debe iniciar sesión para agregar registros.";
    return;
  }

  const url = apiBaseURL + "/registros.php";
  const actividadSeleccionada = document.getElementById("select-actividades").value;
  const actividadSeleccionadaId = parseInt(actividadSeleccionada);

  const fechaIngresadaValor = document.querySelector("#txtAgregarRegistroFecha").value;
  if (!fechaIngresadaValor) {
    document.querySelector("#pAgregarRegistroMensajes").innerHTML = "Debe ingresar una fecha válida.";
    return;
  }
  const fechaIngresada = new Date(fechaIngresadaValor);
  const tiempoIngresado = document.querySelector("#txtAgregarRegistroTiempo").value;

  const hoy = new Date();
  if (fechaIngresada > hoy) {
    document.querySelector("#pAgregarRegistroMensajes").innerHTML = "La fecha ingresada no puede ser mayor a la fecha actual.";
    return;
  }

  if (actividadSeleccionadaId && tiempoIngresado) {
    const bodyDeLaSolicitud = {
      idActividad: actividadSeleccionadaId,
      fecha: fechaIngresadaValor,
      tiempo: tiempoIngresado,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": usuarioLogueado.token,
        "iduser": usuarioLogueado.idUsuario,
      },
      body: JSON.stringify(bodyDeLaSolicitud),
    })
      .then((respuestaDeLaAPI) => {
        if (respuestaDeLaAPI.status === 401) {
          cerrarSesionPorFaltaDeToken();

        } else if (respuestaDeLaAPI.status === 200) {
          document.querySelector("#txtAgregarRegistroFecha").value = "";
          document.querySelector("#txtAgregarRegistroTiempo").value = "";
          document.querySelector("#select-actividades").value = "";
          return respuestaDeLaAPI.json();
        }

      })
      .then((bodyDeLaRespuesta) => {
        if (bodyDeLaRespuesta.error) {
          mostrarToast("ERROR", "Error", bodyDeLaRespuesta.error);

        }
        else if (bodyDeLaRespuesta?.registros?.length > 0) {
          bodyDeLaRespuesta.registros.forEach((r) => {
            registrosDeUsuario.push(ActividadUsuario.parse(r));
          });
          mostrarToast("SUCCESS", "Registro exitoso", "Se ha registrado la actividad correctamente.");
          mostrarTablaRegistrosUsuario();
          NAV.push("page-obtener-registros");
          NAV.popToRoot();
        } else {
          mostrarToast("ERROR", "Error", "No se pudo registrar la actividad.");
        }
      })
      .catch((error) => {
        console.error(error);
        document.querySelector("#pAgregarRegistroMensajes").innerHTML = "Error al conectar con el servidor.";
      });
  } else {
    document.querySelector("#pAgregarRegistroMensajes").innerHTML = "Todos los campos son obligatorios.";
  }
}


//Registros de Usuario - Obtener------------------
function ObtenerRegistrosUsuario() {
  registrosDeUsuario = [];
  const url = `${apiBaseURL}/registros.php?iduser=${usuarioLogueado.idUsuario}`;
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "apikey": usuarioLogueado.token,
      "iduser": usuarioLogueado.idUsuario,
    },
  })
    .then((respuestaDeLaAPI) => {
      if (respuestaDeLaAPI.status === 401) {
        cerrarSesionPorFaltaDeToken();
      } else {
        return respuestaDeLaAPI.json();
      }
    }).then((bodyDeLaRespuesta) => {
      if (bodyDeLaRespuesta?.error) {
        mostrarToast("ERROR", "Error", bodyDeLaRespuesta.error);
      } else if (bodyDeLaRespuesta.registros.length > 0) {
        bodyDeLaRespuesta.registros.forEach(r => {
          registrosDeUsuario.push((ActividadUsuario.parse(r)));
          console.log(registrosDeUsuario);
        });
        console.log("resp", bodyDeLaRespuesta);
        completarTablaRegistrosUsuario();
      } else {
        mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
      }
    }).catch(error => console.log(error));
}
//muestro los registros de usuario del GET
function completarTablaRegistrosUsuario() {
  let listadoRegistrosUsuario = '<ion-list>';
  registrosDeUsuario.forEach((r) => {

    listadoRegistrosUsuario += `
        <ion-item class="ion-item-registro-usuario" actividad-usuario-id="${r.id}">
     <ion-thumbnail slot="start">
                    <img src="${r.actividad.getURLImagen()}" width="100"/>
                </ion-thumbnail>
                <ion-label>
                    <h2>${r.duracion}</h2>
                    <h3>${r.fecha}</h3>
                     <ion-button fill="clear" color="danger" onclick="eliminarRegistro(${r.id})">
                        <ion-icon name="trash"></ion-icon>
                    </h4>
                </ion-label>
          </ion-item>
     `;
  });
  listadoRegistrosUsuario += '</ion-list>'
  if (registrosDeUsuario.length == 0) {
    document.querySelector("#pObtenerRegistrosMensajes").innerHTML = "No se encontraron registros.";
  } else {
    document.querySelector("#pObtenerRegistrosMensajes").innerHTML = "";
  }
  const registrosDiv = document.querySelector("#divObtenerRegistros");
  if (registrosDiv) {
    registrosDiv.innerHTML = listadoRegistrosUsuario;
  }

}


//Eliminar registro------------------

function eliminarRegistro(id) {
  const reg = obtenerRegistroPorId(id);
  const registroEliminar = registrosDeUsuario.registroid;

  if (registroEliminar) {
    const url = `${apiBaseURL}/registros.php?id=${registroEliminar}`;
    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "apikey": usuarioLogueado.token,
        "iduser": usuarioLogueado.idUsuario,
      },
    })
      .then((respuestaDeLaAPI) => {
        if (respuestaDeLaAPI.status === 401) {
          cerrarSesionPorFaltaDeToken();
        } else {
          return respuestaDeLaAPI.json();
        }
      }).then((bodyDeLaRespuesta) => {
        if (bodyDeLaRespuesta.error) {
          mostrarToast("ERROR", "Error", bodyDeLaRespuesta.error);
        } else if (bodyDeLaRespuesta?.registros?.length > 0) {
          bodyDeLaRespuesta.registros.forEach(r => {
            registrosDeUsuario.push(ActividadUsuario.parse(r));
          });
          console.log(bodyDeLaRespuesta);
          completarTablaRegistrosUsuario();
        } else {
          mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
        }
      }).catch(error => console.log(error));
  }
}


function obtenerRegistroPorID(id) {
  let reg = null;
  let i = 0;
  while (!reg && i < registrosDeUsuario.length) {
    const registroActual = registrosDeUsuario[i];
    if (registrosDeUsuario[i].id === id) {
      reg = registroActual;
    }
    i++;
  }
  return reg;
}



// Actividades------------------
function ObtenerActividades() {
  listadoActividades = []; // Limpio el array de actividades
  const url = `${apiBaseURL}/actividades.php?iduser=${usuarioLogueado.idUsuario}`;

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "apikey": usuarioLogueado.token,
      "iduser": usuarioLogueado.idUsuario,
    },
  })
    .then((respuestaDeLaAPI) => {
      if (respuestaDeLaAPI.status === 401) {
        cerrarSesionPorFaltaDeToken();
      } else {
        return respuestaDeLaAPI.json();
      }
    })
    .then((bodyDeLaRespuesta) => {
      console.log("Respuesta de la API:", bodyDeLaRespuesta);
      if (!bodyDeLaRespuesta) {
        mostrarToast("ERROR", "Error", bodyDeLaRespuesta.error);
      } else if (bodyDeLaRespuesta?.actividades?.length > 0) {
        bodyDeLaRespuesta.actividades.forEach(a => {
          listadoActividades.push(Actividad.parse(a)); // Agrego la actividad al array de actividades
        });
        actualizarSelectActividades();
      }
      else {
        mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
      }
    })
    .catch((error) => console.log("Error al obtener actividades", error.message));
}

function actualizarSelectActividades() {
  const actividadSeleccionada = document.querySelector("#select-actividades");
  actividadSeleccionada.innerHTML = "";
  for (let i = 0; i < listadoActividades.length; i++) {
    const actividadActual = listadoActividades[i];
    actividadSeleccionada.innerHTML += `<ion-select-option value="${actividadActual.idActividad}">${actividadActual.nombre}</ion-select-option>`;
  }
}



function obtenerActividadPorId(id) {
  let act = null;
  let i = 0;
  while (!act && i < listadoActividades.length) {
    const actividadActual = listadoActividades[i];
    if (actividadActual.idActividad === id) {
      act = actividadActual;
    }
    i++;
  }
  return act;
}

function actividadesChangeHandle(event) {
  const idActividad = event.target.value;
  const actividadSeleccionada = obtenerActividadPorId(idActividad);
  if (actividadSeleccionada) {
    actualizarSelectActividades(actividadSeleccionada);
  }
}
//paises------------------
function obtenerPaises() {

  listaPaises = [];
  const url = apiBaseURL + "/paises.php";
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",

    },
  })
    .then((respuestaDeLaAPI) => {
      return respuestaDeLaAPI.json();

    })
    .then((bodyDeLaRespuesta) => {
      if (bodyDeLaRespuesta.error) {
        mostrarToast("ERROR", "Error", bodyDeLaRespuesta.error);
      } else if (bodyDeLaRespuesta != null) {
        bodyDeLaRespuesta.paises.forEach((p) => {
          listaPaises.push(Pais.parse(p));
          console.log(bodyDeLaRespuesta);
        });
        actualizarSelectPaises();
      } else {
        mostrarToast("ERROR", "Error", "No se han encontrado paises.");
      }
    })
    .catch((error) => console.log("Error al cargar paises", error));
}


function actualizarSelectPaises() {
  SELECT_PAISES.innerHTML = "";
  for (let i = 0; i < listaPaises.length; i++) {
    const paisActual = listaPaises[i];
    SELECT_PAISES.innerHTML += `<ion-select-option value="${paisActual.idPais}">
    ${paisActual.nombre}</ion-select-option>`;
  }
}
//fILTROS------------------
function filtrarRegistrosPorPeriodo(filtro) {

  const hoy = new Date();
  let fSemana = null;
  let fMes = null;
  registrosUsuarioFiltrados = [];

  if (filtro === "semana") {
    fSemana = new Date(hoy.setDate(hoy.getDate() - 7))
    registrosDeUsuario.forEach((r) => {
      let fechaRegistro = new Date(r.fecha);
      if (fechaRegistro >= fSemana) {
        registrosUsuarioFiltrados.push(r);
      }
    });
  } else if (filtro === "mes") {
    fMes = new Date(hoy.setDate(hoy.getDate() - 30))
    registrosDeUsuario.forEach((r) => {
      let fechaRegistro = new Date(r.fecha);
      if (fechaRegistro >= fSemana) {
        registrosUsuarioFiltrados.push(r);
      }
    });
  } else if (filtro === "historico") {
    registrosUsuarioFiltrados = registrosDeUsuario;
  }
  completarTablaRegistrosUsuarioFiltrados();
  return registrosUsuarioFiltrados; //devuelve todos si la fecha es mayor a la actual
}

function completarTablaRegistrosUsuarioFiltrados() {
  let listadoRegistrosUsuarioFiltrados = '<ion-list>';

  try {
    if (registrosUsuarioFiltrados.length > 0) {

      registrosUsuarioFiltrados.forEach((r) => {

        listadoRegistrosUsuarioFiltrados += `
          <ion-item class="ion-item-registro-usuario" actividad-usuario-id="${r.idUsuario}">
            <ion-thumbnail slot="start">
              <img src="${r.actividad.getURLImagen()}" width="100"/>
            </ion-thumbnail>
            <ion-label>
              <h2>${r.duracion}</h2>
              <h3>${r.fecha}</h3>
              <h4>ID: ${r.id}</h4>
              <ion-button fill="clear" color="danger" onclick="eliminarRegistro(${r.id})">
                <ion-icon name="trash"></ion-icon>
              </ion-button>
            </ion-label>
          </ion-item>
        `;
      });
    }
    listadoRegistrosUsuarioFiltrados += '</ion-list>';

    if (registrosUsuarioFiltrados.length === 0) {
      document.querySelector("#pObtenerRegistrosMensajes").innerHTML = "No se encontraron registros.";
    } else {
      document.querySelector("#pObtenerRegistrosMensajes").innerHTML = "";
    }
    document.querySelector("#divObtenerRegistros").innerHTML = listadoRegistrosUsuarioFiltrados;
  } catch (error) {
    document.querySelector("#pObtenerRegistrosMensajes").innerHTML = "Ocurrió un error al cargar los registros.";
  }
}


function aplicarFiltro(evt) {
  const filtro = evt.target.getAttribute("value"); //semana, mes, historico
  filtrarRegistrosPorPeriodo(filtro);
  completarTablaRegistrosUsuarioFiltrados();

}
//informes------------------

function calcularTiempoTotal(registros) {
  let tiempoTotal = 0;
  let tiempoDiario = 0;

  let hoy = new Date();
  const anio = hoy.getFullYear();
  let mes = hoy.getMonth() + 1;
  let dia = hoy.getDate();
  const nuevoDia = dia.toString().padStart(2, "0");
  const nuevoMes = mes.toString().padStart(2, "0");
  const nuevoAnio = anio.toString();
  let nuevaFechaIngresada = `${nuevoAnio}-${nuevoMes}-${nuevoDia}`;

  registrosDeUsuario.forEach(r => {

    const minutos = parseInt(r.tiempo);
    tiempoTotal += minutos;
  });

  return tiempoTotal;
}

function calcularTiempoDiario(registros) {
  let tiempoDiario = 0;

  let hoy = new Date();
  const anio = hoy.getFullYear();
  let mes = hoy.getMonth() + 1;
  let dia = hoy.getDate();
  const nuevoDia = dia.toString().padStart(2, "0");
  const nuevoMes = mes.toString().padStart(2, "0");
  const nuevoAnio = anio.toString();
  let nuevaFechaIngresada = `${nuevoAnio}-${nuevoMes}-${nuevoDia}`;

  registrosDeUsuario.forEach(r => {

    const minutos = parseInt(r.tiempo);

    if (registro.fecha === hoy) {
      tiempoDiario += minutos;
    }
  });

  return tiempoDiario;
}

function completarTablaRegistrosUsuario() { //muestro informes 
  let listadoHTML = '<ion-list>';

  registrosDeUsuario.forEach((r) => {
    listadoHTML += `
      <ion-item class="ion-item-registro-usuario" actividad-usuario-id="${r.id}">
        <ion-thumbnail slot="start">
          <img src="${r.actividad.getURLImagen()}" width="90"/>
        </ion-thumbnail>
        <ion-label>
          <h2>${r.duracion} min</h2>
          <h3>${r.fecha}</h3>
          <ion-button fill="clear" color="danger" onclick="eliminarRegistro(${r.id})">
            <ion-icon name="trash"></ion-icon>
          </ion-button>
        </ion-label>
      </ion-item>
    `;
  });
  listadoHTML += '</ion-list>';

  const Total = calcularTiempoTotal(registrosDeUsuario);
  const Diario = calcularTiempoDiario(registrosDeUsuario);

  const resumenTiempoHTML = `
    <ion-card>
      <ion-card-content>
        <p><strong>Tiempo total:</strong> ${Total} minutos</p>
        <p><strong>Tiempo diario:</strong> ${Diario} minutos</p>
      </ion-card-content>
    </ion-card>
  `;

  document.querySelector("#divObtenerInformes").innerHTML = resumenTiempoHTML + listadoHTML;

  if (registrosDeUsuario.length === 0) {
    document.querySelector("#pObtenerInformesMensajes").innerHTML = "No se encontraron registros.";
  } else {
    document.querySelector("#pObtenerInformesMensajes").innerHTML = "";
  }
}

//mapas------------------

var usuarioIcon = L.icon({
  iconUrl: 'man-outline.svg',
  iconSize: [38, 95],
  shadowSize: [50, 64],
  iconAnchor: [22, 94],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76]
});


function cargarUbicacionUsuario() {
  if ("geolocation" in navigator) {
    window.navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (pos?.coords?.latitude) {
          posicionUsuario = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }
          L.marker([posicionUsuario.latitude, posicionUsuario.longitude], { icon: usuarioIcon }).addTo(map);
        }
      });
  }
}


// function usuariosPaisesMapa(evt) {

//   const url = `${apiBaseURL}/usuariosPorPais.php`;

//   fetch(url, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "apikey": usuarioLogueado.token,
//       "iduser": usuarioLogueado.idUsuario,
//     },
//   })
//     .then((respuestaDeLaAPI) => {
//       if (respuestaDeLaAPI.status === 401) {
//         cerrarSesionPorFaltaDeToken();
//       } else {
//         return respuestaDeLaAPI.json();
//       }
//     })
//     .then((bodyDeLaRespuesta) => {
//       console.log("Respuesta de la API:", bodyDeLaRespuesta);
//       if (!bodyDeLaRespuesta) {
//         mostrarToast("ERROR", "Error", bodyDeLaRespuesta.error);
//       } else if (bodyDeLaRespuesta.paises.length > 0) {
//         bodyDeLaRespuesta.paises.forEach(p => {
//           listadoUsuariosPais.push(Pais.parse(p)); // Agrego el pais a la lista con los atributos de "usuariosPorPais"
//         });
//         console.log(bodyDeLaRespuesta);
//         console.log(listadoUsuariosPais);
//         mostrarUsuariosEnMapa(listadoUsuariosPais);
//       }
//       else {
//         mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
//       }
//     })
//     .catch((error) => console.log("Error al obtener usuarios", error.message));
// }


function mostrarUsuariosEnMapa(listadoUsuariosPais) {
  if (!map) {
    map = L.map('divMapa').setView([posicionUsuario.latitude, posicionUsuario.longitude], -10);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.marker([posicionUsuario.latitude, posicionUsuario.longitude], { icon: usuarioIcon }).addTo(map).bindPopup("Ubicación actual");
    listadoUsuariosPais.forEach((p) => {
      L.marker([p.latitud, p.longitud]).addTo(map).bindPopup(p.cantidadDeUsuarios + " usuarios");
    });
  }

}

function usuariosEnPaisChangeHandler(evt) {
  const idPais = evt.target.value;
  const paisSeleccionado = obtenerPaisPorId(idPais);
  const cantUsu = paisSeleccionado.cantidadDeUsuarios;
  if (paisSeleccionado) {
    map.setView([paisSeleccionado.latitud, paisSeleccionado.longitud], 5);
  }
  const url = `${apiBaseURL}/usuariosPorPais.php`;

  fetch(`https://nominatim.openstreetmap.org/search?q=${paisSeleccionado.latitud, paisSeleccionado.longitud}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "apikey": usuarioLogueado.token,
      "iduser": usuarioLogueado.idUsuario,
    },
  })
    .then((respuestaDeLaAPI) => {
      if (respuestaDeLaAPI.status === 401) {
        cerrarSesionPorFaltaDeToken();
      } else {
        return respuestaDeLaAPI.json();
      }
    })
    .then((bodyDeLaRespuesta) => {
      console.log("Respuesta de la API:", bodyDeLaRespuesta);
      if (!bodyDeLaRespuesta) {
        mostrarToast("ERROR", "Error", bodyDeLaRespuesta.error);
      } else if (bodyDeLaRespuesta.paises.length > 0) {
        const posicionUsuario = {
          latitude: bodyDeLaRespuesta[0].latitude,
          longitude: bodyDeLaRespuesta[0].longitude
        };
        map.setView([posicionUsuario.latitude, posicionaUsuario.longitude], 18);
        marcadorUsuario = L.marker([posicionUsuario.latitude, posicionUsuario.longitude], { icon: usuarioIcon }).addTo(map).bindPopup().openPopup();
      } usuariosEnPaisChangeHandler();
      mostrarUsuariosEnMapa(posicionUsuario);
    });
}




function obtenerPaisPorId(id) {
  let pai = null;
  let i = 0;
  while (!pai && i < paises.length) {
    const paiisActual = paises[i];
    if (paisActual.id === id) {
      pai = paisActual;
    }
    i++;
  }
  return pai;
}


function inicializarMapa() {
  if (!map) {
    map = L.map('divMapa').setView([posicionUsuario.latitude, posicionUsuario.longitude], 18);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.marker([posicionUsuario.latitude, posicionUsuario.longitude]).addTo(map).bindPopup("Ubicación del usuario");
  }
}



//cerrar sesion
function cerrarSesionPorFaltaDeToken() {
  mostrarToast("ERROR", "No autorizado", "Se ha cerrado sesión por seguridad.");
  cerrarSesion();
}

async function mostrarToast(tipo, titulo, mensaje) {
  const toast = document.createElement("ion-toast");
  toast.header = titulo;
  toast.message = mensaje;
  toast.position = "bottom";
  toast.duration = 2000;
  if (tipo === "ERROR") {
    toast.color = "danger";
  } else if (tipo === "SUCCESS") {
    toast.color = "success";
  } else if (tipo === "WARNING") {
    toast.color = "warning";
  }

  document.body.appendChild(toast);
  return toast.present();
}
