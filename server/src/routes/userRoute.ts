import { Router } from 'express';
import { UserController } from '../controllers';
import authMiddleware from '../middlewares/auth.middleware';

class UserRoutes extends UserController{
    public router: Router;
  
    constructor() {
      super();
      this.router = Router();
      this.routes();
    }
  
    private routes(): void {
        this.router.route('/register').post(this.create).get(this.index)
        this.router.route('/login').post(this.loginUser)
        this.router.route('/').get(authMiddleware.validateUserAccess, this.index)
    }
}
export default new UserRoutes().router;