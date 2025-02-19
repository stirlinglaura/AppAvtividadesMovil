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
    //todo
    const actividad = new Actividad();
    if (data.id) {
      actividad.idActividad = data.id;
    }
    if (data.nombre) {
      actividad.nombre = data.nombre;
    }
    if (data.urlImagen) {
      actividad.urlImagen = data.imagen;
    } 

      return actividad;

  }
  getURLImagen() {
    return "https://movetrack.develotion.com/imgs/" + this.urlImagen + ".jpg";
  }
}
