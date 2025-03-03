import {DataTypes, Deferrable} from "sequelize";

import sequelize from "../Sequelize.js";
import User from "./User.js";

const Contact = sequelize.define(
    'contact',
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        favorite: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        owner: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
                deferrable: Deferrable.NOT,
            },
        },
    },
    {
        timestamps: false,
    }
)

Contact.sync();

export default Contact;

