'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsToMany(models.Cart, {
        through: models.CartItem,
        foreignKey: 'ProductId',
        as: 'carts'
      })
      Product.belongsToMany(models.Order, {
        through: models.OrderItem,
        foreignKey: 'ProductId',
        as: 'orders'
      }),
      Product.belongsTo(models.Category),
      Product.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: 'ProductId',
        as: 'FavoritedUsers'
      })
    }
  };
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};