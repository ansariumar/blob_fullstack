const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	markdown: {
		type:String,
		return: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	slug: {
		type: String,
		required: true,
		unique: true
	},
	sanitizedHTML: {
		type: String,
		required: true
	}
})

// this will be called before 'articleSchema' and it will fill the 'slug' in the Schema, then the next() will call the articleSchema
// here "this" refers to articleSchema
articleSchema.pre('validate', function(next) {
	if(this.title) {
		// this.slug = slugify(this.title, {lower: true, strict: true})
		this.slug = createSlug(this.title)
		console.log(this.slug)
	}

	if(this.markdown) {
		markdownHTML = marked.parse(this.markdown); 		//converts what we write in the Markdown into HTML code		
		this.sanitizedHTML = dompurify.sanitize(markdownHTML);	// Gets rid of the malacious HTML(security purpose) 
	}

	next();
})

function createSlug(title) {
	return slugify(title, {lower: true, strict: true})
}

const Article = mongoose.model('Article', articleSchema);
module.exports = { Article, createSlug }