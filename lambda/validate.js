const Ajv = require("ajv");
const fetch = require('./fetch');

module.exports = async (schema, data) => {
  let schema =  await fetch(schemas.strict);
  let validation = await validate(schema, data);
  return validation;
};

const validate = async (schema, data) => {
  const ajv = new Ajv({ loadSchema: fetch, validateFormats: false });
  // for now, ignore dependentRequired
  // (due to a bug in ajv/2019/20 that breaks https lookups)
  ajv.addKeyword("dependentRequired");

  const validator = await ajv.compileAsync(schema);
  return {
    pass: validator(data),
    errors: validator.errors
  };
}
