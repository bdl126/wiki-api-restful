//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB")

const wikiSchema = mongoose.Schema({
    title: String,
    content: String
})

const article = mongoose.model("article", wikiSchema)




app.route("/articles")
    .get((req, res) => {
        article.find({}, function(err, articles) {
            if (!err) {
                res.send(articles)
                console.log("Found them");
            } else {
                res.send(err);
            }
        })
    })
    .post((req, res) => {
        const newArticle = new article ({
            title: req.body.title,
            content: req.body.content
        })
        newArticle.save(function(err){
            if(!err){
                res.send("Successfully added new article")
            } else {
                res.send(err)
            }
        })


    })
    .delete((req, res) => {
        article.deleteMany({}, function(err) {
            if(!err) {
                res.send("Successfully deleted everything")
            } else{
                res.send(err)
            }
        })

    })


app.route("/articles/:article")
    .get((req, res) => {
        const requested_article = req.params.article
        article.findOne({title:requested_article}, function(err, foundArticle) {
            if (!err) {
                if(foundArticle != null) {
                    res.send(foundArticle)
                    console.log(foundArticle);
                    console.log("Found them");
                } else {
                    res.send("Couldn't find the article :(.");
                }
            } else {
                res.send(err);
            }
        })
    })
    .put((req,res) => {
        article.updateOne(
            {title: req.params.article},
            {title: req.body.title, content: req.body.content},
            {writeConcern: true},
            (err) => {
                res.send("Successfully put article")
            }
            )
    })
    .patch((req,res) => {
        article.updateOne(
            {title: req.params.article},
            {$set: req.body},
            (err) => {
                if(!err){
                    res.send("Successfully patch article")
                }
            }
        )
    })
    .delete((req, res) => {
        article.deleteOne({title: req.params.article}, function(err) {
            if(!err) {
                res.send("Successfully deleted the article")
            } else{
                res.send(err)
            }
        })

    })

app.listen(3000, function() {
  console.log("Server started on port 3000");
});