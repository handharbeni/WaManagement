exports.up = function(knex) {
    return knex.schema.table('template_message', table => {
      table.string('template_name', 128);
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.table('template_message', table => {
      table.dropColumn('template_name');
    })
  };