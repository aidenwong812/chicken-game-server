import express from 'express';
import { Op } from 'sequelize';
import { StatusCode } from '../enums/StatusCode';
import dataContext from '../database';

const routes = express.Router();

routes.get('/getBlockedTokensByUserId', async (req, res) => {
    const { userId } = req.query;
    const UserId = userId ? parseInt(userId.toString(), 10) : 0;
    const BlockedTokens = await dataContext.BlockedTokens.findAll({
        where: {
            AccountId: {
                [Op.eq]: UserId,
            },
        },
    });

    return res.status(StatusCode.OK).send({
        BlockedTokens,
    });
});

routes.post('/updateBlockedTokens', async (req, res) => {
    const { userId, tokens } = req.body;
    const UserId = userId ? parseInt(userId.toString(), 10) : 0;

    await dataContext.BlockedTokens.destroy({
        where: {
            AccountId: {
                [Op.eq]: UserId,
            },
        },
    });

    if (tokens) {
        tokens.forEach(async (token: string) => {
            await dataContext.BlockedTokens.create({
                AccountId: userId,
                Token: token,
            });
        });
    }

    return res.status(StatusCode.OK).send('Success');
});

export default routes;
