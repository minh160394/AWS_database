var moose = require("mongoose"),
    express = require("express"),
    app = express(),
    bodyParser= require("body-parser"),
    request = require("request"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
moose.connect("mongodb://localhost/Dogtable");
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var dogSchema = new moose.Schema({
    name: String,
    image: String,
    sex: String,
    description: String,
    date: {type:Date, default: Date.now()}
});
var dogTable =  moose.model("TableofDog", dogSchema);
/*
dogTable.create(
    {
        name: "bulldog",
        image: "https://en.wikipedia.org/wiki/Bulldog#/media/File:CH_Buck_and_Sons_Evita_Peron.jpg",
        sex: "female",
        description: "Ddcascsacascsacascsacas"
        
    },
    function(err, dogtable){
        if(err){
            console.log(err);
        }else{
            console.log("New created dogtable: ");
            console.log(dogtable);
        }
    }); */
app.get("/", function(req,res){
    res.redirect("index");
});
app.get("/index", function(req,res){
    dogTable.find({},function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else{
            res.render("index", {blogs: blogs});
        }
    });
});
app.post("/index",function(req, res) {
     req.body.dogs.description = req.sanitize(req.body.dogs.description);
    dogTable.create(req.body.dogs, function(err, newdogs){
       if(err){
           res.render("/new")
       }else{
           res.redirect("/index");
       } 
    });
});
app.get("/index/:id" , function(req, res) {
    dogTable.findById(req.params.id, function(err, foundDog){
        if(err){
            res.redirect("/index")
        }else {
            res.render("display", {display: foundDog})
        }
    })
});
app.get("/new", function(req,res){
   res.render("new") ;
});
app.get("/index/:id/edit", function(req, res) {
    dogTable.findById(req.params.id, function(err, foundDogs){
        if(err){
            res.redirect("/index")
        }else {
            res.render("edit", {displays: foundDogs})
        }
    })
});
app.put("/index/:id", function(req, res){
    req.body.dogs.description = req.sanitize(req.body.dogs.description);
     dogTable.findByIdAndUpdate(req.params.id, req.body.dogs,function(err, upfoundDogs){
        if(err){
            res.redirect("/index")
        }else {
            res.redirect("/index/" + req.params.id);
        }
    })
});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Sever start !!!!");
});
app.delete("/index/:id", function(req, res){
     dogTable.findByIdAndRemove(req.params.id, function(err){
         if(err){
             res.redirect("/index");
         }else{
             res.redirect("/index");
         }
     })
});