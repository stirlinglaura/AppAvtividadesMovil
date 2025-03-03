class Usuario {
  idUsuario;
  usuario;
  password;
  idPais;
  token;

  static parse(data) {
    const usuario = new Usuario();

    if (data.password) {
      usuario.password = data.password;
    }
    if (data.idPais) {
      usuario.idPais = data.idPais;
    }
    if (data.apiKey) {
      usuario.token = data.apiKey;
    }
    if (data.usuario) {
      usuario.usuario = data.usuario;
    }
    if (data.id) {
      usuario.idUsuario = data.id;
    }

    return usuario;
  }
}

class Actividad {
  idActividad;
  nombre;
  urlImagen;


  static parse(data) {

    const actividad = new Actividad();
    if (data.id) {
      actividad.idActividad = data.id;
    }
    if (data.nombre) {
      actividad.nombre = data.nombre;
    }
    if (data.imagen) {
      actividad.urlImagen = data.imagen;
    }

    return actividad;

  }
  getURLImagen() {
    return "https://movetrack.develotion.com/imgs/" + this.urlImagen + ".jpg";
  }
}

class ActividadUsuario {
  id;
  idActividad;
  actividad;
  idUsuario;
  duracion;
  fecha;




  static parse(data) {
    const actividadUsuario = new ActividadUsuario();

    if (data.id) {
      actividadUsuario.id = data.id;
    }
    if (data.idActividad) {
      actividadUsuario.idActividad = data.idActividad;
    }
    if (data.idUsuario) {
      actividadUsuario.idUsuario = data.idUsuario;
    }
    if (data.tiempo) {
      actividadUsuario.duracion = data.tiempo;
    }
    if (data.fecha) {
      actividadUsuario.fecha = data.fecha;
    }
    if (data.actividad) {
      actividadUsuario.actividad = Actividad.parse(data.actividad);
    }

    return actividadUsuario;
  }
}

class Pais {
  idPais;
  nombre;
  moneda;
  latitud;
  longitud;
  cantidadDeUsuarios = 0;


  static parse(data) {
    const pais = new Pais();
    if (data.id) {
      pais.idPais = data.id;
    }
    if (data.name) {
      pais.nombre = data.name;
    }
    if (data.currency) {
      pais.moneda = data.currency;
    }
    if (data.latitude) {
      pais.latitud = data.latitude;
    }
    if (data.longitude) {
      pais.longitud = data.longitude;
    }
    if (data.name) {
      pais.nombre = data.name ? data.name : "";
    }
    if (data.cantidadDeUsuarios) {
      pais.cantidadDeUsuarios = data.cantidadDeUsuarios;;
    }
    return pais;
  }
}