const mongoose = require ("mongoose");

const listingSchema = new mongoose.Schema({
    title :{
        type : String,
        required :true,
    },
    description:{
        type : String,
        required :true,
    },
    image:{
        type : String,
        default: "https://unsplash.com/photos/photography-of-brown-high-rise-building-beside-seashore-during-daytime-b8kEUZqMNoQ",
        set: (v)=>  v=== "" ? "https://unsplash.com/photos/photography-of-brown-high-rise-building-beside-seashore-during-daytime-b8kEUZqMNoQ" 
        : v,
    },
    price:{
        type : Number,
        required :true,
    },
    location:String,
    country:String,
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
