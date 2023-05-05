import React, { Component } from "react";

const FooterTop = () => (
  <div className="footer-top">
    <div className="container">
      <div className="row">
        <div className="col-sm-6">
          <div className="single-widget">
            <h2>Thông Tin Về Chúng Tôi</h2>
            <ul className="nav nav-pills nav-stacked ">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <a href="#">Hà Nội City</a>
              </li>
              <li>
                <i className="far fa-envelope"></i>
                <a href="#">shopshoes@gmail.com</a>
              </li>
              <li>
                <i className="fas fa-phone-volume"></i>
                <a href="#">+84 234 567 89</a>
              </li>
              <li>
                <i class="fab fa-facebook-f"></i>
                <a href="#">ShopShoes</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-sm-6">
          <div className="companyinfo">
            <h2>
              <span>ShoesShop</span>
            </h2>
            <p>
              ShoesShop là một website chuyên bán giày, bao gồm nhiều thể loại
              đa dạng và phong phú , chúng tôi muốn cung cấp các trải nhiệm
              tuyệt vời nhất đên khách hàng
            </p>
          </div>
        </div>

        {/* <div className="col-sm-3"></div> */}
        <div className="col-sm-12">
          <div className="single-widget">
            <h2>About Shopper</h2>
            <form action="#" className="form-footer container">
              <div className="row">
                <input
                  type="text"
                  placeholder="Your email address"
                  className="col-sm-4"
                />
                <button type="submit" className="">
                  <i className="fa fa-arrow-circle-o-right col-sm-2"></i>Submit
                </button>
              </div>
            </form>
            <p>
              Đăng Ký Gmail để nhận
              <br />
              những thống báo mới nhất về chúng tôi...
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default FooterTop;
