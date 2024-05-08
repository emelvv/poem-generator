const express = require('express');
const path = require('path');
const multer = require('multer');
const database = require('./database')
const gigachat = require('./gigachat_requests')
const session = require('express-session');
const handlebars = require('express-handlebars');


const upload = multer({ dest: 'uploads/' })
const app = express();
const startTime = new Date();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'sosa',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3600000*2} // 3600000 - hour
}));
// Define a custom middleware to update session variables on every request
app.use((req, res, next) => {
    if (req.session.logined==undefined) {
        req.session.logined = false
    }
    next()
})


app.engine(
    'handlebars',
    handlebars.engine({ defaultLayout: 'main' })
);
app.set('views', './views');
app.set('view engine', 'handlebars');


function valid_check(username, password) {
    let logCheck = /^[A-Za-z0-9._\-]{6,20}$/
    let passCheck = /^[A-Za-z0-9-_.:;!@()&#]{8,}$/

    if (logCheck.test(username)){
        if (!passCheck.test(password)){
            return false
        }
    }else{
        return false
    }

    return true
}



// Define a route to serve the main_page.html file when the "/" URL is accessed
app.get('/', (req, res) => {
    if (req.session.logined){
        res.render('main_page', {'title': 'PoemPlease! | Home', 'username': req.session.username, 'lastPoem': req.session.lastPoem});
    }else{
        res.render('main_page', {'title': 'PoemPlease! | Home'});
    }
});

app.get("/auth", (req, res) => {
    if (req.session.logined){
        res.render('auth_page', {'title': 'PoemPlease! | Auth', 'username': req.session.username});
    }else{
        res.render('auth_page', {'title': 'PoemPlease! | Auth'});
    }
});


app.post('/auth',upload.none(),(req,res)=>{
    if (req.body.type == "auth"){
        database.checkUser(req.body.username, req.body.password).then((result)=>{
            if (result){
                req.session.logined = true;
                req.session.username = req.body.username;
                req.session.lastPoem = ''
                res.status(200).json({"status": "success"})
            }else{
                res.status(200).json({"status": "unsuccess"})
            }
        })
    }else if (req.body.type == "reg"){
        if (valid_check(req.body.username, req.body.password)){
            database.addUser(req.body.username, req.body.password).then(result=>{
                if (result){
                    req.session.logined = true;
                    req.session.username = req.body.username;
                    req.session.lastPoem = ''
                    res.status(200).json({"status": "success"})
                }else{
                    res.status(200).json({"status": "unsuccess"})
                }
            })
        }
        
    }else {
        console.log(req.body)
    }
})


TIMELIMIT = 10 // seconds
app.post('/data',(req,res)=>{
    if (req.session.logined){
        if (req.body.type == 'sign_out'){
            req.session.destroy();
            res.status(200).json({"status": "success"})
        }else if (req.body.type = 'generate'){
            if (req.session.time==undefined || new Date()-req.session.timePoem >=TIMELIMIT*10){
                gigachat.generate_poem(req.body.word).then(poem=>{
                    console.log(`User '${req.session.username}' generated poem.`)
                    if (poem != 'Error'){
                        req.session.lastPoem = poem
                        req.session.timePoem = new Date()
                    }
                    res.status(200).json({"status": "success", "poem": poem})
                })
            }else{
                res.status(400).json({"status": "unsuccess", "problem": "time limit"})
            }
        }else{
            res.status(400).json({"status": "unsuccess", "problem": "undefined type"})
        }
    }else{
        res.status(400).json({"status": "unsuccess", "problem": "not log in"})
    }
})


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});