import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface GroupsAttributes {
    Id: number;
    ChatId: string;
}

export type GroupsPk = 'Id';
export type GroupsId = Groups[GroupsPk];
export type GroupsOptionalAttributes = 'Id';
export type GroupsCreationAttributes = Optional<
    GroupsAttributes,
    GroupsOptionalAttributes
>;

export class Groups
    extends Model<GroupsAttributes, GroupsCreationAttributes>
    implements GroupsAttributes
{
    Id!: number;
    ChatId!: string;

    static initModel(sequelize: Sequelize.Sequelize): typeof Groups {
        return Groups.init(
            {
                Id: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    primaryKey: true,
                },
                ChatId: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'groups',
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
