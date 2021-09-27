const User = require('../models/user.model');
const ExternalUser = require('../models/externalUser.model');
const Admin= require('../models/admin.model');


exports.AddEuser = async(req, res) => {
  const {name, gender, email, phone, description} = req.body;

  if (!name) {
    return res.status(401).json({
      status: 'fail',
      message: 'please provide name'
    })
  }
  if (!gender) {
    return res.status(401).json({
      status: 'fail',
      message: 'please provide gender'
    })
  }
  if (!email) {
    return res.status(401).json({
      status: 'fail',
      message: 'please provide email'
    })
  }
  if (!phone) {
    return res.status(401).json({
      status: 'fail',
      message: 'please provide phone'
    })
  }
  if (!description) {
    return res.status(401).json({
      status: 'fail',
      message: 'please provide description'
    })
  }

 
  let newEuser = new ExternalUser({ name, gender, email, phone, description});

  

  await newEuser.save().then(() => {

    return res.status(200).json({
      status: 'succes',
      message: 'registration successful'
})

  })
}
exports.List = async (req, res) =>{
 const Euser= await ExternalUser.find({})
  res.json({Euser})

}
