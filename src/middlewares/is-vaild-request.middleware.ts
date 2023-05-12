import {Request, Response, NextFunction} from 'express';

export const preventInvalidRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body.Body) next();
};
