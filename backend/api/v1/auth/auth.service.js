const User = require("../../../models/user.scheema")
const registerUser = async ({email, password, confirmPassword}) => {
    // check if user exists with the given email
    const existingUser = await User.findOne({email});
    console.log("existingUser", existingUser);
    if (existingUser) {
        throw new Error('User already exists with the given email');
    }

    // save the user to the database
    const newUser = await User.create({
        email,
        password,
        role: 'patient', // default role
        isActive: true,
    });

    newUser.password = undefined; // hide password in the returned object

    // temporarily logging the new user
    console.log("Newly registered user:", newUser);
    // return the created user object (without password)
    return newUser;
}

module.exports = {
    registerUser,
}