/**
 * Generates a secure but easy-to-understand password
 * The password will be 8-10 characters long with a symbol and number at the beginning or end
 */
export function generateSecurePassword(): string {
  // Define character sets
  const letters = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed confusing characters like l, I, O, 0
  const numbers = '23456789'; // Removed confusing numbers like 0, 1
  const symbols = '!@#$%&*+-=?';
  
  // Determine password length (between 8 and 10)
  const passwordLength = Math.floor(Math.random() * 3) + 8;
  
  // Generate the main part of the password (letters only)
  let password = '';
  for (let i = 0; i < passwordLength - 2; i++) {
    password += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Add a random number
  const randomNumber = numbers.charAt(Math.floor(Math.random() * numbers.length));
  
  // Add a random symbol
  const randomSymbol = symbols.charAt(Math.floor(Math.random() * symbols.length));
  
  // Decide whether to add the number and symbol at the beginning or end
  const addAtBeginning = Math.random() > 0.5;
  
  if (addAtBeginning) {
    return randomNumber + randomSymbol + password;
  } else {
    return password + randomSymbol + randomNumber;
  }
} 