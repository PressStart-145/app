 var data = require("../data/castles.json");
 var dataUsers = require("../data/castles.json");
 var quests = data.castles[0].quests;
 var monsterHealth = data.castles[0].game["monsterHealth"];
 var castleHealth = data.castles[0].game["castleHealth"];

exports.select = function(req,res) {
    res.render('castles');
}

exports.view = function(req, res) {
    /*var nameToShow = req.params.userName;
    var castleName = req.params.castleName;
    res.render('castle', {
        'name': nameToShow,
  	     'castleName': castleName
     });*/

     console.log("Not Sending Email, Commented Out");
     /*
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
         to: 'popovingenieur@gmail.com', // list of receivers
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
     });

     */


     res.render('castle', {
         'name': "John",
         'castleName': "Castle 1",
         'monsterName': "Kraken",
         'castleHealth': data.castles[0].game["castleHealth"],
         'monsterHealth': data.castles[0].game["monsterHealth"]
     });
};

exports.join = function(req, res){
    res.render('joinCastle');
};

exports.build = function(req, res){
    res.render('buildCastle');
};
