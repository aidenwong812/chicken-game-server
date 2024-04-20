import express from 'express';
import { Op } from 'sequelize';
import { ethers } from 'ethers';
import { accountDTO } from '../DTO/account';
import { StatusCode } from '../enums/StatusCode';
import dataContext from '../database';

const routes = express.Router();
const defaultChains = ['eth', 'bsc', 'arb', 'base'];

routes.post('/addWallet', async (req, res) => {
    const { accountId, wallet, username, personal } = req.body;
    // console.log(
    //     'accountId, wallet, username----',
    //     accountId,
    //     wallet,
    //     username,
    //     personal,
    // );
    let Wallet;

    Wallet = await dataContext.Wallets.findOne({
        where: {
            Wallet: {
                [Op.eq]: wallet,
            },
            AccountId: {
                [Op.eq]: accountId,
            },
        },
    });

    if (Wallet) {
        await Wallet.update({
            Username: username,
        });
        return res.status(StatusCode.OK).send({
            wallet: Wallet!.Id,
            status: 'update',
        });
    }

    return res.status(StatusCode.OK).send({
        wallet: Wallet!.Id,
        status: 'create',
    });
});

routes.get('/getAccountsByWallet', async (req, res) => {
    const { wallet } = req.query;
    const Wallet: string = wallet ? wallet.toString() : '';
    const Wallets: any[] = await dataContext.Wallets.findAll({
        where: {
            Wallet: {
                [Op.eq]: Wallet,
            },
        },
    });

    return res.status(StatusCode.OK).send({
        wallets: Wallets,
    });
});

routes.get('/getMyWallets', async (req, res) => {
    const { accountId } = req.query;
    const AccountId: any = accountId || 0;
    const Wallets: any[] = await dataContext.Wallets.findAll({
        where: {
            AccountId: {
                [Op.eq]: AccountId,
            },
            Personal: {
                [Op.eq]: true,
            },
        } as any,
    });
    return res.status(StatusCode.OK).send({
        wallets: Wallets,
    });
});

routes.get('/stalkedWallets', async (req, res) => {
    const { accountId } = req.query;
    const AccountId: any = accountId || 0;
    const Wallets: any[] = await dataContext.Wallets.findAll({
        where: {
            AccountId: {
                [Op.eq]: AccountId,
            },
            Personal: {
                [Op.eq]: false,
            },
        } as any,
    });
    return res.status(StatusCode.OK).send({
        wallets: Wallets,
    });
});

routes.post('/addLog', async (req, res) => {
    const { accountId, wallet } = req.body;

    const Account = await dataContext.Account.findOne({
        where: {
            AccountId: {
                [Op.eq]: accountId,
            },
        },
    });

    if (!Account) {
        res.status(StatusCode.InternalServerError).send({
            result: 'Account Not Registered',
        });
    }

    const Log = await dataContext.Logs.create({
        AccountId: accountId,
        Wallet: wallet,
        Timestamp: new Date(),
    });

    return res.status(StatusCode.OK).send({
        Account: Account!.Id,
        Log: Log.Id,
    });
});

routes.get('/getWalletById', async (req, res) => {
    const { id } = req.query;
    const Id = id ? parseInt(id.toString(), 10) : 0;
    const Wallet: any = await dataContext.Wallets.findOne({
        where: {
            Id: {
                [Op.eq]: Id,
            },
        },
    });

    return res.status(StatusCode.OK).send({
        Wallet,
    });
});

routes.post('/updateWalletUsername', async (req, res) => {
    const { id, username } = req.body;
    const Id = id ? parseInt(id.toString(), 10) : 0;
    const Wallet: any = await dataContext.Wallets.findOne({
        where: {
            Id: {
                [Op.eq]: Id,
            },
        },
    });
    await Wallet.update({
        Username: username,
    });

    return res.status(StatusCode.OK).send({
        ok: true,
    });
});

routes.post('/removeWallet', async (req, res) => {
    const { id } = req.body;
    const Id = id ? parseInt(id.toString(), 10) : 0;
    await dataContext.Wallets.destroy({
        where: {
            Id: {
                [Op.eq]: Id,
            },
        },
    });

    return res.status(StatusCode.OK).send({
        ok: true,
    });
});

routes.get('/getAccountByUserId', async (req, res) => {
    const { userId } = req.query;
    const UserId = userId ? parseInt(userId.toString(), 10) : 0;
    const Account = await dataContext.Account.findOne({
        where: {
            AccountId: {
                [Op.eq]: UserId,
            },
        },
        attributes: [
            'AccountId',
            'Type',
            'Chains',
            'MinimumAmount',
            'PubKey',
            'Username',
            'Referrer',
            'ReferralAmount',
            'PremiumDate',
        ],
    });

    return res.status(StatusCode.OK).send({
        Account,
    });
});

routes.post('/addAccount', async (req, res) => {
    const { accountId, chatType, username, payload } = req.body;
    const UserId = accountId ? parseInt(accountId.toString(), 10) : 0;
    let Referrer;
    let referrer = '';
    if (payload) {
        Referrer = await dataContext.Account.findOne({
            where: {
                Username: {
                    [Op.eq]: payload,
                },
            },
        });

        if (Referrer) {
            referrer = payload;
        }
    }

    let Account;
    Account = await dataContext.Account.findOne({
        where: {
            AccountId: {
                [Op.eq]: UserId,
            },
        },
    });

    if (!Account) {
        const wallet = ethers.Wallet.createRandom();

        Account = await dataContext.Account.create({
            AccountId: accountId,
            Type: chatType,
            CreationDate: new Date(),
            Chains: JSON.stringify(defaultChains),
            Referrer: referrer,
            ReferralAmount: 0,
            PubKey: wallet.address,
            PriKey: wallet.privateKey,
            Username: username,
            PremiumDate: new Date(),
        });

        await Referrer?.update({
            ReferralAmount: Referrer.ReferralAmount + 1,
        });
    }

    return res.status(StatusCode.OK).send({
        Account: {
            AccountId: Account?.AccountId,
            Type: Account?.Type,
            Chains: Account?.Chains,
            MinimumAmount: Account?.MinimumAmount,
            PubKey: Account?.PubKey,
            Username: Account?.Username,
            Referrer: Account?.Referrer,
            ReferralAmount: Account?.ReferralAmount,
            PremiumDate: Account?.PremiumDate,
        },
    });
});

routes.post('/updateChains', async (req, res) => {
    const { userId, chains } = req.body;
    const UserId = userId ? parseInt(userId.toString(), 10) : 0;
    const Account = await dataContext.Account.findOne({
        where: {
            AccountId: {
                [Op.eq]: UserId,
            },
        },
    });

    if (Account) {
        await Account.update({
            Chains: chains,
        });
    }
    return res.status(StatusCode.OK).send({ res: 'Success!' });
});

routes.post('/updateMinimumAmount', async (req, res) => {
    const { userId, amount } = req.body;
    const UserId = userId ? parseInt(userId.toString(), 10) : 0;
    const Account = await dataContext.Account.findOne({
        where: {
            AccountId: {
                [Op.eq]: UserId,
            },
        },
    });

    if (Account) {
        await Account.update({
            MinimumAmount: amount,
        });
    }
    return res.status(StatusCode.OK).send({ res: 'Success' });
});

routes.get('/checkIfAccountExist', async (req, res) => {
    const { userId } = req.query;
    const UserId = userId ? parseInt(userId.toString(), 10) : 0;
    const Account = await dataContext.Account.findOne({
        where: {
            AccountId: {
                [Op.eq]: UserId,
            },
        },
    });
    return res.status(StatusCode.OK).send({
        existed: !!Account,
    });
});

routes.get('/checkIfAccountUsernameExist', async (req, res) => {
    const { username } = req.query;
    const Username = username ? username.toString() : '';
    const Account = await dataContext.Account.findOne({
        where: {
            Username: {
                [Op.eq]: Username,
            },
        },
    });

    return res.status(StatusCode.OK).send({
        existed: !!Account,
    });
});

routes.get('/getReferralLeaderboard', async (req, res) => {
    const Accounts = await dataContext.Account.findAll({
        order: [['ReferralAmount', 'DESC']],
        limit: 50,
        attributes: ['AccountId', 'Username', 'ReferralAmount'],
    });
    return res.status(StatusCode.OK).send({
        Referrals: Accounts,
    });
});

routes.get('/getReferralCountByUsername', async (req, res) => {
    const { username } = req.query;
    const Username = username ? username.toString() : '';
    let rank = 0;
    const Account = await dataContext.Account.findOne({
        where: {
            Username: {
                [Op.eq]: Username,
            },
        },
    });

    if (Account && Account.ReferralAmount) {
        const Accounts = await dataContext.Account.findAll({
            where: {
                ReferralAmount: {
                    [Op.not]: 0,
                },
            },
            order: [['ReferralAmount', 'DESC']],
        });
        const referralAmounts = Accounts.map(account => account.ReferralAmount);
        rank = referralAmounts.indexOf(Account!.ReferralAmount) + 1;
    }

    return res.status(StatusCode.OK).send({
        referralCount: Account?.ReferralAmount,
        rank,
    });
});

routes.get('/checkIfAddableToMine', async (req, res) => {
    try {
        const { accountId } = req.query;
        const AccountId: any = accountId || 0;
        const Account = await dataContext.Account.findOne({
            where: {
                AccountId: {
                    [Op.eq]: AccountId,
                },
            },
        });
        if (Account) {
            const premiumIf =
                new Date(Account!.PremiumDate).getTime() > new Date().getTime();
            const Wallets = await dataContext.Wallets.findAll({
                where: {
                    AccountId: {
                        [Op.eq]: AccountId,
                    },
                    Personal: true,
                },
            });
            const addable =
                (premiumIf && Wallets.length < 15) ||
                (!premiumIf && Wallets.length < 2);
            return res.status(StatusCode.OK).send({
                addable,
            });
        }
        return res.status(StatusCode.OK).send({
            addable: false,
        });
    } catch (err) {
        return res.status(StatusCode.OK).send({
            addable: false,
        });
    }
});

routes.get('/checkIfScanable', async (req, res) => {
    const { accountId } = req.query;
    const AccountId: any = accountId || 0;
    const Account = await dataContext.Account.findOne({
        where: {
            AccountId: {
                [Op.eq]: AccountId,
            },
        },
    });
    if (Account) {
        const premiumIf =
            new Date(Account!.PremiumDate).getTime() > new Date().getTime();
        const timestampOf1DayAgo = Date.now() - 24 * 60 * 60 * 1000;
        const logs = await dataContext.Logs.findAll({
            where: {
                AccountId: {
                    [Op.eq]: AccountId,
                },
                Timestamp: {
                    [Op.gt]: timestampOf1DayAgo,
                },
            },
        });

        return res.status(StatusCode.OK).send({
            scanable: premiumIf || logs.length < 5,
        });
    }
    return res.status(StatusCode.OK).send({
        scanable: false,
    });
});

routes.get('/checkIfPremium', async (req, res) => {
    const { accountId } = req.query;
    const AccountId: any = accountId || 0;
    const Account = await dataContext.Account.findOne({
        where: {
            AccountId: {
                [Op.eq]: AccountId,
            },
        },
    });
    if (Account) {
        const premiumIf =
            new Date(Account!.PremiumDate).getTime() > new Date().getTime();
        return res.status(StatusCode.OK).send({
            premiumIf,
        });
    }
    return res.status(StatusCode.OK).send({
        premiumIf: false,
    });
});

routes.get('/checkIfStalkable', async (req, res) => {
    const { accountId } = req.query;
    const AccountId: any = accountId || 0;
    const Account = await dataContext.Account.findOne({
        where: {
            AccountId: {
                [Op.eq]: AccountId,
            },
        },
    });
    if (Account) {
        const premiumIf =
            new Date(Account!.PremiumDate).getTime() > new Date().getTime();
        const stalkedWallets = await dataContext.Wallets.findAll({
            where: {
                AccountId: {
                    [Op.eq]: AccountId,
                },
                Personal: {
                    [Op.eq]: false,
                },
            },
        });
        return res.status(StatusCode.OK).send({
            stalkable:
                (premiumIf && stalkedWallets.length < 10) ||
                (!premiumIf && stalkedWallets.length < 2),
        });
    }
    return res.status(StatusCode.OK).send({
        stalkable: false,
    });
});

routes.get('/getAllAccounts', async (req, res) => {
    const Accounts = await dataContext.Account.findAll();
    const AccountsDTO = Accounts.map(account => accountDTO(account));
    return res.status(StatusCode.OK).send({
        Accounts: AccountsDTO,
    });
});

export default routes;
