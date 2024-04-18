import { Request, Response, NextFunction } from 'express';
import serverConfig from '../config/server.config';
import { BadRequestError } from '../errors';
import jwt from 'jsonwebtoken';
import { UserInstance } from '../db/models/userModel';
const secret = process.env.JWT_SECRETE as string;

// import authHelper from '../helpers/auth.helper';

class AuthenticationMiddleware {
    public async validateUserAccess(req: Request, res: Response, next: NextFunction):Promise<unknown> {
      try {
        const authorization = req.header("x-auth-token");
        if (!authorization)  return res.status(401).json({ msg: "No token provided." });
        let token: string;
        if (authorization.startsWith('Bearer ')) {
          [, token] = authorization.split(' ');
        } else {
          token = authorization;
        }
        
        // const token = req.header("x-auth-token");
        // if (!token) return res.status(401).json({ msg: "No token provided." });
        let verified = jwt.verify(token, secret);

        if (!verified) {
          return res.status(401).json({
            error: 'User not verified, access denied',
          });
        }

      const { id } = verified as { [key: string]: string };

      const user = await UserInstance.findOne({ where: { id } });

      if (!user) {
        return res.status(404).json({
          msg: 'User not verified',
        });
    }
    
    req.user = id;
    req.token = token;
     next();
      } catch (error) {
        return res.status(500).json({ error: error.message });
        // serverConfig.DEBUG(`Error in authentication middleware validate user access method: ${error}`);
        next(error);
      }
    }
  }
  
  export default new AuthenticationMiddleware();