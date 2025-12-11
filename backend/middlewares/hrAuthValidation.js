import Joi from "joi";

export const hrSignupValidation = (req, res, next) => {
  const schema = Joi.object({
    hrName: Joi.string().min(3).max(30).required(),
    hrDOB: Joi.date().required(),
    hrEmail: Joi.string().email().required(),
    hrAddress: Joi.string().min(3).max(100).required(),
    hrPhone: Joi.string().min(10).max(13).required(),
    hrDepartment: Joi.string().min(2).max(13).required(),

    hrPassword: Joi.string().min(3).max(100).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: "Bad request", error });
  next();
};

export const hrLoginValidation = (req, res, next) => {
  const schema = Joi.object({
    hrID: Joi.string().min(13).max(13).required(), // change min and max according to ID length
    hrPassword: Joi.string().min(3).max(100).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: "Bad request", error });
  next();
};

