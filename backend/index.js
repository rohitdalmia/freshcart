const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()
const Stripe = require("stripe")

const app = express()
app.use(cors({
    origin: "*"
  }));
app.use(express.json({limit : "10mb"}))

const PORT = process.env.PORT || 8080
//mongodb connection
mongoose.set('strictQuery',false);
mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log("Connect to Database"))
.catch((err)=>console.log(err))

//schema
const userSchema = mongoose.Schema({
    
    firstName : String,
    lastName : String,
    email : {
        type: String,
        unique : true,
    },
    password : String,
    confirmPassword : String,
    image : String,

})

// 
const userModel = mongoose.model("user" ,userSchema)



// API 
app.get("/",(req,res)=>{
    res.send("Server is running")
})

//Sign Up
app.post("/signup",async(req,res)=>{
    //console.log(req.body)
    const {email} = req.body
    
    try {
        const result = await userModel.findOne({email : email});
        //console.log(result);
        if(result) {
            res.send({message : "Email id is already registered", alert: false})
        }
        else{
            const data = userModel(req.body)
            const save = data.save()
            res.send({message : "Signed up successfully", alert: true })
        }
    } 
    catch(error){
        console.log(error);
    }
})

//Login
app.post("/login",async(req,res)=>{
    //console.log(req.body)
    const {email} = req.body
    try {
        const result = await userModel.findOne({email : email});
        if(result) {
            const dataSend = {
                _id: result._id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                image: result.image,
            };
            console.log(dataSend)
            res.send({message : "Logged in successfully", alert: true, data : dataSend})
        }
        else{
            res.send({message : "Email is not registered, please sign up", alert: false})

        }
    } 
    catch(error){
        console.log(error);
    }
})


// product section

const schemaProduct = mongoose.Schema ({
    name : String,
    category : String,
    image : String,
    price : String,
    description : String,

});
const productModel = mongoose.model("product",schemaProduct)



// save product in data
//api
app.post("/uploadProduct" ,async(req , res)=>{
    //console.log(req.body)
    const data = await productModel(req.body)
    const datasave = await data.save()
    res.send({message : "uploaded successfully"})
})

//
app.get("/product",async(req,res)=>{
    const data = await productModel.find({})
    res.send(JSON.stringify(data))
})

/* Payment Gateway */
//console.log(process.env.STRIPE_SECRET_KEY)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

app.post("/checkout-payment",async(req,res)=>{

    try{
        const params = {
            submit_type : 'pay',
            mode : "payment",
            payment_method_types : ['card'],
            billing_address_collection : "auto",
            shipping_options : [{shipping_rate : "shr_1NV6z3SBh2kHkjK2FQBebSk6"}],

            line_items : req.body.map((item)=>{
                return{
                    price_data : {
                        currency : "inr",
                        product_data : {
                            name : item.name,
                            //images : [item.image]
                        },
                        unit_amount : item.price * 100,
                    },
                    adjustable_quantity : {
                        enabled : true,
                        minimum : 1,
                    },
                    quantity : item.qty 
                }
            }),
            success_url : `${process.env.FRONTEND_URL}/success`,
            cancel_url : `${process.env.FRONTEND_URL}/cancel`,
        }
    
        
        const session = await stripe.checkout.sessions.create(params)
        res.status(200).json(session.id)
    }
    catch(err){
        res.status(err.statusCode || 500).json(err.message)
    }
})

//Server is Running
app.listen(PORT,()=>console.log("server is running at port : " + PORT))