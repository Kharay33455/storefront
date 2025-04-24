import { Link, useNavigate } from "react-router";
import env from "react-dotenv";
import {useRef, useContext} from "react";
import {CompDataContext} from "../App.tsx";

const GetOtp = () => {
    (async function () {
        const email = document.getElementById("exampleInputEmail1").value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("invalid email format.");
            return;
        }

        try {
            // get csrf to send post form with
            const csrfResp = await fetch(env.REACT_APP_BH + "/get-csrf");
            if (csrfResp.status === 200) {
                const cResult = await csrfResp.json();
                const csrf = cResult['csrfToken'];

                const resp = await fetch(env.REACT_APP_BH + "/get-otp",
                    {
                        method: "POST",
                        headers: {
                            "X-CSRFToken": csrf,
                            "Content-Type" : "application/json"
                        },
                        body: JSON.stringify({ "email": email })
                    }
                );
                if (resp.status === 200) {
                    alert("Verification password sent");
                }

            }

        }
        catch {
            alert("Failed to send otp");
        };

    })();
}
const SignUp = () => {

    const globalData = useContext(CompDataContext);
    const navigate = useNavigate();

    const SFormBox = useRef(null);

    const SubmitForm = async (e) =>{
        e.preventDefault();
        const cResp = await fetch(env.REACT_APP_BH + '/get-csrf');
        if(cResp.status === 200)
        {
            const res = await cResp.json();
            const csrf = res['csrfToken'];
            const form = new FormData(SFormBox.current);

            const regResp = await fetch(env.REACT_APP_BH + '/register/', {
                method:"POST",
                headers : {
                    "X-CSRFToken" : csrf
                },
                body : form
            });
            const regRes = await regResp.json();

            if(regResp.status ===200)
            {
                const sessionID = regRes['token'];
                const date = new Date();
                date.setTime(date.getTime() + 2500000000); 
                const cookie = "name="+sessionID+"; expires="+date.toUTCString()+"; path=/";
                document.cookie = cookie;
                const SetUser = globalData['SetUser'];
                SetUser(regRes['user']);
                navigate("/");
                window.location.reload();
            }
            else{
                alert(regRes['err']);
            }
        }
    }
    return (
        <>

            <div className="col-lg-12 container CenterHorizontally">
                <div>
                    <div
                        className="text SignUpFormWrapper">

                        <form method="post" action="" ref={SFormBox}>
                            <div className="form-group">
                                <label for="first_name">First name:</label>
                                <input type="text" name="firstname" className="form-control" id="first_name"
                                    aria-describedby="first_name" required />
                                <small id="first_name" className="form-text text-muted">We'll never share your details with anyone
                                    else.</small>
                            </div>
                            <div className="form-group">
                                <label for="last_name">Last name:</label>
                                <input type="text" name="lastname" className="form-control" id="last_name"
                                    aria-describedby="last_name" required />
                                <small id="last_name" className="form-text text-muted">We'll never share your details with anyone
                                    else.</small>
                            </div>
                            <div className="form-group">
                                <label for="user_name">Username:</label>
                                <input type="text" name="username" className="form-control" id="user_name"
                                    aria-describedby="last_name" required />
                                <small id="last_name" className="form-text text-muted">We'll never share your details with anyone
                                    else.</small>
                            </div>
                            <div className="form-group">
                                <label for="exampleInputEmail1">Email address:</label>
                                <input type="email" name="email" className="form-control" id="exampleInputEmail1"
                                    aria-describedby="emailHelp" required />
                                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone
                                    else.</small>
                            </div>
                            <div className="form-group">
                                <label for="exampleInputPassword1">Password</label>
                                <input type="password" name="password1" className="form-control" id="exampleInputPassword1"
                                    required />
                            </div>
                            <div className="form-group">
                                <label for="exampleInputPassword2">Confirm Password</label>
                                <input type="password" name="password2" className="form-control" id="exampleInputPassword2"
                                    required />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                                <div className="form-group">
                                    <label for="exampleInputPassword2">Verification Code</label>
                                    <input type="text" name="otp" className="form-control" id="otp"
                                        required />
                                </div>

                                <div style={{ position: "absolute", bottom: "0", right: "0" }} onClick={GetOtp}>
                                    <span className="btn btn-info">
                                        Get Verification Code
                                    </span>
                                </div>
                            </div>
                            <div className="form-group form-check">
                                <input type="checkbox" className="form-check-input" id="exampleCheck1" required />
                                <label className="form-check-label" for="exampleCheck1">Agree to our terms and conditions</label>
                            </div>
                            <button type="submit" className="btn btn-primary" onClick={SubmitForm}>Submit</button>
                        </form>

                    </div>
                </div>
            </div>

            <hr />
            <div className="GrayBack">
                <i>
                    Already have an account with us?
                    <Link to="/auth">
                        Sign in instead.
                    </Link>
                </i>
            </div>
        </>
    )
}

export default SignUp