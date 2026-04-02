const Appointment = require('../../../../models/appointment.model');
const Medicine = require('../../../../models/medicine.model');
const Patient = require('../../../../models/patient.model');
const Prescription = require('../../../../models/prescription.model');
const AppError = require('../../../../utils/AppError.util');
const levenshtein = require('fast-levenshtein');


const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');


const isSmartMatch = (input, med) => {
  const inputNorm = normalize(input);
  const nameNorm = normalize(med.name);
  const genericNorm = normalize(med.genericName || '');

  if (nameNorm.includes(inputNorm) || genericNorm.includes(inputNorm)) {
    return true;
  }

  const distanceName = levenshtein.get(inputNorm, nameNorm);
  const distanceGeneric = levenshtein.get(inputNorm, genericNorm);

  return distanceName <= 2 || distanceGeneric <= 2;
};

const getPrescriptionWithStatus = async ({
  params: { token },
  data: { id },
}) => {
 
  const appt = await Appointment.findOne({ token });
  if (!appt) throw new AppError('appointment not found', 404);

  const patient = await Patient.findOne({ userId: id });
  if (!patient) throw new AppError('patient not found', 404);

  if (appt.patientId.toString() !== patient._id.toString()) {
    throw new AppError('not allowed', 403);
  }


  const prescription = await Prescription.findOne({
    appointmentId: appt._id,
  });

  if (!prescription) throw new AppError('prescription not found', 404);


  const allMedicines = await Medicine.find();

  
  const medicationsWithStatus = prescription.medications.map((med) => {
    const found = allMedicines.find((dbMed) => isSmartMatch(med.name, dbMed));

    let availabilityStatus = 'not_in_db';

    if (found) {
      availabilityStatus =
        found.isAvailable && found.stockCount > 0 ? 'available' : 'unavailable';
    }

    return {
      ...med.toObject(),
      availabilityStatus,
      matchedMedicine: found ? found.name : null, 
    };
  });

  return {
    ...prescription.toObject(),
    medications: medicationsWithStatus,
  };
};

module.exports = {
  getPrescriptionWithStatus,
};
