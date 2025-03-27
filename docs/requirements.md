# Office Cab Booking App - Requirements Document

## 1. Overview

The Office Cab Booking App is designed to help office employees book cabs for their daily commute based on their work shifts. The application offers both **subscription-based** and **ad-hoc booking** options, ensuring safety, convenience, and efficiency. It also includes an **admin dashboard** for managing vehicles, drivers, and trip details.

---

## 2. Key Objectives

- Provide a **seamless** and **intuitive** cab booking experience for employees.
- Offer **flexible booking options**: subscription-based (recurring) or ad-hoc (one-time).
- Ensure **employee safety** with live tracking, SOS alerts, and incident reporting.
- Enable **efficient fleet and driver management** via the admin dashboard.
- Optimize cab usage and reduce wait times.
- Maintain **transparency** through real-time status updates and trip history.

---

## 3. User Roles & Permissions

### **1. Employee**

- Book a cab for a shift (one-time or recurring).
- View trip history and upcoming trips.
- Cancel bookings (within the permitted time window).
- Track live trips.
- Trigger an **SOS alert** in case of emergencies.
- Report incidents during or after a trip.

### **2. Admin**

- Manage employees, drivers, and vehicles.
- Assign vehicles and drivers to scheduled trips.
- View and monitor all trips in real time.
- Handle **SOS alerts** and **incident reports**.
- Generate reports on trip statistics and usage trends.

### **3. Driver**

- View assigned trips and schedules.
- Mark trip status as **Started**, **In Progress**, or **Completed**.
- Update real-time location for tracking purposes.
- Receive **SOS alerts** and respond accordingly.

---

## 4. Core Features

### **4.1 Employee Features**

✅ **User Authentication**: Employees can log in using company credentials.  
✅ **Cab Booking**:

- Choose shift time (Morning, Evening, Night).
- Select pickup/drop location.
- Option for **recurring** or **one-time** booking.  
  ✅ **Trip History & Upcoming Trips**: View past and scheduled rides.  
  ✅ **Live Tracking**: Track real-time cab location once the trip starts.  
  ✅ **SOS & Incident Reporting**: Raise alerts for emergencies or report trip issues.  
  ✅ **Cancellation**: Cancel trips with a predefined cutoff time.

### **4.2 Admin Features**

✅ **User & Driver Management**: Add, remove, or update details.  
✅ **Vehicle & Trip Management**: Assign vehicles, monitor trip status.  
✅ **Emergency Handling**: Respond to **SOS alerts** in real time.  
✅ **Analytics & Reports**: Generate reports on trip trends, employee usage, etc.

### **4.3 Driver Features**

✅ **Trip Schedule View**: See assigned trips.  
✅ **Status Updates**: Mark trips as **Started**, **Ongoing**, or **Completed**.  
✅ **Real-time Location Sharing**: Updates cab location periodically.  
✅ **Incident Handling**: Respond to **SOS alerts** from employees.

---

## 5. Business Rules & Constraints

- 🚖 **Booking Rules**:
  - Employees can **book a cab up to 1 hour before the shift starts**.
  - Cancellations must be made **at least 30 minutes before pickup time**.
- 🚗 **Vehicle Assignment**:
  - A driver cannot be assigned to **multiple trips simultaneously**.
  - Admins must ensure proper **vehicle allocation** for upcoming trips.
- 🚨 **Safety Measures**:
  - The app must allow **live trip tracking** for employee safety.
  - **SOS alerts** must be handled **within 5 minutes** of being raised.
- 📊 **Data & Privacy**:
  - Employee and trip details must be **secure** and **accessible only to authorized personnel**.
  - Trip data should be **retained for at least 6 months** for auditing purposes.

---

## 6. Technology Considerations

While this document does not specify implementation details, the app should:

- Support **Web and Mobile (iOS/Android)** for employees and drivers.
- Include a **web-based admin panel** for trip and fleet management.
- Provide **real-time notifications** for trip updates and emergency alerts.
- Ensure **secure authentication** and **role-based access control**.

---

## 7. Future Enhancements (Optional)

🚀 **Automated Route Optimization**: Assign cabs efficiently based on demand.  
🚀 **Multi-Tenant Support**: Allow different companies to use the platform.  
🚀 **AI-based Incident Detection**: Analyze travel patterns for potential risks.  
🚀 **Integration with Payroll**: Allow subscription fees to be deducted from salaries.

---

## 8. Summary

The Office Cab Booking App is designed to streamline employee transportation by providing **convenient** and **safe** booking options. It ensures **efficient vehicle management**, enhances **employee security**, and offers **real-time monitoring** through an admin dashboard.

By implementing this system, companies can **improve employee commute experiences**, **increase safety standards**, and **optimize fleet operations**.
