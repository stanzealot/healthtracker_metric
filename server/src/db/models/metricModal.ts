import { DataTypes, Model } from 'sequelize';
import db from '..';


interface MetricAttributes {
    id: string;
    userId:string
    category: string;
    quantity: string;
    date: String;
}
   
export class MetricInstance extends Model<MetricAttributes> {}
  
MetricInstance.init({
    id: {
        type:DataTypes.STRING, 
        primaryKey:true,
        allowNull:false
    }, 
    userId: {
        type:DataTypes.STRING, 
        allowNull:false
    }, 
    quantity: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
            msg: 'Quantity is required',
            },
            notEmpty: {
            msg: 'Quantity cannot be empty',
            },
        },
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
            msg: 'Category is required',
            },
            notEmpty: {
            msg: 'Category cannot be empty',
            },
        },
    },
    
   
    },
    {
      sequelize: db,
      modelName: 'metric',
    },
);
