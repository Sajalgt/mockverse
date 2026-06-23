const { faker } = require('@faker-js/faker');

// Mapping: Gemini se aane wale field type string ko Faker function se jodta hai
const fieldMap = {
  // Personal Info
  name: () => faker.person.fullName(),
  first_name: () => faker.person.firstName(),
  last_name: () => faker.person.lastName(),
  email: () => faker.internet.email(),
  phone: () => faker.phone.number(),
  username: () => faker.internet.username(),
  password: () => faker.internet.password(),

  // Address / Location
  address: () => faker.location.streetAddress(),
  city: () => faker.location.city(),
  state: () => faker.location.state(),
  country: () => faker.location.country(),
  zipcode: () => faker.location.zipCode(),
  latitude: () => faker.location.latitude(),
  longitude: () => faker.location.longitude(),

  // Date / Time
  date: () => faker.date.recent().toISOString(),
  past_date: () => faker.date.past().toISOString(),
  future_date: () => faker.date.future().toISOString(),
  time: () => faker.date.recent().toTimeString(),
  night_time: () => {
    const hour = faker.number.int({ min: 0, max: 4 });
    const minute = faker.number.int({ min: 0, max: 59 });
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  },

  // Business / Company
  company: () => faker.company.name(),
  job_title: () => faker.person.jobTitle(),
  department: () => faker.commerce.department(),

  // Numbers / IDs
  id: () => faker.string.uuid(),
  number: () => faker.number.int({ min: 1, max: 10000 }),
  price: () => faker.commerce.price(),
  rating: () => faker.number.float({ min: 1, max: 5, precision: 0.1 }),
  percentage: () => faker.number.int({ min: 0, max: 100 }),

  // Internet / Tech
  url: () => faker.internet.url(),
  ip_address: () => faker.internet.ip(),
  user_agent: () => faker.internet.userAgent(),

  // Text
  text: () => faker.lorem.sentence(),
  paragraph: () => faker.lorem.paragraph(),
  word: () => faker.lorem.word(),

  // Boolean
  boolean: () => faker.datatype.boolean(),

  // Misc
  color: () => faker.color.human(),
  image_url: () => faker.image.url(),
};

// Fallback function — agar field type map mein nahi mila
function generateValue(fieldType) {
  const normalizedType = fieldType.toLowerCase().trim();

  if (fieldMap[normalizedType]) {
    return fieldMap[normalizedType]();
  }

  // Agar exact match nahi mila, partial match try karo
  // (jaise "delhi_address" ko "address" se match karna)
  const partialMatch = Object.keys(fieldMap).find((key) =>
    normalizedType.includes(key)
  );

  if (partialMatch) {
    return fieldMap[partialMatch]();
  }

  // Kuch bhi match nahi hua toh generic text fallback
  return faker.lorem.word();
}

module.exports = { generateValue, fieldMap };