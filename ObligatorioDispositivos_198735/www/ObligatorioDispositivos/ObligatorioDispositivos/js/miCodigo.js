// Variables de estado
let usuarioLogueado = null;
let listadoActividades = [];
let actividades = [];

// Constantes
const apiBaseURL = "https://movetrack.develotion.com/";

const MENU = document.querySelector("#menu");
const ROUTER = document.querySelector("#ruteo");
const NAV = document.querySelector("#nav");
const HOME = document.querySelector("#pantalla-home");
const LOGIN = document.querySelector("#pantalla-login");
const REGISTRO = document.querySelector("#pantalla-registro");
const ACTIVIDADES = document.querySelector("#pantalla-actividades");
const REGISTRO_ACTIVIDADES = document.querySelector(
  "#pantalla-registro-actividad"
);

//Menu
function cerrarMenu() {
  MENU.close();
}
//inicio
inicializar();

function inicializar() {
  subscripcionAEventos();
  actualizarUsuarioLogueadoDesdeLocalStorage();
}

function actualizarUsuarioLogueadoDesdeLocalStorage() {
  let usuarioRecuperadoDeLocalstorage = localStorage.getItem(
    "UsuarioLogueadoObligatorio"
  );
  if (usuarioRecuperadoDeLocalstorage) {
    usuarioLogueado = JSON.parse(usuarioRecuperadoDeLocalstorage);
  }
}

function subscripcionAEventos() {
  // Routeo
  ROUTER.addEventListener("ionRouteDidChange", navegar);
  // Login
  document.querySelector("#btnLoginIngresar").addEventListener("click", Login);
  //Registro
  document
    .querySelector("#btnRegistroRegistrarse")
    .addEventListener("click", Registro);
  //RegistrarActividad
  document
    .querySelector("#btnMenuRegistroActividad")
    .addEventListener("click", RegistrarActividad);
  document
    .querySelector("#btnMenuListadoActividades")
    .addEventListener("click", ObtenerActividades);
}

//navegación
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
    case "/registro-actividad":
      mostrarRegistroActividad();
      break;
  }
}
function verificarInicio() {
  if (usuarioLogueado) {
    NAV.setRoot("page-registro-actividad");
    NAV.popToRoot();
  } else {
    NAV.setRoot("page-login");
    NAV.popToRoot();
  }
}

function actualizarMenu() {
  document.querySelector("#btnMenuRegistroActividad").style.display = "none";
  document.querySelector("#btnMenuListadoActividades").style.display = "none";
  document.querySelector("#btnMenuCerrarSesion").style.display = "none";
  document.querySelector("#btnMenuLogin").style.display = "none";
  document.querySelector("#btnMenuRegistro").style.display = "none";

  if (usuarioLogueado) {
    document.querySelector("#btnMenuCerrarSesion").style.display = "block";
    document.querySelector("#btnMenuRegistroActividad").style.display = "block";
    document.querySelector("#btnMenuListadoActividades").style.display =
      "block";
  } else {
    document.querySelector("#btnMenuLogin").style.display = "block";
    document.querySelector("#btnMenuRegistro").style.display = "block";
  }
}

function mostrarLogin() {
  ocultarPantallas();
  LOGIN.style.display = "block";
}

function mostrarRegistro() {
  ocultarPantallas();
  REGISTRO.style.display = "block";
}

function mostrarActividades() {
  ocultarPantallas();
  ACTIVIDADES.style.display = "block";
}

function mostrarRegistroActividad() {
  ocultarPantallas();
  REGISTRO_ACTIVIDADES.style.display = "block";
}

function ocultarPantallas() {
  LOGIN.style.display = "none";
  REGISTRO.style.display = "none";
  ACTIVIDADES.style.display = "none";
  REGISTRO_ACTIVIDADES.style.display = "none";
}

//Logout------------------
function cerrarSesion() {
  usuarioLogueado = null;
  localStorage.clear();
  NAV.setRoot("page-login");
  NAV.popToRoot();
}

// Login------------------
function Login() {
  let emailIngresado = document.querySelector("#txtLoginEmail").value;
  let passwordIngresado = document.querySelector("#txtLoginPassword").value;

  document.querySelector("#pLoginMensajes").innerHTML = "";
  if (emailIngresado && passwordIngresado) {
    const url = apiBaseURL + "login";
    const bodyDeLaSolicitud = {
      usuario: emailIngresado,
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
          document.querySelector("#pLoginMensajes").innerHTML =
            "Ha ocurrido un error. Por favor, intente nuevamente.";
        }
        return respuestaDeLaAPI.json(); //.json es una promesa que devuelve el body de la respuesta
      })
      .then((bodyDeLaRespuesta) => {
        const token = bodyDeLaRespuesta.data?.token;
        if (bodyDeLaRespuesta.data?.token) {
          document.querySelector("#txtLoginEmail").value = "";
          document.querySelector("#txtLoginPassword").value = "";
          usuarioLogueado = Usuario.parse(bodyDeLaRespuesta.data);
          localStorage.setItem(
            "UsuarioLogueadoObligatorio",
            JSON.stringify(usuarioLogueado)
          );
          console.log(usuarioLogueado);
          NAV.setRoot("page-registro-actividad"); // Cambio el stack y redirijo a Registro de Actividades
          NAV.popToRoot();
        } else if (bodyDeLaRespuesta.error) {
          document.querySelector("#pLoginMensajes").innerHTML =
            bodyDeLaRespuesta.error;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    document.querySelector("#pLoginMensajes").innerHTML =
      "Todos los campos son obligatorios.";
  }
}
// Registro------------------
function Registro() {
  let emailIngresado = document.querySelector("#txtRegistroEmail").value;
  let passwordIngresado = document.querySelector("#txtRegistroPassword").value;
  let paisIngresado = document.querySelector("#txtRegistroPais").value;

  document.querySelector("#pRegistroMensajes").innerHTML = "";

  if (emailIngresado && passwordIngresado && paisIngresado) {
    const url = apiBaseURL + "usuarios";
    const bodyDeLaSolicitud = {
      usuario: emailIngresado,
      password: passwordIngresado,
      idPais: paisIngresado,
    };
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyDeLaSolicitud), // Se convierte el objeto a un string para enviarlo.
    })
      .then((respuestaDeLaAPI) => {
        // Se recibe la respuesta de la API.
        if (respuestaDeLaAPI.status == 200) {
          document.querySelector("#txtRegistroEmail").value = "";
          document.querySelector("#txtRegistroPassword").value = "";
          document.querySelector("#txtRegistroPais").value = "";
          document.querySelector("#pRegistroMensajes").innerHTML =
            "Se ha registrado exitosamente :)";
        } else {
          document.querySelector("#pRegistroMensajes").innerHTML =
            "Ha ocurrido un error, por favor intente nuevamente.";
        }
        return respuestaDeLaAPI.json(); // .Json es una promesa que devuelve el
        // bodyDeLaRespuesta con el then.
      })
      .then((bodyDeLaRespuesta) => {
        // Se recibe el body de la respuesta de la API.
        if (bodyDeLaRespuesta.error) {
          document.querySelector("#pRegistroMensajes").innerHTML =
            bodyDeLaRespuesta.error;
        } else {
          NAV.setRoot("page-login"); // Cambio el stack y redirijo a Login
          NAV.popToRoot();
        }
      })
      .catch((error) => {
        //da error
        console.log("Error al registrar usuario", error);
      });
  } else {
    document.querySelector("#pRegistroMensajes").innerHTML =
      "Todos los campos son obligatorios.";
  }
}

// Actividades------------------
function ObtenerActividades() {
  const url = apiBaseURL + "actividades";
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: usuarioLogueado.token,
      idUsuario: usuarioLogueado.id,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      actividades = data;
      if (actividades.length <= 0) {
        document.querySelector("#listadoActividades").innerHTML =
          "No hay actividades para mostrar";
      } else {
        listadoactividades = null;
        listadoActividades.innerHTML = "";

        actividades.forEach((actividad) => {
          listadoactividades += `<li>${actividad.nombre}</li>`;
        });
        listadoactividades += "<br>";
      }
      document.querySelector("#listadoActividades").innerHTML =
        listadoactividades;
    })
    .catch((error) => {
      console.error("Error al obtener las actividades:", error);
    });
}

function RegistrarActividad() {}
