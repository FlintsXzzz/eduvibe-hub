-- Confirm the test student email for testing
UPDATE auth.users SET email_confirmed_at = now() WHERE email = 'teststudent1@gmail.com';