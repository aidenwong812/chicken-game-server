import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface AdvertsAttributes {
    Id: number;
    Text: string;
    Url: string;
    Date: string;
    UserId: number;
    Type: string;
    MediaType: string;
}

export type AdvertsPk = 'Id';
export type AdvertsId = Adverts[AdvertsPk];
export type AdvertsOptionalAttributes =
    | 'Id'
    | 'Text'
    | 'Url'
    | 'Date'
    | 'MediaType';
export type AdvertsCreationAttributes = Optional<
    AdvertsAttributes,
    AdvertsOptionalAttributes
>;

export class Adverts
    extends Model<AdvertsAttributes, AdvertsCreationAttributes>
    implements AdvertsAttributes
{
    Id!: number;
    Text!: string;
    Url!: string;
    Date!: string;
    UserId!: number;
    Type!: string;
    MediaType!: string;

    static initModel(sequelize: Sequelize.Sequelize): typeof Adverts {
        return Adverts.init(
            {
                Id: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    primaryKey: true,
                },
                Text: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                Url: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                Date: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                UserId: {
                    type: DataTypes.BIGINT,
                    allowNull: false,
                },
                Type: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                MediaType: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'adverts',
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
