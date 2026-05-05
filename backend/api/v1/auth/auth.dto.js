class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.email = user.email;
    this.role = user.role;
    this.isProfileComplete = user.isProfileComplete;
  }
}

module.exports = {
  UserDTO,
};
