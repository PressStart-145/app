exports.view = function(req, res) {
    var nameToShow = req.params.userName;
    res.render('castles', {
        'name': nameToShow
     });
};
