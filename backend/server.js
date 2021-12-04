require('dotenv').config({ path: '../.env'})
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const router = express.Router();
const PORT = 4000;
let Todo = require('./todo.model');

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true ,useUnifiedTopology: true});
const connection = mongoose.connection;

// Once the connection is established, callback
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

router.get('/', (req,res) => {
    Todo.find((err, todos) => {
        if(err)
            console.log(err);
        else {
            res.json(todos);
        }
    });
});

router.get('/:id',(req,res) => {
    const id = req.params.id;
    Todo.findById(id, (err,todo) => {
        res.json(todo);
    });
});

router.post('/add',(req,res) => {
    const todo = new Todo(req.body);
    todo.save()
        .then( todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch( err => {
            res.status(400).send('adding new todo failed');
        });
});

router.post('/update/:id',(req,res) => {
    Todo.findById(req.params.id, (err, todo) => {
        if(!todo)
            res.status(404).send('Data is not found');
        else {
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;
            todo.save().then( todo => {
                res.json('Todo updated');
            })
            .catch( err => {
                res.status(400).send("Update not possible");
            });
        }
    });
});


app.use('/todos', router);

app.listen( PORT, () => {
    console.log("Server is running on port " + PORT);
});
