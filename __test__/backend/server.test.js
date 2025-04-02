import request from "supertest";
import app from "@/pages/api/server.js";

describe("Holiday Planner API", () => {
  // 🟢 Test GET /holidays
  test("GET /holidays should return a list of holidays", async () => {
    const response = await request(app).get("/holidays");
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // 🟢 Test GET /
  test("GET / should redirect to /holidays", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(302); 
    expect(response.headers.location).toBe("/holidays");
});


  // 🟢 Test GET /holidays?filter=Done
  test("GET /holidays should return a list of holidays", async () => {
    const response = await request(app).get(`/holidays?filter=${"Done"}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // 🟢 Test GET /holidays?filter=Done
  test("GET /holidays should return a list of holidays", async () => {
    const response = await request(app).get(`/holidays?filter=${"Upcoming"}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // 🟢 Test GET /holidays?sortBy="StartDate"
  test("GET /holidays should return a list of holidays", async () => {
    const response = await request(app).get(`/holidays?sortBy=${"Start Date"}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // 🟢 Test GET /holidays?sortBy="EndDate"
  test("GET /holidays should return a list of holidays", async () => {
    const response = await request(app).get(`/holidays?sortBy=${"End Date"}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // 🟢 Test GET /holidays?sortBy="Name"
  test("GET /holidays should return a list of holidays", async () => {
    const response = await request(app).get(`/holidays?sortBy=${"Name"}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // 🟢 Test POST /holidays (Valid Holiday)
  test("POST /holidays should create a new holiday", async () => {
    const newHoliday = {
      name: "Test Holiday",
      destination: "Test City",
      startDate: "2025-12-10",
      endDate: "2025-12-20",
      transport: "Plane",
      transport_price: 300,
      accomodation: "Hotel",
      accomodation_name: "Test Hotel",
      accomodation_price: 500,
      accomodation_location: "Test Location",
    };

    const response = await request(app).post("/holidays").send(newHoliday);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(newHoliday.name);
  });

  // 🔴 Test POST /holidays (Invalid Data)
  test("POST /holidays should return 400 if required fields are missing", async () => {
    const invalidHoliday = { name: "Invalid Holiday" }; // Missing fields

    const response = await request(app).post("/holidays").send(invalidHoliday);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

 // 🔴 Test POST /holidays (Invalid StartDate)
  test("POST /holidays should return 400 if startDate is invalid", async () => {
    const invalidHoliday = { name: "Test Holiday",
        destination: "Test City",
        startDate: "invalid",
        endDate: "2025-12-20",
        transport: "Plane",
        transport_price: 300,
        accomodation: "Hotel",
        accomodation_name: "Test Hotel",
        accomodation_price: 500,
        accomodation_location: "Test Location", }; // Missing fields

    const response = await request(app).post("/holidays").send(invalidHoliday);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

   // 🔴 Test POST /holidays (Invalid EndDate)
  test("POST /holidays should return 400 if endDate is invalid", async () => {
    const invalidHoliday = { name: "Test Holiday",
        destination: "Test City",
        startDate: "2025-12-20",
        endDate: "invalid",
        transport: "Plane",
        transport_price: 300,
        accomodation: "Hotel",
        accomodation_name: "Test Hotel",
        accomodation_price: 500,
        accomodation_location: "Test Location", }; // Missing fields

    const response = await request(app).post("/holidays").send(invalidHoliday);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

   // 🔴 Test POST /holidays (Invalid Dates)
  test("POST /holidays should return 400 if endDate is before startDate", async () => {
    const invalidHoliday = { name: "Test Holiday",
        destination: "Test City",
        startDate: "2025-12-20",
        endDate: "2025-12-13",
        transport: "Plane",
        transport_price: 300,
        accomodation: "Hotel",
        accomodation_name: "Test Hotel",
        accomodation_price: 500,
        accomodation_location: "Test Location", }; // Missing fields

    const response = await request(app).post("/holidays").send(invalidHoliday);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

   // 🔴 Test POST /holidays (Invalid transport Price)
  test("POST /holidays should return 400 if transportPrice < 0", async () => {
    const invalidHoliday = { name: "Test Holiday",
        destination: "Test City",
        startDate: "2025-12-20",
        endDate: "2025-12-21",
        transport: "Plane",
        transport_price: -300,
        accomodation: "Hotel",
        accomodation_name: "Test Hotel",
        accomodation_price: 500,
        accomodation_location: "Test Location", }; // Missing fields

    const response = await request(app).post("/holidays").send(invalidHoliday);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

   // 🔴 Test POST /holidays (Invalid accomodation price)
  test("POST /holidays should return 400 if accomodationPrice < 0", async () => {
    const invalidHoliday = { name: "Test Holiday",
        destination: "Test City",
        startDate: "2025-12-20",
        endDate: "2025-12-21",
        transport: "Plane",
        transport_price: 300,
        accomodation: "Hotel",
        accomodation_name: "Test Hotel",
        accomodation_price: -500,
        accomodation_location: "Test Location", }; // Missing fields

    const response = await request(app).post("/holidays").send(invalidHoliday);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

   // 🔴 Test POST /holidays (Invalid transport)
  test("POST /holidays should return 400 if transport not invalid", async () => {
    const invalidHoliday = { name: "Test Holiday",
        destination: "Test City",
        startDate: "2025-12-20",
        endDate: "2025-12-21",
        transport: "invalid",
        transport_price: 300,
        accomodation: "Hotel",
        accomodation_name: "Test Hotel",
        accomodation_price: 500,
        accomodation_location: "Test Location", }; // Missing fields

    const response = await request(app).post("/holidays").send(invalidHoliday);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

   // 🔴 Test POST /holidays (Invalid Accomodation)
  test("POST /holidays should return 400 if accomodation not invalid", async () => {
    const invalidHoliday = { name: "Test Holiday",
        destination: "Test City",
        startDate: "2025-12-20",
        endDate: "2025-12-21",
        transport: "Car",
        transport_price: 300,
        accomodation: "invalid",
        accomodation_name: "Test Hotel",
        accomodation_price: 500,
        accomodation_location: "Test Location", }; // Missing fields

    const response = await request(app).post("/holidays").send(invalidHoliday);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  // 🔴 Test POST /holidays (Start date in the past)
  test("POST /holidays should return 400 if startDate is in the past", async () => {
    const invalidHoliday = { name: "Test Holiday",
        destination: "Test City",
        startDate: "2024-12-21",
        endDate: "2025-12-21",
        transport: "Car",
        transport_price: 300,
        accomodation: "Hotel",
        accomodation_name: "Test Hotel",
        accomodation_price: 500,
        accomodation_location: "Test Location", }; // Missing fields

    const response = await request(app).post("/holidays").send(invalidHoliday);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

// 🟢 Test PUT /holidays (Valid Holiday)
test("PUT /holidays should update an existing holiday", async () => {
    const newHoliday = {
      name: "Test Holiday",
      destination: "Test City",
      startDate: "2025-12-10",
      endDate: "2025-12-20",
      transport: "Plane",
      transport_price: 300,
      accomodation: "Hotel",
      accomodation_name: "Test Hotel",
      accomodation_price: 500,
      accomodation_location: "Test Location",
    };

    const response = await request(app).put("/holidays/1").send(newHoliday);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(newHoliday.name);
  });

  //  🔴 Test PUT /holidays (Inexisting Holiday)
test("PUT /holidays should update an existing holiday", async () => {
    const newHoliday = {
      name: "Test Holiday",
      destination: "Test City",
      startDate: "2025-12-10",
      endDate: "2025-12-20",
      transport: "Plane",
      transport_price: 300,
      accomodation: "Hotel",
      accomodation_name: "Test Hotel",
      accomodation_price: 500,
      accomodation_location: "Test Location",
    };

    const response = await request(app).put("/holidays/99999").send(newHoliday);
    
    expect(response.status).toBe(404);
  });

  // 🟢 Test GET /holidays/:id
  test("GET /holidays/:id should return a single holiday", async () => {
    const response = await request(app).get("/holidays/1"); // Assuming ID 1 exists

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
  });

  // 🔴 Test GET /holidays/:id (Non-existent holiday)
  test("GET /holidays/:id should return 404 if holiday is not found", async () => {
    const response = await request(app).get("/holidays/99999"); // Non-existent ID

    expect(response.status).toBe(404);
  });

  // 🟢 Test DELETE /holidays/:id
  test("DELETE /holidays/:id should delete a holiday", async () => {
    const response = await request(app).delete("/holidays/1"); // Assuming ID 1 exists

    expect(response.status).toBe(200);
  });

  // 🔴 Test DELETE /holidays/:id (Non-existent holiday)
  test("DELETE /holidays/:id should return 404 if holiday is not found", async () => {
    const response = await request(app).delete("/holidays/99999"); // Non-existent ID

    expect(response.status).toBe(404);
  });

});
