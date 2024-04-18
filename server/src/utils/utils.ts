import Joi from "joi";
import jwt from 'jsonwebtoken';

// export const createUserSchema = Joi.object().keys({
//     name: Joi.string().required(),
//     email: Joi.string().trim().lowercase().required(),
//     password: Joi.string().required().min(4),
//     confirmPassword: Joi.any().equal(Joi.ref('password')).required().label('Confirm password').messages({ 'any.only': '{{#label}} does not match' }),
// }).with('password', 'confirmPassword');
export const createUserSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().trim().lowercase().required(),
    password: Joi.string().required().min(4),
});

export const loginUserSchema = Joi.object().keys({
    email: Joi.string().trim().lowercase().required(),
    password: Joi.string().required(),
});
  

export const createMetricUserSchema = Joi.object().keys({
  category: Joi.string().required(),
  quantity: Joi.string().trim().lowercase().required(),
  date: Joi.string().required().min(4),
});
  
export const generateToken = (user: Record<string, unknown>): unknown => {
  const passPhrase = process.env.JWT_SECRETE as string;
  return jwt.sign(user, passPhrase, { expiresIn: '7d' });
};

  

  
export const options ={
    abortEarly:false,
    errors:{
        wrap:{
            label: ''
        }
    }
} 
