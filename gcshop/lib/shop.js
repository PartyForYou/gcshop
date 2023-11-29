// 201935222 김민석
var db = require('./db');

function authIsOwner(req, res) {
    if (req.session.is_logined) {
        return true;
    } else {
        return false;
    }
}
module.exports = {
    home: (req, res) => {

        var category = req.params.category;

        var sql = "SELECT * FROM merchandise";
        if (category && category !== 'all') {
            sql += ` WHERE category = '${category}'`;
        }

        db.query(sql, (error, merchandise) => {
            if (error) {
                throw error;
            }

            db.query("SELECT * FROM boardtype", (error, subIds) => {
                if (error) {
                    throw error;
                }

                var isOwner = authIsOwner(req, res);
                var context;

                if (isOwner) {
                    if (req.session.class === '00'){
                        context = {
                            menu: 'menuForMIS.ejs',
                            who: req.session.name,
                            body: 'merchandise.ejs',
                            logined: 'YES',
                            list: merchandise,
                            id: null,
                            boardtypes: subIds
                        };

                    } else if (req.session.class === '02') {
                        context = {
                            menu: 'menuForCustomer.ejs',
                            who: req.session.name,
                            body: 'merchandise.ejs',
                            logined: 'YES',
                            list: merchandise,
                            id: null,
                            boardtypes: subIds
                        };
                    } else if (req.session.class === '01') {
                        context = {
                            menu: 'menuForManager.ejs',
                            who: req.session.name,
                            body: 'merchandise.ejs',
                            logined: 'YES',
                            list: merchandise,
                            id: null,
                            boardtypes: subIds
                        };
                    }
                } else {
                    context = {
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        body: 'merchandise.ejs',
                        logined: 'NO',
                        list: merchandise,
                        id: null,
                        boardtypes: subIds
                    };
                }

                req.app.render('home', context, (err, html) => {
                    res.end(html);
                });
            });
        });
    },
    detail: (req, res) => {
        var merId = req.params.merId;
        db.query('SELECT * from merchandise where mer_id = ?', [merId], (error, merchandise) => {
            if (error) {
                throw error;
            }
            db.query("SELECT * FROM boardtype", (error2, subIds) => {
                if (error2) {
                    throw error2;
                }
                var isOwner = authIsOwner(req, res);
                var context;

                if (isOwner) {
                    if (req.session.class === '00'){
                        context = {
                            menu: 'menuForMIS.ejs',
                            who: req.session.name,
                            body: 'merchandiseDetail.ejs',
                            logined: 'YES',
                            list: merchandise[0],
                            id: null,
                            boardtypes: subIds,
                            classes: req.session.class
                        };

                    } else if (req.session.class === '02') {
                        context = {
                            menu: 'menuForCustomer.ejs',
                            who: req.session.name,
                            body: 'merchandiseDetail.ejs',
                            logined: 'YES',
                            list: merchandise[0],
                            id: null,
                            boardtypes: subIds,
                            classes: req.session.class
                        };
                    } else if (req.session.class === '01') {
                        context = {
                            menu: 'menuForManager.ejs',
                            who: req.session.name,
                            body: 'merchandiseDetail.ejs',
                            logined: 'YES',
                            list: merchandise[0],
                            id: null,
                            boardtypes: subIds,
                            classes: req.session.class
                        };
                    }
                } else {
                    context = {
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        body: 'merchandiseDetail.ejs',
                        logined: 'NO',
                        list: merchandise[0],
                        id: null,
                        boardtypes: subIds,
                        classes: req.session.class
                    };
                }

                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })

            })
        })
    },
    search: (req, res) => {
        var post = req.body;
        console.log(post);
        db.query(`select * from merchandise 
        where name like '%${post.search}%' or brand like '%${post.search}%' or supplier like '%${post.search}%'`, (error, search) => {
            if (error) {
                throw error;
            }
            db.query("SELECT * FROM boardtype", (error, subIds) => {
                if (error) {
                    throw error;
                }
                console.log(search);
                var isOwner = authIsOwner(req, res);
                var context;

                if (isOwner) {
                    if (req.session.class === '00'){
                        context = {
                            menu: 'menuForMIS.ejs',
                            who: req.session.name,
                            body: 'merchandise.ejs',
                            logined: 'YES',
                            list: search,
                            id: null,
                            boardtypes: subIds
                        };

                    } else if (req.session.class === '02') {
                        context = {
                            menu: 'menuForCustomer.ejs',
                            who: req.session.name,
                            body: 'merchandise.ejs',
                            logined: 'YES',
                            list: search,
                            id: null,
                            boardtypes: subIds
                        };
                    } else if (req.session.class === '01') {
                        context = {
                            menu: 'menuForManager.ejs',
                            who: req.session.name,
                            body: 'merchandise.ejs',
                            logined: 'YES',
                            list: search,
                            id: null,
                            boardtypes: subIds
                        };
                    }
                } else {
                    context = {
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        body: 'merchandise.ejs',
                        logined: 'NO',
                        list: search,
                        id: null,
                        boardtypes: subIds
                    };
                }
                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            })
        })

    },
    customeranal: (req, res) => {
        var isOwner = authIsOwner(req, res);
        if (isOwner) {
            if (req.session.class === '00') {
                var sql1 = `select * from boardtype;`
                var sql2 = `select address,ROUND(( count(*) / ( select count(*) from person )) * 100, 2) as rate 
                from person group by address;`
                db.query(sql1 + sql2, (error, results) => {
                    console.log(results);
                    var context = {
                        /*********** home.ejs에 필요한 변수 ***********/
                        menu: 'menuForMIS.ejs',
                        body: 'customerAnal.ejs',
                        /*********** menuForMIS.ejs에 필요한 변수 ***********/
                        who: req.session.name,
                        logined: 'YES',
                        boardtypes: results[0],
                        /*********** customerAnal.ejs에 필요한 변수 ***********/
                        percentage: results[1]
                    };
                    req.app.render('home', context, (err, html) => {
                        res.end(html);
                    })
                });
            }
        }
        else {
            var sql1 = `select * from boardtype;`;
            db.query(sql1 + sql2, (error, results) => {
                var context = {
                    /*********** home.ejs에 필요한 변수 ***********/
                    menu: 'menuForCustomer.ejs',
                    body: 'merchandise.ejs',
                    /*********** menuForCustomer.ejs에 필요한 변수 ***********/
                    who: '손님',
                    logined: 'NO',
                    boardtypes: results[0],
                    /*********** mechandise.ejs에 필요한 변수 ***********/
                    merchandise: results[1],
                    vu: 'v'
                };
                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            });
        }
    },
    merchandiseanal: (req, res) => {
        var isOwner = authIsOwner(req, res);
        if (isOwner) {
            if (req.session.class === '00') {
                var sql1 = `select * from boardtype;`
                // var sql2 = `select address,ROUND(( count(*) / ( select count(*) from person )) * 100, 2) as rate 
                // from person group by address;`
                var sql2 = `select brand,ROUND(( count(*) / ( select count(*) from merchandise )) * 100, 2) as rate 
                from merchandise group by brand;`
                db.query(sql1 + sql2, (error, results) => {
                    console.log(results);
                    var context = {
                        /*********** home.ejs에 필요한 변수 ***********/
                        menu: 'menuForMIS.ejs',
                        body: 'merchandiseAnal.ejs',
                        /*********** menuForMIS.ejs에 필요한 변수 ***********/
                        who: req.session.name,
                        logined: 'YES',
                        boardtypes: results[0],
                        /*********** customerAnal.ejs에 필요한 변수 ***********/
                        percentage: results[1]
                    };
                    req.app.render('home', context, (err, html) => {
                        res.end(html);
                    })
                });
            }
        }
        else {
            var sql1 = `select * from boardtype;`;
            db.query(sql1 + sql2, (error, results) => {
                var context = {
                    /*********** home.ejs에 필요한 변수 ***********/
                    menu: 'menuForCustomer.ejs',
                    body: 'merchandise.ejs',
                    /*********** menuForCustomer.ejs에 필요한 변수 ***********/
                    who: '손님',
                    logined: 'NO',
                    boardtypes: results[0],
                    /*********** mechandise.ejs에 필요한 변수 ***********/
                    merchandise: results[1],
                    vu: 'v'
                };
                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            });
        }
    }

};
