const express = require("express");
const bodyParser = require('body-parser'); // latest version of exressJS now comes with Body-Parser!
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require ('knex');

// Controllers
const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

// const db = knex({
//   client: "pg",
//   connection: process.env.DATABASE_URL
// });

const db = knex({ 
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB
  }
});


const app = express();

app.use(cors({
  origin: 'https://facialrecognitionfrontend.onrender.com', // Replace with your front-end URL
  methods: 'GET,POST,PUT,DELETE',
  credentials: true, // If you need to include cookies
}));
app.use(bodyParser.json());


// app.post('/signin', (req, res) => {
//   db.select('email', 'hash').from('login')
//     .where('email', '=', req.body.email)
//     .then(data => {
//       const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
//       if (isValid) {
//         return db.select('*').from('users')
//           .where('email', '=', req.body.email)
//           .then(user => {
//             res.json(user[0])
//           })
//           .catch(err => res.status(400).json('unable to get user'))
//       } else {
//         res.status(400).json('wrong credentials')
//       }
//     })
//     .catch(err => res.status(400).json('wrong credentials'))
// })

// app.post('/register', (req, res) => {
//   const { email, name, password } = req.body;
//   const hash = bcrypt.hashSync(password);
//     db.transaction(trx => {
//       trx.insert({
//         hash: hash,
//         email: email
//       })
//       .into('login')
//       .returning('email')
//       .then(loginEmail => {
//         return trx('users')
//           .returning('*')
//           .insert({
//             email: loginEmail[0].email,
//             name: name,
//             joined: new Date()
//           })
//           .then(user => {
//             res.json(user[0]);
//           })
//       })
//       .then(trx.commit)
//       .catch(trx.rollback)
//     })
//     .catch(err => res.status(400).json('unable to register'))
// })

// app.get('/profile/:id', (req, res) => {
//   const { id } = req.params;
//   db.select('*').from('users').where({id})
//     .then(user => {
//       if (user.length) {
//         res.json(user[0])
//       } else {
//         res.status(400).json('Not found')
//       }
//     })
//     .catch(err => res.status(400).json('error getting user'))
// })

// app.put('/image', (req, res) => {
//   const { id } = req.body;
//   db('users').where('id', '=', id)
//   .increment('entries', 1)
//   .returning('entries')
//   .then(entries => {
//     res.json(entries[0].entries);
//   })
//   .catch(err => res.status(400).json('unable to get entries'))
// })

// app.listen(3000, ()=> {
//   console.log('app is running on port 3000');
// })


app.get('/', (req, res)=> { res.send('IT ALIVE!') });

app.post('/signin', signin.handleSignin(db, bcrypt)); /* This is another way to shorter the repetitive lines you see below where you remove req,res */
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) }) 
app.get("/profile/:id", (req, res) => { profile.handleProfileGet(req, res, db) });
app.put('/image', (req, res) => { image.handleImage(req, res, db)});
app.post('/imageurl', (req, res) => { image.handleAPICall(req, res)});

app.listen(3001, () => {
  console.log("app is running on port 3001");
});


