import sequelize from '../db/Sequelize.js';

import Contact from '../db/models/Contact.js';
import User from '../db/models/User.js';

export const connectDb = async () =>
    sequelize
        .authenticate()
        .then(async () => {
            console.log('Database connection successful');
            await User.sync({ alter: true });
            await Contact.sync({ alter: true });
        })
        .catch((error) => {
            console.error("Unable to connect to the database:", error);
            process.exit(1);
        });
