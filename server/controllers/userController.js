const User = require('../models/user')
const mongoose = require('mongoose')

/**
 * GET /
 * Homepage
 */
exports.homepage = async (req, res) => {

  const messages = await req.flash('info')

  const locals = {
    title: "User Manage System",
    description:
      "User Manage System with create, read, update, delete functionality with using NodeJS, Express.JS and MongoDB.",
  };

  let perPage = 12;
  let page = req.query.page || 1;

  try {
    const user = await User.aggregate([{ $sort: { createdAt: -1 }}]).skip(perPage * page - perPage).limit(perPage).exec();
    const count = await User.countDocuments();
    res.render("index", { locals, messages, user, current: page, pages: Math.ceil(count / perPage) } );
  } catch (err) {
    console.log(err)
  }

  // try {
  //   const user = await User.find({}).limit(25);
  //   res.render("index", { locals, messages, user } );
  // } catch (err) {
  //   console.log(err)
  // }
};


/**
 * GET /
 * About
 */
exports.about = async (req, res) => {
  const locals = {
    title: "About",
    description: "NodeJs User Management System",
  };

  try {
    res.render("about", locals);
  } catch (error) {
    console.log(error);
  }
};


/**
 * GET /
 * New User Form
 */
exports.addUser = async (req, res) => {
  const locals = {
    title: "Add New User",
    description:
      "NodeJS User Management System",
  };
  
  res.render("user/add", locals);
};


  /**
 * GET /
 * Create New User
 */
exports.postUser = async (req, res) => {
  console.log(req.body);
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    tel: req.body.tel,
    email: req.body.email,
    details: req.body.details
  });
  
  try {
    await User.create(newUser);
    await req.flash('info', 'Added Successfully')
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};


/**
 * GET /
 * User Data
 */
exports.viewUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    const locals = {
      title: "View User Data",
      description: "NodeJS User Management System"
    };

    res.render("user/view", { locals, user });
  } catch (err) {
    console.log(err);
  }
}


/**
 * GET /
 * Edit User Data
 */
exports.editUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    const locals = {
      title: "Edit User Data",
      description: "Free NodeJs User Management System",
    };

    res.render("user/edit", {
      locals,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};


/**
 * GET /
 * Update User Data
 */
exports.editPost = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      tel: req.body.tel,
      email: req.body.email,
      details: req.body.details,
      updatedAt: Date.now(),
    });
    await res.redirect(`/edit/${req.params.id}`);

    console.log("redirected");
  } catch (error) {
    console.log(error);
  }
};

/**
 * Delete /
 * Delete User Data
 */
exports.deleteUser = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get /
 * Search User Data
 */
exports.searchUser = async (req, res) => {
  const locals = {
    title: "Search User Data",
    description: "Free NodeJs User Management System",
  };

  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const user = await User.find({
      $or: [
        { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", {
      user,
      locals,
    });
  } catch (error) {
    console.log(error);
  }
};