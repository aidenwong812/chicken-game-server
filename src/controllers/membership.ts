import express from 'express';
import { Op } from 'sequelize';
import { StatusCode } from '../enums/StatusCode';
import dataContext from '../database';

const routes = express.Router();
const ETH_PRICE = process.env.PREMIUM_PRICE
    ? parseFloat(process.env.PREMIUM_PRICE)
    : 0.04;

routes.get('/handleMembership', async (req, res) => {
    const { userId } = req.query;
    const UserId = userId ? parseInt(userId.toString(), 10) : 0;
    const Account = await dataContext.Account.findOne({
        where: {
            AccountId: {
                [Op.eq]: UserId,
            },
        },
    });

    const Invoice = await dataContext.Invoices.create({
        AccountId: UserId,
        PaymentType: 'eth',
        Amount: ETH_PRICE,
        CreatedDate: new Date(),
        Paid: false,
        TicketAmount: 1,
        Expired: false,
        Type: 'membership',
    });

    return res.status(StatusCode.OK).send({
        address: Account?.PubKey,
        invoiceId: Invoice.Id,
        price: ETH_PRICE,
    });
});

routes.get('/checkMembershipStatus', async (req, res) => {
    const { userId } = req.query;
    const UserId = userId ? parseInt(userId.toString(), 10) : 0;
    const Account = await dataContext.Account.findOne({
        where: {
            AccountId: {
                [Op.eq]: UserId,
            },
        },
    });
    if (Account) {
        res.status(StatusCode.OK).send({
            premium: Account.PremiumDate,
        });
    } else {
        res.status(StatusCode.OK).send({
            premium: 0,
        });
    }
});

export default routes;
