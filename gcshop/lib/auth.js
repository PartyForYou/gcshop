// 201935222 김민석
var db = require('./db');
var qs = require("querystring")
var sanitizeHtml = require("sanitize-html");

module.exports = {
    login: (req, res) => {
        db.query("SELECT * FROM boardtype", (error2, subIds) => {
            if (error2) {
                throw error2;
            }
            var context = {
                menu: 'menuForCustomer.ejs',
                who: '손님',
                body: 'login.ejs',
                logined: 'No',
                boardtypes: subIds
            };
            req.app.render('home', context, (err, html) => {
                res.end(html);
            })
        })
    },
    login_process: (req, res) => {
        var post = req.body;
        db.query('select count(*) as num from person where loginid = ? and password = ?', [post.id, post.pwd], (error, results) => {
            if (results[0].num === 1) {
                db.query('select name, class from person where loginid = ? and password = ?', [post.id, post.pwd], (error, result) => {
                    req.session.is_logined = true;
                    req.session.loginid = post.id;
                    req.session.name = result[0].name
                    req.session.class = result[0].class
                    res.redirect('/shop/all');
                })
            }
            else {
                req.session.is_logined = false;
                req.session.name = '손님';
                req.session.class = '99';
                res.write("<script>alert('WRONG ID OR PW'); location.href='/auth/login';</script>");
                // res.redirect('/auth/login'); //redirect 수정하기
            }
        })
    },
    logout_process: (req, res) => {

        req.session.destroy((err) => {
            res.redirect('/shop/all');
        })
    },
    register: (req, res) => {
        db.query("SELECT * FROM boardtype", (error2, subIds) => {
            if (error2) {
                throw error2;
            }
            var context = {
                menu: 'menuForCustomer.ejs',
                who: req.session.name,
                body: 'register.ejs',
                logined: 'NO',
                person: {},
                boardtypes: subIds
            };
            req.app.render("home", context, (err, html) => {
                res.end(html);
            })
        })
    },
    register_process: (req, res) => {
        var post = req.body;

        var sanitizedLoginId = sanitizeHtml(post.loginid);

        db.query('SELECT COUNT(*) AS num FROM person WHERE loginid = ?', [sanitizedLoginId], (error, results) => {
            if (error) {
                throw error;
            }

            if (results[0].num > 0) {
                res.write("<script>alert('Duplicated ID!!'); location.href='/auth/register';</script>");
                res.end();
            } else {
                var sanitizedPassword = sanitizeHtml(post.password);
                var sanitizedName = sanitizeHtml(post.name);
                var sanitizedAddress = sanitizeHtml(post.address);
                var sanitizedTel = sanitizeHtml(post.tel);
                var sanitizedBirth = sanitizeHtml(post.birth);

                db.query(
                    `INSERT INTO person (loginid, password, name, address, tel, birth, class)
                    VALUES(?, ?, ?, ?, ?, ?, ?)`,
                    [sanitizedLoginId, sanitizedPassword, sanitizedName, sanitizedAddress, sanitizedTel, sanitizedBirth, '02'],
                    (error, result) => {
                        if (error) {
                            throw error;
                        }
                        req.session.is_logined = true;
                        req.session.name = sanitizedName;
                        req.session.class = '02';

                        res.writeHead(302, { Location: `/` });
                        res.end();
                    }
                );
            }
        });
    }

}