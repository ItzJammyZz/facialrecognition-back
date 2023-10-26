import express from "express";
import bodyParser from 'body-parser'; // latest version of exressJS now comes with Body-Parser!
import bcrypt from "bcrypt-nodejs";
import cors from "cors";
import knex from 'knex';


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

// Controllers
import handleRegister from './controllers/register.js';
import handleSignin from './controllers/signin.js';
import handleProfileGet from './controllers/profile.js';
import { handleImage, handleAPICall } from './controllers/image.js';


// const app = express();
// app.use(bodyParser.json());
// app.use(cors({
//   origin: 'https://facialrecognitionfrontend.onrender.com', 
//   methods: 'GET,POST,PUT,DELETE',
//   credentials: true, 
// }));

const app = express();
app.use(bodyParser.json());
app.use(cors());

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








app.get('/', (req, res)=> { res.send('Brainnnn!') });

// app.post('/signin', handleSignin(db, bcrypt)); 
// app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) }) 
// app.get("/profile/:id", (req, res) => { handleProfileGet(req, res, db) });
// app.put('/image', (req, res) => { handleImage(req, res, db)});
// app.post('/imageurl', (req, res) => { handleAPICall(req, res)});

//SIGNIN (post, pw over HTTP body)
app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt) });

//REGISTER (post, add to database)
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

//PROFILE (get user)
app.get('/profile/:id', (req, res, db) => { profile.handleProfileGet(req, res, db) });

//IMAGE (put, update count on user profile)
app.put('/image', (req, res) => { image.handleImage(req, res, db) });

//IMAGEURL (post, handle Face Recognition API from backend)
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

app.listen(3000, () => {
  console.log("app is running on port 3001");
});


