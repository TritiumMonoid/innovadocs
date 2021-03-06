const R = require("ramda");
const { obtenerIdInsertado, obtenerFilasAfectadas } = require("../bd.js");

const paginacion = 10;
const paginar = pagina => pagina * paginacion;

const Alumno = json => ({
    "id": json["AlumnoId"],
    "nombre": json["AlumnoNombre"],
    "apellidoPaterno": json["AlumnoApellidoPaterno"],
    "apellidoMaterno": json["AlumnoApellidoMaterno"],
    "genero": json["AlumnoGeneroId"],
    "carreraId": json["AlumnoCarreraId"],
    "tecnologicoId": json["AlumnoTecnologicoId"],
});

const buscar = parametros => conexion =>
      conexion.query(
          "SELECT AlumnoId, AlumnoNombre, AlumnoApellidoPaterno, AlumnoApellidoMaterno, AlumnoGeneroId, AlumnoCarreraId, AlumnoTecnologicoId FROM Alumno WHERE AlumnoId = ?",
          [
              parametros["id"]
          ]
      )
      .then(R.compose(R.head, R.map(Alumno)));

const buscarTodos = parametros => conexion =>
      conexion.query("SELECT COUNT(*) AS 'total' FROM Alumno")
      .then(R.compose(R.prop("total"), R.head))
      .then(total =>
            conexion.query(
                "SELECT AlumnoId, AlumnoNombre, AlumnoApellidoPaterno, AlumnoApellidoMaterno, AlumnoGeneroId, AlumnoCarreraId, AlumnoTecnologicoId FROM Alumno LIMIT ?, ?",
                [
                    paginar(parametros["pagina"]),
                    paginacion
                ]
            )
            .then(R.map(Alumno))
            .then(alumnos => ({
                pagina: parametros.pagina,
                paginacion: paginacion,
                total: total,
                alumnos: alumnos
            })));

const crear = parametros => conexion =>
      conexion.query(
          "INSERT INTO Alumno(AlumnoId, AlumnoNombre, AlumnoApellidoPaterno, AlumnoApellidoMaterno, AlumnoGeneroId, AlumnoCarreraId, AlumnoTecnologicoId) VALUES(?, ?, ?, ?, ?, ?, ?)",
          [
              parametros.id,
              parametros.nombre,
              parametros.apellidoPaterno,
              parametros.apellidoMaterno,
              parametros.genero,
              parametros.carreraId,
              parametros.tecnologicoId
          ]
      )
      .then(obtenerIdInsertado);

const modificar = parametros => conexion =>
      conexion.query(
          "UPDATE Alumno SET AlumnoId = ?, AlumnoNombre = ?, AlumnoApellidoPaterno = ?, AlumnoApellidoMaterno = ?, AlumnoGeneroId = ?, AlumnoCarreraId = ?, AlumnoTecnologicoId = ? WHERE AlumnoId = ?",
          [
              parametros.nuevaId,
              parametros.nombre,
              parametros.apellidoPaterno,
              parametros.apellidoMaterno,
              parametros.genero,
              parametros.carreraId,
              parametros.tecnologicoId,
              parametros.id
          ]
      )
      .then(obtenerFilasAfectadas);

const eliminar = parametros => conexion =>
      conexion.query(
          "DELETE FROM Alumno WHERE AlumnoId = ?",
          [
              parametros.id
          ]
      )
      .then(obtenerFilasAfectadas);

module.exports = {
    "Alumno": Alumno,
    "buscar": buscar,
    "buscarTodos": buscarTodos,
    "crear": crear,
    "modificar": modificar,
    "eliminar": eliminar
}
