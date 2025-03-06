import { DataTypes, Model } from "sequelize";
import db from "../config/database.config"
import User from './userModel';

export interface PostAttributes {
    id: string;
    userId: string;
    title: string;
    body: string;

}


class Post extends Model<PostAttributes> {}

Post.init({
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    userId: { type: DataTypes.UUID, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
}, { sequelize:db, modelName: 'Post' });
                                                                                                                                                                                                                                                                                             

export default Post;
