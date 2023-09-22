const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const knex = require('knex');
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

let db = knex({
        client: 'pg',
        connection: {
          host : '127.0.0.1',
          port : 5432,
          user : 'yeseniamarquina',
          password : '',
          database : 'journal'
        }
});

console.log(db.select('*').from('users'));


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

    const {email, firstName, lastName} = req.body;

    db('users')
    .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        joined: new Date()
    }, ['*'])
    .then(user => {
        return res.json(user[0]);
      }
    )
    .catch(e => res.status(400).json('Error not able to register.'))
})

app.post('/entry', (req, res) => {
    const {id, entry} = req.body;


    db('entries')
    .insert({
        date_created: new Date(),
        entry: entry,
        userId: id
    })
    .then(entries => {
        res.json(entries[0].entries)
    })
    .catch(e => res.status(400).json(e))


    // database.users.forEach(user => {
    //     found = true;
    //     user.entries++;
    //     return res.json(user.entries);
    // })
    // if(!found){
    //     res.status(400).json('not found');
    // }
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
