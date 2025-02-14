export default {
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET,
  db: {
    uri: process.env.MONGODB_URI,
  },
  bcrypt_salt_round: 12,
};
