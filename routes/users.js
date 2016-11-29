/*
 * GET log in page. Add user.
 */

var data = require("../data/users.json");
var models = require('../models');

var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'pressstart',
  api_key: '253161822796357',
  api_secret: '9vUKk4-tKlFrkk7rHai5tQrL27c'
});

exports.details = function(req, res) {
  res.render('accountDetails', {
    'user': req.app.locals.currentUser
  });
}

exports.update = function(req, res) {
  // if (req.body.name !== "") {
  //   req.app.locals.currentUser.name = req.body.name;
  // }
  // if (req.body.email !== "") {
  //   req.app.locals.currentUser.email = req.body.email;
  // }
  // if (req.body.password !== "") {
  //   req.app.locals.currentUser.password = req.body.password;
  // }
  //
  // req.app.locals.success = true;
  // res.redirect('account');

  updateUser(req, res, req.body, req.files);
}

exports.signup = function(req, res) {
  res.render('signup');
}

exports.add = function(req, res) {
  //   var usernameTaken = false;
  //   var invalidUsername = false;
  //   if(!(new RegExp(/^[a-zA-Z0-9_]+$/).test(req.body.username))) {
  //       invalidUsername = true;
  //   }
  //   data.users.forEach(function(userJson){
  //     if(userJson.username === req.body.username) {
  //       usernameTaken = true;
  //     }
  //   });
  //   if(usernameTaken) {
  //     var errMsg = "Username " + req.body.username + " taken";
  //     res.render('signup', {
  //       'err': true,
  //       'errMsg': errMsg
  //     });
  // } else if(invalidUsername) {
  //     var errMsg = "Username " + req.body.username + " is invalid. Only letters, numbers, and underscores allowed.";
  //     res.render('signup', {
  //       'err': true,
  //       'errMsg': errMsg
  //     });
  // } else {
  //     var newUser = {
  //         "name": req.body.fullname,
  //         "username": req.body.username,
  //         "password": req.body.password,
  //         "email": req.body.email,
  //         "imageURL": req.body.image
  //     };
  //     data.users.push(newUser);
  //     //console.log(data);
  //
  //     req.app.locals.createdUserSuccess = true;
  //     res.redirect('login');
  // }
  addUser(req, res, req.body, req.files);
};

exports.login = function(req, res) {
  var err = req.app.locals.err;
  var errMsg = req.app.locals.errMsg;
  var success = req.app.locals.success;
  var successMsg = req.app.locals.successMsg;
  req.app.locals.err = null;
  req.app.locals.errMsg = null;
  req.app.locals.success = null;
  req.app.locals.successMsg = null;

  res.render('login', {
    'err': err,
    'errMsg': errMsg,
    'success': success,
    'successMsg': successMsg
  });
};

exports.forgotPassword = function(req, res) {
  res.render('forgotPassword');
};

exports.sendPassword = function(req, res) {
  if (!req.body.username) {
    req.app.locals.err = true;
    req.app.locals.errMsg = "no username specified"
    res.redirect("/login");
  }

  models.User
    .find({
      username: req.body.username
    })
    .exec(function(err, users) {
      if (err) console.log(err);
      if (users.length == 0) {
        req.app.locals.err = true;
        req.app.locals.errMsg = "no username " + req.body.username
        res.redirect("/login");
      } else if (users.length > 1) {
        console.log(users);
        req.app.locals.err = true;
        req.app.locals.errMsg = "more than one username " + req.body.username
        res.redirect("/login");
      } else {
        sendEmail(users[0]);
      }
    });


  sendEmail = function(user) {
    var userEmail = user.email; //'popovingenieur@gmail.com';


    var regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

    if (!regex.test(user.email)) {
      req.app.locals.err = true;
      req.app.locals.errMsg = "Wrong email format " + user.email
      res.redirect("/login");
    }

    var nodemailer = require('nodemailer');

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
      service: 'gmail', // no need to set host or port etc.
      auth: {
        user: 'pressstartcogs120@gmail.com',
        pass: 'cogs120PS'
      }
    });

    // setup e-mail data with unicode symbols
    var emailTxt = "Hi " + user.name + "\n here is your password for username (" + user.username + ")/n" + user.password;
    var emailHtml = "<h1>Hi " + user.name + "</h1><p>Here is your password for username (" + user.username + ")</p><p>" + user.password + "</p>";

    var mailOptions = {
      from: '"Quest We Can" <pressstartcogs120@gmail.com>', // sender address
      to: userEmail, // list of receivers
      subject: 'Your Quest We Can password', // Subject line
      text: emailTxt, // plaintext body
      html: emailHtml // html body
    };


    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
         console.log(error);
         req.app.locals.err = true;
         req.app.locals.errMsg = "Failed to send email"
         res.redirect("/login");
      }
      console.log('Message sent: ' + info.response);
      req.app.locals.success = true;
      req.app.locals.successMsg = "Sent email to " + user.email
      res.redirect("/login");
    });
  }
};

/*
d8888b. d8888b.      d88888b db    db d8b   db  .o88b.
88  `8D 88  `8D      88'     88    88 888o  88 d8P  Y8
88   88 88oooY'      88ooo   88    88 88V8o 88 8P
88   88 88~~~b.      88~~~   88    88 88 V8o88 8b
88  .8D 88   8D      88      88b  d88 88  V888 Y8b  d8
Y8888D' Y8888P'      YP      ~Y8888P' VP   V8P  `Y88P'
*/

addUser = function(req, res, userInfo, userFiles) {
  if (!(new RegExp(/^[a-zA-Z0-9_]+$/).test(req.body.username))) {
    var errMsg = "Username " + req.body.username + " is invalid. Only letters, numbers, and underscores allowed.";
    res.render('signup', {
      'err': true,
      'errMsg': errMsg
    });
  } else {
    models.User
      .find({
          username: userInfo.username
        },
        function(err, users) {
          if (err) console.log(err);
          var errMsg = "";
          if (users.length != 0) {
            var errMsg = "Username " + userInfo.username + " taken";
            res.render('signup', {
              'err': true,
              'errMsg': errMsg
            });
          } else {
            var imgURL = userFiles.image.path;
            var newUser = {
              "name": userInfo.fullname,
              "username": userInfo.username,
              "password": userInfo.password,
              "email": userInfo.email,
              "imageURL": imgURL
            };

            if (imgURL.trim().length != 0) {
              cloudinary.uploader.upload(imgURL, function(result) {
                newUser['imageURL'] = result.url;
                var user = new models.User(newUser);
                user.save(function(err, user) {
                  if (err) console.log(err);
                  console.log("User " + user.username + " saved on DB");
                  req.app.locals.success = true;
                  req.app.locals.successMsg = "Account successfully created.";
                  res.redirect('login');
                });
              });
            } else {
              var user = new models.User(newUser);
              user.save(function(err, user) {
                if (err) console.log(err);
                console.log("User " + user.username + " saved on DB");
                req.app.locals.success = true;
                req.app.locals.successMsg = "Account successfully created.";
                res.redirect('login');
              });
            }
          }
        });
  }
}

updateUser = function(req, res, userInfo, userFiles) {
  userInfo.username = req.app.locals.currentUser.username;
  if (userInfo.name === "") {
    userInfo.name = req.app.locals.currentUser.name;
  }
  if (userInfo.email === "") {
    userInfo.email = req.app.locals.currentUser.email;
  }
  if (userInfo.password === "") {
    userInfo.password = req.app.locals.currentUser.password;
  }
  if (userFiles.imageURL === "") {
    userFiles.imageURL = req.app.locals.currentUser.imageURL;
  }

  var imgURL = userFiles.image.path;
  if (imgURL.trim().length != 0) {
    cloudinary.uploader.upload(imgURL, function(result) {
      models.User.findOneAndUpdate({
        username: userInfo.username
      }, {
        $set: {
          name: userInfo.name,
          email: userInfo.email,
          password: userInfo.password,
          imageURL: result.url
        }
      }, {
        new: true
      }, function(err, doc) {
        if (err) console.log(err);
        req.app.locals.currentUser = userInfo;
        req.app.locals.success = true;
        req.app.locals.successMsg = "Account successfully created.";
        res.redirect('account');
      });
    });
  } else {
    models.User.findOneAndUpdate({
      username: userInfo.username
    }, {
      $set: {
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password,
        imageURL: userFiles.imageURL
      }
    }, {
      new: true
    }, function(err, doc) {
      if (err) console.log(err);
      req.app.locals.currentUser = userInfo;
      req.app.locals.success = true;
      res.redirect('account');
    });
  }
}
