var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
const proxyquire = require('proxyquire');
const { sequelize, Sequelize } = require('sequelize-test-helpers');

describe('# Cart model', () => {
    const { DataTypes } = Sequelize;
    const CartFactory = proxyquire('../../models/cart', {
        sequelize: Sequelize,
        DataTypes: DataTypes
    });
    
    let Cart;
    before(() => {
        Cart = CartFactory(sequelize, DataTypes);
    })

    after(() => {
        Cart.init.resetHistory();
    })

    it('called Cart.init with the correct parameters', () => {
        expect(Cart.init).to.have.been.calledWith({},
          {
            sequelize,
            modelName: 'Cart'
          }
        );
    })
    
    context('associations', () => {
        const Product = 'dummy product';
        let CartItem;
        before(() => {
            Cart.associate({ Product });
        });

        it("defined a belongsToMany association with Product", () => {
            expect(Cart.belongsToMany).to.have.been.calledWith(Product, {
                through: CartItem,
                foreignKey: 'CartId',
                as: 'items'
            });
        });
    });
})