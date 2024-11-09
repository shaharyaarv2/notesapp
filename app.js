const express = require('express');
const app = express();
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const Notes = require('./models/notes');
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/notes');


app.set("view engine" , "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname , "public")));


app.get('/' , (req , res) =>{
    fs.readdir("./files" , (err , file)=>{
        res.render('home' , {files: file})
    })
});

//Create Routes

app.get('/create' , (req , res) =>{
    res.render('create');
})

app.post('/create' , async(req , res) => {
    console.log(req.body);
    const {filename , content } = req.body;
        const newNote =  new Notes({
            filename : filename,
            content : content
        })

       await newNote.save();
    res.redirect('/')
})

app.get('/edit/:filename' , async (req , res)=>{
    const { filename } = req.params;
    // Find the document using the filename
    const note = await Notes.findOne({ filename : filename });
    if (!note) {
        return res.status(404).send('Note not found');
    }

    res.render('edit', {filename , content : note.content})
})
app.post('/edit/:filename' , async (req , res) =>{
    const {filename} = req.params
    console.log("request to change the notes of ",filename , "things to change" , req.body);
    const {newName , newContent} = req.body;
    const newNote = await Notes.findOneAndUpdate({filename : filename} , {filename : newName , content : newContent});
    res.redirect('/');
    
})

app.get('/edit/:filename' , (req , res) =>{
    fs.unlink(`./files/${filename}` , (err)=>{
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/')
        }
    })
})










app.listen(3000, console.log("Server ON......"));