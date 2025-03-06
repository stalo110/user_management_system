import User from './userModel';
import Address from './addressModel';
import Post from './postModel';

export const setupAssociations = () => {
    User.hasOne(Address, { foreignKey: 'userId' });
    Address.belongsTo(User, { foreignKey: 'userId' });

    User.hasMany(Post, { foreignKey: 'userId' });
    Post.belongsTo(User, { foreignKey: 'userId' });
};

export { User, Address, Post };
