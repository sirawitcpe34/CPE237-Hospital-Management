let countAppointment = `SELECT COUNT(start_time) AS CNTAppointment 
    FROM "Appointment" 
    WHERE start_time BETWEEN '2022-04-22 00:00:00' AND '2022-04-22 23:59:59'
        AND "staffID" = '1005';`
let listAppointment = `SELECT * 
    FROM "Appointment" 
    WHERE start_time BETWEEN '2022-04-22 00:00:00' AND '2022-04-22 23:59:59' 
        AND "staffID" = '1005';`
let FoundDisaseinYearandCNTAppointment = `SELECT p."patientID", p."firstname", p."lastname", COUNT(distinct d."diseaseID") AS FoundDisaseInYear,
    COUNT(distinct a."appointmentID") AS CNTAppointInYear
    FROM "Appointment" a, "Patient" p, "PatientDisease" d
    WHERE p."patientID" = '1000000023' AND
        (d."diseaseFound" BETWEEN '2022-01-01 00:00:00' AND '2022-12-31 23:59:59') AND
        (a."start_time" BETWEEN '2022-01-01 00:00:00' AND '2022-12-31 23:59:59') AND
        a."patientID" = p."patientID" AND
        p."patientID" = d."patientID"
        GROUP BY p."patientID";`
let  CNTmedicineandCNTdevice = `SELECT CAST(a."start_time" AS DATE),
    p."patientID", s."firstname", p."firstname", 
    COUNT(distinct m."medicineID") AS CNTMedicine,
    COUNT(distinct d."deviceID") AS CNTDevice
    FROM "Appointment" a, "Patient" p, "Staff" s, "MedicineWithdraw" m, "DeviceWithdraw" d
    WHERE a."appointmentID" = '10000000007' AND
        a."patientID" = p."patientID" AND
        a."staffID" = s."staffID" AND
        a."appointmentID" = m."appointmentID" AND
        a."appointmentID" = d."appointmentID" 
    GROUP BY a."start_time",p."patientID",s."staffID";`
let CNTpatientssanddoctors = `SELECT d."diseaseID", s."departmentID", COUNT(distinct s."staffID") AS CNTDoctor,
    COUNT(distinct d."patientID") AS CNTPatient
    FROM "Appointment" a, "Patient" p, "PatientDisease" d, "Staff" s
    WHERE s."departmentID" = '13' AND
        d."diseaseID" = '100009'
    GROUP BY d."diseaseID", s."departmentID";`
