const express = require ("express");
const app = express();
const mongoose = require ("mongoose");
const path = require ("path");

const Listing = require ("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilis/expressError.js");
const wrapAsync = require("./utilis/wrapAsync.js");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main().then((res)=>{
    console.log("Database connected");
} )
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


let port = 8080;
app.listen(port,()=>{
    console.log(`App is listening at port ${port}` );
})
app.get("/",(req,res) =>{
    res.send("Connection successful");
})
// ALL LISTINGS SHOW
app.get("/listings", wrapAsync( async (req,res) =>{
     const allListings = await Listing.find({});
     res.render("listings/index.ejs",{allListings});
}));
//ADD LISTING
app.get("/listings/new",(req,res) =>{
    res.render("listings/addNew.ejs");
});

app.post("/listings",(req,res) =>{
    if(!req.body){
        throw new ExpressError(400,"Bad request");
    }
    const newListing = new Listing(req.body.listing);
    newListing.save();
    res.redirect("/listings");
    
});

//SHOW INDIVISUAL INFO
app.get("/listings/:id", wrapAsync( async (req,res) =>{

    let {id} = req.params;
    const info = await Listing.findById(id);
    if(!info){
        throw new ExpressError(500,"Chat not found");
    }
    res.render("listings/show.ejs",{info});
    

} ));

//EDIT LISTING
app.get("/listings/:id/edit", wrapAsync( async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  }));

//UPDATE LISTINGS
app.put("/listings/:id", wrapAsync( async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  }));

//Delete Route
app.delete("/listings/:id", wrapAsync( async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }));
  

app.use((err,req,res,next) =>{
    let {status=500,message = "some error "} = err;
    res.status(status).send(message);
})