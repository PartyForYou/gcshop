// 201935222 김민석
var db = require('./db');
var qs = require("querystring")
var sanitizeHtml = require("sanitize-html");

module.exports = {
    view: (req, res) => {
        var id = req.params.vu
        db.query("SELECT * FROM code_tbl", (error, codes) => {
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
                    body: 'code.ejs',
                    logined: 'YES',
                    list: codes,
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
        db.query("SELECT * FROM boardtype", (error2, subIds) => {
            if (error2) {
                throw error2;
            }
            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                body: 'codeCU.ejs',
                logined: 'YES',
                code_tbl: {},
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

        sanitizedMainId = sanitizeHtml(post.main_id);
        sanitizedSubId = sanitizeHtml(post.sub_id);
        sanitizedMainName = sanitizeHtml(post.main_name);
        sanitizedSubName = sanitizeHtml(post.sub_name);
        sanitizedStart = sanitizeHtml(post.start);
        sanitizedEnd = sanitizeHtml(post.end);
        db.query(
            `INSERT INTO code_tbl (main_id, sub_id, main_name, sub_name, start, end)
        VALUES(?, ?, ?, ?, ?, ?)`,
            [sanitizedMainId, sanitizedSubId, sanitizedMainName, sanitizedSubName, sanitizedStart, sanitizedEnd],
            (error, result) => {
                if (error) {
                    throw error;
                }
                res.writeHead(302, { Location: `/code/view/v` });
                res.end();
            }
        )
    },
    update: (req, res) => {

        var main_id = req.params.main;
        var sub_id = req.params.sub;
        db.query("SELECT * FROM code_tbl WHERE main_id = ? AND sub_id = ?", [main_id, sub_id], (error, code_tbl) => {

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
                    body: 'codeCU.ejs',
                    logined: 'YES',
                    code_tbl: code_tbl[0],
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
        console.log(post);
        // sanitizedMainId = sanitizeHtml(post.main_id);
        // sanitizedSubId = sanitizeHtml(post.sub_id);
        sanitizedMainName = sanitizeHtml(post.main_name);
        sanitizedSubName = sanitizeHtml(post.sub_name);
        sanitizedStart = sanitizeHtml(post.start);
        sanitizedEnd = sanitizeHtml(post.end);

        db.query(
            `UPDATE code_tbl SET main_name=?, sub_name=?, start=?, end=? WHERE main_id = ? AND sub_id = ?`,
            [sanitizedMainName, sanitizedSubName, sanitizedStart, sanitizedEnd, post.main_id, post.sub_id],
            (error, result) => {
                if (error) {
                    throw error;
                }
                res.writeHead(302, { Location: `/code/view/u` });
                res.end();
            }

        )



    },
    delete_process: (req, res) => {
        var main_id = req.params.main;
        var sub_id = req.params.sub;
        db.query("DELETE FROM code_tbl WHERE main_id = ? AND sub_id = ?", [main_id, sub_id], (error, result) => {
            if (error) {
                throw error;
            }
            res.writeHead(302, { Location: `/code/view/u` });
            res.end();
        });
    }
}   
