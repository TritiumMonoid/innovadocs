import axios from "axios";
import { prop, merge } from "ramda";
import { peek, peekException } from "../utils";
import { autentificador } from "./config";

class Sesion {

    static remover() {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
    }

    static asignar(json) {
        localStorage.setItem("token", json.token);
        localStorage.setItem("id", json.id);
    }

    static obtener() {
        return new Promise((aceptar, rechazar) => {
            const token = localStorage.getItem("token"),
                  id = localStorage.getItem("id");
            if (token == null || id == null) {
                Sesion.remover();
                rechazar();
            } else {
                aceptar({token: token, id: id});
            }
        });
    }

    static iniciar(id, clave) {
        return axios.post(autentificador + "/token", {id: id, clave: clave})
            .then(prop("data"))
            .then(merge({id: id}))
            .then(peek(Sesion.asignar))
            .catch(peekException(Sesion.remover));
    }

    static verificar() {
        return Sesion.obtener()
            .then(json => axios.get(autentificador + "/token/" + json.token)
                  .then(prop("data"))
                  .then(merge(json)))
            .then(peek(Sesion.asignar))
            .catch(peekException(Sesion.remover));
    }

    static terminar(id, clave) {
        Sesion.remover();
        return Promise.resolve();
    }

}

Sesion.Activa = "Activa";
Sesion.Inactiva = "Inactiva";
Sesion.Carga = "Carga";

export default Sesion;
