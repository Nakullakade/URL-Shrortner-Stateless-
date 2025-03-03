const express=require("express");
const app=express();
const path= require("path");
const cookieParser=require("cookie-parser");
const {restrictToLoggedinUserOnly,checkAuth}=require("./middleware/auth_mid.js");
const URL=require("./models/url.js");
const PORT=8001;

//mongo connection
const {connectMongoDB}=require("./connect.js");
connectMongoDB("mongodb://localhost:27017/short-url")
.then(()=>console.log("mongo connected!"));

//collect the routes
const URLroute=require("./routes/url_router.js");
const staticRoute=require("./routes/staticRouter.js");
const userRoute=require("./routes/user_routes.js");

//for server side rendering (user interface) used embedded javascript
app.set("view engine","ejs");
app.set("views",path.resolve("./view"));

//to parse the json data
app.use(express.json());
//to parse the form data(html)
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());


//register routes
app.use("/url",restrictToLoggedinUserOnly,URLroute);
app.use("/",checkAuth,staticRoute);
app.use("/user",userRoute);


app.get("/url/:shortId",async (req,res)=>{
    const shortId=req.params.shortId;
 const entry= await URL.findOneAndUpdate(
    {
        shortId,
    },{
        $push:{
            visitHistory:{
                timestamp:Date.now(),
            },
        },
    }
 );
 var xl=entry.redirectURL;
 res.redirect(xl);
});

app.listen(PORT,()=>console.log(`Server Started at PORT: ${PORT}`));