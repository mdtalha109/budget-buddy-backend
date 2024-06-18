export const config = {
  jwtSecret: process.env.JWT_SECRET || 'defaultSecret',
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
};
