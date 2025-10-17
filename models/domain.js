const Sequelize = require('sequelize');

class Domain extends Sequelize.Model{
    static initiate(sequelize){
        Domain.init(
            {
                host: {
                    type: Sequelize.STRING(80),
                    allowNull: false,
                },
                type: {
                    type: Sequelize.ENUM('free', 'premium'),
                    allowNull: false,
                },
                clientSecret: {
                    type: Sequelize.UUID,
                    allowNull: false,
                },
            },{
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: 'Domain',
                tableName: 'domains',
                paranoid: true,
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci',
            }
        );
    }

    static associate(db) {
        db.Domain.belongsTo(db.User);  //User : 1 <-> N : Post
    }
}

module.exports = Domain;