import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface BlockedTokensAttributes {
    Id: number;
    AccountId: string;
    Token: string;
}

export type BlockedTokensPk = 'Id';
export type BlockedTokensId = BlockedTokens[BlockedTokensPk];
export type BlockedTokensOptionalAttributes = 'Id';
export type BlockedTokensCreationAttributes = Optional<
    BlockedTokensAttributes,
    BlockedTokensOptionalAttributes
>;

export class BlockedTokens
    extends Model<BlockedTokensAttributes, BlockedTokensCreationAttributes>
    implements BlockedTokensAttributes
{
    Id!: number;
    AccountId!: string;
    Token!: string;

    static initModel(sequelize: Sequelize.Sequelize): typeof BlockedTokens {
        return BlockedTokens.init(
            {
                Id: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    primaryKey: true,
                },
                AccountId: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                Token: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'blockedtokens',
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
