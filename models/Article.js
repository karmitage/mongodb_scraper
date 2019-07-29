var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Create a new UserSchema object
var ArticleSchema = new Schema({
    // `title` is required and of type String
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String
    },
    // `link` is required and of type String
    link: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    // `notes` is an object that stores a note id
    // The ref property links the ObjectId to the Note model
    // This allows us to populate the Article with associated notes
    notes: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
