
/*
 * GET castle page.
 */

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
     res.render('castle', {
         'name': "John",
         'castleName': "Castle 1"
     });
};

exports.join = function(req, res){
    res.render('joinCastle');
};

exports.build = function(req, res){
    res.render('buildCastle');
};
