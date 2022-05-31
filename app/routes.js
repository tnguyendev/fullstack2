module.exports = function(app, passport, db) {

    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('lines').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            lines: result
          })
        })
    });

    app.get('/updateForm', isLoggedIn, function(req, res) {
      db.collection('messages').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('update.ejs', {
          user : req.user,
          messages: result
        })
      })
  });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/postLine', (req, res) => {
      db.collection('lines').save({
        name: req.body.name, 
        line: req.body.line
      }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    app.post('/update', (req, res) => {
      db.collection('users').findOneAndUpdate({
        _id: ObjectId(req.user._id)
      },{
        $set: {
          local:{
            email: req.body.email,
            password: req.user.local.password,
          }
        }
      },{
        upsert: false
      },(error, result)=>{
        if(error) return console.log(error)
        console.log("save to database")
        res.redirect('/profile')
      })
    })

    app.delete('/profile', (req, res) => {
      db.collection('lines').deleteMany({},(err, result) => {
        if (err) return res.send(500, err)
        res.send('deleted')
      })
    })
    
    app.delete('/profile', (req, res) => {
      db.collection('lines').deleteMany({
        name: req.user.local.name
      },(err, result) => {
        if (err) return res.send(500, err)
        res.send('deleted')
      })
    })

        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', 
            failureRedirect : '/login', 
            failureFlash : true 
        }));

        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', 
            failureRedirect : '/signup', 
            failureFlash : true 
        }));

    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
