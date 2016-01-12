var express = require('express');
var logger = log4js.getLogger('main');
var bundles = require('../../bundle.result.json');

module.exports = function(config, passport) {
    var LocalStrategy = require('passport-local').Strategy;

    //with the setting rolling = true of express-session, the session cookie is updated in browser & in redis after this method is called
    this.isLoggedIn = function (req, res, next) {
        if (req.isAuthenticated()) {
            req.session.message = null;
            return next();
        }
        if (req.xhr) {
            res.sendStatus(401);
        } else {
            res.render('main', {
                title: 'Main page',
                bundle: bundles
            });
        }
    };

    this.authenticate = function (req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err)
            }
            if (!user) {
                req.session.message = [info.message];
                return res.redirect('/')
            }
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                if (typeof req.body.remember !== 'undefined') {
                    req.session.cookie.maxAge = config.session.rememberMe;
                } else {
                    req.session.cookie.maxAge = config.session.default;
                }
                req.body.user = user;
                next();
            });
        })(req, res, next);
    };

    // Configure Passport authenticated session persistence.
    //
    // In order to restore authentication state across HTTP requests, Passport needs
    // to serialize users into and deserialize users out of the session.  The
    // typical implementation of this is as simple as supplying the user ID when
    // serializing, and querying the user record by ID from the database when
    // deserializing.
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        global.maindb.master(function(err, conn) {
            try {
                conn.query('SELECT .... FROM .... WHERE id = ?', [id], function (err, user, fields) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, {message: 'Unknown user ' + username});
                    }
                    if (user.length > 0) {
                        done(err, user[0]);
                    }
                });
                conn.release();
            } catch (e) {
                logger.error(e);
            }
        });
    });

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(emailOrUsername, password, done) {
            global.maindb.master(function(err, conn) {
                var query = 'SELECT ... FROM ... e WHERE (email=? or username=?) and password=?';
                try {
                    conn.query(query, [config.mysql.main.groupId.manager, config.mysql.main.groupId.agent, emailOrUsername, emailOrUsername, password], function (err, users, fields) {
                        if (err) {
                            return done(err);
                        }
                        if (!users) {
                            return done(null, false, {message: 'Unknown email or username' + emailOrUsername});
                        }
                        if (Array.isArray(users)) {
                            var user = users[0];
                            if (!user) {
                                return done(null, false, {message: 'Invalid login'});
                            }
                            return done(null, user);
                        }
                        return done(null, false);
                    });
                    conn.release();
                } catch (e) {
                    logger.error(e);
                }
            });
        }
    ));
    return this;
};

