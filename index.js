//requirement
const express=require('express');
const mongoose=require('mongoose');
const session=require('express-session');
//requiring schema
const User=require('./schema/user');
const Man=require('./schema/manager');
const Menu=require('./schema/menu');
const Order=require('./schema/order');
const Rev=require('./schema/review')
//const { off } = require('./schema/user');
const Cart=require('./schema/cart');
const order = require('./schema/order');
const { json } = require('express/lib/response');
var app=express();
var ratingmail=[];
var fetcher;
var customer;
var uloc;
var locationdata;
var fmenumail;
var menudata;
var cart_befor_order;
var userinfo;
var menu_added_by_fetcher;
var orders_got_to_manager;
var ratingsinfo;
//mongodb connection
app.use(session({secret:'capestone'}));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const uri = "mongodb+srv://taruneluri:taruneluri@cluster0.gkezw.mongodb.net/fooddelivery?retryWrites=true&w=majority";
mongoose.connect(uri).then(()=>{console.log("DataBase Connected !!")});
const connection=mongoose.connection;
//get apis
app.get('/',function(req,res){
    req.session.visited=false;
    res.sendFile(__dirname+'/pages/index.html');
})
app.get('/login',function(req,res){
    req.session.visited=false;
    res.sendFile(__dirname+'/pages/login.html');
})
app.get('/reg',function(req,res){
    req.session.visited=false;
    res.sendFile(__dirname+'/pages/reg.html');
})
app.get('/dashboard',function(req,res){
    if(req.session.visited==true)
    {
        res.sendFile(__dirname+'/pages/dashboard.html')
    }
    else
    {
        res.redirect('/login');
    }
})
app.get('/m',function(req,res){
    req.session.visited=false;
    res.sendFile(__dirname+'/pages/manager/index.html');
})
app.get('/mlogin',function(req,res){
    req.session.visited=false;
    res.sendFile(__dirname+'/pages/manager/login.html');
})
app.get('/mreg',function(req,res){
    req.session.visited=false;
    res.sendFile(__dirname+'/pages/manager/reg.html');
})
app.get('/view',function(req,res)
{
    if(req.session.visited==true)
    {
        res.sendFile(__dirname+'/pages/view.html')
    }
    else
    {
        res.sendFile(__dirname+'/pages/login.html');
        res.redirect('/login');
    }
});
app.get('/mdashboard',(req,res)=>{
    if(req.session.visited==true)
    {
        res.sendFile(__dirname+'/pages/manager/mdashboard.html');
    }
    else
    {
        res.redirect('/mlogin');
    }
});
app.get('/addmenu',(req,res)=>{
    if(req.session.visited==true)
    {
        res.sendFile(__dirname+'/pages/manager/addmenu.html');
    }
    else
    {
        res.redirect('/mlogin');
    }
})
app.get('/cart',(req,res)=>{
    if(req.session.visited==true)
    {
        res.sendFile(__dirname+'/pages/cart.html');
    }
    else
    {
        res.redirect('/login');
    }
});
app.get('/vieworders',(req,res)=>{
    if(req.session.visited==true)
    {
        res.sendFile(__dirname+'/pages/manager/vieworders.html');
    }
    else
    {
        res.redirect('/mlogin');
    }
})
app.get('/uorders',(req,res)=>{
    if(req.session.visited==true)
    {
        res.sendFile(__dirname+'/pages/order.html');
    }
    else
    {
        res.redirect('/login');
    }
});
app.get('/ratings',(req,res)=>{
    if(req.session.visited==true)
    {
        res.sendFile(__dirname+'/pages/review.html')
    }
    else
    {
        res.redirect('/login');
    }
})
app.get('/mratings',(req,res)=>{
    if(req.session.visited==true)
    {
        res.sendFile(__dirname+'/pages/manager/review.html');
    }
    else
    {
        res.redirect('/mlogin');
    }
})
app.get('/uup',(req,res)=>{
    if(req.session.visited==true)
    {
        res.sendFile(__dirname+'/pages/update.html');
    }
    else
    {
        res.redirect('/login');
    }
})
app.get('/mup',(req,res)=>{
    if(req.session.visited==true)
    {
        res.sendFile(__dirname+'/pages/manager/update.html');
    }
    else
    {
        res.redirect('/mlogin');
    }
})
app.get('/uprofile',(req,res)=>{
    if(req.session.visited==true)
    {
        res.sendFile(__dirname+'/pages/profile.html')
    }
})
//post apis
//new user registration using /register
app.post('/register',(req,res)=>{
    //geting information from register form
    var a=req.body.uname;
    var b=req.body.ucity;
    var c=req.body.uno;
    var d=req.body.umail;
    var e=req.body.upswd;
    //using find function to check if the user already exists
    User.findOne({umail:d,uno:c},(err,result)=>{
        if(err)
        {
            console.log(err);
            res.redirect('/reg');
        }
        else
        {
            if(result==null)
            {
                //if user doesnt exist query to create and register new user
                User.create({
                    uname:a,
                    ucity:b,
                    uno:c,
                    umail:d,
                    upswd:e
                },(err)=>{
                    if(err)
                    {
                        console.log(err);
                        res.redirect('/reg')
                    }
                    else
                    {
                        res.redirect('/login');
                    }
                })
            }
            else
            {
                res.redirect('/login');
            }
        }
    })
});
//existing user login using /login
app.post('/login',(req,res)=>{
    //geting information from html login page
    var a=req.body.umail;
    var b=req.body.upswd;
    //using mongodb query to check the login credentials
    User.findOne({umail:a,upswd:b},(err,result)=>{
        if(err)
        {
            console.log(err);
            res.redirect('/login');
        }
        else
        {
            if(result==null)
            {
                
                res.redirect('/login');
            }
            else
            {
                req.session.visited=true;
                customer=result;
                res.redirect('/dashboard')
            }
        }
    })
});
//creating new restaurant manager account
app.post('/mregister',(req,res)=>{
    //getting information from the html page
    var a=req.body.rfname ;
    var b=req.body.roname ;
    var c=req.body.rname ;
    var d=req.body.rcity ;
    var e=req.body.rno ;
    var f=req.body.rmail ;
    var g=req.body.rpswd ;
    Man.findOne({rmail:f,rno:e},(err,result)=>{
        if(err)
        {
            console.log(err);
            res.redirect('/mreg');
        }
        else
        {
            if(result==null)
            {
                Man.create({
                    rfname:a,
                    roname:b,
                    rname:c,
                    rcity:d,
                    rno:e,
                    rmail:f,
                    rpswd:g
                },(err)=>{
                    if(err)
                    {
                        console.log(err);
                        res.redirect('/mreg');
                    }
                    else
                    {
                        res.redirect('/mlogin');
                    }
                })
            }
            else
            {
                res.redirect('/mlogin');
            }
        }
    })
})
//loging in a existing restaurant manager using /mlogin
app.post('/mlogin',(req,res)=>{
    //getting information form the database
    var a=req.body.rmail;
    var b=req.body.rpswd;
    Man.findOne({rmail:a,rpswd:b},(err,result)=>{
        if(err)
        {
            console.log(err);
            res.redirect('/mlogin')
        }
        else
        {
            if(result==null)
            {
                res.redirect('/mlogin');
            }
            else
            {
                req.session.visited=true;
                fetcher=result;
                res.redirect('/mdashboard');
            }
        }
    })
});
//adding food menu taking email as a primary key
app.post('/addmenu',(req,res)=>{
    var a=req.body.mname;
    var b=req.body.mcat;
    var c=req.body.mdesc;
    var d=req.body.mprice;
    Menu.findOne({rmail:fetcher.rmail,mname:a},(err,result)=>{
        if(err)
        {
            console.log(err);
            res.redirect('/addmenu');
        }
        else
        {
            if(result==null)
            {
                Menu.create({
                    rmail:fetcher.rmail,
                    mname:a,
                    mcat:b,
                    mdesc:c,
                    mprice:d
                },(err)=>{
                    if(err)
                    {
                        console.log(err);
                        res.redirect('/addmenu')
                    }
                    else
                    {
                        res.redirect('/addmenu');
                    }
                })
            }
            else
            {
                res.redirect('/addmenu');
            }
        }
    })
});
//geting added food information from the database and storing them in table
app.get('/getaddedmenu',(req,res)=>{
    Menu.find({rmail:fetcher.rmail},(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            menu_added_by_fetcher=result;
            res.send(result)
        }
    })
});
app.get('/deletemenu/:id',(req,res)=>{
    var id=req.params.id;
    Menu.deleteOne(menu_added_by_fetcher[id],function(err,result){
        if(err)
        {
            console.log(err);
        }
        else
        {
            //console.log(result);
            res.redirect('/addmenu');
        }
    })
})
//asking for location of user to find restaurant
app.post('/location',(req,res)=>{
    uloc=req.body.floc;
    res.redirect('/dashboard');
})
//geting information of given location in the dashboard page
app.get('/locationresults',(req,res)=>{
    Man.find({rcity:uloc},(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            locationdata=result;
            res.send(result);
        }
    })
})
//menu page
app.get('/menu/:id',(req,res)=>{
    var id=req.params.id
    for(var i=0;i<locationdata.length;i++)
    {
        if(id==i)
        {
            fmenumail=locationdata[id].rmail;
            res.redirect('/view');
        }
    }
})
//fetching menu
app.get('/fetchmenutoview',(req,res)=>{
    Menu.find({rmail:fmenumail},(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            menudata=result;
            res.send(result);
        }
    })
})
app.get('/add/:id',(req,res)=>{
    id=req.params.id;
    Cart.create({
        umail:customer.umail,
        uno:customer.uno,
        uloc:customer.ucity,
        rmail:menudata[id].rmail,
        iname:menudata[id].mname,
        iprice:menudata[id].mprice,
    },(err)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect('/view');
        }
    })
});
app.get('/getcartinfo',(req,res)=>{
    Cart.find({umail:customer.umail},(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            cart_befor_order=result;
            res.send(result);
        }
    })
});
app.get('/cartdelete/:id',(req,res)=>{
    var id=req.params.id;
    Cart.deleteOne(cart_befor_order[id],(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect('/cart');
        }
    })
})
app.post('/placeorder',function(req,res){
    var dloc=req.body.dloc;

    for(var i=0;i<cart_befor_order.length;i++)
    {
        ratingmail[i]=cart_befor_order[i].rmail
        Order.create({
            umail:customer.umail,
            uname:customer.uname,
            uno:customer.uno,
            uadd:dloc,
            rmail:cart_befor_order[i].rmail,
            iname:cart_befor_order[i].iname,
            iprice:cart_befor_order[i].iprice,
        
        })
        Cart.deleteOne(cart_befor_order[i],(err,result)=>{
            if(err)
            {
                console.log(err);
            }
        }); 
    }
    res.redirect('/cart');
})
app.get('/fetchuorders',(req,res)=>{
    Order.find({umail:customer.umail},(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.send(result);
        }
    })
});
app.get('/mangorders',(req,res)=>{
    Order.find({rmail:fetcher.rmail},(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            orders_got_to_manager=result;
            res.send(result);
        }
    })
})
app.get('/doneorder/:id',(req,res)=>{
    var id=req.params.id;
    Order.deleteOne(Order[id],(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect('/vieworders');
        }
    })
});
app.post('/giverating',(req,res)=>{
    var a=req.body.rate;
    var b=req.body.review;
    for(i=0;i<ratingmail.length;i++)
    {
        Rev.create({
            uname:customer.uname,
            rmail:ratingmail[i],
            rating:a,
            review:b

        })
    }
    res.redirect('/dashboard');
})
app.post('/skip',(req,res)=>{
    res.redirect('/dashboard');
})
app.get('/mgetratings',(req,res)=>{
    Rev.find({rmail:fetcher.rmail},(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            ratingsinfo=result;
            res.send(result);     
        }
    })
})
app.get('/delrev/:id',(req,res)=>{
    var id=req.params.id;
    Rev.deleteOne(Rev[id],(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            res.redirect('/mratings');
        }
    })
})
app.get('/ulogout',(req,res)=>{
    req.session.visited=false;
    res.redirect('/login');
})
app.get('/mlogout',(req,res)=>{
    req.session.visited=false;
    res.redirect('/mlogin');
});
app.post('/uup',(req,res)=>{
    var a=req.body.cpswd;
    var b=req.body.npswd;
    User.updateOne({umail:customer.umail,upswd:a},{upswd:b},(err,result)=>{
        if(err)
        {
            console.log(err)
        }
        else
        {
            if(result.matchedCount==1)
            {
                res.redirect('/dashboard');
            }
            else
            {
                res.redirect('/uup');
            }
            
        }
    })
})
app.post('/mup',(req,res)=>{
    var a=req.body.cpswd;
    var b=req.body.npswd;
    Man.updateOne({rmail:fetcher.rmail,rpswd:a},{rpswd:b},(err,result)=>{
        if(err)
        {
            console.log(err)
        }
        else
        {
            if(result.matchedCount==1)
            {
                res.redirect('/mdashboard');
            }
            else
            {
                res.redirect('/mup');
            }
            
        }
    })
})
app.listen(3000,()=>{console.log('Server Started !')});