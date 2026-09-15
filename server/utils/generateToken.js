const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'super_secret_bca_project_jwt_key_2026', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
