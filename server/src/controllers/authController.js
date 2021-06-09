const User = require('../models/user');

exports.createOrUpdateUser =  async (req, res) => {
    const {name, picture, email, phone_number} = req.user;
    const role = req.body.role;
    const user = await User.findOneAndUpdate({email: email}, {name, picture}, {new: true})
    // console.log(user);
    if (user) {
        console.log('user updated');
        res.json(user);
    } else {
        const newUser = await new User({
            email,
            name,
            picture,
            phone_number,
            role
        }).save();
        res.json(newUser);  
    }
};

exports.currentUser = async (req,res) => {
    User.findOne({phone_number: req.user.phone_number}).exec((err, user) => {
        if(err) throw new Error(err)
        res.json(user);
    })
}
