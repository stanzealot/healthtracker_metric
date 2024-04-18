import { DataTypes, Model } from 'sequelize';
import db from '..';
import { MetricInstance } from './metricModal';


interface UserAttributes {
    id: string;
    name: string;
    email: string;
    password: string;
   
    isVerified: boolean;
    otp?: number;
    otpExpiration?: number;
}
   
export class UserInstance extends Model<UserAttributes> {}
  
UserInstance.init({
    id: {
        type:DataTypes.STRING, 
        primaryKey:true,
        allowNull:false
    }, 
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
            msg: 'name is required',
            },
            notEmpty: {
            msg: 'name cannot be empty',
            },
        },
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
            msg: 'Email is required',
            },
            notEmpty: {
            msg: 'Email cannot be empty',
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
            msg: 'Password is required',
            },
            notEmpty: {
            msg: 'Password cannot be empty',
            },
        },
    },
    

    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
   
    },
    {
      sequelize: db,
      modelName: 'User',
    },
);

UserInstance.hasMany(MetricInstance, {foreignKey:'userId',
as:'metric'
})

MetricInstance.belongsTo(UserInstance,{foreignKey:'userId',
as:'User'}) 