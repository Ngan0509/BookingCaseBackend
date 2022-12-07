'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'jack1102ng@gmail.com',
      password: '123456',
      firstName: 'Lê Ngân',
      lastName: 'Nguyễn Hoàng',
      address: 'Việt Nam',
      gender: 0,
      typeRole: 'ROL',
      keyRole: 'R1',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
