var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
const proxyquire = require('proxyquire');
const { sequelize, Sequelize } = require('sequelize-test-helpers');

describe('# Product model', () => {
    const { DataTypes } = Sequelize;
    const ProductFactory = proxyquire('../../models/product', {
        sequelize: Sequelize,
        DataTypes: DataTypes
    });
    
    let Product;
    before(() => {
        Product = ProductFactory(sequelize, DataTypes);
    })

    after(() => {
        Product.init.resetHistory();
    })

    it('called Product.init with the correct parameters', () => {
        expect(Product.init).to.have.been.calledWith(
          {
            name: DataTypes.STRING,
            price: DataTypes.INTEGER,
            description: DataTypes.TEXT,
            image: DataTypes.STRING,
            CategoryId: DataTypes.INTEGER
          },
          {
            sequelize,
            modelName: 'Product'
          }
        );
    })

    context('associations', () => {
        const Cart = 'dummy cart';
        const Order = 'dummy order';
        const Category = 'dummy category';
        const User = 'dummy user';
        let CartItem;
        let OrderItem;
        let Favorite;
        before(() => {
            Product.associate({ Cart });
            Product.associate({ Order });
            Product.associate({ Category });
            Product.associate({ User });
        });

        it("defined a belongsToMany association with Cart", () => {
            expect(Product.belongsToMany).to.have.been.calledWith(Cart, {
                through: CartItem,
                foreignKey: 'ProductId',
                as: 'carts'
            });
        });

        it("defined a belongsToMany association with Order", () => {
            expect(Product.belongsToMany).to.have.been.calledWith(Order, {
                through: OrderItem,
                foreignKey: 'ProductId',
                as: 'orders'
            });
        });

        it("defined a belongsTo association with Category", () => {
            expect(Product.belongsTo).to.have.been.calledWith(Category);
        });

        it("defined a belongsToMany association with User", () => {
            expect(Product.belongsToMany).to.have.been.calledWith(User, {
                through: Favorite,
                foreignKey: 'ProductId',
                as: 'FavoritedUsers'
            });
        });
    });
})