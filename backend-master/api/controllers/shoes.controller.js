"use strict";
const shoes = require("../models/shoes.model");
const publisherController = require("./publisher.controller");
const authorController = require("./author.controller");
const categoryController = require("./category.controller");

exports.getTotalPage = (req, res) => {
  shoes.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: err });
      return;
    }
    res.status(200).json({ data: parseInt((docs.length - 1) / 9) + 1 });
  });
};

exports.getAllBook = async (req, res) => {
  if (typeof req.body.page === "undefined") {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  //Khoang gia
  let range = null;
  let objRange = null;
  if (typeof req.body.range !== "undefined") {
    range = req.body.range;
    //objRange = JSON.parse(range);
    objRange = range;
  }
  //Search Text
  let searchText = "";
  if (typeof req.body.searchtext !== "undefined") {
    searchText = req.body.searchtext;
  }
  let searchPublisher = null;
  searchPublisher = await publisherController.getIDBySearchText(searchText);
  let searchAuthor = null;
  searchAuthor = await authorController.getIDBySearchText(searchText);
  let searchCategory = null;
  searchCategory = await categoryController.getIDBySearchText(searchText);
  //Sap xep
  let sortType = "release_date";
  let sortOrder = "-1";
  if (typeof req.body.sorttype !== "undefined") {
    sortType = req.body.sorttype;
  }
  if (typeof req.body.sortorder !== "undefined") {
    sortOrder = req.body.sortorder;
  }
  if (
    sortType !== "price" &&
    sortType !== "release_date" &&
    sortType !== "view_counts" &&
    sortType !== "sales"
  ) {
    res.status(422).json({ msg: "Invalid sort type" });
    return;
  }
  if (sortOrder !== "1" && sortOrder !== "-1") {
    res.status(422).json({ msg: "Invalid sort order" });
    return;
  }
  //Trang va tong so trang
  let bookCount = null;
  try {
    if (range !== null) {
      bookCount = await shoes.count({
        $or: [
          { name: new RegExp(searchText, "i") },
          { id_nsx: { $in: searchPublisher } },
          { id_author: { $in: searchAuthor } },
          { id_category: { $in: searchCategory } },
        ],
        price: { $gte: objRange.low, $lte: objRange.high },
      });
    } else {
      bookCount = await shoes.count({
        $or: [
          { name: new RegExp(searchText, "i") },
          { id_nsx: { $in: searchPublisher } },
          { id_author: { $in: searchAuthor } },
          { id_category: { $in: searchCategory } },
        ],
      });
    }
  } catch (err) {
    res.status(500).json({ msg: err });
    return;
  }
  let totalPage = parseInt((bookCount - 1) / 9 + 1);
  let { page } = req.body;
  if (parseInt(page) < 1 || parseInt(page) > totalPage) {
    res.status(200).json({ data: [], msg: "Invalid page", totalPage });
    return;
  }
  //De sort
  let sortQuery = {};
  sortQuery[sortType] = sortOrder;
  //Lay du lieu
  if (range !== null) {
    shoes
      .find({
        $or: [
          { name: new RegExp(searchText, "i") },
          { id_nsx: { $in: searchPublisher } },
          { id_author: { $in: searchAuthor } },
          { id_category: { $in: searchCategory } },
        ],
        price: { $gte: objRange.low, $lte: objRange.high },
      })
      .skip(9 * (parseInt(page) - 1))
      .limit(9)
      .sort(sortQuery)
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: err });
          return;
        }
        res.status(200).json({ data: docs, totalPage });
      });
  } else {
    shoes
      .find({
        $or: [
          { name: new RegExp(searchText, "i") },
          { id_nsx: { $in: searchPublisher } },
          { id_author: { $in: searchAuthor } },
          { id_category: { $in: searchCategory } },
        ],
      })
      .skip(9 * (parseInt(page) - 1))
      .limit(9)
      .sort(sortQuery)
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: err });
          return;
        }
        res.status(200).json({ data: docs, totalPage });
      });
  }
};

exports.getBookByPublisher = async (req, res) => {
  if (
    typeof req.body.page === "undefined" ||
    typeof req.body.id === "undefined"
  ) {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  let { id, page } = req.body;
  //Khoang gia
  let range = null;
  let objRange = null;
  if (typeof req.body.range !== "undefined") {
    range = req.body.range;
    //objRange = JSON.parse(range);
    objRange = range;
  }
  //Search Text
  let searchText = "";
  if (typeof req.body.searchtext !== "undefined") {
    searchText = req.body.searchtext;
  }
  //Sap xep
  let sortType = "release_date";
  let sortOrder = "-1";
  if (typeof req.body.sorttype !== "undefined") {
    sortType = req.body.sorttype;
  }
  if (typeof req.body.sortorder !== "undefined") {
    sortOrder = req.body.sortorder;
  }
  if (
    sortType !== "price" &&
    sortType !== "release_date" &&
    sortType !== "view_counts" &&
    sortType !== "sales"
  ) {
    res.status(422).json({ msg: "Invalid sort type" });
    return;
  }
  if (sortOrder !== "1" && sortOrder !== "-1") {
    res.status(422).json({ msg: "Invalid sort order" });
    return;
  }
  //Trang va tong so trang
  let bookCount = null;
  try {
    if (range !== null) {
      bookCount = await shoes.count({
        name: new RegExp(searchText, "i"),
        id_nsx: id,
        price: { $gte: objRange.low, $lte: objRange.high },
      });
    } else {
      bookCount = await shoes.count({
        name: new RegExp(searchText, "i"),
        id_nsx: id,
      });
    }
  } catch (err) {
    res.status(500).json({ msg: err });
    return;
  }
  let totalPage = parseInt((bookCount - 1) / 9 + 1);
  if (parseInt(page) < 1 || parseInt(page) > totalPage) {
    res.status(200).json({ data: [], msg: "Invalid page", totalPage });
    return;
  }
  //De sort
  let sortQuery = {};
  sortQuery[sortType] = sortOrder;
  //Lay du lieu
  if (range !== null) {
    shoes
      .find({
        name: new RegExp(searchText, "i"),
        id_nsx: id,
        price: { $gte: objRange.low, $lte: objRange.high },
      })
      .skip(9 * (parseInt(page) - 1))
      .limit(9)
      .sort(sortQuery)
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: err });
          return;
        }
        res.status(200).json({ data: docs, totalPage });
      });
  } else {
    shoes
      .find({ name: new RegExp(searchText, "i"), id_nsx: id })
      .skip(9 * (parseInt(page) - 1))
      .limit(9)
      .sort(sortQuery)
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: err });
          return;
        }
        res.status(200).json({ data: docs, totalPage });
      });
  }
};

exports.getBookByCategory = async (req, res) => {
  if (
    typeof req.body.id === "undefined" ||
    typeof req.body.page === "undefined"
  ) {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  let { id, page } = req.body;
  //Khoang gia
  let range = null;
  let objRange = null;
  console.log(req.body.range);
  if (typeof req.body.range !== "undefined") {
    range = req.body.range;
    objRange = range;
  }
  //Kiem tra text
  let searchText = "";
  if (typeof req.body.searchtext !== "undefined") {
    searchText = req.body.searchtext;
  }
  //Sap xep
  let sortType = "release_date";
  let sortOrder = "-1";
  if (typeof req.body.sorttype !== "undefined") {
    sortType = req.body.sorttype;
  }
  if (typeof req.body.sortorder !== "undefined") {
    sortOrder = req.body.sortorder;
  }
  if (
    sortType !== "price" &&
    sortType !== "release_date" &&
    sortType !== "view_counts" &&
    sortType !== "sales"
  ) {
    res.status(422).json({ msg: "Invalid sort type" });
    return;
  }
  if (sortOrder !== "1" && sortOrder !== "-1") {
    res.status(422).json({ msg: "Invalid sort order" });
    return;
  }
  //Tinh tong so trang
  let bookCount, bookFind;
  try {
    if (range === null) {
      bookFind = await shoes.find({
        id_category: id,
        name: new RegExp(searchText, "i"),
      });
    } else {
      bookFind = await shoes.find({
        id_category: id,
        name: new RegExp(searchText, "i"),
        price: { $gte: objRange.low, $lte: objRange.high },
      });
    }
  } catch (err) {
    res.status(500).json({ msg: err });
    return;
  }
  bookCount = bookFind.length;
  let totalPage = parseInt((bookCount - 1) / 9 + 1);
  if (parseInt(page) < 1 || parseInt(page) > totalPage) {
    res
      .status(200)
      .json({ data: [], msg: "Invalid page", totalPage: totalPage });
    return;
  }
  //De sort
  let sortQuery = {};
  sortQuery[sortType] = sortOrder;
  //Lay du lieu
  if (range === null) {
    shoes
      .find({ id_category: id, name: new RegExp(searchText, "i") })
      .limit(9)
      .skip(9 * (page - 1))
      .sort(sortQuery)
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: err });
          return;
        }
        res.status(200).json({ data: docs, totalPage: totalPage });
      });
  } else {
    shoes
      .find({
        id_category: id,
        name: new RegExp(searchText, "i"),
        price: { $gte: objRange.low, $lte: objRange.high },
      })
      .limit(9)
      .skip(9 * (page - 1))
      .sort(sortQuery)
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: err });
          return;
        }
        res.status(200).json({ data: docs, totalPage: totalPage });
      });
  }
};

exports.getBookByAuthor = async (req, res) => {
  if (
    typeof req.body.id === "undefined" ||
    typeof req.body.page === "undefined"
  ) {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  let { id, page } = req.body;
  //Khoang gia
  let range = null;
  let objRange = null;
  if (typeof req.body.range !== "undefined") {
    range = req.body.range;
    objRange = range;
  }
  //Kiem tra text
  let searchText = "";
  if (typeof req.body.searchtext !== "undefined") {
    searchText = req.body.searchtext;
  }
  //Sap xep
  let sortType = "release_date";
  let sortOrder = "-1";
  if (typeof req.body.sorttype !== "undefined") {
    sortType = req.body.sorttype;
  }
  if (typeof req.body.sortorder !== "undefined") {
    sortOrder = req.body.sortorder;
  }
  if (
    sortType !== "price" &&
    sortType !== "release_date" &&
    sortType !== "view_counts" &&
    sortType !== "sales"
  ) {
    res.status(422).json({ msg: "Invalid sort type" });
    return;
  }
  if (sortOrder !== "1" && sortOrder !== "-1") {
    res.status(422).json({ msg: "Invalid sort order" });
    return;
  }
  //De sort
  let sortQuery = {};
  sortQuery[sortType] = sortOrder;
  //Tinh tong so trang
  let bookCount, bookFind;
  try {
    if (range === null) {
      bookFind = await shoes.find({
        id_author: id,
        name: new RegExp(searchText, "i"),
      });
    } else {
      bookFind = await shoes.find({
        id_author: id,
        name: new RegExp(searchText, "i"),
        price: { $gte: objRange.low, $lte: objRange.high },
      });
    }
  } catch (err) {
    res.status(500).json({ msg: err });
    return;
  }
  bookCount = bookFind.length;
  let totalPage = parseInt((bookCount - 1) / 9 + 1);
  if (parseInt(page) < 1 || parseInt(page) > totalPage) {
    res
      .status(200)
      .json({ data: [], msg: "Invalid page", totalPage: totalPage });
    return;
  }
  //Lay du lieu
  if (typeof req.body.range === "undefined") {
    shoes
      .find({ id_author: id, name: new RegExp(searchText, "i") })
      .limit(9)
      .skip(9 * (page - 1))
      .sort(sortQuery)
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: err });
          return;
        }
        res.status(200).json({ data: docs, totalPage: totalPage });
      });
  } else {
    shoes
      .find({
        id_author: id,
        name: new RegExp(searchText, "i"),
        price: { $gte: objRange.low, $lte: objRange.high },
      })
      .limit(9)
      .skip(9 * (page - 1))
      .sort(sortQuery)
      .exec((err, docs) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: err });
          return;
        }
        res.status(200).json({ data: docs, totalPage: totalPage });
      });
  }
};

exports.getBookByID = async (req, res) => {
  if (req.params.id === "undefined") {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  let result;
  try {
    result = await shoes.findById(req.params.id);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
    return;
  }
  if (result === null) {
    res.status(404).json({ msg: "not found" });
    return;
  }
  result.view_counts = result.view_counts + 1;
  result.save((err, docs) => {
    if (err) {
      console.log(err);
    }
  });
  res.status(200).json({ data: result });
};

exports.getRelatedBook = async (req, res) => {
  if (typeof req.params.bookId === "undefined") {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  let { bookId } = req.params;
  let bookObj = null;
  try {
    bookObj = await shoes.findById(bookId);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
    return;
  }
  if (bookObj === null) {
    res.status(200).json({ data: [], msg: "Invalid bookId" });
    return;
  }
  shoes
    .find({
      $or: [
        {
          $and: [
            { id_category: bookObj.id_category },
            { _id: { $nin: [bookId] } },
          ],
        },
        {
          $and: [{ id_author: bookObj.id_author }, { _id: { $nin: [bookId] } }],
        },
      ],
    })
    .limit(5)
    .sort({ release_date: -1 })
    .exec((err, docs) => {
      if (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
      }
      res.status(200).json({ data: docs });
    });
};
