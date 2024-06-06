/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('template_values', function (t) {
        t.increments('id').unsigned().primary();
        t.timestamps(true, true);
        t.integer('owner_id').unsigned();
        t.foreign("owner_id").references("owners.id");
        t.integer('template_id').unsigned();
        t.foreign("template_id").references("template_message.id");
        t.integer('template_field_id').unsigned();
        t.foreign("template_field_id").references("template_fields.id");
        t.text('field', 'longtext');
        t.text('value', 'longtext');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    let dropQuery = `DROP TABLE template_values`
    return knex.raw(dropQuery);  
};
