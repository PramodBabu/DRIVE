const admin = require('../firebase');

exports.authCheck = async (req, res, next) => {
    try {
        const firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken);
        req.user = firebaseUser;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            err: 'invalid or expired token'
        });
    }
}

exports.signInWithPhoneAndPassword = async (req, res) => {
    try {
        const phoneNumber = req.body.phoneNumber;
        if (phoneNumber === undefined) {
            res.send({'s':400,'m':'Bad argument: no phone number'});
        }
        const user = await admin.auth().getUserByPhoneNumber(phoneNumber);
        console.log(user);
        res.send({email: user.email});
    } catch (error) {
        res.send(error);
    }
}
