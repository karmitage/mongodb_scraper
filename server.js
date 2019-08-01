var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

//scraping 
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Require handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//use the Heroku monogo db connection if available; otherwise use local connection

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


// render handlebars pages
app.get("/", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({ "saved": false })
        .then(function (data) {
            var hbsObject = {
                article: data
            };
            console.log(hbsObject);
            res.render("index", hbsObject);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


// A GET route for scraping the NYT website
app.get("/scrape", function (req, res) {
    // get html body
    axios.get("https://www.newyorktimes.com").then(function (response) {

        // load into cheerio and save
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $("article").each(function (i, element) {
            // Save an empty result object
            var result = {};

            var summary = ""
            if ($(this).find("ul").length) {
                summary = $(this).find("li").first().text();
            } else {
                summary = $(this).find("p").text();
            };

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).find("h2").text();
            result.summary = summary;
            result.link = "https://www.nytimes.com" + $(this).find("a").attr("href");


            // Create a new Article in the db using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });
    });

    //route to show saved articles


    app.get("/saved", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({ "saved": true }).populate("notes").exec(function (error, data) {
            var hbsObject = {
                article: data
            };
            console.log(hbsObject);
            res.render("articles", hbsObject);
        });
    });


    //update the articles "saved" boolean
    app.post("/articles/save/:id", function (req, res) {
        // Use the article id to find and update its saved boolean
        db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
            // Execute the above query
            .exec(function (err, doc) {
                // Log any errors
                if (err) {
                    console.log(err);
                }
                else {
                    // Or send the document to the browser
                    res.send(doc);
                }
            });
    });

});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});