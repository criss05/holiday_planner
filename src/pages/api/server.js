import express from "express";
import cors from "cors";
import initialHolidays from "../../data/Holidays.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let holidays = [...initialHolidays];

const validateRequest = (req, res, next) => {
    const { name, destination, startDate, endDate, transport, transport_price, accomodation, accomodation_name, accomodation_price, accomodation_location } = req.body;

    if (!name || !destination || !startDate || !endDate || !transport || !transport_price || !accomodation || !accomodation_name || !accomodation_price || !accomodation_location) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    if (isNaN(Date.parse(startDate))) {
        return res.status(400).json({ error: "Start date is not valid" });
    }
    if (isNaN(Date.parse(endDate))) {
        return res.status(400).json({ error: "End date is not valid" });
    }
    if (new Date(startDate) - new Date(endDate) > 0) {
        return res.status(400).json({ error: "End date cannot be before the start date" });
    }

    if (transport_price < 0) {
        return res.status(400).json({ error: "Transport price cannot be negative" });
    }

    if (accomodation_price < 0) {
        return res.status(400).json({ error: "Accomodation price cannot be negative" });
    }

    if (!["Car", "Plane", "Train", "Bus", "Ship"].includes(transport)) {
        return res.status(400).json({ error: "Transport can be only form the list: {'Car', 'Plane', 'Train', 'Bus', 'Ship'}" });
    }

    if (!["Hotel", "Motel", "Hostel", "Apartment", "Cabin", "Resort", "Villa", "Campsite"].includes(accomodation)) {
        return res.status(400).json({ error: "Accomodation can be only form the list: {'Hotel', 'Motel', 'Hostel', 'Apartment', 'Cabin', 'Resort', 'Villa', 'Campsite'}" });
    }
    next();
};

app.get('/', (req, res) => {
    res.redirect('/holidays')
})

app.get("/holidays", (req, res) => {
    let { filter, sortBy } = req.query;
    let result = [...holidays];

    if (filter) {
        const now = new Date();
        if (filter === "Done") {
            result = result.filter(h => new Date(h.endDate) <= now);
        } else if (filter === "Upcoming") {
            result = result.filter(h => new Date(h.endDate) >= now);
        }
    }

    if (sortBy) {
        result.sort((a, b) => {
            if (sortBy === "Start Date") return new Date(a.startDate) - new Date(b.startDate);
            if (sortBy === "End Date") return new Date(a.endDate) - new Date(b.endDate);
            return a[sortBy.toLowerCase()].localeCompare(b[sortBy.toLowerCase()]); //TO CHECK
        });
    }

    res.json(result);
});

app.get("/holidays/:id", (req, res) => {
    const holiday = holidays.find((h) => h.id === parseInt(req.params.id));
    if (!holiday) {
        return res.status(404).json({ error: "Holiday not found" });
    }
    res.json(holiday);
})

// Add a new holiday
app.post("/holidays", validateRequest, (req, res) => {
    const { name, destination, startDate, endDate, transport, transport_price, accomodation, accomodation_name, accomodation_price, accomodation_location } = req.body;
    
    if (new Date(startDate).getDate() < new Date().getDate()) {
        return res.status(400).json({ error: "Start date cannot be in the past" });
    }
    if (new Date(endDate).getDate() < new Date().getDate()) {
        return res.status(400).json({ error: "End date cannot be in the past" });
    }
    
    const newHoliday = {
        id: Math.max(...holidays.map((h) => h.id)) + 1,
        name,
        destination,
        startDate,
        endDate,
        transport,
        transport_price,
        accomodation,
        accomodation_name,
        accomodation_price,
        accomodation_location
    };

    holidays.push(newHoliday);
    res.status(201).json(newHoliday);
});


app.put("/holidays/:id", validateRequest, (req, res) => {
    const { name, destination, startDate, endDate, transport, transport_price, accomodation, accomodation_name, accomodation_price, accomodation_location } = req.body;

    const index = holidays.findIndex((h) => h.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: "Holiday not found" });
    }

    holidays[index] = { ...holidays[index], 
        name, 
        destination, 
        startDate, 
        endDate, 
        transport, 
        transport_price, 
        accomodation, 
        accomodation_name, 
        accomodation_price, 
        accomodation_location };

    res.status(200).json(holidays[index]);
});


app.delete("/holidays/:id", (req, res) => {
    const index = holidays.findIndex((h) => h.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: "Holiday not found" });
    }

    holidays.splice(index, 1);

    res.status(200).json("Capsule deleted succesfully!");
});

export default app;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
