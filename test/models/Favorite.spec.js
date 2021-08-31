var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
const proxyquire = require('proxyquire');
const { sequelize, Sequelize } = require('sequelize-test-helpers');

describe('# Favorite model', () => {
    const { DataTypes } = Sequelize;
    const FavoriteFactory = proxyquire('../../models/favorite', {
        sequelize: Sequelize,
        DataTypes: DataTypes
    });
    
    let Favorite;
    before(() => {
        Favorite = FavoriteFactory(sequelize, DataTypes);
    })

    after(() => {
        Favorite.init.resetHistory();
    })

    it('called Favorite.init with the correct parameters', () => {
        expect(Favorite.init).to.have.been.calledWith(
          {
            UserId: DataTypes.INTEGER,
            ProductId: DataTypes.INTEGER
          },
          {
            sequelize,
            modelName: 'Favorite'
          }
        );
    })
})