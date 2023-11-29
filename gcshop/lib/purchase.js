// 201935222 김민석
var db = require('./db');
var template = require("./template")
const { dateOfEightDigit } = require('./template');

function authIsOwner(req, res) {
    if (req.session.is_logined) {
        return true;
    } else {
        return false;
    }
}
module.exports = {
    home: (req, res) => {


        vu = req.params.vu;

        var qr = "SELECT * FROM purchase LEFT OUTER JOIN merchandise ON purchase.mer_id = merchandise.mer_id";
        var param = null;

        if (req.session.class === '00' || req.session.class === '02') {
            qr += " WHERE loginid =?";
            param = [req.session.loginid];
        }



        db.query(qr, param, (error, purchase) => {
            if (error) {
                throw error;
            }

            db.query("SELECT * FROM boardtype", (error2, subIds) => {
                if (error2) {
                    throw error2;
                }
                var isOwner = authIsOwner(req, res);
                if (isOwner) {
                    if (req.session.class === '00' || req.session.class === '02') {
                        context = {
                            menu: 'menuForCustomer.ejs',
                            who: req.session.name,
                            body: 'purchase.ejs',
                            logined: 'YES',
                            list: purchase,
                            classes: req.session.class,
                            id: null,
                            boardtypes: subIds
                        };
                    } else if (req.session.class === '01') {
                        context = {
                            menu: 'menuForManager.ejs',
                            who: req.session.name,
                            body: 'purchase.ejs',
                            logined: 'YES',
                            list: purchase,
                            classes: req.session.class,
                            id: vu,
                            boardtypes: subIds
                        };
                    }
                } else {
                    context = {
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        body: 'purchase.ejs',
                        logined: 'NO',
                        classes: req.session.class,
                        list: purchase,
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
    detail: (req, res) => {
        var merId = req.params.merId;
        db.query('SELECT * from merchandise where mer_id = ?', [merId], (error, merchandise) => {
            if (error) {
                throw error;
            }
            var isOwner = authIsOwner(req, res);
            db.query("SELECT * FROM boardtype", (error2, subIds) => {
                if (error2) {
                    throw error2;
                }
                if (isOwner) {
                    if (req.session.class === '00' || req.session.class === '02') {
                        context = {
                            menu: 'menuForCustomer.ejs',
                            who: req.session.name,
                            body: 'merchandiseDetail.ejs',
                            logined: 'YES',
                            list: merchandise[0],
                            id: null,
                            boardtypes: subIds
                        };
                    } else if (req.session.class === '01') {
                        context = {
                            menu: 'menuForManager.ejs',
                            who: req.session.name,
                            body: 'merchandiseDetail.ejs',
                            logined: 'YES',
                            list: merchandise[0],
                            id: null,
                            boardtypes: subIds
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
                        boardtypes: subIds
                    };
                }


                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })

            })
        })
    },
    detail_create: (req, res) => {
        var post = req.body;
        db.query(
            `INSERT INTO purchase (loginid, mer_id, date, price, point, qty, total)
        VALUES(?, ?, ?, ?, ?, ?, ?)`,
            [req.session.loginid, post.merId, template.dateOfEightDigit(), post.price, post.price * 0.05, post.quantity, post.price * post.quantity],
            (error, result) => {
                if (error) {
                    throw error;
                }

                res.writeHead(302, { Location: `/purchase/view/v` });
                res.end();
            }
        )
    },
    delete_process: (req, res) => {
        var params = req.params;
        db.query(
            `UPDATE purchase SET cancel=? WHERE purchase_id = ?`,
            ['Y', params.purchase_id],
            (error, result) => {
                if (error) {
                    throw error;
                }
                res.writeHead(302, { Location: `/purchase/view/v` });
                res.end();
            }
        )

    },

    cart: (req, res) => {
        vu = req.params.vu;
        var qr = "SELECT * FROM cart LEFT OUTER JOIN merchandise ON cart.mer_id = merchandise.mer_id";
        var param = null;

        if (req.session.class === '00' || req.session.class === '02') {
            qr += " WHERE loginid =?";
            param = [req.session.loginid];
        }
        db.query(qr, param, (error, cart) => {
            if (error) {
                throw error;
            }

            db.query("SELECT * FROM boardtype", (error2, subIds) => {
                if (error2) {
                    throw error2;
                }
                var isOwner = authIsOwner(req, res);

                if (isOwner) {
                    if (req.session.class === '00' || req.session.class === '02') {
                        context = {
                            menu: 'menuForCustomer.ejs',
                            who: req.session.name,
                            body: 'cart.ejs',
                            classes: req.session.class,
                            logined: 'YES',
                            list: cart,
                            id: null,
                            boardtypes: subIds
                        };
                    } else if (req.session.class === '01') {
                        context = {
                            menu: 'menuForManager.ejs',
                            who: req.session.name,
                            body: 'cart.ejs',
                            classes: req.session.class,
                            logined: 'YES',
                            list: cart,
                            id: vu,
                            boardtypes: subIds
                        };
                    }
                } else {
                    context = {
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        body: 'cart.ejs',
                        logined: 'NO',
                        classes: req.session.class,
                        list: cart,
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
    cart_process: (req, res) => {
        var post = req.body;
        db.query(
            `INSERT INTO cart (loginid, mer_id, date)
        VALUES(?, ?, ?)`,
            [req.session.loginid, post.mer_id, template.dateOfEightDigit()],
            (error, result) => {
                if (error) {
                    throw error;
                }

                res.writeHead(302, { Location: `/purchase/cart/view/v` });
                res.end();
            }
        )
    },
    purchase_input_process: (req, res) => {
        var post = req.body;
        var check = post.check;

        if (null == check || check == 'undefined') {

            return;
        }

        var quantity = post.quantity;

        var p_num = Array.isArray(check);
        console.log('p_num :: ', p_num);

        if (!p_num) {
            var tmp_chk = [];
            tmp_chk.push(check);
            check = tmp_chk;

            var tmp_qtt = [];
            tmp_qtt.push(quantity);
            quantity = tmp_qtt;
        }
        for (let i = 0; i < check.length; i++) {
            db.query("SELECT *, " + quantity[i] + " as quantity FROM cart LEFT OUTER JOIN merchandise ON cart.mer_id =  merchandise.mer_id WHERE cart_id = ?", [check[i]], (error, cart) => {
                if (error) {
                    throw error;
                }

                db.query(
                    `INSERT INTO purchase (loginid, mer_id, date, price, point, qty, total)
        VALUES(?, ?, ?, ?, ?, ?, ?)`,
                    [req.session.loginid, cart[0].mer_id, template.dateOfEightDigit(), cart[0].price, cart[0].price * 0.05, cart[0].quantity, cart[0].price * cart[0].quantity],
                    (error2, result) => {
                        if (error2) {
                            throw error2;
                        }
                        db.query("DELETE FROM cart WHERE cart_id = ?", [check[i]], (error3, result) => {
                            if (error3) {
                                throw error3;
                            }
                        })
                    })
            })
        }

        res.writeHead(302, { Location: `/purchase/view/v` });
        res.end();
    },
    search: (req, res) => {
        var post = req.body;
        db.query(`select * from purchase LEFT OUTER JOIN merchandise ON purchase.mer_id = merchandise.mer_id
        where loginid like '%${post.search}%'`, (error, search) => {
            if (error) {
                throw error;
            }
            db.query("SELECT * FROM boardtype", (error2, subIds) => {
                if (error2) {
                    throw error2;
                }
                context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'purchase.ejs',
                    logined: 'YES',
                    list: search,
                    classes: req.session.class,
                    id: post.id,
                    boardtypes: subIds
                };

                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            })
        })

    },
    cSearch: (req, res) => {
        var post = req.body;
        db.query(`select * from cart LEFT OUTER JOIN merchandise ON cart.mer_id = merchandise.mer_id
        where loginid like '%${post.search}%'`, (error, search) => {
            if (error) {
                throw error;
            }
            db.query("SELECT * FROM boardtype", (error2, subIds) => {
                if (error2) {
                    throw error2;
                }
                context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'cart.ejs',
                    logined: 'YES',
                    list: search,
                    classes: req.session.class,
                    id: post.id,
                    boardtypes: subIds

                };
                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            })
        })

    },

    purchasecreate: (req, res) => {
        db.query("SELECT * FROM boardtype", (error, subIds) => {
            db.query("SELECT * FROM merchandise", (error2, merchandise) => {

                if (error) {
                    throw error;
                }
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'purchaseCU.ejs',
                    logined: 'YES',
                    boardtypes: subIds,
                    cru: 'C',
                    merchandise: merchandise,
                    id: req.session.loginid

                };
                // document.getElementById("priceField").value = price;
                req.app.render("home", context, (err, html) => {
                    res.end(html);
                })
            })
        })

    },
    purchasecreate_process: (req, res) => {
        var post = req.body;
        db.query('SELECT * FROM merchandise where mer_id = ?', [post.mer_id], (error2, merchandise) => {
            if (error2) {
                throw error2;
            }
            console.log(merchandise[0].price * post.qty)
            db.query(
                `INSERT INTO purchase (loginid, mer_id, date, price, point, qty, total)
            VALUES(?, ?, ?, ?, ?, ?, ?)`,
                [post.loginid, post.mer_id, template.dateOfEightDigit(), merchandise[0].price, merchandise[0].price * 0.05, post.qty, merchandise[0].price * post.qty],
                (error, result) => {
                    if (error) {
                        throw error;
                    }
                    res.writeHead(302, { Location: `/purchase/view/v` });
                    res.end();
                }

            )
        })

    },
    purchaseupdate: (req, res) => {
        var id = req.params.purchaseId;
        db.query("SELECT * FROM boardtype", (error, subIds) => {
            db.query("SELECT * FROM purchase left outer join merchandise on purchase.mer_id = merchandise.mer_id WHERE purchase_id = ?", [id], (error2, purchase) => {
                if (error) {
                    throw error;
                }
                db.query("SELECT * FROM purchase left outer join person on purchase.loginid = person.loginid where purchase.purchase_id = ?", [id], (error, purchase2) => {


                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'purchaseCU.ejs',
                        logined: 'YES',
                        boardtypes: subIds,
                        cru: 'U',
                        merchandise: purchase,
                        purchase: purchase2,
                        pNum: id,
                        id: req.session.loginid

                    };
                    req.app.render("home", context, (err, html) => {
                        res.end(html);
                    })
                })
            })
        })

    },
    purchaseupdate_process: (req, res) => {
        var post = req.body;
        db.query("SELECT * FROM merchandise LEFT OUTER JOIN purchase ON merchandise.mer_id = purchase.mer_id WHERE purchase.purchase_id = ?", [post.pNum], (error, merchandise) => {
            if (error) {
                throw error;
            }

            db.query(
                `UPDATE purchase SET qty=?, point=?, total=?, payYN=?, cancel=?, refund=? WHERE purchase_id = ?`,
                [post.qty, merchandise[0].price * 0.05, merchandise[0].price * post.qty, post.payYN, post.cancel, post.refund, post.pNum],
                (error, result) => {
                    if (error) {
                        throw error;
                    }
                    res.writeHead(302, { Location: `/purchase/view/u` });
                    res.end();
                }

            )
        })

    },
    purchasedelete_process: (req, res) => {
        var purchaseId = req.params.purchaseId;
        db.query("DELETE FROM purchase WHERE purchase_id = ? ", [purchaseId], (error, result) => {
            if (error) {
                throw error;
            }
            res.writeHead(302, { Location: `/purchase/view/u` });
            res.end();
        });

    },
    cartcreate: (req, res) => {
        db.query("SELECT * FROM boardtype", (error, subIds) => {
            db.query("SELECT * FROM merchandise", (error2, merchandise) => {

                if (error) {
                    throw error;
                }
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'cartCU.ejs',
                    logined: 'YES',
                    boardtypes: subIds,
                    cru: 'C',
                    merchandise: merchandise,
                    id: req.session.loginid

                };
                // document.getElementById("priceField").value = price;
                req.app.render("home", context, (err, html) => {
                    res.end(html);
                })
            })
        })

    },
    cartcreate_process: (req, res) => {
        var post = req.body;
        db.query(
            `INSERT INTO cart (loginid, mer_id, date)
            VALUES(?, ?, ?)`,
            [post.loginid, post.mer_id, template.dateOfEightDigit()],
            (error, result) => {
                if (error) {
                    throw error;
                }
                res.writeHead(302, { Location: `/purchase/cart/view/v` });
                res.end();
            }

        )

    },
    cartupdate: (req, res) => {
        var id = req.params.cartId;
        db.query("SELECT * FROM boardtype", (error, subIds) => {
            db.query("SELECT * FROM cart left outer join merchandise on cart.mer_id = merchandise.mer_id WHERE cart_id = ?", [id], (error2, cart) => {
                if (error) {
                    throw error;
                }
                db.query("SELECT * FROM cart left outer join person on cart.loginid = person.loginid where cart.cart_id = ?", [id], (error, cart2) => {

                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'cartCU.ejs',
                        logined: 'YES',
                        boardtypes: subIds,
                        cru: 'U',
                        merchandise: cart,
                        purchase: cart2,
                        pNum: id,
                        id: req.session.loginid

                    };
                    req.app.render("home", context, (err, html) => {
                        res.end(html);
                    })
                })
            })
        })

    },
    cartupdate_process: (req, res) => {
        var post = req.body;
        console.log(post);
        db.query("SELECT * FROM merchandise WHERE mer_id = ?", [post.mer_id], (error3, merchandise) => {
            if(error3){
                throw error3;
            }
            console.log(merchandise);
        
        db.query(
            `INSERT INTO purchase (loginid, mer_id, date, price, point, qty, total, payYN, cancel, refund)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [post.loginid, post.mer_id, template.dateOfEightDigit(), merchandise[0].price, merchandise[0].price*0.05, post.qty, post.qty*merchandise[0].price, 'N', 'N', 'N'],
            (error, result) => {
                if (error) {
                    throw error;
                }

                db.query("DELETE FROM cart WHERE cart_id = ?", [post.pNum], (error, result) => {
                    if (error) {
                        throw error;
                    }


                    res.writeHead(302, { Location: `/purchase/view/v` });
                    res.end();
                })
            })
        })

    },
    cartdelete_process: (req, res) => {
        var cartId = req.params.cartId;
        db.query("DELETE FROM cart WHERE cart_id = ? ", [cartId], (error, result) => {
            if (error) {
                throw error;
            }
            res.writeHead(302, { Location: `/purchase/cart/view/u` });
            res.end();
        });
    }


};
