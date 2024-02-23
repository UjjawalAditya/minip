const express=require("express");
const mongoose = require('mongoose');
const methodOverride=require('method-override')
const app=express();
const path=require("path");
const Product=require('./models/product');
const Farm=require("./models/farm")
const AppError=require("./apperror")
const ObjectID = require('mongoose').Types.ObjectId;

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

mongoose.connect('mongodb://127.0.0.1:27017/shopApp', { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log("connected !!!")
}).catch((e)=>{
    console.log(e)
})

//farm routes
app.get("/farms",async(req,res)=>{
    const farms= await Farm.find({});
    res.render("farm",{farms})
})
app.get("/farms/new",(req,res)=>{
    res.render("newfarm")
})
app.get("/farms/:id",async(req,res)=>{
    const farm= await Farm.findById(req.params.id).populate('products')
    console.log(farm);
    res.render("showfarm",{farm});

})
app.get("/farms/:id/products/new",(req,res)=>{
    const id=req.params.id;
    res.render("new",{id})
})
app.post("/farms/:id/products",async (req,res)=>{
   const id=req.params.id;
   const f=await Farm.findById(id)
    
const p=new Product(req.body);




f.products.push(p);
p.farms=f;


console.log(p)
await f.save();
await p.save();
res.redirect(`/farms/${id}`)


 

  

})
app.post("/farms",async(req,res)=>{
    const farm= new Farm(req.body);
    await farm.save();
    res.redirect('/farms');
})








//products Routes
app.get("/products",async(req,res)=>{
    const products=await Product.find({})
  
   res.render('product',{products})
})
app.get("/products/new",(req,res)=>{
   
    res.render("new");
})
app.get("/products/:id", async (req, res, next) => {
    const { id } = req.params;
    try {
        if (!ObjectID.isValid(id)) {
            throw new AppError('Invalid Id', 400);
        }
        
        const products = await Product.findById(id);
        
        if (!products) {
            throw new AppError('Product Not Found', 404);
        }

        res.render('details', { products });
    } catch (err) {
        next(err); // Pass the error to the next middleware
    }
});

app.get("/products/:id/edit",async(req,res)=>{
    const {id}=req.params;
    const products= await Product.findById(id);
    res.render("edit",{products});
})
app.put("/products/:id",async(req,res)=>{
 
   const {id}=req.params;
   const fp= await Product.findByIdAndUpdate(id,req.body,{runValidators:true})
   res.redirect(`/products/${fp._id}`)

    
})

app.post("/products/new",async(req,res,next)=>{
    try{
        const np= new Product(req.body)
    await np.save();
    console.log(req.body)
    res.redirect("/products");

    } catch(e){
        next(e)
    }
   
    
})
app.delete("/products/:id", async(req,res)=>{
    const {id}=req.params;
    const deletedproduct= await Product.findByIdAndDelete(id)
    res.redirect("/products")
})
app.use((err,req,res,next)=>{
    const {status=500,message='product not found'}=err;
    res.status(status).send(message);
 })


app.listen(3000,()=>{
    console.log("listening at 3000");
})