/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('owners', function (t) {
        t.increments('id').unsigned().primary();
        t.string('name').notNull();
        t.string('username', 255).notNull();
        t.text('password').notNull();
        t.string('country_code', 5).notNull();
        t.string('phone_number', 12).notNull();
        t.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    let dropQuery = `DROP TABLE owners`
    return knex.raw(dropQuery);  
};
