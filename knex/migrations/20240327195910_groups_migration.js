/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('groups', function (t) {
        t.increments('id').unsigned().primary();
        t.timestamps(true, true);
        t.string('name').notNull();
        t.integer('owner_id').unsigned();
        t.foreign("owner_id").references("owners.id");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    let dropQuery = `DROP TABLE groups`
    return knex.raw(dropQuery);  
};
