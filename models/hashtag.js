// models/hashtag.js
const { Model, STRING } = require('sequelize');

class Hashtag extends Model {
  static initiate(sequelize) {
    Hashtag.init(
      {
        title: {
          type: STRING(15),
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Hashtag',
        tableName: 'hashtags',
        paranoid: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci', // ← 오타 수정
      }
    );
  }

  static associate(db) {
    // Post ↔ Hashtag (N:M), 중간 테이블: PostHashtag
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' }); // ← this 사용
  }
}

module.exports = Hashtag;
