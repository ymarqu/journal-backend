const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors')

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'yesenia',
            email: 'yesenia@gmail.com',
            password: '123',
            entries: 0,
            joined: new Date()
        },
        {
            id: '1234',
            name: 'Dave',
            password: 'butt',
            email: 'dave@gmail.com',
            entries: 2,
            joined: new Date()
        }
    ]
}





app.get('/', (req, res) => {
    res.send(database.users);
})


app.post('/signin', (req,res) => {

    database.users.forEach(user  => {
        if(user.email === req.body.email && user.password === req.body.password){
            res.json(user);
        }
    })
    res.status(400).json('access denied');
})

app.post('/register', (req, res) => {

    const {email, name} = req.body;

    database.users.push({
        id: '12345',
        name: name,
        email: email,
        entries: 0,
        joined: new Date()
    })

    res.json(database.users[database.users.length - 1]);

})

app.put('/entry', (req, res) => {
    const {id} = req.body;
    let found = false;

    database.users.forEach(user => {
        found = true;
        user.entries++;
        return res.json(user.entries);
    })
    if(!found){
        res.status(400).json('not found');
    }
})


app.get('/journal/:id', (req, res) => {
    const {id} = req.params;
    let found = false;

    database.users.forEach(user => {
        if(user.id === id){
            found = true;
           return res.json(user);
        }
    })
    if(!found){
        res.status(400).json('not found!');
    }
})



app.listen(3000, () => {
    console.log("listening on port 3000");
})
