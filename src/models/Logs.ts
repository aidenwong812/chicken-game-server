import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface LogsAttributes {
    Id: number;
    AccountId: string;
    Wallet: string;
    Timestamp: Date;
}

export type LogsPk = 'Id';
export type LogsId = Logs[LogsPk];
export type LogsOptionalAttributes = 'Id';
export type LogsCreationAttributes = Optional<
    LogsAttributes,
    LogsOptionalAttributes
>;

export class Logs
    extends Model<LogsAttributes, LogsCreationAttributes>
    implements LogsAttributes
{
    Id!: number;
    Timestamp!: Date;
    AccountId!: string;
    Wallet!: string;

    static initModel(sequelize: Sequelize.Sequelize): typeof Logs {
        return Logs.init(
            {
                Id: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    primaryKey: true,
                },
                Timestamp: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                AccountId: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                Wallet: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'logs',
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
