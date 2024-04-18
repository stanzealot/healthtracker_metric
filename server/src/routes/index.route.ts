import { Router, Request, Response } from 'express';
import { NotFoundError } from '../errors';
import serverConfig from '../config/server.config';
import systemMiddlewares from '../middlewares/system.middlewares';
import userRoute from './userRoute';
import metricRoute from './metricRoute';
import authMiddleware from '../middlewares/auth.middleware';

class Routes {
 public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.get('/', (req: Request, res: Response) => {
    return res.status(200).json({
        message: 'Welcome To PixelDat Expense Tracker Mobile App',
        data: {
        service: 'Health Metric Tracker',
        environment: serverConfig.NODE_ENV,
        version: '1.0.0',
        },
    });
    });

    this.router.use(systemMiddlewares.formatRequestQuery);
    
    this.router.use('/user',userRoute);

    this.router.use(authMiddleware.validateUserAccess);
    
    this.router.use('/api',metricRoute);
    
    this.router.all('*', () => {
        throw new NotFoundError('Resource not found.');
    });

  }


}
export default new Routes().router;