import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface InvoiceAttributes {
    Id: number;
    AccountId: number;
    PaymentType: string;
    Amount: number;
    TicketAmount: number;
    CreatedDate: Date;
    PaidDate?: Date;
    Paid: boolean;
    Expired: boolean;
    Type: string;
    Text: string;
    Url: string;
    AdDate: string;
}

export type InvoicePk = 'Id';
export type InvoiceId = Invoice[InvoicePk];
export type InvoiceOptionalAttributes =
    | 'Id'
    | 'AccountId'
    | 'Text'
    | 'Url'
    | 'AdDate';
export type InvoiceCreationAttributes = Optional<
    InvoiceAttributes,
    InvoiceOptionalAttributes
>;

export class Invoice
    extends Model<InvoiceAttributes, InvoiceCreationAttributes>
    implements InvoiceAttributes
{
    Id!: number;
    AccountId!: number;
    PaymentType!: string;
    Amount!: number;
    TicketAmount!: number;
    CreatedDate!: Date;
    PaidDate?: Date;
    Paid!: boolean;
    Expired!: boolean;
    Type!: string;
    Text!: string;
    Url!: string;
    AdDate!: string;

    static initModel(sequelize: Sequelize.Sequelize): typeof Invoice {
        return Invoice.init(
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
                PaymentType: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                Amount: {
                    type: DataTypes.BIGINT,
                    allowNull: false,
                },
                TicketAmount: {
                    type: DataTypes.BIGINT,
                    allowNull: false,
                },
                CreatedDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                PaidDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                Paid: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                },
                Expired: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                },
                Type: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                Text: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                Url: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                AdDate: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'invoices',
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
