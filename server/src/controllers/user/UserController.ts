import { Request, Response,NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UserInstance } from '../../db/models/userModel';
import bcrypt from 'bcryptjs';
import {  createUserSchema, generateToken, loginUserSchema, options } from '../../utils/utils';


export default class UserController {

  // method to create user
    protected async create(
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<Response> {
      try {
        let newId = uuidv4();
        
        const validationResult = createUserSchema.validate(req.body, options);
    
        if (validationResult.error) {
          return res.status(400).json({
            msg: validationResult.error.details[0].message,
          });
        }
    
        const duplicateEmail = await UserInstance.findOne({
          where: { email: req.body.email },
        });
        if (duplicateEmail) {
          return res.status(409).json({
            msg: 'email is already taken',
          });
        }
    
        const passwordHash = await bcrypt.hash(req.body.password, 8);
    
        const record = await UserInstance.create({
          id: newId,
          name: req.body.name,
          email: req.body.email,
          password: passwordHash,
          
        });
    
        return res.json({
          record,
          // token,
        });
      } catch (e) {   
        console.log(e);
        res.status(500).json({ error: e.message });
        next(e);
      }
    }


    protected async loginUser(req: Request,res: Response,next: NextFunction): Promise<Response> {
      try {
      
        const validationResult = loginUserSchema.validate(req.body, options);
    
        if (validationResult.error) {
          return res.status(400).json({ msg: validationResult.error.details[0].message });
        }
        let User = (await UserInstance.findOne({ where: { email: req.body.email } })) as unknown as { [key: string]: string };
    
        if (!User) {
          return res.status(403).json({ msg: 'User not found' });
        }
    
    
        const { id,name,password,email} = User;

        const userData = { id, name, password, email }; 

        const token = generateToken({ id });

        const validUser = await bcrypt.compare(req.body.password, password);
        if (!validUser) {
          return res.status(401).json({ msg: 'Password do not match' });
        }
        if (validUser) {
          return res.json({  token, ...userData });
        }
      } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
        next(e);
      }
    }


    protected async get(req: Request, res: Response, next: NextFunction) {
      try{ 
        const { id } = req.params;
        const user = await UserInstance.findOne({where: { id }});
        return res.status(200).json({
          message: 'user fetched successful',
          user,
        });
        }catch(err){
            console.log(err)
            res.status(500).json({
            msg:res.status(500).send(err),
            route:'/user/:id'
          })
        };
    }

   


   

   


    protected async index(req: Request, res: Response, next: NextFunction) {
      try{ 
          const users = await UserInstance.findAll();
          return res.status(200).json({ status: 200, msg: 'Users found successfully',users });
        }catch(err){
            console.log(err)
            res.status(500).json({
            msg:res.status(500).send(err),
          })
        };
    }

    

    protected async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
      try {
      const { params: { id } } = req;

       const record = await UserInstance.findOne({where: {id}})
       if(!record){
          return res.status(404).json({
             msg:"Cannot find user"
          })
        }
        const deletedRecord = await record.destroy()
        return res.status(200).json({
          msg: 'user deleted successfully.',
        });
      } catch (err) {
        console.log(err)
          res.status(500).json({
          msg:res.status(500).send(err),
          route:'/user/:id'
         })
      }
    }
}