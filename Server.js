const express=require('express')
const app=express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
var jquery=require("jquery")
var db;
var s;

MongoClient.connect('mongodb://localhost:27017/Footwear',(err,database)=>{
    if(err) return console.log(err)
    db=database.db('Footwear')
    app.listen(5000,()=>{
        console.log("listening at port number 5000")
    })
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))

//Stock details or Home Page
app.get('/',(req,res)=>{
    db.collection('ladies').find().toArray((err,result)=>{
        if(err) return console.log(err);
        res.render('stock_details.ejs',{stock: result})
    })
})

//add product page
app.get('/create',(req,res)=>{
        res.render('add.ejs')
})

//update stock page
/*app.get('/updatestock',(req,res)=>{
        res.render('update.ejs')
})*/  

//delete product page
app.get("/deleteproduct",(req,res)=>{
    db.collection("ladies").find({pid:req.query.pid}).toArray((err,result)=>{
        if(err) return console.log(err);
        res.render("delete.ejs",{data:result});
    });
    
}); 

//add new product to collection
app.post('/AddData',(req,res)=>{
    db.collection('ladies').save(req.body,(err,result)=>{
        if(err)
             return console.log(err)
        console.log('New Product Added');
        res.redirect('/')
    })  
})

//update the stock
/*app.put('/update/(:pid)',(req,res)=>{
    db.collection('ladies').find().toArray((err,result) => {
        if(err)
             return console.log(err)
        for(var i=0;i<result.length;i++){
            if(result[i].pid==req.body.id){
                s=result[i].stock
                break
            }
        }
        db.collection('ladies').findOneAndUpdate({pid:req.body.id} , {
            $set:{stock: req.body.stock}},{sort:{_id:-1}},
            (err,result) => {
                if(err) 
                    return res.send(err)
                console.log(req.body.id + 'stock updated')
                res.redirect('/')
        })  
    })
})*/
//show stock update page
app.get("/updatestock",(req,res)=>{
    db.collection("ladies").find({pid:req.query.pid}).toArray((err,result)=>{
        if(err) return console.log(err);
        res.render("update.ejs",{data:result});
    });
    
});
//updatestock(post)
app.post('/update',(req,res)=>{
    var edited=parseInt(req.body.stock);
    var edited1=parseInt(req.body.cp);
    var edited2=parseInt(req.body.sp);
    db.collection("ladies").findOneAndUpdate({pid:req.body.id},{
        $set:{stock: edited,cp:edited1,sp:edited2}},{sort: {_id:-1}},
        (err,result)=>{
            if(err) return console.log(error);
            console.log(req.body.id+" stock edited");
            res.redirect("/");
    });
});
//delete product
app.post('/delete',(req,res)=>{
    db.collection('ladies').findOneAndDelete({pid : req.body.id},(err,result)=>{
        if(err)
             return console.log(err)
        console.log(req.body.id+'Product Deleted')
        res.redirect('/')
    })  
}) 


/*app.put('/edit/(:id)', function(req, res, next) { 
    var errors = req.validationErrors()
     
        var ladies = {
            pid: req.sanitize('pid').escape().trim(),
            stock: req.sanitize('stock').escape().trim(),
            cp: req.sanitize('cp').escape().trim()
        }
        var o_id = new ObjectId(req.params.id)
        req.db.collection('ladies').update({"pid": o_id}, user, function(err, result) {
            if (err)
                req.flash('error', err)
            req.flash('success', 'Data updated successfully!')
            res.render('update.ejs', {stock:data})
            res.redirect('/stock_details.ejs')
        })        
})*/