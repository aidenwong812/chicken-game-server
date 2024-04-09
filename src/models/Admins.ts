import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface AdminAttributes {
    Id: number;
    AccountId: string;
}

export type AdminPk = 'Id';
export type AdminId = Admin[AdminPk];
export type AdminOptionalAttributes = 'Id';
export type AdminCreationAttributes = Optional<
    AdminAttributes,
    AdminOptionalAttributes
>;

export class Admin
    extends Model<AdminAttributes, AdminCreationAttributes>
    implements AdminAttributes
{
    Id!: number;
    AccountId!: string;

    static initModel(sequelize: Sequelize.Sequelize): typeof Admin {
        return Admin.init(
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
            },
            {
                sequelize,
                tableName: 'admins',
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
