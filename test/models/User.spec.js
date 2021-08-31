var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
const proxyquire = require('proxyquire');
const { sequelize, Sequelize } = require('sequelize-test-helpers');

describe('# User model', () => {
    const { DataTypes } = Sequelize;
    const UserFactory = proxyquire('../../models/user', {
        sequelize: Sequelize,
        DataTypes: DataTypes
    });
    
    let User;
    before(() => {
        User = UserFactory(sequelize, DataTypes);
    })

    after(() => {
        User.init.resetHistory();
    })

    it('called User.init with the correct parameters', () => {
        expect(User.init).to.have.been.calledWith(
          {
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            role: DataTypes.STRING,
            account: DataTypes.STRING,
            address: DataTypes.STRING,
            phone: DataTypes.STRING
          },
          {
            sequelize,
            modelName: 'User'
          }
        );
    })

    context('associations', () => {
        const Order = 'dummy order';
        const Product = 'dummy product';
        let Favorite;
        before(() => {
            User.associate({ Order });
            User.associate({ Product });
        });

        it("defined a hasMany association with Order", () => {
            expect(User.hasMany).to.have.been.calledWith(Order);
        });

        it("defined a belongsToMany association with Product", () => {
            expect(User.belongsToMany).to.have.been.calledWith(Product, {
                through: Favorite,
                foreignKey: 'UserId',
                as: 'FavoritedProducts'
            });
        });
    });
})