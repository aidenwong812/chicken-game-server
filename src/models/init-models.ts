import type { Sequelize } from 'sequelize';
import { Account as _Account } from './Account';
import type { AccountAttributes } from './Account';

import { Wallets as _Wallets } from './Wallets';
import type { WalletsAttributes } from './Wallets';

import { Logs as _Logs } from './Logs';
import type { LogsAttributes } from './Logs';

import { Admin as _Admin } from './Admins';
import type { AdminAttributes } from './Admins';

import { Groups as _Groups } from './Groups';
import type { GroupsAttributes } from './Groups';

import { Invoice as _Invoice } from './Invoice';
import type { InvoiceAttributes } from './Invoice';

import { LastProcessedBlock as _LastProcessedBlock } from './LastProcessedBlock';
import type { LastProcessedBlockAttributes } from './LastProcessedBlock';

import { BlockedTokens as _BlockedTokens } from './BlockedTokens';
import type { BlockedTokensAttributes } from './BlockedTokens';

import { Adverts as _Adverts } from './Adverts';
import type { AdvertsAttributes } from './Adverts';

export {
    _Account as Account,
    _Wallets as Wallets,
    _Logs as Logs,
    _Admin as Admin,
    _Groups as Groups,
    _Invoice as Invoice,
    _LastProcessedBlock as LastProcessedBlock,
    _BlockedTokens as BlockedTokens,
    _Adverts as Adverts,
};

export type {
    AccountAttributes,
    WalletsAttributes,
    LogsAttributes,
    AdminAttributes,
    GroupsAttributes,
    InvoiceAttributes,
    LastProcessedBlockAttributes,
    BlockedTokensAttributes,
    AdvertsAttributes,
};

export function initModels(sequelize: Sequelize) {
    const Account = _Account.initModel(sequelize);
    const Wallets = _Wallets.initModel(sequelize);
    const Logs = _Logs.initModel(sequelize);
    const Admin = _Admin.initModel(sequelize);
    const Groups = _Groups.initModel(sequelize);
    const Invoices = _Invoice.initModel(sequelize);
    const LastProcessedBlock = _LastProcessedBlock.initModel(sequelize);
    const BlockedTokens = _BlockedTokens.initModel(sequelize);
    const Adverts = _Adverts.initModel(sequelize);

    return {
        Account,
        Wallets,
        Logs,
        Admin,
        Groups,
        Invoices,
        LastProcessedBlock,
        BlockedTokens,
        Adverts,
    };
}
