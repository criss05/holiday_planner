import { faker } from "@faker-js/faker";



export const generateRandomHoliday = () => {
  const holiday = {
    name: faker.commerce.productName(),
    // destination: faker.address.city(),
    // transport: faker.random.arrayElement(["Plane", "Train", "Car", "Bus", "Boat"]),
    startDate: faker.date.future().toISOString(),
    endDate: faker.date.past().toISOString(),
  };
  return holiday;
};

export const generateRandomHolidays = (num = 2) => {
  const newHolidays = [];
  for (let i = 0; i < num; i++) {
    newHolidays.push(generateRandomHoliday());
  }
  return newHolidays;
};
