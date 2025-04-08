import { faker } from "@faker-js/faker";



export const generateRandomHoliday = () => {
  const holiday = {
    name: faker.commerce.productName(),
    destination: "CLuj-Napoca",
    transport:"Boat",
    startDate: faker.date.past(1).toISOString(),
    endDate: faker.date.future(1).toISOString(),
    transport_price: 20,
    accommodation_price: 100
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
