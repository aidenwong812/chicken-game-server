import { Sequelize } from 'sequelize';
import { initModels } from './models/init-models';

export const sequelize = new Sequelize(
    'scanner',
    process.env.DATABASE_USERNAME!,
    process.env.DATABASE_PASSWORD,
    {
        dialect: 'mysql',
        // eslint-disable-next-line no-console
        logging: console.log,
        define: {
            timestamps: false,
        },
    },
);

sequelize.addHook('beforeCount', options => {
    // eslint-disable-next-line no-param-reassign
    if (!(options as any).forceIncludeCount) options.include = undefined;
    // if ((this as any)._scope.include && this._scope.include.length > 0) {
    //     options.distinct = true;
    //     options.col =
    //         this._scope.col ||
    //         options.col ||
    //         `"${this.options.name.singular}".id`;
    // }

    // if (options.include && options.include.length > 0) {
    //     options.include = null;
    // }
});

// sequelize.authenticate();

const dataContext = initModels(sequelize);

export default dataContext;
