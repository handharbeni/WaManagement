var bcrypt = require('bcryptjs');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('owners').del()
    .then(function () {
      // Inserts seed entries
      return knex('owners').insert([
        {
          id: 0,
          name: "Beni",
          username: "beni",
          phone_number: "81556617741",
          country_code: "+62",
          password: bcrypt.hashSync('beni', 8)
        }
      ]);
    });
};
