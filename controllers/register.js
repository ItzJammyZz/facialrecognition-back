const  handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      console.log("Registration data is missing or invalid", err);
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
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
        email: loginEmail[0].email,
        name: name,
        joined: new Date()
      })
      .then(user => {
        console.log('Error during user insert:', err); 
       res.json(user[0]);
         })
      })
      .then(trx.commit)
      // .catch(trx.rollback)
      .catch(err => {
        console.log('Error during transaction:', err); // Log the error
        trx.rollback(); // Rollback the transaction
        res.status(400).json('Unable to register 2');
      });
    })
  
    .catch(err => {
      console.log("Error during transaction start:", err);
      res.status(400).json({error: 'Unable to register 3', err});
  });
  }

  export default handleRegister;