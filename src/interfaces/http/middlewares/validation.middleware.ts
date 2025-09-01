import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Logger } from '../../../utils/logger';

export class ValidationMiddleware {
  private logger = new Logger('ValidationMiddleware');

  validate = <T>(dtoClass: new () => T) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const dtoObject = plainToInstance(dtoClass, req.body);
      const errors = await validate(dtoObject as object);

      if (errors.length > 0) {
        const formattedErrors = this.formatErrors(errors);
        res.status(400).json({
          message: 'Validation failed',
          errors: formattedErrors
        });
        return;
      }

      req.validatedBody = dtoObject;
      next();
    };
  };

  private formatErrors(errors: ValidationError[]): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    
    errors.forEach(error => {
      const property = error.property;
      const constraints = error.constraints;
      
      if (constraints) {
        result[property] = Object.values(constraints);
      }
      
      if (error.children && error.children.length > 0) {
        const childErrors = this.formatErrors(error.children);
        Object.keys(childErrors).forEach(key => {
          result[`${property}.${key}`] = childErrors[key];
        });
      }
    });
    
    return result;
  }
}