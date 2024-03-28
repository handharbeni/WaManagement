/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('groups_contacts', function (t) {
        t.increments('id').unsigned().primary();
        t.timestamps(true, true);
        t.integer('owner_id').unsigned();
        t.foreign("owner_id").references("owners.id");
        t.integer('group_id').unsigned();
        t.foreign("group_id").references("groups.id");
        t.integer('contact_id').unsigned();
        t.foreign("contact_id").references("contacts.id");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    let dropQuery = `DROP TABLE groups_contacts`
    return knex.raw(dropQuery);  
};
