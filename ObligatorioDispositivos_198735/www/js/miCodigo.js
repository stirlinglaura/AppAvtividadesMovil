// Variables de estado
let usuarioLogueado = null;
let listadoActividades = [];
let actividades = [];

// Constantes
let apiBaseURL = "https://movetrack.develotion.com";

const MENU = document.querySelector("#menu");
const ROUTER = document.querySelector("#ruteo");
const NAV = document.querySelector("#nav");
const HOME = document.querySelector("#pantalla-home");
const LOGIN = document.querySelector("#pantalla-login");
const REGISTRO = document.querySelector("#pantalla-registro");
const AGREGAR_REGISTRO = document.querySelector("#pantalla-agregarRegistro");
const OBTENER_REGISTROS = document.querySelector("#pantalla-obtenerRegistros");
const OBTENER_ACTIVIDADES = document.querySelector(
  "#pantalla-obtenerActividades"
);

//inicio
inicializar();

function inicializar() {
  subscripcionAEventos();
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
  //Agregar Registro
  document
    .querySelector("#btnMenuAgregarRegistro")
    .addEventListener("click", mostrarAgregarRegistro);
  //Obtener Actividades
  document
    .querySelector("#btnMenuObtenerActividades")
    .addEventListener("click", ObtenerActividades);
  //Cerrar Sesion
  document
    .querySelector("#btnMenuCerrarSesion")
    .addEventListener("click", cerrarSesion);
}

//menu
function actualizarMenu() {
  document.querySelector("#btnMenuAgregarRegistro").style.display = "none";
  document.querySelector("#btnMenuObtenerActividades").style.display = "none";
  document.querySelector("#btnMenuCerrarSesion").style.display = "none";
  document.querySelector("#btnMenuLogin").style.display = "none";
  document.querySelector("#btnMenuRegistro").style.display = "none";

  if (usuarioLogueado) {
    document.querySelector("#btnMenuCerrarSesion").style.display = "block";
    document.querySelector("#btnMenuAgregarRegistro").style.display = "block";
    document.querySelector("#btnMenuObtenerActividades").style.display =
      "block";
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

function mostrarRegistros() {
  ocultarPantallas();
  OBTENER_REGISTROS.style.display = "block";
}

function mostrarActividades() {
  ocultarPantallas();
  OBTENER_ACTIVIDADES.style.display = "block";
}

function ocultarPantallas() {
  HOME.style.display = "none";
  LOGIN.style.display = "none";
  REGISTRO.style.display = "none";
  // AGREGAR_REGISTRO.style.display = "none";
  // OBTENER_REGISTROS.style.display = "none";
  OBTENER_ACTIVIDADES.style.display = "none";
}

//Logout------------------
function cerrarSesion() {
  usuarioLogueado = null;
  localStorage.clear();
  NAV.setRoot("page-login");
  NAV.popToRoot();
}

//navegación

function verificarInicio() {
  if (usuarioLogueado) {
    NAV.setRoot("page-obtenerActividades");
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
    //case "/registro-actividad":
    //mostrarRegistroActividad();
    //break;
  }
}

// Registro------------------
function Registro2() {
  let usuarioIngresado = document.querySelector("#txtRegistroUsuario").value;
  let passwordIngresado = document.querySelector("#txtRegistroPassword").value;
  let paisIngresado = document.querySelector("#txtRegistroPais").value;

  document.querySelector("#pRegistroMensajes").innerHTML = "";

  if (usuarioIngresado && passwordIngresado && paisIngresado) {
    const url = apiBaseURL + "/usuarios";
    const bodyDeLaSolicitud = {
      usuario: usuarioIngresado,
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
          return respuestaDeLaAPI.json(); // .Json es una promesa que devuelve el
          // bodyDeLaRespuesta con el then.
        } else {
          document.querySelector("#pRegistroMensajes").innerHTML =
            "Ha ocurrido un error, por favor intente nuevamente.";
        }
      })
      .then((bodyDeLaRespuesta) => {
        // Se recibe el body de la respuesta de la API.
        if (bodyDeLaRespuesta.data?.token) {
          document.querySelector("#txtRegistroUsuario").value = "";
          document.querySelector("#txtRegistroPassword").value = "";
          document.querySelector("#txtRegistroPais").value = "";
          document.querySelector("#pRegistroMensajes").innerHTML =
            "Se ha registrado exitosamente :)";
          usuarioLogueado = Usuario.parse(bodyDeLaRespuesta.data);
          //guardo el token en localstorage para el auto-login
          localStorage.setItem(
            "UsuarioLogueadoObligatorio",
            JSON.stringify(usuarioLogueado)
          );
          NAV.setRoot("page-obtenerActividades"); // Cambio el stack y redirijo a Login
          NAV.popToRoot();
        } else if (bodyDeLaRespuesta.error) {
          document.querySelector("#pRegistroMensajes").innerHTML =
            bodyDeLaRespuesta.error;
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
function Registro() {
  let usuarioIngresado = document.querySelector("#txtRegistroUsuario").value;
  let passwordIngresado = document.querySelector("#txtRegistroPassword").value;
  let paisIngresado = document.querySelector("#txtRegistroPais").value;

  document.querySelector("#pRegistroMensajes").innerHTML = "";

  if (usuarioIngresado && passwordIngresado && paisIngresado) {
    const url = apiBaseURL + "/usuarios.php";
    const bodyDeLaSolicitud = {
      usuario: usuarioIngresado,
      password: passwordIngresado,
      idPais: paisIngresado,
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
        if (bodyDeLaRespuesta.apiKey) {
          document.querySelector("#txtRegistroUsuario").value = "";
          document.querySelector("#txtRegistroPassword").value = "";
          document.querySelector("#txtRegistroPais").value = "";
          document.querySelector("#pRegistroMensajes").innerHTML =
            "Se ha registrado exitosamente :)";

          const usuarioLogueado = Usuario.parse({
            usuario: usuarioIngresado,
            password: passwordIngresado,
            idPais: paisIngresado,
            token: bodyDeLaRespuesta.apikey,
          });
          localStorage.setItem(
            "UsuarioLogueadoObligatorio",
            JSON.stringify(usuarioLogueado)
          );
          NAV.setRoot("page-obtenerActividades");
          NAV.popToRoot();
        } else if (bodyDeLaRespuesta.error) {
          document.querySelector("#pRegistroMensajes").innerHTML =
            bodyDeLaRespuesta.error;
        }
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
  let emailIngresado = document.querySelector("#txtLoginUsuario").value;
  let passwordIngresado = document.querySelector("#txtLoginPassword").value;

  document.querySelector("#pLoginMensajes").innerHTML = "";

  if (emailIngresado && passwordIngresado) {
    const url = apiBaseURL + "/login.php";
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
          document.querySelector("#txtLoginUsuario").value = "";
          document.querySelector("#txtLoginPassword").value = "";
          // guardo el token
          usuarioLogueado = Usuario.parse(bodyDeLaRespuesta.data);
          localStorage.setItem(
            "UsuarioLogueadoObligatorio",
            JSON.stringify(usuarioLogueado)
          );
          NAV.setRoot("page-obtenerActividades"); // Cambio el stack y redirijo a Registro de Actividades
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
function actualizarUsuarioLogueadoDesdeLocalStorage() {
  let usuarioRecuperadoDeLocalstorage = localStorage.getItem(
    "UsuarioLogueadoObligatorio"
  );
  if (usuarioRecuperadoDeLocalstorage) {
    usuarioLogueado = JSON.parse(usuarioRecuperadoDeLocalstorage);
  }
}
// Registros------------------
function AgregarRegistro() {}

// Actividades------------------
function ObtenerActividades() {
  const url = apiBaseURL + "/actividades";
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-auth": usuarioLogueado.token,
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
      if (bodyDeLaRespuesta?.error) {
        mostrarToast("ERROR", "Error", bodyDeLaRespuesta.error);
      } else if (bodyDeLaRespuesta?.data?.length > 0) {
        bodyDeLaRespuesta.data.forEach((a) => {
          actividades.push(Actividad.parse(a));
        });
        listadoactividades += "<br>";
      } else {
        mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
      }
    })
    .catch((error) => console.log(error));
}

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
