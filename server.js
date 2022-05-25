const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const articleRouter = require('./routes/articles.js');
const Articles = require('./models/articlesM');


const app = express();

app.set('view engine', 'ejs');

// Won't be able to submit forms without this below line
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));             //if tis line moves below, the delete button won't work
app.use('/articles', articleRouter);

mongoose.connect('mongodb://localhost/Blog')
    .then(() => console.log("Connected to Mongodb server..."))
    .catch((err) => console.log(err));

app.get('/', async (req, res) => {

    const DBarticles = await Articles.find()
        .sort({date: 'desc'});                   //Most recent article first                  

    // It by default checks the "views" folder i.e it actually is "views/articles/index"
    res.render("articles/index", {articles: DBarticles})          //The Homepage
})

const port = process.env.PORT || 3000;

app.listen(port, () =>  {
    console.log(`Listening to port ${port}`);
});