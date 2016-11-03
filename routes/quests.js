var data = require("../data/castles.json");

exports.add = function(req, res){
    var newQuest = {
        "title": req.body.title,
        "description": req.body.description,
        "level": req.body.level,
        "deadline": req.body.deadline,
        "takenBy": "",
        "completed": false
    };
    data.castles[0].quests.push(newQuest);
    res.render('wizard', data.castles[0]);
};

exports.account = function(req, res) {
    res.render('account', {
        'numCompleted': 5
    });
};

exports.view = function(req, res) {
    res.render('wizard', data.castles[0]);
};
