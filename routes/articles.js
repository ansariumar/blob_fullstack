 //@ts-nocheck

// this is the localhost3000://articles

const express = require('express');
const router = express.Router();
const Article = require('./../models/articlesM.js')

router.get('/new',  async (req, res) => {
	res.render('articles/new.ejs', { article: new Article() }) 	
})

router.get('/edit/:id',async (req,res) => {
	const article = await  Article.findById(req.params.id);

	try {
	res.render('articles/edit', { article: article })
	} catch (error) {
		console.log(error);
	}
})

router.get('/:slug', async (req,res) => {

	const article = await Article.findOne({slug: req.params.slug});

	if (!article) res.redirect('/');
	
	res.render('articles/show', {article: article});
	
})

// The request that comes is the Article object that have a {title, description,markdown}
router.post('/', async (req,res) => {

	let newArticle = new Article({				
		title: req.body.title,
		description: req.body.description,
		markdown: req.body.markdown
	})
		
	try{
		newArticle = await newArticle.save().catch((err) => console.log(err));	
		console.log(newArticle);
		res.redirect(`/articles/${newArticle.slug}`);
	}catch(e){
		console.log('lol1')
	  	res.render('articles/new', {article: newArticle})	//When there is an error
	}

})

router.delete('/:id', async (req,res) => {
	const deleted_blog = await Article.findByIdAndDelete(req.params.id);
	console.log(`The Article with title"${deleted_blog.title}" was deleted`); 
	res.redirect('/');
})

module.exports = router;