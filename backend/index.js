var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const app = express()

app.use(bodyParser.json())
app.use(express.static('frontend'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb+srv://sneakerhead:sneakerhead@sneakerhead.lcbokea.mongodb.net/test',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))

//create schema
const noteschema = {
    name: String,
    email: String,
    pass: String
}

const Note = mongoose.model("users", noteschema);

app.get("/", function(req, res){
    res.sendFile(__dirname + "/backend/frontend/signup.html");
})

app.get("/login", function(req, res){
    res.sendFile(__dirname + "/backend/frontend/login.html");
})

app.post("/", function(req, res){
    let NewNote = new Note({
        name: req.body.name,
        email: req.body.email,
        pass: req.body.pass
    });
    NewNote.save();
    res.redirect("./signup_success.html")
})

app.listen(3000, function(){
    console.log("Listening on PORT 3000");
})

app.post("/login", async(req, res) => {
    try {
        const email = req.body.Username;
        const pass = req.body.Password;

        const useremail = await Note.findOne({email: email});
        
        if(useremail.pass === pass){
            console.log("password matched");
            res.status(201).redirect("./login_success.html");
        }else{
            res.send("password not matching");
        }

    }   catch {
        res.status(400).send("invalid email");
    }
})