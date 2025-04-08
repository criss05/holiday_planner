import { faker } from "@faker-js/faker";



export const generateRandomHoliday = () => {
  const startDate = faker.date.future(); // Start date is in the future
  const endDate = faker.date.between({ from: startDate, to: faker.date.future() });

  const holiday = {
    name: faker.commerce.productName(),
    destination: "CLuj-Napoca",
    transport:"Boat",
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
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
