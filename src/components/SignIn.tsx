import { Link, useNavigate } from "react-router";
import { useEffect, useRef, useState, useContext } from "react";
import {validator} from "./Auth.tsx";
import env from "react-dotenv";
import {CompDataContext} from "../App.tsx";


const SignIn = () => {
    const navigate = useNavigate();
    const globalData = useContext(CompDataContext);
    const SubmitButton = useRef(null);  // create ref for button
    const usernameBox = useRef(null);
    const passwordBox = useRef(null);
    const formBox = useRef(null);
    const [csrf, SetCSRF] = useState(null);
    

    const submitForm = async ()=>{
        // validate
        const isUserValid = validator(usernameBox.current.value);
        console.log(isUserValid);
        const isPasswordValid = validator(passwordBox.current.value)
        console.log(isPasswordValid);
        if(isUserValid && isPasswordValid)
        {
            const form = new FormData(formBox.current);
            const response = await fetch(env.REACT_APP_BH + "/login/", 
                {
                    method : "POST",
                    headers : {

                        "X-CSRFToken" : csrf
                    },
                    body : form
                }
            )
            const results = await response.json();
            if (response.status === 200){
                const sessionID = results['sessionID'];
                const date = new Date();
                date.setTime(date.getTime() + 2500000000); 
                const cookie = "name="+sessionID+"; expires="+date.toUTCString()+"; path=/";
                document.cookie = cookie;
                const SetUser = globalData['SetUser'];
                SetUser(results['user']);
                navigate("/");
                window.location.reload();
            }
            else{
                alert(results['err']);
            }
        }
    };

    useEffect(()=>{
        (async function(){
            const resp = await fetch(env.REACT_APP_BH+"/get-csrf");
            if(resp.status===200)
            {
                const results = await resp.json();
                SetCSRF(results["csrfToken"])
                
            }
            else{
                return "No-TOKEN"
            }
        })();
    }, [SetCSRF])

    return (
        <>

            <div className="col-lg-12 container" >
                <form style={{ zIndex: "4" }} ref={formBox}>

                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input ref={usernameBox} type="text" className="form-control" id="username" name="username" required placeholder="Enter your username" />
                    </div>
                    <div className="form-group" style={{ opacity: "2" }}>
                        <label htmlFor="password">Password:</label>
                        <input ref={passwordBox} type="password" className="form-control" id="password" name="password1" required placeholder="Enter secure Password" />
                    </div>
                    <br />
                    <p className="btn btn-primary" onClick={submitForm} ref={SubmitButton}>Submit</p>
                    <br />
                    <span>
                        Don't have an account?
                        <i><Link to="/auth/sign-up"> Register</Link> with us.</i>
                    </span>
                </form>
            </div>
        </>
    )
}

export default SignIn