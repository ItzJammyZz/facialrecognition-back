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
        console.log('Error during user insert:', err); 
      //  res.json(user[0]);
      res.status(400).json('Unable to register');
         })
      })
      .then(trx.commit)
      // .catch(trx.rollback)
      .catch(err => {
        console.log('Error during transaction:', err); // Log the error
        trx.rollback(); // Rollback the transaction
        res.status(400).json('Unable to register');
      });
    })
  
    .catch(err => {
      console.log("Error during transaction start:", err);
      res.status(400).json({error: 'Unable to register'});
  });
  }

  export default handleRegister;