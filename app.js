var express = require("express"),
    mongoose = require("mongoose"),
    bodyparser = require("body-parser"),
    methodOverride = require("method-override");


var app = express();

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//setup to data
mongoose.connect("mongodb://localhost/restful_blog_app");

//schema setup
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:{type: Date, default: Date.now()}
});
//setup variable to accesst to the database
var blogDataBase = mongoose.model("Blog", blogSchema);

//setup index route
app.get("", function(req, res){
    blogDataBase.find(function(err,blog){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{blogs:blog});
        }
    });
});

app.get("/blogs", function(req, res){
    blogDataBase.find(function(err,blog){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{blogs:blog});
        }
    });
});
//setup show route
app.get("/blogs/show/:id",function(req,res){
    blogDataBase.findById(req.params.id,function(err,blog){
        if(err){
            res.send("Something is not right!");
        }
        else{
            res.render("show",{blog:blog});
        }
    });
});
//blogs/new route setting up
app.get("/blogs/new", function(req, res) {
    res.render("new");
});
//blog route post request
app.post("/blogs", function(req, res){
   blogDataBase.create(req.body.blog, function(err, newBlog){
       if(err){
           console.log(err);
       }
       else{
           res.redirect("/blogs");
       }
   });
});

//setup edit GET route
app.get("/blogs/edit/:id", function(req, res){
    blogDataBase.findById(req.params.id,function(err, foundBlog){
        if(err){
            console.log(err);
        }
        else{
            res.render("edit",{blog:foundBlog});
        }
    });
    
});
//setup edit POST route
app.post("/blogs/:id",function(req, res){
    blogDataBase.findByIdAndUpdate(req.params.id,req.body.blog,function(err, blog){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/blogs");
        }
    });
});
//creating deleting route
app.delete("/blogs/:id", function(req, res){
    blogDataBase.findByIdAndRemove(req.params.id,function(err,blog){
        if(err){
            console.log(err);
        }
        else{
            console.log(blog.title + " have been delted");
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is ready now!");
});
 
