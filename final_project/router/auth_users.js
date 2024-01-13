const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: '24h'});
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("Customer successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const us_name = req.session.authorization['username'];
    const isbn=req.params.isbn;
    dict={}
    dict[us_name]=req.query.review;
    books[isbn].reviews.push(dict);
    res.send("the review for the book with ISBN "+isbn+" has been updated/added.");
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let username = req.session.authorization['username'];
    const isbn=req.params.isbn;
for(let k in books[isbn].reviews){
    if(k.key==username){
books[isbn].reviews.remove(k);
res.send("the review for username: "+username+" from isbn "+ isbn+" has been removed.");
break;
    }
}
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
