const Ajv = require("ajv");
const URL = require("url").URL;
const fetch = require('./fetch');

module.exports = async (schema, data) => {
  if(stringIsAValidUrl(schema)) {
    schema = await fetch(schema);
  }

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
};

const stringIsAValidUrl = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};
