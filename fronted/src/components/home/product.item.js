import React from "react";
import { Link } from "react-router-dom";
const ProductItem = ({ urlImg, price, name, id, book }) => (
  <div className="col-sm-4">
    <Link to={"/product/" + id}>
      <div className="product-image-wrapper">
        <div className="single-products">
          <div className="productinfo text-center">
            <img src={urlImg} alt="" />
            <h4 className="name-product">{name}</h4>
            <div className="product-content">
              <h2>Giá:</h2>
              <h2>
                {new Intl.NumberFormat("de-DE", { currency: "EUR" }).format(
                  price
                )}
                <sup>đ</sup>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </Link>
  </div>
);
export default ProductItem;
