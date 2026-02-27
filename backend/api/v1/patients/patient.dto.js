class PatientDTO {
  constructor(patient) {
    this.id = patient._id;
    this.firstName = patient.firstName;
    this.lastName = patient.lastName;
    this.age = patient.age;
    this.gender = patient.gender;
    this.phoneNumber = patient.phoneNumber;
    this.address = patient.address;
    this.bloodGroup = patient.bloodGroup;
    this.insuranceDetaild = patient.insuranceDetaild;
    this.isTemporary = patient.isTemporary;
    this.createdAt = patient.createdAt;
    this.photo = patient.photo;
    this.userId = patient.userId;
    this.updatedAt = patient.updatedAt;
  }
}

module.exports = {
  PatientDTO,
};
