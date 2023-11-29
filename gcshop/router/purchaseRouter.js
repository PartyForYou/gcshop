// 201935222 김민석
var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router()

var purchase = require('../lib/purchase');

router.get('/view/:vu', (req, res) => {
    purchase.home(req, res);
})
router.get('/detail/:merId', (req, res) => {
    purchase.detail(req, res);
})
router.post('/detail_create', (req, res) => {
    purchase.detail_create(req, res);
})
router.get('/delete/:purchase_id',(req,res)=>{
    purchase.delete_process(req,res);
})
router.post('/cart_process', (req, res) => {
    purchase.cart_process(req, res);
})
router.get('/cart/view/:vu', (req, res) => {
    purchase.cart(req, res);
})
router.post('/purchase_input', (req, res) => {
    purchase.purchase_input_process(req, res);
})

router.post('/search', (req, res) => {
    purchase.search(req, res);
})
router.post('/cart/search', (req, res) => {
    purchase.cSearch(req, res);
})

router.get('/purchase/create', (req, res) => {
    purchase.purchasecreate(req, res);
})
router.post('/purchase/create_process', (req, res) => {
    purchase.purchasecreate_process(req, res);
})
router.get('/purchase/update/:purchaseId', (req, res) => {
    purchase.purchaseupdate(req, res);
})
router.post('/purchase/update_process', (req, res) => {
    purchase.purchaseupdate_process(req, res);
})
router.get('/purchase/delete/:purchaseId', (req, res) => {
    purchase.purchasedelete_process(req, res);
})

router.get('/cart/create', (req, res) => {
    purchase.cartcreate(req, res);
})
router.post('/cart/create_process', (req, res) => {
    purchase.cartcreate_process(req, res);
})
router.get('/cart/update/:cartId', (req, res) => {
    purchase.cartupdate(req, res);
})
router.post('/cart/update_process', (req, res) => {
    purchase.cartupdate_process(req, res);
})
router.get('/cart/delete/:cartId', (req, res) => {
    purchase.cartdelete_process(req, res);
})


module.exports = router;

