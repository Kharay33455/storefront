import { useEffect, useState } from "react";
import env from "react-dotenv";
import Activity from "../auxfuncs/Activity.tsx";
import { AddCommaToNum } from '../auxfuncs/Misc.tsx';
import { Link } from "react-router";

const HistoryList = ({ param }) => {
    return (
        <div>
            {
                param.HData === null ?
                    <Activity />
                    :

                    <div className='list-group' style={{ gap: '2vh' }}>
                        {
                            param.HData['orders'].map((item, index) => (
                                <div key = {index}>

                                    <Link key={index} className="CatLink" to={"/payment/" + item['order_id']}>

                                        <div className={"list-group-item list-group-item-action list-group-item-" + (!item['hasPaid'] ? "primary" : item['successful'] === null ? "warning" : item['successful'] ? "success" : "danger")} key={index} style={{ textTransform: 'capitalize' }}>
                                            <p>
                                                Order ID : {item['order_id']}
                                            </p>
                                            <p>
                                                <strong>
                                                    Shipping Address: <br />
                                                </strong>
                                                <span>
                                                    Street : {item['ship_p1']} <br />{item['ship_p2']}<br />{item['ship_p3']}<br />{new Date(item['time']).toLocaleString()}
                                                </span>
                                            </p>

                                            <div className="SideBySide">
                                                <div>
                                                    <p>
                                                        Total
                                                    </p>
                                                </div>

                                                <div>
                                                    <p>
                                                        $&nbsp;{AddCommaToNum(item['total'])}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    <Link to={"/summary/" + item['order_id']}>
                                        <p className="btn btn-info">
                                            Order Summary
                                        </p>
                                    </Link>
                                </div>
                            ))
                        }
                    </div>
            }
        </div>
    )
}
const History = () => {
    const [HData, SetHD] = useState(null);

    useEffect(() => {
        (async function () {
            const resp = await fetch(env.REACT_APP_BH + "/history",
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Token " + document.cookie.split("=")[1]
                    }
                }
            );
            if (resp.status === 200) {
                const results = await resp.json();
                console.log(results);
                SetHD(results);
                return
            }
            else {
                alert("An unexpected error has occured.");
            }
        })();

    }, []);
    return (
        <>
            <div className='Subhead'>
                <h1 className="centerText">
                    History
                </h1>
            </div>
            <hr />
            <HistoryList param={{ 'HData': HData }} />
        </>
    )
}

export default History