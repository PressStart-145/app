exports.view = function(req, res) {
    res.render('team', {
        'castleName': "Castle 1",
        'rankings': [
          {
            'image' : 'PersonalAccount-01-01.png',
            'name' : 'Irene'
          } ,
          {
            'image' : 'PersonalAccount-01-01.png',
            'name' : 'Irene'
          } ,
          {
            'image' : 'PersonalAccount-01-01.png',
            'name' : 'Pierre'
          } ,
          {
            'image' : 'PersonalAccount-01-01.png',
            'name' : 'John Snow'
          }
        ],
        'achievements' : [
          {
            'image' : 'TeamInfo-01-01.png',
            'name' : 'Killed a boss!'
          } ,
          {
            'image' : 'TeamInfo-01-01.png',
            'name' : 'Protected 10 towns!'
          } ,
          {
            'image' : 'TeamInfo-01-01.png',
            'name' : 'No damage in a week!'
          } ,
          {
            'image' : 'TeamInfo-01-01.png',
            'name' : '7 quests completed'
          }
        ]
    });
};
