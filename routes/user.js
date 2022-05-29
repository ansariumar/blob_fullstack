const express = require('express');
const router = express.Router();
const Article = require('./../models/articlesM.js')


router.get('/home', async (req, res) => {

	const Allarticles = await Article.find()
		.sort({date: 'desc'});

	res.render('user/homePage.ejs', {articles: Allarticles});
})


router.get('/:slug', async (req, res) => {
	
	const article = await Article.findOne({slug: req.params.slug});
	
	if (!article) {res.status(404).redirect('/home')}

	res.render('user/Ghostwind-master/post.ejs', {blog: article})
})

module.exports = router;