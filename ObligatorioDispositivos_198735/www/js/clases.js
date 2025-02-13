class Usuario {
  usuario;
  password;
  idPais;
  token;

  static parse(data) {
    const usuario = new Usuario();
    if (data.usuario) {
      usuario.usuario = data.usuario;
    }
    if (data.password) {
      usuario.password = data.password;
    }
    if (data.idPais) {
      usuario.idPais = data.idPais;
    }
    if (data.token) {
      usuario.token = data.token;
    }
    return usuario;
  }
}

class Actividad {
  //todo

  static parse(data) {
    //todo
    const actividad = new Actividad();
    if (data._id) {
      actividad.id = data._id;
    }

    return actividad;
  }

  getURLImagen() {
    //todo
    return "https://movetrack.develotion.com/imgs/" + this.urlImagen + ".jpg";
  }
}
