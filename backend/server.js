//imports

import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//set up app

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

//replace array with database

const users = [];

//secret key for jwt
const secretKey = process.env.secretKey;

//middleware to check if the REQUEST has a valid JWT TOKEN  

const authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization")
    if(!token){
        return res.status(401).send("Access Denied")
    }

    jwt.verify(token, secretKey, (err, user) => {
        if(err){
            return res.status(403).send("Invalid Token")
        }

        req.user = user;
        next();
    })
}

//register endpoint

app.post("/register", async (req, res) => {
    try{
        const {username, email, password} = req.body;

        //check if user already exists
        if(users.find( (user) => user.email === email )){
            return res.status(400).send("User already exists")
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //store user in memory(replace with database storage in production)
        const user = {username, email, password: hashedPassword};
        users.push(user);

        res.status(201).send("Registration Successful")
    }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error")
    }
})

//login endpoint

app.post("/login", async (req, res) =>{
    try{
        const {email, password} = req.body;

        //find the user in the database
        const user = users.find( (user) => email === user.email);

        if(!user){
            return res.status(401).send("Invalid email or password")
        }

        //compared the hashed password with the password in the database

        if(await bcrypt.compare(password, user.password)){
            //generate and send a JWT token
            const token = jwt.sign({email: user.email}, secretKey);
            res.json({token})
        }else{
            res.status(401).send("Invalid email or password")
        }
    }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error")
    }
})

//protected endpoint
app.get("/dashboard", authenticateJWT, (req,res) => {
    res.send("Welcome to the dashboard, " + req.user.username + "!")
})

app.listen(PORT, () =>{
    console.log("Server is runnning on port " + PORT + ".")
})