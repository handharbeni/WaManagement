/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('contacts', function (t) {
        t.increments('id').unsigned().primary();
        t.timestamps(true, true);
        t.string('name').notNull();
        t.string('country_code', 5).notNull();
        t.string('phone_number', 12).notNull();
        t.integer('owner_id').unsigned();
        t.foreign("owner_id").references("owners.id");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    let dropQuery = `DROP TABLE contacts`
    return knex.raw(dropQuery);  
};
