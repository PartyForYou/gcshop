// 201935222 김민석
const { type } = require('os');
var db = require('./db');
var qs = require("querystring")
var template = require("./template")
var sanitizeHtml = require("sanitize-html");
const { dateOfEightDigit } = require('./template');

module.exports = {
    typeview: (req, res) => {
        var sql1 = `select * from boardtype; `
        var sql2 = ` select * from code_tbl where main_id = '0000' ;`
        db.query(sql1 + sql2, (error, subIds) => {
            if (error) {
                throw error;
            }
            var sntzedMerId = sanitizeHtml(req.params.merId);
            db.query(`select * from merchandise where mer_id = ?`, [sntzedMerId], (err, result) => {
                var context = {
                    /*********** home.ejs에 필요한 변수 ***********/
                    menu: 'menuForManager.ejs',
                    body: 'boardtype.ejs',
                    /*********** menuForManager.ejs에 필요한 변수 ***********/
                    who: req.session.name,
                    logined: 'YES',
                    /*********** boardtypeCU.ejs에 필요한 변수 ***********/
                    boardtypes: subIds[0],
                    id: 'U',


                };
                req.app.render("home", context, (err, html) => {
                    res.end(html);
                })
            })
        })
    },

    typecreate: (req, res) => {
        db.query("SELECT * FROM boardtype", (error, subIds) => {
            if (error) {
                throw error;
            }
            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                body: 'boardtypeCU.ejs',
                logined: 'YES',
                cu: 'C',
                boardtypes: subIds
            };
            console.log(context);
            req.app.render("home", context, (err, html) => {
                res.end(html);
            })
        })

    },
    typecreate_process: (req, res) => {
        var post = req.body;

        sanitizeTitle = sanitizeHtml(post.title);
        sanitizeDescription = sanitizeHtml(post.description);
        sanitizeNumPerPage = sanitizeHtml(post.numPerPage);
        sanitizeWriteYN = sanitizeHtml(post.write_YN);
        sanitizeReYN = sanitizeHtml(post.re_YN);

        db.query(
            `INSERT INTO boardtype (title, description, write_YN, re_YN, numPerPage)
            VALUES(?, ?, ?, ?, ?)`,
            [sanitizeTitle, sanitizeDescription, sanitizeWriteYN, sanitizeReYN, sanitizeNumPerPage],
            (error, result) => {
                if (error) {
                    throw error;
                }
                res.writeHead(302, { Location: `/board/type/view` });
                res.end();
            }
        )
    },
    typeupdate: (req, res) => {
        var type_id = req.params.typeId;
        db.query("SELECT * FROM boardtype WHERE type_id = ?", [type_id], (error, boardtype) => {
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
                    body: 'boardtypeCU.ejs',
                    logined: 'YES',
                    boardtype: boardtype[0],
                    cu: 'U',
                    boardtypes: subIds
                };
                console.log(context);
                req.app.render("home", context, (err, html) => {
                    res.end(html);
                })
            })
        });
    },
    typeupdate_process: (req, res) => {
        var post = req.body;
        sanitizeTitle = sanitizeHtml(post.title);
        sanitizeDescription = sanitizeHtml(post.description);
        sanitizeNumPerPage = sanitizeHtml(post.numPerPage);
        sanitizeWriteYN = sanitizeHtml(post.write_YN);
        sanitizeReYN = sanitizeHtml(post.re_YN);


        db.query(
            `UPDATE boardtype SET title=?, description=?, write_YN=?, re_YN=?, numPerPage=? WHERE type_id = ?`,
            [sanitizeTitle, sanitizeDescription, sanitizeWriteYN, sanitizeReYN, sanitizeNumPerPage, post.type_id],
            (error, result) => {
                if (error) {
                    throw error;
                }
                res.writeHead(302, { Location: `/board/type/view` });
                res.end();
            }

        )
    },
    typedelete_process: (req, res) => {
        var type_id = req.params.typeId;
        db.query("DELETE FROM boardtype WHERE type_id = ?", [type_id], (error, result) => {
            if (error) {
                throw error;
            }
            res.writeHead(302, { Location: `/board/type/view` });
            res.end();
        });
    },



    view: (req, res) => {
        var typeId = req.params.typeId;
        var pNum = req.params.pNum;



        db.query("SELECT * FROM boardtype ", (error2, subIds) => {
            if (error2) {
                throw error2;
            }
            db.query("SELECT * FROM boardtype WHERE type_id = ? ", [typeId], (error3, result) => {
                if (error3) {
                    throw error3;
                }
                db.query("SELECT count(*) as total from board where type_id = ?", [typeId], (error4, result2) => {
                    if (error4) {
                        throw error4;
                    }
                    var numPerPage = result[0].numPerPage;
                    var offs = (pNum - 1) * numPerPage;
                    var totalPages = Math.ceil(result2[0].total / numPerPage);

                    db.query("SELECT * FROM board LEFT OUTER JOIN person ON board.loginid = person.loginid LEFT OUTER JOIN (select type_id, description, write_YN, re_YN, numPerPage FROM boardtype) as b ON board.type_id = b.type_id WHERE board.type_id = ? ORDER BY date desc, board_id desc LIMIT ? OFFSET ?", [typeId, numPerPage, offs], (error, board) => {
                        if (error) {
                            throw error;
                        }

                        //if문으로 권한 나누기
                        if (req.session.class == '01') {
                            var context = {
                                menu: 'menuForManager.ejs',
                                who: req.session.name,
                                body: 'board.ejs',
                                logined: 'YES',

                                pNum: pNum,
                                totalPages: totalPages,
                                classes: req.session.class,
                                boardtypes: subIds,
                                board: board
                            };

                        } else if (req.session.class == '02') {
                            var context = {
                                menu: 'menuForCustomer.ejs',
                                who: req.session.name,
                                body: 'board.ejs',
                                logined: 'YES',

                                pNum: pNum,
                                totalPages: totalPages,
                                classes: req.session.class,
                                boardtypes: subIds,
                                board: board
                            };

                        } else if (req.session.class == '00') {
                            var context = {
                                menu: 'menuForMIS.ejs',
                                who: req.session.name,
                                body: 'board.ejs',
                                logined: 'YES',

                                pNum: pNum,
                                totalPages: totalPages,
                                classes: req.session.class,
                                boardtypes: subIds,
                                board: board
                            };

                        } else {
                            var context = {
                                menu: 'menuForCustomer.ejs',
                                who: '손님',
                                body: 'board.ejs',
                                logined: 'NO',

                                pNum: pNum,
                                totalPages: totalPages,
                                classes: req.session.class,
                                boardtypes: subIds,
                                board: board
                            };
                        }

                        req.app.render("home", context, (err, html) => {
                            res.end(html);
                        })
                    })
                })
            })
        })
    },
    detail: (req, res) => {
        console.log(template.dateOfEightDigit());
        db.query("SELECT * FROM boardtype ", (error2, subIds) => {
            if (error2) {
                throw error2;
            }
            var pNum = req.params.pNum;
            var boardId = req.params.boardId;
            db.query("SELECT * FROM board LEFT OUTER JOIN person ON board.loginid = person.loginid INNER JOIN (select type_id, re_YN FROM boardtype) as boardtype ON board.type_id = boardtype.type_id WHERE board.board_id = ?", [boardId], (error, board) => {
                if (error) {
                    throw error;
                }
                db.query("SELECT * FROM comment INNER JOIN (select board_id, type_id from board) as board ON comment.board_id = board.board_id LEFT OUTER JOIN person ON comment.loginid = person.loginid WHERE comment.board_id = ?", [boardId], (error, comment) => {
                    console.log(board);
                    if (req.session.class == '01') {
                        var context = {
                            menu: 'menuForManager.ejs',
                            who: req.session.name,
                            body: 'boardCRU.ejs',
                            logined: 'YES',
                            boardtypes: subIds,

                            loginid: req.session.loginid,
                            classes: req.session.class,
                            pNum: pNum,
                            cru: 'R',
                            board: board[0],
                            comment: comment

                        }

                    } else if (req.session.class == '02') {
                        var context = {
                            menu: 'menuForCustomer.ejs',
                            who: req.session.name,
                            body: 'boardCRU.ejs',
                            logined: 'YES',
                            boardtypes: subIds,

                            loginid: req.session.loginid,
                            classes: req.session.class,
                            pNum: pNum,
                            cru: 'R',
                            board: board[0],
                            comment: comment

                        }
                    } else if (req.session.class == '00') {
                        var context = {
                            menu: 'menuForMIS.ejs',
                            who: req.session.name,
                            body: 'boardCRU.ejs',
                            logined: 'YES',
                            boardtypes: subIds,

                            loginid: req.session.loginid,
                            classes: req.session.class,
                            pNum: pNum,
                            cru: 'R',
                            board: board[0],
                            comment: comment

                        }

                    } else {
                        var context = {
                            menu: 'menuForCustomer.ejs',
                            who: '손님',
                            body: 'boardCRU.ejs',
                            logined: 'NO',
                            boardtypes: subIds,

                            loginid: req.session.loginid,
                            classes: req.session.class,
                            pNum: pNum,
                            cru: 'R',
                            board: board[0],
                            comment: comment

                        }

                    }

                    req.app.render("home", context, (err, html) => {
                        res.end(html);
                    })
                })
            })
        })
    },
    create: (req, res) => {
        db.query("SELECT * FROM boardtype", (error2, subIds) => {
            if (error2) {
                throw error2;
            }
            if (req.session.class == '01') {
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'boardCRU.ejs',
                    logined: 'YES',

                    loginid: req.params.loginid,
                    type_id: req.params.typeId,
                    cru: 'C',
                    boardtypes: subIds

                }

            } else if (req.session.class == '02' || req.session.class == '00') {
                var context = {
                    menu: 'menuForCustomer.ejs',
                    who: req.session.name,
                    body: 'boardCRU.ejs',
                    logined: 'YES',

                    loginid: req.params.loginid,
                    type_id: req.params.typeId,
                    cru: 'C',
                    boardtypes: subIds

                }

            } else {
                var context = {
                    menu: 'menuForCustomer.ejs',
                    who: '손님',
                    body: 'boardCRU.ejs',
                    logined: 'NO',

                    loginid: req.params.loginid,
                    type_id: req.params.typeId,
                    cru: 'C',
                    boardtypes: subIds

                }

            }
            req.app.render("home", context, (err, html) => {
                res.end(html);
            })
        })

    },
    create_process: (req, res) => {
        var post = req.body;
        var typeId = post.type_id;
        sanitizedTitle = sanitizeHtml(post.title);
        sanitizedContent = sanitizeHtml(post.content);
        sanitizedPassword = sanitizeHtml(post.password);
        sanitizedDate = sanitizeHtml(post.date)

        db.query(
            `INSERT INTO board (type_id, loginid, password, title, date, content)
        VALUES(?, ?, ?, ?, ?, ?)`,
            [post.type_id, req.session.loginid, sanitizedPassword, sanitizedTitle, template.dateOfEightDigit(), sanitizedContent],
            (error, result) => {
                if (error) {
                    throw error;
                }
                res.writeHead(302, { Location: `/board/view/${typeId}/1` });
                res.end();
            }
        )
    },
    update: (req, res) => {
        db.query("SELECT * FROM boardtype", (error2, subIds) => {
            if (error2) {
                throw error2;
            }
            db.query("SELECT * FROM board LEFT OUTER JOIN person ON board.loginid = person.loginid WHERE board_id=? ", [req.params.boardId], (error3, board) => {
                console.log(board[0])

                if (req.session.class == '01') {
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'boardCRU.ejs',
                        logined: 'YES',

                        pNum: req.params.pNum,
                        board: board[0],
                        loginid: req.params.loginid,
                        type_id: req.params.typeId,
                        cru: 'U',
                        boardtypes: subIds
                    };

                } else if (req.session.class == '02' || req.session.class == '00') {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        body: 'boardCRU.ejs',
                        logined: 'YES',

                        pNum: req.params.pNum,
                        board: board[0],
                        loginid: req.params.loginid,
                        type_id: req.params.typeId,
                        cru: 'U',
                        boardtypes: subIds
                    };

                } else {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        body: 'boardCRU.ejs',
                        logined: 'NO',

                        pNum: req.params.pNum,
                        board: board[0],
                        loginid: req.params.loginid,
                        type_id: req.params.typeId,
                        cru: 'U',
                        boardtypes: subIds
                    };

                }


                req.app.render("home", context, (err, html) => {
                    res.end(html);
                })
            })
        })

    },

    update_process: (req, res) => {
        var post = req.body;
        console.log(req.body);

        var boardId = post.board_id
        var pNum = post.pNum
        sanitizeTitle = sanitizeHtml(post.title);
        sanitizeDate = sanitizeHtml(post.date);
        sanitizeContent = sanitizeHtml(post.content);
        sanitizePassword = sanitizeHtml(post.password);

        db.query(
            `UPDATE board SET title=?, date=?, content=?, password=? WHERE board_id = ?`,
            [sanitizeTitle, sanitizeDate, sanitizeContent, sanitizePassword, post.board_id],
            (error, result) => {
                if (error) {
                    throw error;
                }
                res.writeHead(302, { Location: `/board/detail/${boardId}/1` });
                res.end();
            }

        )

    },

    delete_process: (req, res) => {
        var boardId = req.params.boardId;
        var typeId = req.params.typeId;
        var pNum = req.params.pNum;
        console.log(req.params);
        console.log(req.body);
        db.query("DELETE FROM board WHERE board_id = ?", [boardId], (error, result) => {
            if (error) {
                throw error;
            }
            res.writeHead(302, { Location: `/board/view/${typeId}/${pNum}` });
            res.end();
        });
    },
    
    add_comment: (req, res) => {
        var post = req.body;
        console.log(post);
        console.log(req.params);
        boardId = req.params.boardId
        typeId = req.params.typeId
        db.query(
            `INSERT INTO comment (loginid, board_id, content, date)
        VALUES(?, ?, ?, ?)`,
            [req.session.loginid, req.params.boardId, post.comment, template.dateOfEightDigit()],
            (error, result) => {
                if (error) {
                    throw error;
                }
                res.writeHead(302, { Location: `/board/detail/${boardId}/${typeId}` });
                res.end();
            }
        )

    },
    delete_comment: (req, res) => {
        console.log(req.body);
        var post = req.body;
        var boardId = post.board_id;
        var typeId = post.type_id;
        var commentId = req.params.commentId
        db.query("DELETE FROM comment WHERE comment_id = ?", [commentId], (error, result) => {
            if (error) {
                throw error;
            }
            res.writeHead(302, { Location: `/board/detail/${boardId}/${typeId}` });
            res.end();
        });
    }
}   
