const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const methodOverride = require('method-override');
const articleRouter = require('./routes/articles.js');
const userRouter = require('./routes/user.js');
const {Article} = require('./models/articlesM');


const app = express();

app.set('view engine', 'ejs');

// Won't be able to submit forms without this below line
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));             //if tis line moves below, the delete button won't work
app.use(express.json())
app.use('/public', express.static(__dirname + '/public'));
app.use('/articles', articleRouter);
app.use('/blog', userRouter);

// 'mongodb://localhost:27017/playground'
// process.env.MONGO_URI
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to Mongodb server..."))
    .catch((err) => console.log("Error made lolol" + err));


app.get('/', async (req, res) => {

    const DBarticles = await Article.find()
        .sort({date: 'desc'});                   //Most recent article first                  

    // It by default checks the "views" folder i.e it actually is "views/articles/index"
    res.render("articles/index", {articles: DBarticles})          //The Homepage
})


const port = process.env.PORT || 3000;

app.listen(port, () =>  {
    console.log(`Listening to port ${port} \n http://localhost:3000/`);
});
