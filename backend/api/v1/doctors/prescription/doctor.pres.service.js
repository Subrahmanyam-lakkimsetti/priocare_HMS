const Appointment = require('../../../../models/appointment.model');
const Doctor = require('../../../../models/doctor.model');
const Prescription = require('../../../../models/prescription.model');
const AppError = require('../../../../utils/AppError.util');

const createPrescription = async ({
  params: { apptId },
  data: { id },
  body,
}) => {
  const isPrescriptionExists = await Prescription.findOne({
    appointmentId: apptId,
  });

  if (isPrescriptionExists) {
    throw new AppError('prescription already exists', 409);
  }

  const appointment = await Appointment.findById(apptId);

  if (!appointment) {
    throw new AppError('appointment not found', 404);
  }

  const doctor = await Doctor.findOne({ userId: id });

  if (appointment.doctorId.toString() !== doctor._id.toString())
    throw new AppError('you are not allowed');

  if (!['in_consultation', 'completed'].includes(appointment.status)) {
    throw new AppError('not allowed to write prescription', 403);
  }

  console.log(body);
  const prescription = await Prescription.create({
    appointmentId: apptId,
    doctorId: doctor._id,
    patientId: appointment.patientId,
    ...body,
  });

  console.log('updated prescription', prescription);

  return prescription;
};

const updatePrescription = async ({ params: { prescriptionId }, body }) => {
  const prescription = await Prescription.findOneAndUpdate(
    { _id: prescriptionId },
    { ...body },
    { new: true },
  );

  if (!prescription) {
    throw new AppError('prescription does not exists', 404);
  }

  return prescription;
};

module.exports = {
  createPrescription,
  updatePrescription,
};
