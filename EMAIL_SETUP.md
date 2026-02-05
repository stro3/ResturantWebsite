# Email Configuration for Gastronome Restaurant

## For Gmail SMTP (Recommended for demo)
EMAIL_USER=your.restaurant.email@gmail.com
EMAIL_PASS=your_app_password

## Alternative SMTP Services
# For Outlook/Hotmail:
# EMAIL_USER=your.restaurant.email@outlook.com
# EMAIL_PASS=your_password
# SMTP_HOST=smtp-mail.outlook.com
# SMTP_PORT=587

# For Yahoo Mail:
# EMAIL_USER=your.restaurant.email@yahoo.com
# EMAIL_PASS=your_app_password
# SMTP_HOST=smtp.mail.yahoo.com
# SMTP_PORT=587

## Professional Email Setup Instructions:

### Option 1: Gmail (Easiest for testing)
1. Create a Gmail account for your restaurant (e.g., gastronome.restaurant@gmail.com)
2. Enable 2-Factor Authentication
3. Generate an "App Password" specifically for this application
4. Update EMAIL_USER and EMAIL_PASS in backend/.env

### Option 2: Professional Email Service
1. Use your domain email (e.g., reservations@gastronome.com)
2. Get SMTP credentials from your email provider
3. Update EMAIL_USER, EMAIL_PASS, and SMTP settings

## To Enable Live Email Sending:
1. Update the credentials in backend/.env
2. In backend/app.py, uncomment the SMTP code in send_reservation_email function
3. Comment out the demo simulation code

## Current Status:
- ✅ Professional email templates created
- ✅ Email confirmation system implemented  
- ✅ Error handling and validation added
- ⚠️ Email sending is simulated for demo (no actual emails sent)
- 📧 To send real emails, configure credentials and enable SMTP code