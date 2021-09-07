var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
const proxyquire = require('proxyquire');
const { sequelize, Sequelize } = require('sequelize-test-helpers');

describe('# Category model', () => {
    const { DataTypes } = Sequelize;
    const CategoryFactory = proxyquire('../../models/category', {
        sequelize: Sequelize,
        DataTypes: DataTypes
    });
    
    let Category;
    before(() => {
        Category = CategoryFactory(sequelize, DataTypes);
    })

    after(() => {
        Category.init.resetHistory();
    })

    it('called Category.init with the correct parameters', () => {
        expect(Category.init).to.have.been.calledWith(
          {
            name: DataTypes.STRING
          },
          {
            sequelize,
            modelName: 'Category'
          }
        );
    })

    context('associations', () => {
        const Product = 'dummy product';
        before(() => {
            Category.associate({ Product });
        });

        it("defined a hasMany association with Product", () => {
            expect(Category.hasMany).to.have.been.calledWith(Product);
        });
    });
})