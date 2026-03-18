export interface User {
  id: string;
  name: string;
  phone: string;
  blood_group: string | null;
  district: string | null;
  is_donor: boolean;
  is_doctor: boolean;
  is_ambulance: boolean;
  doctor_speciality: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
}
