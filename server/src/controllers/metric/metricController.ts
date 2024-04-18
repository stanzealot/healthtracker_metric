import { Request, Response,NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UserInstance } from '../../db/models/userModel';
import bcrypt from 'bcryptjs';
import {  createMetricUserSchema, createUserSchema, generateToken, loginUserSchema, options,  } from '../../utils/utils';
import { MetricInstance } from '../../db/models/metricModal';
import { date } from 'joi';



export default class MetricController {

  // method to create health metric
    protected async create(
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<Response> {
      try {
        let newId = uuidv4();
        let userId = req.user;
        
        const validationResult = createMetricUserSchema.validate(req.body, options);

        if (validationResult.error) {
          return res.status(400).json({
            msg: validationResult.error.details[0].message,
          });
        }
        
        const {date,quantity,category} = req.body;
        // let isoDate = new Date(useDate).toISOString();
        // console.log("date: ",isoDate);
        const user = await UserInstance.findOne({where: {id:userId}})
          if(!user){
            return res.status(404).json({
               msg:"User not found",
            })
           }
        
        const record = await MetricInstance.create({
          id: newId,
          userId: userId,
          quantity: quantity,
          date:date,
          category:category
        });
        
        const metrics = await MetricInstance.findOne({attributes: ['id','quantity','date','category'],where:{id:newId}});
        return res.json(
            metrics,
        );
      } catch (e) {   
        console.log(e);
        return res.status(500).json({ error: e.message });
      }
    };


    

    protected async get(req: Request, res: Response, next: NextFunction) {
      try{ 
        let userId = req.user;
        const user = await UserInstance.findOne({where: { id:userId }});

        return res.status(200).json({
          message: 'user fetched successful',
          user,
        });
        }catch(e){
            console.log(e)
            return res.status(500).json({ error: e.message });
        };
    }

   



    protected async index(req: Request, res: Response, next: NextFunction) {
      try{ 
          let userId = req.user;
          const record = await MetricInstance.findAll({attributes: ['id','quantity','date','category'],where:{userId}});
          if(!record){
            return res.status(404).json({
                msg:"User not found",
             });
          }
          return res.json(record);
        }catch(e){
            console.log(e)
            return res.status(500).json({ error: e.message });
        };
    }

    

    protected async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
      try {
        let {id} = req.params;
        console.log('reached here')
        const record = await MetricInstance.findOne({where: {id}})
       if(!record){
          return res.status(404).json({
             msg:"Cannot find user"
          })
        }
        const deletedRecord = await record.destroy()
        return res.json({
          msg: 'user deleted successfully.',
        });
      } catch (e) {
        console.log(e)
        return res.status(500).json({ error: e.message });
      }
    }
}