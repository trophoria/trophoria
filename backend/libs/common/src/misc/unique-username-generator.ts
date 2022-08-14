import { randomInt } from 'crypto';

export function generateNameFromEmail(email: string, randomDigits?: number) {
  const nameParts = email.replace(/@.+/, '');
  const name = nameParts.replace(/[&/\\#,+()$~%._@'":*?<>{}]/g, '');
  return name + randomNumber(randomDigits);
}

const randomNumber = (max: number) => {
  return randomInt(1 * Math.pow(10, max - 1), 9 * Math.pow(10, max - 1));
};
