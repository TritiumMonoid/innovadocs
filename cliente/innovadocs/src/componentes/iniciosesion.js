import React, { Component } from "react";
import {
    Dialog,
    Snackbar,
    Paper,
    TextField,
    Button
} from "@material-ui/core";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import Sesion from "./sesion.js";
import Plantilla from "./plantilla.js";

const estilo = withStyles(theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    contenedor: {
        margin: 'auto',
        marginTop: 30,
        padding: 30,
        width: 400
    },
    alineado_derecha: {
        float: 'right'
    }
}));

class InicioSesion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            clave: '',
            mostrarDialogo: false
        };
    }

    render() {
        const { classes } = this.props;
        return(
            <Plantilla>
              <Paper className={classes.contenedor}>
                <form onSubmit={e => this.iniciarSesion(e)}>
                  <h1> Inicio de sesión </h1>
                  <TextField
                    floatingLabelText="ID de usuario"
                    hintText="ID de usuario"
                    fullWidth={true}
                    value={this.state.id}
                    onChange={this.actualizarEntrada("id")}
                    autoFocus={true}
                    />
                  <TextField
                    floatingLabelText="Contraseña"
                    hintText="Contraseña"
                    type="password"
                    fullWidth={true}
                    value={this.state.clave}
                    onChange={this.actualizarEntrada("clave")}
                    />
                  <br/><br/>
                  <Link to="/registro">
                    <Button variant="flat" label="Nuevo usuario" color="primary" />
                  </Link>
                  <Button
                    variant="raised"
                    label="Siguiente"
                    type="submit"
                    color="primary"
                    className={[classes.button, classes.alineado_derecha].join(", ")}
                    />
                </form>
                <Dialog
                  actions={<Button variant="flat" label="Aceptar" onClick={this.cerrarDialogo}/>}
                  modal={false}
                  open={this.state.mostrarDialogo}
                  onRequestClose={this.cerrarDialogo}
                  >
                  "No existe un usuario con esa contraseña."
                </Dialog>
            </Paper>
            </Plantilla>
        );
    }

    cerrarDialogo = click => {
        this.setState({
            mostrarDialogo: false
        });
    };

    actualizarEntrada = llave => evento => {
        const estado = {};
        estado[llave] = evento.target.value;
        this.setState(estado);
    }

    iniciarSesion(e) {
        e.preventDefault();
        Sesion.iniciar(this.state.id, this.state.clave)
            .then(_ => {
                this.props.history.push('/');
            })
            .catch(_ => {
                this.setState({
                    mostrarDialogo: true
                });
            });
    }
}

InicioSesion.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default estilo(InicioSesion);
