package com.medicare.config;

import com.medicare.entity.*;
import com.medicare.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorAvailabilityRepository availabilityRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            logger.info("Database already initialized with seed data.");
            return;
        }

        logger.info("Initializing MediCare database with sample seed data...");

        // 1. Create Admin
        User adminUser = new User();
        adminUser.setEmail("admin@medicare.com");
        adminUser.setFullName("System Administrator");
        adminUser.setPassword(passwordEncoder.encode("admin123"));
        adminUser.setPhone("+1-800-MEDICARE");
        adminUser.setRole(Role.ROLE_ADMIN);
        adminUser.setEnabled(true);
        userRepository.save(adminUser);

        // 2. Create Doctors
        Doctor doc1 = createDoctor("dr.smith@medicare.com", "Dr. Robert Smith", "doctor123", "+1-555-0101",
                "Cardiology", "MD, FACC - Harvard Medical School", 14, 750.0,
                "Senior Cardiologist specializing in preventive cardiology and heart failure management.", DoctorStatus.APPROVED);

        Doctor doc2 = createDoctor("dr.johnson@medicare.com", "Dr. Sarah Johnson", "doctor123", "+1-555-0102",
                "Neurology", "MD, PhD - Johns Hopkins University", 10, 800.0,
                "Consultant Neurologist specializing in stroke management, epilepsy, and migraine treatment.", DoctorStatus.APPROVED);

        Doctor doc3 = createDoctor("dr.emily@medicare.com", "Dr. Emily Davis", "doctor123", "+1-555-0103",
                "Dermatology", "MD, DNB - Stanford University", 8, 600.0,
                "Specialist Dermatologist offering comprehensive clinical dermatology and laser treatments.", DoctorStatus.APPROVED);

        Doctor doc4 = createDoctor("dr.michael@medicare.com", "Dr. Michael Chen", "doctor123", "+1-555-0104",
                "Pediatrics", "MD, FAAP - Columbia University", 12, 550.0,
                "Dedicated Pediatrician passionate about child growth monitoring and adolescent medicine.", DoctorStatus.PENDING);

        // 3. Create Patients
        Patient pat1 = createPatient("john.doe@gmail.com", "John Doe", "patient123", "+1-555-0201",
                "Male", LocalDate.of(1990, 5, 14), "O+", "742 Evergreen Terrace, Springfield", "+1-555-9901",
                "Mild hypertension diagnosed in 2022. No known drug allergies.");

        Patient pat2 = createPatient("sarah.connor@gmail.com", "Sarah Connor", "patient123", "+1-555-0202",
                "Female", LocalDate.of(1988, 11, 23), "A+", "456 Oak Avenue, Metropolis", "+1-555-9902",
                "Asthma patient since childhood. Allergic to Penicillin.");

        // 4. Create Availability for Approved Doctors
        createAvailability(doc1, List.of(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY), "09:00", "17:00");
        createAvailability(doc2, List.of(DayOfWeek.TUESDAY, DayOfWeek.THURSDAY), "10:00", "16:00");
        createAvailability(doc3, List.of(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY), "11:00", "18:00");

        // 5. Create Sample Appointments
        Appointment app1 = new Appointment(pat1, doc1, LocalDate.now().plusDays(2), "10:00 - 10:30", AppointmentStatus.CONFIRMED, "Annual routine heart checkup");
        appointmentRepository.save(app1);

        Appointment app2 = new Appointment(pat2, doc2, LocalDate.now().plusDays(3), "11:00 - 11:30", AppointmentStatus.PENDING, "Persistent migraine headaches for 2 weeks");
        appointmentRepository.save(app2);

        Appointment app3 = new Appointment(pat1, doc3, LocalDate.now().minusDays(5), "14:00 - 14:30", AppointmentStatus.COMPLETED, "Skin allergy consultation");
        app3.setConsultationNotes("Patient presented with contact dermatitis on arms. Prescribed topical antihistamine and barrier cream.");
        appointmentRepository.save(app3);

        // 6. Create Sample Prescription for Completed Appointment
        Prescription pres = new Prescription(app3, doc3, pat1,
                "Contact Dermatitis",
                "1. Hydrocortisone Cream 1% - Apply twice daily for 7 days\n2. Cetirizine 10mg - Take 1 tablet daily at bedtime for 5 days",
                "Keep area dry and avoid perfumed soaps. Follow up if rash persists after 1 week.");
        prescriptionRepository.save(pres);

        // 7. Create Sample Medical Records
        MedicalRecord rec1 = new MedicalRecord(pat1, doc1, "Lipid Profile & ECG Report", "Lab Report", "https://example.com/reports/ecg_john_doe.pdf", "Normal sinus rhythm, Cholesterol 195 mg/dL", LocalDate.now().minusDays(10));
        medicalRecordRepository.save(rec1);

        MedicalRecord rec2 = new MedicalRecord(pat2, null, "Chest X-Ray Digital Copy", "X-Ray", "https://example.com/reports/xray_sarah.pdf", "Clear lung fields, no focal consolidation.", LocalDate.now().minusDays(20));
        medicalRecordRepository.save(rec2);

        // 8. Create Sample Notifications
        notificationRepository.save(new Notification(pat1.getUser(), "Welcome to MediCare", "Your patient profile has been set up successfully. You can now book appointments online."));
        notificationRepository.save(new Notification(doc1.getUser(), "Profile Approved", "Your doctor profile is approved and active for online patient bookings."));

        logger.info("MediCare seed data successfully populated!");
    }

    private Doctor createDoctor(String email, String name, String password, String phone,
                                String spec, String qual, int exp, double fee, String bio, DoctorStatus status) {
        User user = new User();
        user.setEmail(email);
        user.setFullName(name);
        user.setPassword(passwordEncoder.encode(password));
        user.setPhone(phone);
        user.setRole(Role.ROLE_DOCTOR);
        user.setEnabled(true);
        User savedUser = userRepository.save(user);

        Doctor doctor = new Doctor(savedUser, spec, qual, exp, fee, bio, status);
        return doctorRepository.save(doctor);
    }

    private Patient createPatient(String email, String name, String password, String phone,
                                  String gender, LocalDate dob, String blood, String address, String emergency, String history) {
        User user = new User();
        user.setEmail(email);
        user.setFullName(name);
        user.setPassword(passwordEncoder.encode(password));
        user.setPhone(phone);
        user.setRole(Role.ROLE_PATIENT);
        user.setEnabled(true);
        User savedUser = userRepository.save(user);

        Patient patient = new Patient(savedUser, gender, dob, blood, address, emergency, history);
        return patientRepository.save(patient);
    }

    private void createAvailability(Doctor doctor, List<DayOfWeek> days, String start, String end) {
        for (DayOfWeek day : days) {
            DoctorAvailability availability = new DoctorAvailability(doctor, day, start, end, 15, 30);
            availabilityRepository.save(availability);
        }
    }
}
