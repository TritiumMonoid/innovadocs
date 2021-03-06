import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import Sesion from "./sesion";

const estilos = {
    contenedor: {
        display: 'inline-block',
        position: 'fixed',
        left: '50%',
        top: '50%'
    },
    cargador: {
        display: 'inline-block',
        position: 'relative'
    }
};

class ComprobanteSesion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sesion: Sesion.Carga,
            id: ''
        };
        Sesion.token()
            .then(json => {
                this.setState({
                    sesion: Sesion.Activa,
                    id: json.id
                });
            })
            .catch(error => {
                this.setState({
                    sesion: Sesion.Inactiva,
                    id: ''
                });
            });
    }

    render() {
        if (this.state.sesion == Sesion.Carga) {
            return (
                <div style={estilos.contenedor}>
                  <CircularProgress
                    size={300}
                    />
                </div>
            );
        } else if (this.state.sesion == Sesion.Activa) {
            return this.props.children ? this.props.children : null;
        } else if (this.state.sesion == Sesion.Inactiva) {
            return (<Redirect to="/inicio-sesion"/>);
        } else {
            return null;
        }
    }
}

export default ComprobanteSesion;
