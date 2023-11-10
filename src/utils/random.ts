const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const specialChars = "!@#$%^&*";

export function randString(config: IRandStringConfig): string {
  let characters = "";
  if (config.uppercase || config.alphaNumeric) {
    characters += uppercase;
  }
  if (config.lowercase || config.alphaNumeric) {
    characters += lowercase;
  }
  if (config.numbers || config.alphaNumeric) {
    characters += numbers;
  }
  if (config.specialChars) {
    characters += specialChars;
  }
  let randomChars = "";
  for (let i = 0; i < config.length; i++) {
    randomChars += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return randomChars;
}

interface IRandStringConfig {
  length: number;
  specialChars?: boolean;
  numbers?: boolean;
  uppercase?: boolean;
  lowercase?: boolean;
  alphaNumeric?: boolean;
}
