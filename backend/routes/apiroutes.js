let express = require("express");
let mongoose = require("mongoose");
let ShoppingItem = require("../models/shoppingitem");
const { compareSync } = require("bcrypt");

let router = express.Router();

//Dummy DB

let database = [];
let id = 100;




//Shopping REST API

router.get('/shopping',function(req,res){
    let query = {"user":req.session.user};
    if(req.query.type){
        query = {
            "user":req.session.user,
            "type":req.query.type
        }
    }

    ShoppingItem.find(query,{"type":1,"count":1,"price":1}, function(err,items){
        if(err){
            return res.status(200).json([])
        }
        if(!items){
            return res.status(200).json([])
        }
        return res.status(200).json(items)
    })
});

router.post('/shopping',function(req,res){
    let item =new ShoppingItem( {
        user: req.session.user,
        type: req.body.type,
        count: req.body.count,
        price: req.body.price
    })
    item.save(function(err,item) {
        if(err){
            console.log("Error in saving shoppingitem: "+err)
            return res.status(409).json({message:"Not saved"})
        }
        if(!item){
            return res.status(409).json({message:"Not saved"})
        }
        return res.status(200).json({message:"success"})
    })

});

router.delete('/shopping/:id',function(req,res){
    let id = req.params.id;
    ShoppingItem.findById(id,function(err,item){
        if(err) {
            console.log("Error in removing shoppingitem: "+err)
            return res.status(404).json({message:"not found"})
        }
        if(!item) {
            return res.status(404).json({message:"not found"})
        }
        if(item.user === req.session.user) {
            ShoppingItem.deleteOne({"_id":item._id},function(err){
                if(err){
                    console.log('Failed to remove item: '+err)
                    return res.status(409).json({message:"conflict"})
                }
                return res.status(200).json({message:"success"})
            })
        } else {
            return res.status(409).json({message:"conflict"})
        }
    })
});

router.put('/shopping/:id',function(req,res){
    let id = req.params.id;
    ShoppingItem.findById(id,function(err,item){
        if(err) {
            console.log("Error in editing shoppingitem: "+err)
            return res.status(404).json({message:"not found"})
        }
        if(!item) {
            return res.status(404).json({message:"not found"})
        }
        if(item.user === req.session.user) {
            ShoppingItem.replaceOne({"_id":item._id},{
                user:   req.session.user,
                type:   req.body.type,
                count:  req.body.count,
                price:  req.body.price
            }, function(err){
                if(err){
                    console.log('Failed to edit item: '+err)
                    return res.status(409).json({message:"conflict"})
                }
                return res.status(200).json({message:"success"})
            })
        } else {
            return res.status(409).json({message:"conflict"})
        }
    })
    
});

module.exports = router;