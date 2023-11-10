import bcrypt from "bcrypt";
import hashingConfig from "../configs/hashing";
export function generateHash(input: string): string {
  return bcrypt.hashSync(input, hashingConfig.salt);
}
export function validateHash(
  input: string | undefined | null,
  hash: string
): boolean {
  if (!input) return false;
  return bcrypt.compareSync(input, hash);
}
