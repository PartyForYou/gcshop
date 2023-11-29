// 201935222 김민석
var db = require('./db');
var qs = require("querystring")
var sanitizeHtml = require("sanitize-html");

module.exports = {
    view: (req, res) => {
        var id = req.params.vu
        db.query("SELECT * FROM merchandise", (error, merchandises) => {
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
                body: 'merchandise.ejs',
                logined: 'YES',
                list: merchandises,
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
        db.query("SELECT * FROM code_tbl", (error, code_tbl) => {
            db.query("SELECT * FROM boardtype", (error2, subIds) => {
                if (error2) {
                    throw error2;
                }

            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                body: 'merchandiseCU.ejs',
                logined: 'YES',
                category: code_tbl,
                merchandise: {},
                boardtypes: subIds
            };
            req.app.render("home", context, (err, html) => {
                res.end(html);
            })
        })
    })

    },
    create_process: (req, res, newImage) => {
        var post = req.body;

        console.log(newImage);

        sanitizedCategory = sanitizeHtml(post.category);
        sanitizedName = sanitizeHtml(post.name);
        sanitizedPrice = sanitizeHtml(post.price);
        sanitizedStock = sanitizeHtml(post.stock);
        sanitizedBrand = sanitizeHtml(post.brand);
        sanitizedSupplier = sanitizeHtml(post.supplier);
        sanitizedSaleYn = sanitizeHtml(post.sale_yn);
        sanitizedSalePrice = sanitizeHtml(post.sale_price);
        var image = newImage;
        // if (newImage == "No") {
        //     image = post.image
        // } else {
        //     image = newImage
        // }

        db.query(
            `INSERT INTO merchandise (category, name, price, stock, brand, supplier, image, sale_yn, sale_price)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [sanitizedCategory, sanitizedName, sanitizedPrice, sanitizedStock, sanitizedBrand, sanitizedSupplier, image, sanitizedSaleYn, sanitizedSalePrice],
            (error, result) => {
                res.writeHead(302, { Location: `/shop/all` });
                res.end();
            }

        )
    },
    update: (req, res) => {
        var id = req.params.merId;
        db.query("SELECT * FROM merchandise LEFT OUTER JOIN code_tbl ON merchandise.category = code_tbl.sub_id WHERE mer_id = ?", [id], (error, merchandise) => {
            // db.query("SELECT * FROM merchandise WHERE mer_id = ?", [id], (error, merchandise) => {
            db.query("SELECT * FROM code_tbl", (error2, code_tbl) => {
                db.query("SELECT * FROM boardtype", (error3, subIds) => {
                    if (error2) {
                        throw error2;
                    }
                if (error) {
                    throw error;
                }

                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'merchandiseCU.ejs',
                    logined: 'YES',
                    category: code_tbl,
                    merchandise: merchandise[0],
                    boardtypes: subIds
                };
                req.app.render("home", context, (err, html) => {
                    res.end(html);
                })
            });
        });
    })
    },
    update_process: (req, res, newImage) => {
        var post = req.body;
        console.log(post);

        console.log(newImage);

        sanitizedCategory = sanitizeHtml(post.category);
        sanitizedName = sanitizeHtml(post.name);
        sanitizedPrice = sanitizeHtml(post.price);
        sanitizedStock = sanitizeHtml(post.stock);
        sanitizedBrand = sanitizeHtml(post.brand);
        sanitizedSupplier = sanitizeHtml(post.supplier);
        sanitizedSaleYn = sanitizeHtml(post.sale_yn);
        sanitizedSalePrice = sanitizeHtml(post.sale_price);
        var image;
        if (newImage == "No") {
            image = post.image
        } else {
            image = newImage
        }
        db.query(
            `UPDATE merchandise SET category=?, name=?, price=?, stock=?, brand=?, supplier=?, image=?, sale_yn=?, sale_price=? WHERE mer_id=?`,
            [sanitizedCategory, sanitizedName, sanitizedPrice, sanitizedStock, sanitizedBrand, sanitizedSupplier, image, sanitizedSaleYn, sanitizedSalePrice, post.mer_id],
            (error, result) => {
                res.writeHead(302, { Location: `/merchandise/view/u` });
                res.end();
            }

        )



    },
    delete_process: (req, res) => {
        id = req.params.merId;
        db.query("DELETE FROM merchandise WHERE mer_id = ?", [id], (error, result) => {
            if (error) {
                throw error;
            }
            res.writeHead(302, { Location: `/merchandise/view/u` });
            res.end();
        });

    }
}   
