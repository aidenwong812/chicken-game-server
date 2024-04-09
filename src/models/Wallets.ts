import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface WalletsAttributes {
    Id: number;
    AccountId: string;
    Username?: string;
    Wallet: string;
    Personal: boolean;
}

export type WalletsPk = 'Id';
export type WalletsId = Wallets[WalletsPk];
export type WalletsOptionalAttributes = 'Id' | 'Username';
export type WalletsCreationAttributes = Optional<
    WalletsAttributes,
    WalletsOptionalAttributes
>;

export class Wallets
    extends Model<WalletsAttributes, WalletsCreationAttributes>
    implements WalletsAttributes
{
    Id!: number;
    AccountId!: string;
    Username?: string;
    Wallet!: string;
    Personal!: boolean;

    static initModel(sequelize: Sequelize.Sequelize): typeof Wallets {
        return Wallets.init(
            {
                Id: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    primaryKey: true,
                },
                AccountId: {
                    type: DataTypes.BIGINT,
                    allowNull: false,
                },
                Username: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                Wallet: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                Personal: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'wallets',
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
