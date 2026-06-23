const { generateValue } = require('../utils/fieldMapper');

const MAX_RECORDS = 50000; // POC ke liye safe upper limit

function generateSingleRecord(fields) {
  const record = {};

  fields.forEach((field) => {
    record[field.name] = generateValue(field.type);
  });

  return record;
}

function generateBulkData(schema) {
  const { fields, record_count } = schema;

  if (!fields || !Array.isArray(fields) || fields.length === 0) {
    throw new Error('Schema mein valid fields nahi mile');
  }

  let count = record_count && record_count > 0 ? record_count : 100;

  if (count > MAX_RECORDS) {
    count = MAX_RECORDS;
  }

  const records = [];
  for (let i = 0; i < count; i++) {
    records.push(generateSingleRecord(fields));
  }

  return records;
}

module.exports = { generateBulkData, generateSingleRecord };