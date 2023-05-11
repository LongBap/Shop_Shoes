import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

class Shoes1 extends Component {
  constructor() {
    super();
    this.state = {
      pagination: [],
      book: null,
      file: null,
      imagePreviewUrl: null,
      curr: "add",
      category: "Loại giày",
      category2: [],
      publisher: "Nhà Sản Xuất",
      name: "",
      release_date: null,
      price: "",
      img: "",
      describe: "",
      id_nsx: "",
      id_category: "",
      noti: "",
      id: null,
    };
  }
  componentWillMount() {
    let tmp = [];
    for (let i = 1; i <= this.props.totalpage; i++) {
      tmp.push(i);
    }
    this.setState({ pagination: tmp });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.totalpage !== this.props.totalpage) {
      let tmp = [];
      for (let i = 1; i <= nextProps.totalpage; i++) {
        tmp.push(i);
      }
      this.setState({ pagination: tmp });
    }
    if (nextProps.book !== null) {
      this.setState({
        imagePreviewUrl: nextProps.book.img,
      });
    }
    if (nextProps.isadd === true) {
      this.reset();
    }
    if (nextProps.isupdate === true) {
      this.reset();
    }
  }
  handleEdit(record) {
    console.log(this.props.category.length);
    this.setState({
      curr: "update",
      name: record.name,
      release_date: record.release_date.slice(0, 10),
      price: record.price,
      describe: record.describe,
      category: this.getNameCategoryByID(record.id_category),
      id_category: record.id_category,
      id_nsx: record.id_nsx,
      publisher: this.getNamePublisherByID(record.id_nsx),
      img: record.img,
      id: record._id,
    });
  }
  columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Mô Tả",
      dataIndex: "describe",
      key: "describe",
    },
    {
      title: "Hàng Động",
      key: "action",
      render: (data) => {
        return (
          <div>
            <Button
              icon={
                <EditOutlined
                  className="action-icon-positive"
                  style={{ color: "#3498db" }}
                />
              }
              type="text"
              onClick={() => this.handleEdit(data)}
            />
            <Button
              icon={<DeleteOutlined className="action-icon-negative" />}
              type="text"
              onClick={() => this.props.deleteBook(data._id)}
            />
          </div>
        );
      },
    },
  ];
  handleChangeTable(a) {
    console.log(a);
  }
  renderPagination() {
    if (this.state.pagination.length === 0) {
      return null;
    } else {
      return (
        <ul className="pagination pagination-custom col-md-6 offset-md-3">
          <li onClick={() => this.props.backPage()}>
            <a>&laquo;</a>
          </li>
          {this.state.pagination.map((element, index) => {
            if (this.props.page === element) {
              return (
                <li
                  className="active"
                  onClick={() => this.props.setPage(element)}
                >
                  <a>{element}</a>
                </li>
              );
            } else {
              return (
                <li onClick={() => this.props.setPage(element)}>
                  <a>{element}</a>
                </li>
              );
            }
          })}
          <li onClick={() => this.props.nextPage()}>
            <a>&raquo;</a>
          </li>
        </ul>
      );
    }
  }
  handleChangeImg = (img) => {
    if (img === undefined) return;
    let reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        file: img,
        img: reader.result,
      });
    };
    reader.readAsDataURL(img);
  };
  invalidPrice = (t) => {
    var str = t.toString();
    let count = 0;
    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) == "+" || str.charAt(i) == "-") count++;
      else break;
    }
    str = str.substring(count, str.length);
    count = 0;
    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) == ".") {
        count++;
      }
      if (str.charAt(i) < "0" || str.charAt(i) > "9") return false;
    }
    if (count > 1) return false;
    return !isNaN(Number.parseFloat(str));
  };
  submitAddBook = () => {
    const { id_category, name, price, release_date, describe, id_nsx, file } =
      this.state;
    console.log(file);
    if (name.length <= 0) {
      this.setState({
        noti: "Name invalid",
      });
      return;
    } else {
      this.setState({
        noti: "",
      });
    }
    if (release_date === null) {
      this.setState({
        noti: "Day invalid",
      });
      return;
    } else {
      this.setState({
        noti: "",
      });
    }
    if (!this.invalidPrice(price)) {
      this.setState({
        noti: "Price invalid",
      });
      return;
    } else {
      this.setState({
        noti: "",
      });
    }
    if (id_category === "") {
      this.setState({
        noti: "Category invalid",
      });
      return;
    } else {
      this.setState({
        noti: "",
      });
    }

    if (id_nsx === "") {
      this.setState({
        noti: "Publisher invalid",
      });
      return;
    } else {
      this.setState({
        noti: "",
      });
    }
    if (file === null) {
      this.setState({
        noti: "File invalid",
      });
      return;
    } else {
      this.setState({
        noti: "",
      });
    }
    this.props.addBook(
      id_category,
      name,
      price,
      release_date,
      describe,
      id_nsx,
      file
    );
  };
  submitUpdateBook = () => {
    const {
      id_category,
      name,
      price,
      release_date,
      describe,
      id_nsx,
      file,
      id,
      img,
    } = this.state;
    if (name.length <= 0) {
      this.setState({
        noti: "Name invalid",
      });
      return;
    } else {
      this.setState({
        noti: "",
      });
    }
    if (release_date === null) {
      this.setState({
        noti: "Day invalid",
      });
      return;
    } else {
      this.setState({
        noti: "",
      });
    }
    if (!this.invalidPrice(price)) {
      this.setState({
        noti: "Price invalid",
      });
      return;
    } else {
      this.setState({
        noti: "",
      });
    }
    if (id_category === "") {
      this.setState({
        noti: "Category invalid",
      });
      return;
    } else {
      this.setState({
        noti: "",
      });
    }
    if (id_nsx === "") {
      this.setState({
        noti: "Publisher invalid",
      });
      return;
    } else {
      this.setState({
        noti: "",
      });
    }
    if (file === null && img === "") {
      this.setState({
        noti: "File invalid",
      });
      return;
    } else {
      this.setState({
        noti: "",
      });
    }
    this.props.updateBook(
      id,
      name,
      id_category,
      price,
      release_date,
      describe,
      id_nsx,
      file
    );
  };
  renderBtnSubmit = () => {
    if (this.state.curr === "add") {
      return (
        <div className="form-group">
          <div className="col-lg-offset-2 col-lg-10">
            <button
              onClick={() => this.submitAddBook()}
              className="btn-custom"
              type="submit"
            >
              Thêm
            </button>
            <button className="btn-custom" disabled type="button">
              Cập Nhật
            </button>
            <button className="btn-custom" onClick={() => this.reset()}>
              Reset
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="form-group">
          <div className="col-lg-offset-2 col-lg-10">
            <button className="btn-custom" disabled type="submit">
              Thêm
            </button>
            <button
              className="btn-custom"
              onClick={() => this.submitUpdateBook()}
              type="button"
            >
              Cập Nhật
            </button>
            <button className="btn-custom" onClick={() => this.reset()}>
              Reset
            </button>
          </div>
        </div>
      );
    }
  };
  reset = () => {
    this.setState({
      noti: "",
      name: "",
      file: null,
      imagePreviewUrl: null,
      curr: "add",
      category: "category",
      publisher: "publisher",
      name: "",
      release_date: null,
      price: "",
      img: "",
      describe: "",
      id_nsx: "",
      id_category: "",
      noti: "",
      id: null,
    });
  };

  renderMenuCategory = () => {
    if (this.props.category) {
      return this.props.category.map((element, index) => {
        return (
          <li
            onClick={() =>
              this.setState({
                category: element.name,
                id_category: element._id,
              })
            }
          >
            <a>{element.name}</a>
          </li>
        );
      });
    } else {
      return null;
    }
  };
  renderMenuAuthor = () => {
    if (this.props.author) {
      return this.props.author.map((element, index) => {
        return (
          <li
            onClick={() =>
              this.setState({ author: element.name, id_author: element._id })
            }
          >
            <a>{element.name}</a>
          </li>
        );
      });
    } else {
      return null;
    }
  };
  renderMenuPublisher = () => {
    if (this.props.publisher) {
      return this.props.publisher.map((element, index) => {
        return (
          <li
            onClick={() =>
              this.setState({ publisher: element.name, id_nsx: element._id })
            }
          >
            <a>{element.name}</a>
          </li>
        );
      });
    } else {
      return null;
    }
  };
  getNameCategoryByID = (id) => {
    for (let i = 0; i < this.props.category.length; i++) {
      if (id === this.props.category[i]._id) return this.props.category[i].name;
    }
  };
  getNameAuthorByID = (id) => {
    for (let i = 0; i < this.props.author.length; i++) {
      if (id === this.props.author[i]._id) return this.props.author[i].name;
    }
  };
  getNamePublisherByID = (id) => {
    for (let i = 0; i < this.props.publisher.length; i++) {
      console.log(id + " === " + this.props.publisher[i]._id);
      if (id === this.props.publisher[i]._id)
        return this.props.publisher[i].name;
    }
  };
  render() {
    return (
      <section id="main-content">
        <div className="row">
          <div className="col-lg-12">
            <h3 className="page-header">
              <i className="fa fa-table" /> Table
            </h3>
            <ol className="breadcrumb">
              <li>
                <i className="fa fa-home" />
                <Link to="/">Home</Link>
              </li>
              <li>
                <i className="fa fa-table" />
                Table
              </li>
              <li>
                <i className="fa fa-th-list" />
                Shoes Manager
              </li>
            </ol>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Table
              dataSource={this.props.book}
              columns={this.columns}
              onChange={this.handleChangeTable}
              pagination={false}
            />
            {this.renderPagination()}
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <section className="panel">
              <header className="panel-heading">Form validations</header>
              <div className="panel-body">
                <div className="form" id="from-book">
                  <div
                    className="form-validate form-horizontal"
                    id="feedback_form"
                    method="get"
                    action=""
                  >
                    <div className="form-group ">
                      <label for="cname" className="control-label col-lg-2">
                        Tên Sản Phẩm <span className="required">*</span>
                      </label>
                      <div className="col-lg-10">
                        <input
                          onChange={(e) => {
                            this.setState({
                              name: e.target.value,
                            });
                          }}
                          value={this.state.name}
                          className="form-control"
                          id="cname"
                          name="fullname"
                          minlength="5"
                          type="text"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group ">
                      <label for="cemail" className="control-label col-lg-2">
                        Ngày nhập<span className="required">*</span>
                      </label>
                      <div className="col-lg-10">
                        <input
                          value={this.state.release_date}
                          onChange={(e) =>
                            this.setState({
                              release_date: e.target.value,
                            })
                          }
                          className="form-control "
                          id="cemail"
                          type="date"
                          name="email"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group ">
                      <label for="curl" className="control-label col-lg-2">
                        Giá
                      </label>
                      <div className="col-lg-10">
                        <input
                          value={this.state.price}
                          onChange={(e) =>
                            this.setState({
                              price: e.target.value,
                            })
                          }
                          className="form-control "
                          id="curl"
                          type="text"
                          name="url"
                        />
                      </div>
                    </div>
                    <div className="form-group ">
                      <label for="cname" className="control-label col-lg-2">
                        Miêu Tả <span className="required">*</span>
                      </label>
                      <div className="col-lg-10">
                        <input
                          value={this.state.describe}
                          onChange={(e) =>
                            this.setState({
                              describe: e.target.value,
                            })
                          }
                          className="form-control"
                          id="subject"
                          name="subject"
                          minlength="5"
                          type="text"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group ">
                      <label for="comment " className="control-label col-lg-2">
                        Loại giày
                      </label>
                      <div className="btn-group col-lg-10">
                        <button
                          style={{ width: "200px" }}
                          type="button"
                          className="btn btn-default dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {this.state.category} <span className="caret" />
                        </button>
                        <ul className="dropdown-menu" role="menu">
                          {this.renderMenuCategory()}
                        </ul>
                      </div>
                    </div>
                    <div className="form-group ">
                      <label for="comment" className="control-label col-lg-2">
                        Xuất xứ
                      </label>
                      <div className="btn-group col-lg-10">
                        <button
                          type="button"
                          className="btn btn-default dropdown-toggle"
                          data-toggle="dropdown"
                          style={{ width: "200px" }}
                        >
                          {this.state.publisher} <span className="caret" />
                        </button>
                        <ul className="dropdown-menu" role="menu">
                          {this.renderMenuPublisher()}
                        </ul>
                      </div>
                    </div>
                    <div className="form-group ">
                      <label for="comment" className="control-label col-lg-2">
                        Image upload{" "}
                      </label>
                      <div className="col-lg-10">
                        <input
                          className="form-control "
                          type="file"
                          id="ccomment"
                          name="comment"
                          required
                          onChange={(e) =>
                            this.handleChangeImg(e.target.files[0])
                          }
                        />
                      </div>
                    </div>
                    <div className="form-group ">
                      <label for="comment" className="control-label col-lg-2">
                        Ảnh Sản Phẩm
                      </label>
                      <div className="col-lg-10">
                        <img
                          src={this.state.img}
                          style={{ maxWidth: "300px" }}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-lg-offset-2 col-lg-10">
                        <p>{this.state.noti}</p>
                      </div>
                    </div>
                    <div className="col-lg-offset-2 col-lg-12">
                      {this.renderBtnSubmit()}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    );
  }
}
export default Shoes1;
