import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface LastProcessedBlockAttributes {
    Id: number;
    BlockNumber?: number;
    TimeStamp?: number;
}

export type LastProcessedBlockPk = 'Id';
export type LastProcessedBlockId = LastProcessedBlock[LastProcessedBlockPk];
export type LastProcessedBlockOptionalAttributes = 'Id';
export type LastProcessedBlockCreationAttributes = Optional<
    LastProcessedBlockAttributes,
    LastProcessedBlockOptionalAttributes
>;

export class LastProcessedBlock
    extends Model<
        LastProcessedBlockAttributes,
        LastProcessedBlockCreationAttributes
    >
    implements LastProcessedBlockAttributes
{
    Id!: number;
    BlockNumber!: number;
    TimeStamp!: number;

    static initModel(
        sequelize: Sequelize.Sequelize,
    ): typeof LastProcessedBlock {
        return LastProcessedBlock.init(
            {
                Id: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    primaryKey: true,
                },
                BlockNumber: {
                    type: DataTypes.BIGINT,
                    allowNull: false,
                },
                TimeStamp: {
                    type: DataTypes.BIGINT,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'lastProcessedBlock',
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
