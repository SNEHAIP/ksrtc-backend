const express = require("express")
const mongoose = require("mongoose")
const cors =require("cors")
const bcrypt = require("bcryptjs")
const jsonwebtoken =require("jsonwebtoken")



const{registermodel} =require("./models/register")
const{busmodel} =require("./models/bus")



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

    app.post("/signin",(req,res)=>{
        let input =req.body
        registermodel.find({"email":req.body.email}).then(
            (response)=>{
                if (response.length>0) {
                    let dbpassword=response[0].password
                    console.log(dbpassword)
                    bcrypt.compare(input.password,dbpassword,(error,isMatch)=>{
                     if (isMatch) {

                        jsonwebtoken.sign({email:input.email},"register-app",{expiresIn:"1d"},(error,token)=>{
                            if (error) {
                                res.json({"status":"unable"})
                                
                            } else {
                                res.json({"status":"success","userid" : response[0]._id,"token":token})
                                
                            }
                        })
                    
                } else {
                    res.json({"status":"incorrect"})
                    
                }
            })
        }
                }
        ).catch()
    })

 

    app.post("/view",(req,res)=>{
        let token=req.headers["token"]
        jsonwebtoken.verify(token,"register-app",(error,decoded)=>{
        if (error) {
            res.json ({"status":"unauthorised access"})
            
        } else {
            if(decoded)
                {
                    registermodel.find().then(
                        (response)=>{
                            res.json(response)
                        }
                    ).catch()
                }
            
        }
    })
    })



    app.post("/add",(req,res)=>{
        let input =req.body
        let ksrtc = new busmodel(input)
        ksrtc.save()
        res.json({"status":"success"})
    })

app.post("/viewbus",(req,res)=>{
    busmodel.find().then(
        (data)=>{
            res.json(data)
        }
    ).catch(
        (error)=>{
            res.json(error)
        }
    )
})



app.post("/search",(req,res)=>{
    let input = req.body
    busmodel.find(input).then(
        (data)=>{
            res.json(data)
        }
    ).catch(
        (error)=>{
            res.json(error)
        }
    ).finally()
})





app.post("/delete",(req,res)=>{
    let input =req.body
    busmodel.findByIdAndDelete(input._id).then(
        (response)=>{
            res.json({"status":"success"})
        }
    ).catch(
        (error)=>{
            res.json({error})
        }
    )

    
})







    app.listen(8080,()=>{
        console.log("server started")
    })