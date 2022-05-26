const express = require('express');
const router = express.Router();
const Article = require('./../models/articlesM.js')


router.get('/home', async (req, res) => {

	const Allarticles = await Article.find()
		.sort({date: 'desc'});

	res.render('user/homePage.ejs', {articles: Allarticles});
})



module.exports = router;