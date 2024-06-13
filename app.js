const express = require("express")
const mongoose = require("mongoose")
const cors =require("cors")
const bcrypt = require("bcryptjs")



const{registermodel} =require("./models/register")


const app = express()
app.use(cors())
app.use (express.json())


mongoose.connect("mongodb+srv://snehaip:sneha2020@cluster0.swl0hmq.mongodb.net/ksrtcdb?retryWrites=true&w=majority&appName=Cluster0")



//password crypting
const generatedHashedPassword = async  (password)=>{
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}

app.post("/signup", async(req,res)=>{
    let input = req.body
    let hashedPassword= await generatedHashedPassword(input.password)
    console.log(hashedPassword)
    input.password= hashedPassword
    let register= new registermodel(input)
    register.save()
    res.send({"status":"success"})
    })


    app.listen(8080,()=>{
        console.log("server started")
    })