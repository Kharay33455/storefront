import {GetCSRF} from "../auxfuncs/Misc.tsx";
import env from "react-dotenv";


export const AddToCart = (itemID, SetCartCount, navigate, update) => {

    (async function () {
        const csrf = await GetCSRF();
        if (csrf) {
            const resp = await fetch(env.BH + '/add-to-cart/',
                {
                    method: 'POST',
                    headers: {
                        "Authorization": "Token " + document.cookie.split("=")[1],
                        "X-CSRFToken": csrf,
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify({'itemID' : itemID, 'update' : update})
                }
            );

            const results = await resp.json();
            if (resp.status === 200) {
                alert(results['msg'])
                SetCartCount(results['cartCount']);
            }
            else if (resp.status ===301){
                navigate(results['path']);
            }
            else{
                alert(results['err']);
            }
            return true;
        }
    })()
}
