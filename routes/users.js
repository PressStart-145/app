
/*
 * GET log in page. Add user.
 */

var data = require("../data/users.json");

exports.add = function(req, res){
    var newUser = {
        "name": req.body.fullname,
        "username": req.body.username,
        "password": req.body.password,
        "email": req.body.email,
        "imageURL": req.body.image
    };
    data.users.push(newUser);
    //console.log(data);
    res.render('login');
};

exports.login = function(req, res){
    req.app.locals.currentUsername = 'user'; //TODO get actual username
    res.render('login');
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
