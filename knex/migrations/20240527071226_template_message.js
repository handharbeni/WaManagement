/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('template_message', function (t) {
        t.increments('id').unsigned().primary();
        t.timestamps(true, true);
        t.integer('owner_id').unsigned();
        t.foreign("owner_id").references("owners.id");
        t.text('template', 'longtext');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    let dropQuery = `DROP TABLE template_message`
    return knex.raw(dropQuery);  
};
