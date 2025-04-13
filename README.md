POST /api/admin/register - Create a new admin (protected, super-admin only)
POST /api/admin/login - Login as admin
GET /api/admin/logout - Logout admin
GET /api/admin/me - Get current admin info (protected)
PUT /api/admin/updatedetails - Update admin details (protected)
PUT /api/admin/updatepassword - Update admin password (protected)


Email Configuration Variables
EMAIL_SERVICE=gmail

This specifies which email service provider to use
Common values: gmail, outlook, yahoo, hotmail, etc.
Nodemailer uses this to determine connection settings
EMAIL_USERNAME=your_email@gmail.com

Replace this with your actual email address
For Gmail, use your full Gmail address (e.g., listygosupport@gmail.com)
EMAIL_PASSWORD=your_email_password

For Gmail, this should NOT be your regular account password
Instead, use an "App Password" for security reasons (explained below)
EMAIL_FROM=support@listygo.com

The "From" display address in sent emails
Can be different from your actual email address
Recipients will see this as the sender
ADMIN_EMAIL=admin@yourcompany.com

The email address where admin notifications are sent
Used when users submit contact forms
Replace with your actual admin monitoring email