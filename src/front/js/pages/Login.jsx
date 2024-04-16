import React,{useContext,useState} from "react";
import {Context} from "../store/appContext"
import { useNavigate } from "react-router-dom";
import "../../styles/index.css";
import Swal from "sweetalert2";

const Login = () => {
    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")
    const {store, actions} = useContext(Context)
    const navigate = useNavigate()

    const handleClick = (event) =>{
        event.preventDefault()
        const login = async () =>{
            const response = await actions.login(email, password)
            console.log(response)
            if(response){
                Swal.fire({
                    icon: "success",
                    title: "Correcto!!",
                    text: "login correcto" ,
                    timer: 2000
                  });
                  navigate("/private")
            }else{
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error inesperedo",
                timer: 3000
              });
            }
        }
         login()      
    };

    return(
    <>  
    <section>
        <h1>
            Login 
        </h1>
        
        <div className="form">
            <form>
                <label htmlFor="email">Email</label>
                <input id="email" value={email} type="text" placeholder="Enter your email" onChange={(e)=> setEmail(e.target.value)}/>
                <label htmlFor="password">Password</label>
                <input id="password" value={password} type="password" onChange={(e)=> setPassword(e.target.value)}/>
            <button onClick={handleClick} type="submit">Send</button>
            </form>
        </div>
        
    </section>
    </>
    )
}

export default Login;