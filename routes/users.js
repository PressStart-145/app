
/*
 * GET log in page. Add user.
 */

var data = require("../data/users.json");


exports.details = function(req, res) {
  res.render('accountDetails', {'user': req.app.locals.currentUser});
}

exports.update = function(req, res) {
  if(req.body.name !== "") {
    req.app.locals.currentUser.name = req.body.name;
  }
  if(req.body.email !== "") {
    req.app.locals.currentUser.email = req.body.email;
  }
  if(req.body.password !== "") {
    req.app.locals.currentUser.password = req.body.password;
  }

  req.app.locals.success = true;
  res.redirect('account');
}

exports.signup = function(req, res) {

  res.render('signup');
}

exports.add = function(req, res){
    var usernameTaken = false;
    data.users.forEach(function(userJson){
      if(userJson.username === req.body.username) {
        usernameTaken = true;
      }
    });
    if(usernameTaken) {
      var errMsg = "Username " + req.body.username + " taken";
      res.render('signup', {
        'err': true,
        'errMsg': errMsg
      });
    } else {
      var newUser = {
          "name": req.body.fullname,
          "username": req.body.username,
          "password": req.body.password,
          "email": req.body.email,
          "imageURL": req.body.image
      };
      data.users.push(newUser);
      //console.log(data);
      res.redirect('login');
    }
};

exports.login = function(req, res){
    var err = req.app.locals.err;
    var errMsg = req.app.locals.errMsg;
    req.app.locals.err = null;
    req.app.locals.errMsg = null;

    res.render('login', {'err': err, 'errMsg': errMsg});
};

exports.sendPassword = function(req, res) {
  console.log("Not Sending Email, Commented Out");
  /*
  var userEmail = 'popovingenieur@gmail.com'; //TODO get from json data

  console.log("In sending email function");

  var nodemailer = require('nodemailer');

  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport({
       service: 'gmail', // no need to set host or port etc.
       auth: {
          user: 'pressstartcogs120@gmail.com',
          pass: 'cogs120cse170'
      }
  });

  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: '"Press Start" <pressstartcogs120@gmail.com>', // sender address
      to: userEmail, // list of receivers
      subject: 'Your Press Start password', // Subject line
      text: 'Here s your password you moron: dickbutt', // plaintext body
      html: '<b>Here s your password you moron: dickbutt</b>' // html body
  };


  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
  });*/



  res.send('<h1>Email sent</h1>') //TODO write confirmation page
};
