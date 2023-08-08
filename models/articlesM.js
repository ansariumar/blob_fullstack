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
        type: String,
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
//If the mongoose.model is above this function, i.e if the model is compiled first, the "pre" as well as "post" function wont run
articleSchema.pre('validate', async function(next) {

    if (this.title) {
        this.slug = await createSlug(this.title)
    }
    if (this.markdown) {
        markdownHTML = marked.parse(this.markdown); //converts what we write in the Markdown into HTML code		
        this.sanitizedHTML = dompurify.sanitize(markdownHTML); // Gets rid of the malacious HTML(security purpose) 
    }

    next();
})


async function createSlug(title) {

	const slug = makeSlug(title)

    let uniqueSlug = slug;
    let counter = 1;
    while (true) {
        const existingRecord = await ArticleModel.findOne({ slug: uniqueSlug });
        if (!existingRecord) break;

        uniqueSlug = `${slug}-${counter}`; // Modify the slug to make it unique
        counter++;
    }
    console.log("uniqueSlug" + uniqueSlug)
    return uniqueSlug;
}

function makeSlug(title) {
    return slugify(title, { lower: true, strict: true })
}


var ArticleModel = mongoose.model('Article', articleSchema);

const Article = ArticleModel;
module.exports = { Article }