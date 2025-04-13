CREATE TABLE Holidays (
    holiday_id SERIAL PRIMARY KEY,
    holiday_name VARCHAR(30) NOT NULL,
    holiday_destination VARCHAR(100) NOT NULL,
    holiday_start_date DATE NOT NULL,
    holiday_end_date DATE NOT NULL,
    holiday_transport VARCHAR(10) NOT NULL CHECK (LOWER(holiday_transport) IN ('car', 'ship', 'plane', 'train', 'bus')),
    holiday_transport_price INT NOT NULL CHECK (holiday_transport_price >= 0),
    holiday_accommodation VARCHAR(10) NOT NULL CHECK (LOWER(holiday_accommodation) IN ('hotel', 'motel', 'hostel', 'apartment', 'cabin', 'resort', 'villa', 'campsite')),
    holiday_accommodation_price INT NOT NULL CHECK (holiday_accommodation_price >= 0),
    holiday_accommodation_name VARCHAR(50) NOT NULL,
    holiday_accommodation_location VARCHAR(100) NOT NULL
);

drop table Holidays

INSERT INTO Holidays VALUES
(1, 'Beach Getaway', 'Hawaii', '2024-06-10', '2024-10-20', 'Bus', 800, 'Resort', 250, 'Hawaii Beach Resort', 'Waikiki Beach, Honolulu'),
(2, 'Mountain Retreat', 'Swiss Alps', '2025-07-15', '2025-07-25', 'Train', 200, 'Cabin', 180, 'Alpine Lodge', 'Zermatt, Switzerland'),
(3, 'City Adventure', 'New York', '2025-08-05', '2025-08-15', 'Plane', 600, 'Hotel', 350, 'Times Square Hotel', 'New York City, USA'),
(4, 'Safari Experience', 'Kenya', '2025-09-12', '2025-09-22', 'Car', 500, 'Resort', 400, 'Savannah Safari Resort', 'Maasai Mara, Kenya'),
(5, 'Cultural Escape', 'Japan', '2025-10-20', '2025-10-30', 'Plane', 700, 'Motel', 100, 'Kyoto Inn', 'Kyoto, Japan'),
(6, 'Road Trip', 'California', '2025-11-01', '2025-11-10', 'Car', 300, 'Motel', 120, 'Route 66 Motel', 'Los Angeles, California'),
(7, 'Ski Adventure', 'Canada', '2024-12-05', '2024-12-15', 'Plane', 750, 'Resort', 350, 'Whistler Ski Resort', 'Whistler, British Columbia'),
(8, 'Tropical Paradise', 'Maldives', '2026-01-20', '2026-01-30', 'Bus', 1000, 'Villa', 500, 'Sunset Beach Villas', 'Malé, Maldives'),
(9, 'Historic Tour', 'Rome', '2026-02-10', '2026-02-20', 'Train', 150, 'Hotel', 250, 'Colosseum Hotel', 'Rome, Italy'),
(10, 'Backpacking Trip', 'Thailand', '2026-03-05', '2026-03-15', 'Plane', 500, 'Hostel', 30, 'Bangkok Backpackers', 'Bangkok, Thailand'),
(11, 'Luxury Cruise', 'Caribbean', '2026-04-10', '2026-04-20', 'Ship', 2000, 'Cabin', 600, 'Royal Caribbean Suite', 'Caribbean Sea'),
(12, 'Desert Expedition', 'Dubai', '2026-05-15', '2026-05-25', 'Plane', 600, 'Resort', 350, 'Dubai Desert Resort', 'Dubai, UAE'),
(13, 'Festival Tour', 'Brazil', '2024-06-10', '2024-06-20', 'Plane', 800, 'Hotel', 300, 'Rio Carnival Hotel', 'Rio de Janeiro, Brazil'),
(14, 'Hiking Adventure', 'Peru', '2026-07-05', '2026-07-15', 'Train', 250, 'Hostel', 50, 'Machu Picchu Hostel', 'Aguas Calientes, Peru'),
(15, 'Wildlife Exploration', 'South Africa', '2026-08-20', '2026-08-30', 'Car', 450, 'Campsite', 30, 'Kruger National Park Campsite', 'Kruger, South Africa'),
(16, 'Food Tour', 'France', '2026-09-01', '2026-09-10', 'Train', 180, 'Hotel', 250, 'Parisian Gourmet Hotel', 'Paris, France'),
(17, 'Island Hopping', 'Greece', '2023-10-15', '2023-10-25', 'Ship', 350, 'Villa', 450, 'Santorini Villa', 'Santorini, Greece'),
(18, 'Northern Lights Trip', 'Iceland', '2026-11-10', '2026-11-20', 'Bus', 500, 'Hotel', 200, 'Aurora Hotel', 'Reykjavik, Iceland'),
(19, 'Cave Exploration', 'Vietnam', '2023-12-05', '2023-12-15', 'Ship', 300, 'Hostel', 40, 'Phong Nha Hostel', 'Phong Nha, Vietnam'),
(20, 'Rainforest Adventure', 'Amazon', '2027-01-20', '2027-01-30', 'Ship', 800, 'Campsite', 50, 'Amazon Rainforest Campsite', 'Amazon Rainforest, Brazil');
