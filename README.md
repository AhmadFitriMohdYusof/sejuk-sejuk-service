# Sejuk Sejuk Service

Air-conditioner service management system for technicians and admins.

## Features
- Admin order creation
- Technician job completion
- Performance dashboard
- Real-time notifications

## Technologies
- React.js
- Firebase (Firestore, Auth)
- Material-UI
- React Router

## Setup
1. Clone repository
```bash
git clone https://github.com/AhmadFitriMohdYusof/sejuk-sejuk-service.git
```

2. Install dependencies
```bash
npm install
```

3. Configure Firebase
- Create `.env` file with your Firebase config

4. Run development server
```bash
npm start
```

## Used this Demo Account and Password for Login
Email: admin@sejuk.com
Password: Admin_123

Email: ali@sejuk.com
Password: Ali_123

Email: min@sejuk.com
Password: Min_123

Email: john@sejuk.com
Password: John_123



# Challenges that I have faced

Module 3: Notification System Implementation
The notification system (Module 3) presented significant technical hurdles such as:

Initial Challenges

## WhatsApp API Limitations:
- WhatsApp's official API requires business verification and approval from Meta
- Twilio's WhatsApp integration demanded paid subscriptions and complex setup
- Temporary "click-to-chat" links proved unreliable for automated notifications

## Email Service Issues:
- Firebase's built-in email service lacked templates and customization
- SMTP setup with Nodemailer required backend server infrastructure
- Gmail's security policies blocked automated sending from frontend apps
