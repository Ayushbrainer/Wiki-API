const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.set('view engine',ejs);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB',{useNewUrlParser: true,useUnifiedTopology: true});

const articleSchema = {
  title:String,
  content:String
};

const Article = mongoose.model('article',articleSchema);

app.route("/articles")

.get(function(req,res) {
  Article.find(function(err,articles){
      // var i=1;
    // articles.forEach(function(article){
    //   console.log(i+". " + article.title);
    //   i++;
    // })
    res.send(articles);
  })
})

.post(function(req,res){
  const title = req.body.title;
  const content = req.body.content;
  const newArticle = Article({
    title:title,
    content:content
  });
  newArticle.save().then(()=>console.log("Done"));
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      console.log("Succesfully Deleted All Docs");
      res.send('Succesfully Deleted All Docs');
    }else{
      console.log(err);
      res.send(err);
    }
  })
});


app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.find({title:req.params.articleTitle},function(err,foundArticle){
    if(!err){
      res.send(foundArticle);
    }else{
      res.send(err);
    }
  });
})


.put(function(req,res){
  Article.updateOne({title:req.params.articleTitle},{title:req.body.title,content:req.body.content},function(err){
    if(!err){
      res.send("Article Updated");
    }else{
      res.send(err);
    }
  })
})

.patch(function(req,res){
  Article.updateOne({title:req.params.articleTitle},{$set:req.body},function (err) {
    if(!err){
      res.send("Article Patched Succesfully");
    }else{
      console.log(err);
    }
  });
})


.delete(function (req,res) {
  Article.deleteOne({title:req.params.articleTitle},function (err) {
    if(!err){
      res.send("Article Deleted Succesfully");
    }else{
      console.log(err);
    }
  })
});



app.listen(3000,()=>console.log("Started Server"));
