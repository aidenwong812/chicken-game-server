import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface AccountAttributes {
    Id: number;
    CreationDate: Date;
    AccountId: string;
    Type: string;
    Chains: string;
    MinimumAmount: number;
    PubKey: string;
    PriKey: string;
    Username: string;
    Referrer: string;
    ReferralAmount: number;
    PremiumDate: Date;
}

export type AccountPk = 'Id';
export type AccountId = Account[AccountPk];
export type AccountOptionalAttributes = 'Id' | 'Chains' | 'MinimumAmount';
export type AccountCreationAttributes = Optional<
    AccountAttributes,
    AccountOptionalAttributes
>;

export class Account
    extends Model<AccountAttributes, AccountCreationAttributes>
    implements AccountAttributes
{
    Id!: number;
    CreationDate!: Date;
    AccountId!: string;
    Type!: string;
    Chains!: string;
    MinimumAmount!: number;
    PubKey!: string;
    PriKey!: string;
    Username!: string;
    Referrer!: string;
    ReferralAmount!: number;
    PremiumDate!: Date;

    static initModel(sequelize: Sequelize.Sequelize): typeof Account {
        return Account.init(
            {
                Id: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    primaryKey: true,
                },
                CreationDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                AccountId: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                Type: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                Chains: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                MinimumAmount: {
                    type: DataTypes.BIGINT,
                    allowNull: true,
                },
                PubKey: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                PriKey: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                Username: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                Referrer: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                ReferralAmount: {
                    type: DataTypes.BIGINT,
                    allowNull: true,
                },
                PremiumDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'account',
                timestamps: false,
                freezeTableName: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'Id' }],
                    },
                ],
            },
        );
    }
}
