var express = require('express');
var router = express.Router();

/* GET members page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Members' });
});

function ensureAuthenticated(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
}
module.exports = router;
