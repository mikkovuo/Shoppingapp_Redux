const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const apiRoutes = require("./routes/apiroutes");
const mongoose = require("mongoose");
const UserModel = require("./models/user");
const SessionModel = require("./models/session");

let app = express();

//User DB
mongoose.connect("mongodb://localhost/shoppingapp").then(
    () => console.log("Connected to MongoDB!"),
    (error) => console.log("Failed to connect to MongoDB. Reason: "+error)
);



const ttl = 1000*60*60;

//Middlewares

app.use(bodyParser.json());

tokenizer = () => {
    let token = "";
    letters = "qwertyuiopasdfghjklzxcvbnm0123456789QWERTYUIOPASDFGHJKLZXCVBNM";
    for(let ii = 0; ii < 256; ii++){
        let temp = Math.floor(Math.random()*letters.length);
        token = token +letters[temp];
    }
    return token;

}

isUserLogged = (req,res,next) => {
    let token = req.headers.token;
    if(!token){
        return res.status(403).json({message:"forbidden"})
    }

    SessionModel.findOne({"token":token},function(err,session) {
        if(err){
            return res.status(403).json({message:"forbidden"})
        }
    
        if(!session){
            return res.status(403).json({message:"forbidden"})
        }
        let now = Date.now();
        if(now > session.ttl){
            SessionModel.deleteOne({"_id":session._id},function(err) {
                if(err) {
                    console.log("Failed to remove session: "+err)
                }
                return res.status(403).json({message:"forbidden"})
            })
        }
        req.session = {};
        req.session.user = session.user;
        session.ttl = now+ttl;
        session.save(function(err) {
            return next();
        })
    
    })
}

//LOGIN API

app.post("/register",function(req,res){
    if(!req.body){
        return res.status(422).json({message:"Please provide proper credentials"});
    }
    if(!req.body.username || !req.body.password){
        return res.status(422).json({message:"Please provide proper credentials"});
    }
    if(req.body.password.length < 8 || req.body.username.length < 4){
        return res.status(422).json({message:"Please provide proper credentials"});
    }

    bcrypt.hash(req.body.password,14,function(err,hash){
        if(err){
            return res.status(422).json({message:"Please provide proper credentials"});
        }
        let user = new UserModel({
            username: req.body.username,
            password: hash
        })

        user.save(function(err,user){
            if(err){
                console.log("Regiser failed. Error: "+err);
                return res.status(409).json({message:"Username already in use"})
            }else {
                console.log('Register success. Username:'+user.username);
                return res.status(200).json({message:"Register success!"})
            }
        })
    })
})

app.post("/login",function(req,res) {
    if(!req.body){
        return res.status(422).json({message:"Please provide proper credentials"});
    }
    if(!req.body.username || !req.body.password){
        return res.status(422).json({message:"Please provide proper credentials"});
    }
    if(req.body.password.length < 8 || req.body.username.length < 4){
        return res.status(422).json({message:"Please provide proper credentials"});
    }

    let user = {
        username: req.body.username,
        password: req.body.password
    }

    UserModel.findOne({"username":req.body.username},function (err,user){
        if(err){
            console.log("Error in finding user: " +err);
            return res.status(403).json({message:"username or password incorrect"});
        }
        if(!user){
            return res.status(403).json({message:"username or password incorrect"});
        }
        bcrypt.compare(req.body.password,user.password, function(err,success){
            if(err){
                return res.status(403).json({message:"username or password incorrect"});
            }
            if(!success){
                return res.status(403).json({message:"username or password incorrect"});
            }
            let token = tokenizer();
            let temp = Date.now();
            let session = new SessionModel({
                user: user.username,
                token:token,
                ttl: temp+ttl
            })
            session.save(function(err,session){
                if(err){
                    return res.status(403).json({message:"username or password incorrect"});
                }
                if(!session){
                    return res.status(403).json({message:"username or password incorrect"});
                }
                return res.status(200).json({token:token})
            })
        })
    })
})

app.post("/logout",function(req,res) {
	let token = req.headers.token;
	if(!token) {
		return res.status(404).json({message:"not found"})
    }
    SessionModel.findOne({"token":token},function(err,session){
        if(err){
            console.log("Error in finding session: " +err);
            return res.status(403).json({message:"Not found."});
        }
        if(!session){
            console.log("Session doesn't exist.");
            return res.status(403).json({message:"Not found."});
        }
        SessionModel.deleteOne({"_id":session._id},function(err){
            if(err){
                console.log("Failed to remove session.");
            }
            return res.status(200).json({message:"Success!"})
        })
    })
})


app.use("/api",isUserLogged,apiRoutes);

app.listen(3001);

console.log('Running at port 3001');