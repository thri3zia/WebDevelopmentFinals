const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { dirname } = require('path');
const { title } = require('process');
const app = express();


const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'web_database'
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database is connected');
});


app.set('views', path.join(__dirname, 'views'));


app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/',(req, res) =>{
    let sql = "SELECT * FROM task";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;

   
    res.render('user_index', {
        title : 'TODO-LIST MANAGEMENT SYSTEM',
        task : rows
        
    });
});
    
});

app.get('/add',(req, res) =>{
    res.render('add_task', {
        title : 'Todo-List Management System',
   
        
    });
});

app.post('/save',(req, res) =>{
    let data = {taskname: req.body.taskname};
    let sql = "INSERT INTO task SET ?";
    let query = connection.query(sql, data,(err, results) =>{
        if(err) throw err;
        res.redirect('/');
    });
});

app.get('/edit/:taskID',(req, res) =>{
    const taskID = req.params.taskID;
    console.log("asfsdafa"+taskID);
    let sql = `Select * from task where task_id = ${taskID}`;
    let query = connection.query(sql,(err, result) =>{
        if(err) throw err;
        res.render('edit_task',{
            title : 'Todo-List Management System',
            task : result[0]
        });
        
    });
    
});
app.post('/update',(req, res) =>{
    const taskID = req.body.task_id;
   
    console.log("hakdog"+taskID);
    let sql = "update task SET taskname='"+req.body.taskname+"' where task_id ="+taskID;
    let query = connection.query(sql,(err, results) =>{
        if(err) throw err;
        res.redirect('/');
    });
});

app.get('/delete/:taskID',(req, res) =>{
    const taskID = req.params.taskID;
    let sql = `DELETE from task where task_id = ${taskID}`;
    let query = connection.query(sql,(err, result) =>{
        if(err) throw err;
        res.redirect('/');
        
        
    });
    
});



app.listen(3000, () => {
    console.log('Server is running at port 3000');
});