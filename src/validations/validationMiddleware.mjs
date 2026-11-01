import { validationResult } from 'express-validator'

export const validate = (req, res, next) => {
  const errors = validationResult(req)

  if (errors.isEmpty()) {
    return next()
  }

  req.validationErrors = errors.array()
  return next()
}