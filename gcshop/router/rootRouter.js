// 201935222 김민석
var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router()

var shop = require('../lib/shop');


router.get('/:category',(req, res)=>{

    shop.home(req, res);
}); 
router.get('/detail/:merId', (req, res) => {
    shop.detail(req, res);
})
router.post('/search', (req, res) => {
    shop.search(req, res);
})
router.get('/anal/customer', (req, res) => {
    shop.customeranal(req, res);
})
router.get('/anal/merchandise', (req, res) => {
    shop.merchandiseanal(req, res);
})

module.exports = router;

