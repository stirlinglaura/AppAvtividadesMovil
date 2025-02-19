// Variables de estado
let usuarioLogueado = null;
let listadoActividades = [];
let actividadesFiltradas = [];
let listaPaises = [];

// Constantes
let apiBaseURL = "https://movetrack.develotion.com";

const MENU = document.querySelector("#menu");
const ROUTER = document.querySelector("#ruteo");
const NAV = document.querySelector("#nav");
const HOME = document.querySelector("#pantalla-home");
const LOGIN = document.querySelector("#pantalla-login");
const REGISTRO = document.querySelector("#pantalla-registro");
const AGREGAR_REGISTRO = document.querySelector("#pantalla-agregar-registro");
const OBTENER_REGISTROS = document.querySelector("#pantalla-obtener-registros");
const OBTENER_ACTIVIDADES = document.querySelector(
  "#pantalla-obtener-actividades"
);
const SELECT_ACTIVIDADES = document.querySelector("#select-actividades");
const PAISES = document.querySelector("#pantalla-paises");
const SELECT_PAISES = document.querySelector("#select-paises");

//inicio
inicializar();

function inicializar() {
  suscripcionAEventos();
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
  document
    .querySelector("#btnAgregarRegistro")
    .addEventListener("click", AgregarRegistro);
  //ObtenerRegistros de usuario
  // document
  // .querySelector("#btnMenuObtenerRegistros")
  //.addEventListener("click", ObtenerRegistrosUsuario);
  //Agregar registro ir
  document
    .querySelector("#btnAgregarRegistroIr")
    .addEventListener("click", btnAgregarRegistroIr);
  //Obtener Actividades desde el menú
  document
    .querySelector("#btnMenuObtenerActividades")
    .addEventListener("click", ObtenerYListarActividades);
  //Select Actividades
  SELECT_ACTIVIDADES.addEventListener("ionChange", actualizarSelectActividades);

  //Obtener Paises
  document
    .querySelector("#btnMenuPaises")
    .addEventListener("click", obtenerPaises);
  //Select Paises
  SELECT_PAISES.addEventListener("ionChange", actualizarSelectPaises);
  //Cerrar Sesion
  document
    .querySelector("#btnMenuCerrarSesion")
    .addEventListener("click", cerrarSesion);
}

//menu
function actualizarMenu() {
  document.querySelector("#btnMenuLogin").style.display = "none";
  document.querySelector("#btnMenuRegistro").style.display = "none";
  document.querySelector("#btnMenuAgregarRegistro").style.display = "none";
  document.querySelector("#btnMenuObtenerRegistros").style.display = "none";
  document.querySelector("#btnMenuObtenerActividades").style.display = "none";
  document.querySelector("#btnMenuPaises").style.display = "none";
  document.querySelector("#btnMenuCerrarSesion").style.display = "none";

  if (usuarioLogueado) {
    document.querySelector("#btnMenuCerrarSesion").style.display = "block";
    document.querySelector("#btnMenuAgregarRegistro").style.display = "block";
    document.querySelector("#btnMenuObtenerRegistros").style.display = "none";
    document.querySelector("#btnMenuObtenerActividades").style.display =
      "block";
    document.querySelector("#btnMenuAgregarRegistro").style.display = "block";
    document.querySelector("#btnMenuPaises").style.display = "block";
  } else {
    document.querySelector("#btnMenuLogin").style.display = "block";
    document.querySelector("#btnMenuRegistro").style.display = "block";
  }
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
  AGREGAR_REGISTRO.style.display = "block";
}

function mostrarObtenerRegistrosUsuario() {
  ocultarPantallas();
  OBTENER_REGISTROS.style.display = "block";
}

function mostrarActividades() {
  ocultarPantallas();
  ObtenerYListarActividades();
  OBTENER_ACTIVIDADES.style.display = "block";
  actualizarMenu();
}
function mostrarPaises() {
  ocultarPantallas();
  PAISES.style.display = "block";
}
function ocultarPantallas() {
  HOME.style.display = "none";
  LOGIN.style.display = "none";
  REGISTRO.style.display = "none";
  AGREGAR_REGISTRO.style.display = "none";
  OBTENER_REGISTROS.style.display = "none";
  OBTENER_ACTIVIDADES.style.display = "none";
  PAISES.style.display = "none";
}

//Logout------------------
function cerrarSesion() {
  usuarioLogueado = null;
  localStorage.clear();
  NAV.setRoot("page-login");
  cerrarMenu();
}
//ir a Agregar registro
function btnAgregarRegistroIr() {
  NAV.push("page-agregar-registro");
}
//navegación

function verificarInicio() {
  if (usuarioLogueado) {
    NAV.setRoot("page-obtener-actividades");
    NAV.popToRoot();
  } else {
    NAV.setRoot("page-login");
    NAV.popToRoot();
  }
}

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
    case "/actividades":
      mostrarActividades();
      break;
    //case "/registros":
    //  mostrarObtenerRegistrosUsuario();
    //  break;
    case "/paises":
      mostrarPaises();
      break;
    case "/agregar-registro":
      mostrarAgregarRegistro();
      break;
  }
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
        NAV.setRoot("page-agregar-registro");
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
          NAV.setRoot("page-agregar-registro"); // Cambio el stack y redirijo a Registro de Actividades
          NAV.popToRoot(); // Limpio el stack de navegación
        } else if (respuestaBody.mensaje)
          document.querySelector("#pLogin").innerHTML = respuestaBody.mensaje;
      }) //cierra then
      .catch((mensaje) => console.log(mensaje));
  } else {
    mostrarToast(
      "ERROR",
      "Datos incompletos",
      "Debe ingresar correo y contraseña"
    );
  }
}

function actualizarUsuarioLogueadoDesdeLocalStorage() {
  let usuarioRecuperadoDeLocalstorage = localStorage.getItem(
    "UsuarioLogueadoObligatorio"
  );
  if (usuarioRecuperadoDeLocalstorage) {
    usuarioLogueado = JSON.parse(usuarioRecuperadoDeLocalstorage);
  }
}
// Registros------------------
function AgregarRegistro() {
  document.querySelector("#select-actividades").innerHTML = "";

  let actividadSeleccionada = document.querySelector(
    "#select-actividades"
  ).value;
  let fechaIngresada = document.querySelector("#txtAgregarRegistroFecha").value;
  let tiempoIngresado = document.querySelector(
    "#txtAgregarRegistroTiempo"
  ).value;
}

// Actividades------------------
function ObtenerYListarActividades() {
  listadoActividades = []; // Limpio el array de actividades
  const url = `${apiBaseURL}/actividades.php?iduser={usuarioLogueado.idUsuario}`;

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
      if (!bodyDeLaRespuesta || !bodyDeLaRespuesta.actividades) {
        mostrarToast("ERROR", "Error", bodyDeLaRespuesta.error);
      } else if (bodyDeLaRespuesta?.actividades?.length >0) {    {
          bodyDeLaRespuesta.actividades.forEach(a => {
          listadoActividades.push(Actividad.parse(a)); // Agrego la actividad al array de actividades
        });
        actualizarSelectActividades();
      }} else {
        mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
      }    })
    .catch((error) => console.log("Error al obtener actividades", error));
}

function actualizarSelectActividades() {
  SELECT_ACTIVIDADES.innerHTML = "";
  for (let i = 0; i < listadoActividades.length; i++) {
    const actividadActual = listadoActividades[i];
    console.log("actividadActual",actividadActual);
    SELECT_ACTIVIDADES.innerHTML += `<ion-select-option value="${actividadActual.id}">${actividadActual.nombre}</ion-select-option>`;
    
  }
}
function listarActividades() {
document.querySelectorAll("#select-actividades").innerHTML = "";
for (let i = 0; i < listadoActividades.length; i++) {
  const actividadActual = listadoActividades[i];
  document.querySelector("#select-actividades").innerHTML += `<ion-select-option value="${actividadActual.id}">${actividadActual.nombre}</ion-select-option>`;
}
}
function completarTablaActividades() {
  let listadoActividades = '<ion-list>';
  actividadesFiltradas.forEach((p) => {
      let listadoEtiquetas = '';
      p.etiquetas.forEach((e, i) => {
          listadoEtiquetas += `<ion-badge color="warning">${e}</ion-badge>`;
          if (i !== p.etiquetas.length -1 ) {
              listadoEtiquetas += " "
          }
      });

      listadoProductos += `
          <ion-item class="ion-item-producto" producto-id="${p.id}">
              <ion-thumbnail slot="start">
                  <img src="${p.getURLImagen()}" width="100"/>
              </ion-thumbnail>
              <ion-label>
                  <h2>${p.nombre}</h2>
                  <h3>${p.codigo}</h3>
                  <h3>$${p.precio}</h3>
                  <h4>${listadoEtiquetas}</h4>
                  <h4>
                      <ion-badge color="${p.estado === 'en stock'? 'success' : 'danger'}">${p.estado}</ion-badge>
                  </h4>
              </ion-label>
          </ion-item>
      `;
  });
  listadoProductos += '</ion-list>'

  if (productosFiltrados.length === 0) {
      listadoProductos = "No se encontraron productos.";
  }

  document.querySelector("#divProductos").innerHTML = listadoProductos;

  const tagsProductos = document.querySelectorAll(".ion-item-producto");

  tagsProductos.forEach((tp) => {
      tp.addEventListener('click', tagProductoClickHandler);
  });
}
//paises
function obtenerPaises() {
  let listaPaises = [];
  const url = apiBaseURL + "/paises.php";
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "apikey": usuarioLogueado.token,
      "id": usuarioLogueado.idUsuario
    },
  })
    .then((respuestaDeLaAPI) => {
      return respuestaDeLaAPI.json();
    })
    .then((bodyDeLaRespuesta) => {
      if (bodyDeLaRespuesta.error) {
        mostrarToast("ERROR", "Error", bodyDeLaRespuesta.error);
      } else if (bodyDeLaRespuesta != null) {
        bodyDeLaRespuesta.idPais.forEach((pais) => {
          listaPaises.push(Pais.parse(pais));
        });
        console.log(listaPaises);
        actualizarSelectPaises();
      } else {
        mostrarToast("ERROR", "Error", "No se han encontrado paises.");
      }
    })
    .catch((error) => console.log("Error al cargar paises", error));
}

//Otras
function actualizarSelectPaises() {
  SELECT_PAISES.innerHTML = "";
  for (let i = 0; i < listaPaises.length; i++) {
    const paisActual = listaPaises[i];
    console.log("actualizacion", listaPaises.length);
    SELECT_PAISES.innerHTML += `<ion-select-option value="${paisActual.id}">
    ${paisActual.name}</ion-select-option>`;
  }
}
function cerrarSesionPorFaltaDeToken() {
  mostrarToast("ERROR", "No autorizado", "Se ha cerrado sesión por seguridad.");
  cerrarSesion();
}
function obtenerActividadPorID(id) {
  let actividadARegistar = null;
  let i = 0;
  while (i < actividades.length && !actividadARegistrar) {
    if (actividades[i].id == id) {
      actividadARegistar = actividades[i];
    }
    i++;
  }
  return actividadARegistar;
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
