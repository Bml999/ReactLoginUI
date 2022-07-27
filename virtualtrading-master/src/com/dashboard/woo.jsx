import React,{useState, useEffect} from "react";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import "./../../App.css";
const api = new WooCommerceRestApi({
  url: "https://reefelt.com",
  consumerKey: "ck_72058a3c4367f99246892e9b6b7472442c19b748",
  consumerSecret: "cs_a05b874dc86bc337afa57a8d836bbccaef88d971",
  version: "wc/v3"
});

const WooProductsList = () =>{
    const [products, setProducts] = useState([]);
    useEffect(()=>{
        api.get("products", {
            per_page: 100, // 20 products per page
            status: "publish",
            orderby: "title"
          })
            .then((response) => {
              // Successful request
              console.log("Response Data:", response.data);
              setProducts(response.data);
            })
            .catch((error) => {
              // Invalid request, for 4xx and 5xx statuses
              //console.log("Response Status:", error.response.status);
            })
    },[])
    return(
        <div className="container-fluid" style={{backgroundColor:"#fff"}}>
            <table className="table products">
                <thead>
                    <tr>
                        <th>SN</th>
                        <th>Product title</th>
                        <th>Images</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((item, index)=>
                        <tr>
                            <td>{index+1}</td>
                            <td style={{maxWidth:"30%"}}><h4>{item.name}</h4><br/>
                            {item?.attributes.map((variation, i)=>{
                                if(variation?.name==="Color"){
                                    return "COLORS: "+ variation?.options.join(", ");
                                }
                            })}
                            </td>
                            <td>{item?.images.map((image, i)=>
                                <img src={image.src} width="250" style={{marginRight: "10px"}}/>
                            )}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
export default WooProductsList;