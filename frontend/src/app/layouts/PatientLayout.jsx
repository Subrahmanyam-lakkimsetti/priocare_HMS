import LogoutButton from '../../components/shared/LogoutButton';
import PatientHome from '../../features/patient/pages/PatientHome';

export default function PatientLayout() {
  return (
    <>
      <div className="p-6">Patient Dashboard</div>
      <PatientHome />
      <LogoutButton />
    </>
  );
}
