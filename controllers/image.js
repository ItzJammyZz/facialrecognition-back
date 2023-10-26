
// const Clarifai = require ('clarifai');


// const app = new Clarifai.App({
//     apiKey: '887893022f414e7da0d611e0e0d5eaf4'
//   });

  const handleAPICall = (req, res) => {
  app.models
  .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
  }


const handleImage = (req, res, db) => {
    const { id } = req.body;
  
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0])
    })
    .catch(err => res.status(400).json('Unable to get entries'))
    // let found = false;
    // database.users.forEach(user => {
    //   if (user.id === id) {
    //     found = true;
    //     user.entries++;
    //     return res.json(user.entries);
    //   }
    // });
    // if (!found) {
    //   res.status(400).json("user entries not found");
    // }
  }

  export {
      handleImage,
      handleAPICall
  }

  // export default handleImage & handleAPICall
