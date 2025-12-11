import Joi from "joi";

export const employeeSignupValidation = (req, res, next) => {
  const schema = Joi.object({
    employeeName: Joi.string().min(3).max(30).required(),
    employeeDOB: Joi.date().required(),
    employeeEmail: Joi.string().email().required(),
    employeeAddress: Joi.string().min(3).max(100).required(),
    employeePhone: Joi.string().min(10).max(13).required(),
    employeeDepartment: Joi.string().min(2).max(13).required(),

    employeePassword: Joi.string().min(3).max(100).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: "Bad request", error });
  next();
};

export const employeeLoginValidation = (req, res, next) => {
  const schema = Joi.object({
    employeeID: Joi.string().min(14).max(14).required(), // change min and max according to ID length
    employeePassword: Joi.string().min(3).max(100).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: "Bad request", error });
  next();
};
