const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});
const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

// Get the book list available in the shop using promise
public_users.get('/',function (req, res) {
const getlist = new Promise((resolve,reject)=>{
    try {
      const data = JSON.stringify(books,null,4); 
      resolve(data);
    } catch(err) {
      reject(err)
    }
});
getlist.then(
  (data) => res.send(data),
  (err) => res.send("Error reading list") 
);
});

// Get book details based on ISBN using promise
public_users.get('/isbn/:isbn',function (req, res) {
  const getlisbn = new Promise((resolve,reject)=>{
    try {
    const ISBN=req.params.isbn;
    const data = JSON.stringify(books[ISBN],null,4); 
      resolve(data);
    } catch(err) {
      reject(err)
    }
});
getlisbn.then(
  (data) => res.send(data),
  (err) => res.send("Error reading list") 
);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
const getauthor = new Promise((resolve,reject)=>{
        try {
        const Author=req.params.author;
        for(let k in books){
            if(books[k].author===Author){
            const data = JSON.stringify(books[k],null,4);
            resolve(data);
            break;
            }
        }
        } catch(err) {
          reject(err)
        }
    });
    getauthor.then(
      (data) => res.send(data),
      (err) => res.send("Error reading list") 
    );

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const gettitle = new Promise((resolve,reject)=>{
        try {
        const tit=req.params.title;
        for(let k in books){
            if(books[k].title===tit){
            const data = JSON.stringify(books[k],null,4);
            resolve(data);
            break;
            }
        }
        } catch(err) {
          reject(err)
        }
    });
    gettitle.then(
      (data) => res.send(data),
      (err) => res.send("Error reading list") 
    );
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const ISBN=req.params.isbn;
    let rev=books[ISBN].reviews
    res.send(rev);
});

module.exports.general = public_users;
