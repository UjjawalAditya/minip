const mongoose = require('mongoose');
const product=require('./models/product');

mongoose.connect('mongodb://127.0.0.1:27017/shopApp', { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log("connected !!!")
}).catch((e)=>{
    console.log(e)
})
// const p=new product({
//     name:'grapes',
//     price:200,
//     category:'fruit'
// });
const p=
    [
    {
        name:"orange",
        price:100,
        category:"fruit"
    },
    {
        name:"mangoes",
        price:500,
        category:"fruit"
    },
    {
        name:"culiflower",
        price:100,
        category:"vegetable"
    },
    {
        name:"white milk",
        price:100,
        category:"dairy"
    }
]

    

product.insertMany(p);
