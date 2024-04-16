import React, {useContext} from "react";
import {Context} from "../store/appContext"

const Private = () =>{
    const {store, actions} = useContext(Context)
    return(
        <>
            {store.user && <h1>Estas logeado</h1>}
            {store.user == null && <h1>cargando...</h1>}
            {store.user == false && <h1>No tienes permitido estar aqui</h1>}
        </>
    )
}

export default Private