// Frontend utility to validate against temporary email addresses
// This helps maintain quality user registrations

const TEMPORARY_EMAIL_DOMAINS = [
  // Popular temporary email services
  '10minutemail.com',
  '10minutemail.net',
  '20minutemail.com',
  '30minutemail.com',
  'guerillamail.com',
  'guerillamail.org',
  'guerrillamail.com',
  'guerrillamail.org',
  'mailinator.com',
  'mailinator.net',
  'mailinator.org',
  'tempmail.org',
  'temp-mail.org',
  'yopmail.com',
  'yopmail.fr',
  'throwaway.email',
  'throwawaymail.com',
  'disposablemail.com',
  'disposableemail.com',
  'temporaryemail.net',
  'tempemailaddress.com',
  'tempmailaddress.com',
  'fakeinbox.com',
  'mailcatch.com',
  'maildrop.cc',
  'sharklasers.com',
  'discardmail.com',
  'trashmail.com',
  'getnada.com',
  'tempail.com',
  'burnermail.io',
  'spam4.me',
  'getairmail.com',
  'tempr.email',
  'emailondeck.com',
  'tempinbox.com',
  'mohmal.com',
  'mytemp.email',
  'luxusmail.org',
  'emailfake.com',
  'tempmail.net',
  'temp-mail.io',
  'temporarymail.com',
  'tempmail.de',
  'mail.tm',
  'tempmailo.com',
  'tempmail.plus',
  'emailtemp.org'
];

/**
 * Check if an email domain is from a temporary email service
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if the email is from a temporary service
 */
export const isTemporaryEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const domain = email.toLowerCase().split('@')[1];
  if (!domain) {
    return false;
  }

  return TEMPORARY_EMAIL_DOMAINS.includes(domain);
};

/**
 * Validate email for registration - checks format and temporary domains
 * @param {string} email - The email address to validate
 * @returns {object} - Validation result with success status and message
 */
export const validateEmailForRegistration = (email) => {
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return {
      isValid: false,
      message: 'Email is required'
    };
  }

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: 'Please enter a valid email address'
    };
  }

  if (isTemporaryEmail(email)) {
    return {
      isValid: false,
      message: 'Please use a permanent email address. We don\'t have time to send you promotional mails.'
    };
  }

  return {
    isValid: true,
    message: 'Email is valid'
  };
};
