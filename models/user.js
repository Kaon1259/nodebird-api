const Sequelize = require('sequelize');

class User extends Sequelize.Model{
    static initiate(sequelize){
        User.init(
            {
                email: {
                    type: Sequelize.STRING(255),
                    allowNull: true,
                    unique:true
                },
                nick: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                },
                password: {
                    type: Sequelize.STRING(100),
                    allowNull: true,
                },
                provider: {
                    type: Sequelize.ENUM('local', 'kakao', 'naver', 'google'),
                    allowNull: false,
                    defaultValue: 'local',
                },
                snsId: {
                    type: Sequelize.STRING(255),
                    allowNull: true,
                }
            },{
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: 'User',
                tableName: 'users',
                paranoid: true,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }

    static associate(db) {
        db.User.hasMany(db.Post);  //User : 1 <-> N : Post
        db.User.belongsToMany(db.User, {
            foreignKey : 'followingId',
            as: 'Followers',
            through : 'Follow'
        });
        db.User.belongsToMany(db.User, {
            foreignKey : 'followerId',
            as: 'Followings',
            through : 'Follow'
        });
        db.User.hasMany(db.Domain);
    }
}

module.exports = User;