"use strict";
const shoes_controller = require("../controllers/shoes.controller");
module.exports = (app) => {
  app.route("/book/totalpage").get(shoes_controller.getTotalPage);

  app.route("/book/allshoes").post(shoes_controller.getAllBook);

  app.route("/book/publisher").post(shoes_controller.getBookByPublisher);

  app.route("/book/category").post(shoes_controller.getBookByCategory);

  app.route("/book/author").post(shoes_controller.getBookByAuthor);

  app.route("/book/:id").get(shoes_controller.getBookByID);

  app.route("/book/related/:bookId").get(shoes_controller.getRelatedBook);
};
