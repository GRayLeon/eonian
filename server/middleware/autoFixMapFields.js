// utils/autoMapFixer.js

function autoFixMapFields(schema) {
  schema.pre('validate', function (next) {
    const doc = this;

    const schemaPaths = schema.paths;

    for (const [path, schemaType] of Object.entries(schemaPaths)) {
      // Array of Map
      if (
        schemaType.instance === 'Array' &&
        schemaType.caster &&
        schemaType.caster.instance === 'Map'
      ) {
        const val = doc.get(path);
        if (Array.isArray(val)) {
          const fixed = val.map(item =>
            item instanceof Map ? item : new Map(Object.entries(item))
          );
          doc.set(path, fixed);
        }
      }

      // Single Map
      if (schemaType.instance === 'Map') {
        const val = doc.get(path);
        if (val && !(val instanceof Map)) {
          doc.set(path, new Map(Object.entries(val)));
        }
      }
    }

    next();
  });
}

module.exports = autoFixMapFields;
