const  handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      console.log("Registration data is missing or invalid");
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
    // database.users.push({
    //   id: "125",
    //   name: name,
    //   email: email,
    //   entries: 0,
    //   joined: new Date(),
    // });
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx ('users')
        .returning('*')
        .insert({
        email: loginEmail[0],
        name: name,
        joined: new Date()
      })
      .then(user => {
        console.log("User registered successfully:", user[0]);
       res.json(user[0]);
         })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
  
    .catch(err => {
      console.log("Error during registration:", err);
      res.status(400).json('Unable to register nothing');
  });
  }

  export default handleRegister;