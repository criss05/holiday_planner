import { faker } from "@faker-js/faker";



export const generateRandomHoliday = () => {
  const holiday = {
    holiday_name: faker.commerce.productName(),
    holiday_destination: "CLuj-Napoca",
    holiday_transport:"Boat",
    holiday_start_date: faker.date.future().toISOString(),
    holiday_end_date: faker.date.past().toISOString(),
    holiday_transport_price: 20,
    holiday_accommodation_price: 100
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
