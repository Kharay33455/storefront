import { useParams} from "react-router";
import { useState, useEffect } from "react";
import env from "react-dotenv";
import { SingleProduct } from "./Index.tsx";

const SingleCat = () => {
    const { catSlug } = useParams();
    const [catData, SetCatData] = useState(null);
    const [loading, SetLoading] = useState(true);

    useEffect(() => {
        const fetchCatData = async () => {
            const response = await fetch(env.BH + "/categories/" + catSlug);
            if (response.status === 200) {
                const results = await response.json();
                SetCatData(results);
                SetLoading(false);
                return
            }
            return;
        }
        fetchCatData();
    }, [catSlug])
    return (
        <>
            { !loading &&
            <div className="HideX">
                <div style={{backgroundImage:`url(${env.BH+catData['cat']['background']})`}} className="CatSlugWrapper CenterVertically" >
                    <h1 style={{ textTransform: "capitalize" }}>
                        {catSlug}
                    </h1>
                </div>
                <div className="BodyGridCont">
                    {catData &&
                    catData['products'].map((item, index)=>
                        <div key = {index}>
                            <SingleProduct param={{ 'item': item, 'index': index, 'render': 'CAT' }} />   
                        </div>
                    )
                    }
                </div>
            </div>
            }
        </>
    )
}

export default SingleCat