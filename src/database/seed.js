import {faker} from '@faker-js/faker';
import dotenv from "dotenv";
import pkg from 'pg';
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

const NUM_HOLIDAYS = 100_000;  // Number of holidays to insert
const NUM_MEMORIES = 10;      // Number of memories per holiday

async function insertData() {
  console.time('Data generation');
  
  // Loop through to insert holiday data
  for (let i = 0; i < NUM_HOLIDAYS; i++) {
    const holidayName = faker.lorem.words(1);
    const holidayDestination = faker.location.city();
    const holidayStartDate = faker.date.recent(365 * 2); // Random date in the next two years
    const holidayEndDate = faker.date.between({from: holidayStartDate, to: '2027-12-31'});
    const holidayTransport = faker.helpers.arrayElement(['car', 'ship', 'plane', 'train', 'bus']);
    const holidayTransportPrice = faker.number.int({ min: 100, max: 3000 });
    const holidayAccommodation = faker.helpers.arrayElement(['hotel', 'motel', 'hostel', 'apartment', 'cabin', 'resort', 'villa', 'campsite']);
    const holidayAccommodationPrice = faker.number.int({ min: 50, max: 1000 });
    const holidayAccommodationName = faker.lorem.words(1);
    const holidayAccommodationLocation = faker.lorem.words(1);

    // Insert holiday data into the 'Holidays' table
    const holidayRes = await pool.query(
      `INSERT INTO Holidays (holiday_name, holiday_destination, holiday_start_date, holiday_end_date,
                              holiday_transport, holiday_transport_price, holiday_accommodation, 
                              holiday_accommodation_price, holiday_accommodation_name, holiday_accommodation_location)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING holiday_id`,
      [
        holidayName,
        holidayDestination,
        holidayStartDate.toISOString().split('T')[0],
        holidayEndDate.toISOString().split('T')[0],
        holidayTransport,
        holidayTransportPrice,
        holidayAccommodation,
        holidayAccommodationPrice,
        holidayAccommodationName,
        holidayAccommodationLocation
      ]
    );

    const holidayId = holidayRes.rows[0].holiday_id;

    // Prepare and insert memories related to this holiday
    const memoryInserts = [];
    for (let j = 0; j < NUM_MEMORIES; j++) {
      memoryInserts.push(pool.query(
        `INSERT INTO uploaded_memories (holiday_id, filename, original_name, file_path)
         VALUES ($1, $2, $3, $4)`,
        [
          holidayId,
          faker.system.fileName(),
          faker.system.fileName(),
          `/uploads/${faker.string.uuid()}.jpg`
        ]
      ));
    }

    await Promise.all(memoryInserts);

    // Log progress every 1000 holidays
    if (i % 1000 === 0) console.log(`Inserted ${i} holidays...`);
  }

  console.timeEnd('Data generation');
  await pool.end();
}

insertData().catch(console.error);