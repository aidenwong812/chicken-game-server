import express from 'express';
import { Op } from 'sequelize';
import { StatusCode } from '../enums/StatusCode';
import dataContext from '../database';

const routes = express.Router();

routes.get('/checkIfAdmin', async (req, res) => {
    const { accountId } = req.query;
    const AccountId = accountId ? accountId.toString() : '';
    const Admin = await dataContext.Admin.findOne({
        where: {
            AccountId: {
                [Op.eq]: AccountId,
            },
        },
    });

    return res.status(StatusCode.OK).send({
        adminIf: !!Admin,
    });
});

routes.get('/getStats', async (req, res) => {
    const timestampOf1DayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const timestampOf7DayAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const users = await dataContext.Account.count();
    const groups = await dataContext.Groups.count();
    const scans = await dataContext.Logs.count({
        where: {
            Timestamp: {
                [Op.gt]: new Date(timestampOf1DayAgo),
            },
        },
    });

    const scans7d = await dataContext.Logs.count({
        where: {
            Timestamp: {
                [Op.gt]: new Date(timestampOf7DayAgo),
            },
        },
    });

    return res.status(StatusCode.OK).send({
        users,
        groups,
        scans,
        scans_7d: scans7d,
    });
});

export default routes;
