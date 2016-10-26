
/*
 * GET castle page.
 */

exports.view = function(req, res) {
    /*var nameToShow = req.params.userName;
    var castleName = req.params.castleName;
    res.render('castle', {
        'name': nameToShow,
  	     'castleName': castleName
     });*/
     res.render('castle', {
         'name': "user",
         'castleName': "Castle 1"
     });
};

exports.join = function(req, res){
    res.render('join');
};

exports.build = function(req, res){
    res.render('buildCastle');
};
