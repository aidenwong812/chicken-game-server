import express from 'express';
import { Op } from 'sequelize';
import { StatusCode } from '../enums/StatusCode';
import dataContext from '../database';

const routes = express.Router();

routes.post('/addGroup', async (req, res) => {
    const { chatId } = req.body;
    const ChatId = chatId ? chatId.toString() : '';
    let Group = await dataContext.Groups.findOne({
        where: {
            ChatId: {
                [Op.eq]: ChatId,
            },
        },
    });
    if (!Group) {
        Group = await dataContext.Groups.create({
            ChatId,
        });
    }
    return res.status(StatusCode.OK).send({
        Group,
    });
});

routes.get('/deleteGroup', async (req, res) => {
    const { chatId } = req.query;
    const ChatId = chatId ? chatId.toString() : '';
    await dataContext.Groups.destroy({
        where: {
            ChatId: {
                [Op.eq]: ChatId,
            },
        },
    });

    return res.status(StatusCode.OK).send({
        removed: true,
    });
});

export default routes;
