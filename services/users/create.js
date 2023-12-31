import airDB from 'services/airtableClient';
import Joi from 'joi';
import crypto from 'crypto';
import { handlePasswordHash } from 'utils';

const schema = Joi.object({
  email: Joi.string().email().required(),
  fullName: Joi.string().required(),
  password: Joi.string().required()
});

const checkEmail = async (email) => {
  const existingUser = await airDB('users')
    .select({ filterByFormula: `email="${email}"` })
    .firstPage();

  if (existingUser && existingUser[0]) {
    throw new Error('email_taken');
  }
};

const create = async (payload) => {
  const { email, fullName, password } = await schema.validateAsync(payload);
  await checkEmail(email);
  const passwordSalt = crypto.randomBytes(16).toString('hex');
  const passwordHash = handlePasswordHash(password, passwordSalt);

  const user = await airDB('users').create([
    {
      fields: {
        email,
        fullName,
        passwordSalt,
        passwordHash,
        role: 'regular'
      }
    }
  ]);

  return user;
};

export default create;
