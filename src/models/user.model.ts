import { DataTypes, Optional } from 'sequelize';
import db from '.';

export interface UserAttributes {
    id: string;
    email: string;
    username?: string;
    profileImage?: string;
    bio?: string;
    darkmode?: boolean;
    locale?: string;
    expired?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

//payloads for dto
// export interface UserInput extends Omit<UserAttributes, 'id' | 'email'> {}
export interface UserInput extends Pick<UserAttributes, 'id' | 'email' | 'username'> {}
export interface UserOutput extends Required<UserAttributes> {}

export const User = db.sequelize.define(
    'user',
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        profileImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        darkmode: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        locale: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'en',
        },
        expired: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        indexes: [
            { unique: true, fields: ['id'] },
            { unique: true, fields: ['email'] },
            { type: 'FULLTEXT', fields: ['username', 'email'] },
        ],
    }
);
