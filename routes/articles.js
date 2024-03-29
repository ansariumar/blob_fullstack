 //@ts-nocheck

// this is the localhost3000://articles

const express = require('express');
const router = express.Router();
const {Article} = require('./../models/articlesM.js')

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

//on clicking the submit button, a ajax POST from frontend will be sent to this route
//we will make a slug out of the title,  check it the slug exist 
//if slug exist change the slug, 
//if slug is unique, save the article in the database and then redirect
router.post('/', async (req, res, next) => {
	req.article = new Article();
	next();
  }, saveArticleAndRedirect('new'))




router.put('/:id', async (req, res, next) => {
	console.log("put was called")
	req.article = await Article.findById(req.params.id);
	next(); 	
}, saveArticleAndRedirect('edit'))	

router.delete('/:id', async (req,res) => {
	const deleted_blog = await Article.findByIdAndDelete(req.params.id);
	console.log(`The Article with title"${deleted_blog.title}" was deleted`); 
	res.json({ message: 'Deleted successfully' });
})

 function saveArticleAndRedirect(path) {
	return async (req, res) => {
		let article = req.article;

		article.title = req.body.title;
		article.description = req.body.description;
		article.markdown = req.body.markdown;
		console.log(article);
		try {
			article = await article.save().catch((err) => console.log(err));	//the try didn't work and would always was sent tp the catch block the error was in the "article.save()" some speling mistake or you forgot either async or await
			res.json({location:`/articles/${article.slug}`})
		} catch (e) {
			res.render(`articles/${path}`, {article: article});
		}
	}
}


module.exports = router;