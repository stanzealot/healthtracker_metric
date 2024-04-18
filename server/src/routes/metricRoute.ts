import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import { MetricController } from '../controllers';

class MetricRoutes extends MetricController{
    public router: Router;
  
    constructor() {
      super();
      this.router = Router();
      this.routes();
    }
  
    private routes(): void {
        this.router.route('/').get(this.index);
        this.router.route('/create').post(this.create);
        this.router.route('/delete/:id').delete(this.delete);
        
    }
}
export default new MetricRoutes().router;