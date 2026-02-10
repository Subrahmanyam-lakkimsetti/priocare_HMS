class DoctorDTO {
  constructor(doctor) {
    this.id = doctor._id;
    this.firstName = doctor.firstName;
    this.lastName = doctor.lastName;
    this.specializations = doctor.specializations;
    this.department = doctor.department;
    this.experienceYears = doctor.experienceYears;
    this.consultationFee = doctor.consultationFee;
    this.availabilityStatus = doctor.availabilityStatus;
    this.workingHours = doctor.workingHours;
    this.availableDays = doctor.availableDays;
  }
}

module.exports = {
  DoctorDTO,
};