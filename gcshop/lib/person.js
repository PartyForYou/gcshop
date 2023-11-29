// 201935222 김민석
var db = require('./db');
var qs = require("querystring");
const sanitize = require('sanitize-html');
var sanitizeHtml = require("sanitize-html");

module.exports = {
    view: (req, res) => {
        var id = req.params.vu
        db.query("SELECT * FROM person", (error, person) => {
            if (error) {
                throw error;
            }
            db.query("SELECT * FROM boardtype", (error2, subIds) => {
                if (error2) {
                    throw error2;
                }
            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                body: 'person.ejs',
                logined: 'YES',
                list: person,
                id: id,
                boardtypes: subIds
            };
            req.app.render("home", context, (err, html) => {
                res.end(html);
            })
        })
    })
    },
    create: (req, res) => {
        db.query("SELECT * FROM boardtype", (error, subIds) => {
            if (error) {
                throw error;
            }
        var context = {
            menu: 'menuForManager.ejs',
            who: req.session.name,
            body: 'personCU.ejs',
            logined: 'YES',
            person: {},
            boardtypes: subIds
        };
        req.app.render("home", context, (err, html) => {
            res.end(html);
        })
    })

    },
    create_process: (req, res) => {
        var post = req.body;
        console.log(post);


        sanitizedLoginId = sanitizeHtml(post.loginid);
        sanitizedPassword = sanitizeHtml(post.password);
        sanitizedName = sanitizeHtml(post.name);
        sanitizedAddress = sanitizeHtml(post.address);
        sanitizedTel = sanitizeHtml(post.tel);
        sanitizedBirth = sanitizeHtml(post.birth);
        sanitizedClass = sanitizeHtml(post.class);
        db.query(
            `INSERT INTO person (loginid, password, name, address, tel, birth, class)
        VALUES(?, ?, ?, ?, ?, ?, ?)`,
            [sanitizedLoginId, sanitizedPassword, sanitizedName, sanitizedAddress, sanitizedTel, sanitizedBirth, sanitizedClass],
            (error, result) => {
                if (error) {
                    throw error;
                }

                res.writeHead(302, { Location: `/person/view/v` });
                res.end();
            }
        )
    },
    update: (req, res) => {

        var loginid = req.params.loginid;
        db.query("SELECT * FROM person WHERE loginid = ?", [loginid], (error, person) => {

            if (error) {
                throw error;
            }

            db.query("SELECT * FROM boardtype", (error2, subIds) => {
                if (error2) {
                    throw error2;
                }
            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                body: 'personCU.ejs',
                logined: 'YES',
                person: person[0],
                boardtypes: subIds
            };
            req.app.render("home", context, (err, html) => {
                res.end(html);
            })
        })
        });
    },
    update_process: (req, res) => {
        var post = req.body;
        sanitizedPassword = sanitizeHtml(post.password);
        sanitizedName = sanitizeHtml(post.name);
        sanitizedAddress = sanitizeHtml(post.address);
        sanitizedTel = sanitizeHtml(post.tel);
        sanitizedBirth = sanitizeHtml(post.birth);
        sanitizedClass = sanitizeHtml(post.class);

        db.query(
            `UPDATE person SET password=?, name=?, address=?, tel=?, birth=?, class=? WHERE loginid = ?`,
            [sanitizedPassword, sanitizedName, sanitizedAddress, sanitizedTel, sanitizedBirth, sanitizedClass, post.loginid],
            (error, result) => {
                if(error){
                    throw error;
                }
                res.writeHead(302, { Location: `/person/view/u` });
                res.end();
            }

        )
    },
    delete_process: (req, res) => {
        var loginid = req.params.loginid;
        db.query("DELETE FROM person WHERE loginid = ?", [loginid], (error, result) => {
            if (error) {
                throw error;
            }
            res.writeHead(302, { Location: `/person/view/u` });
            res.end();
        });
    }
}