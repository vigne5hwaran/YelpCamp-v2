var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true});

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campgrounds", campgroundSchema);

// Campground.create(
//     {
//     name: "Hills Granite",
//     image: "https://www.keralatourism.org/images/destination/large/devikulam_hills_in_munnar20131031103731_132_1.jpg",
//     description: "This is a small granite hill, it has bathrooms, it has water & beautifull granite!"
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         } else {
//             console.log(campground);
//         }
// });



app.get("/", function(req, res){
    res.render("home");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
    // GET ALL CAMPGROUNDS FROM DB
    Campground.find({}, function(err, camp){
        if(err){
            console.log(err)
        } else {
            res.render("campgrounds", {camp: camp});
        }
    });
});

// CREATE - add new campground to DB
app.post("/campgrounds", function(req, res){
    // get campgrounds from form and add that in to the array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampgrounds = {name: name, image: image, description: description};
    
    // Create a new campground and save it to the DB
        Campground.create(newCampgrounds, function(err, newlyCreated){
            if(err) {
                console.log(err);
            } else {
                res.redirect("campgrounds");
            }
        });
    
    // redirect to the campgrounds page
    
});

//NEW - show form to create new campgrounds
app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

// SHOW - shows more info about the campgrounds
app.get("/campgrounds/:id", function(req, res) {
    //find the campground with provided id
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render("show", {camping:foundCamp});
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started!");
});