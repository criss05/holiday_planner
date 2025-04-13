import express from "express";
import cors from "cors";
import initialHolidays from "../../data/Holidays.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import archiver from 'archiver';
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
})

const app = express();
const PORT = 5000;
const uploadDir = path.join("uploads");
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

app.use(cors());
app.use(express.json());


const validateRequest = (req, res, next) => {
    const { holiday_name, holiday_destination, holiday_start_date, holiday_end_date, holiday_transport, holiday_transport_price, holiday_accommodation, holiday_accommodation_name, holiday_accommodation_price, holiday_accommodation_location } = req.body;

    if (!holiday_name || !holiday_destination || !holiday_start_date || !holiday_end_date || !holiday_transport || !holiday_transport_price || !holiday_accommodation || !holiday_accommodation_name || !holiday_accommodation_price || !holiday_accommodation_location) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    if (isNaN(Date.parse(holiday_start_date))) {
        return res.status(400).json({ error: "Start date is not valid" });
    }
    if (isNaN(Date.parse(holiday_end_date))) {
        return res.status(400).json({ error: "End date is not valid" });
    }
    if (new Date(holiday_start_date) - new Date(holiday_end_date) > 0) {
        return res.status(400).json({ error: "End date cannot be before the start date" });
    }

    if (holiday_transport_price < 0) {
        return res.status(400).json({ error: "Transport price cannot be negative" });
    }

    if (holiday_accommodation_price < 0) {
        return res.status(400).json({ error: "accommodation price cannot be negative" });
    }

    if (!["Car", "Plane", "Train", "Bus", "Ship"].includes(holiday_transport)) {
        return res.status(400).json({ error: "Transport can be only form the list: {'Car', 'Plane', 'Train', 'Bus', 'Ship'}" });
    }

    if (!["Hotel", "Motel", "Hostel", "Apartment", "Cabin", "Resort", "Villa", "Campsite"].includes(holiday_accommodation)) {
        return res.status(400).json({ error: "accommodation can be only form the list: {'Hotel', 'Motel', 'Hostel', 'Apartment', 'Cabin', 'Resort', 'Villa', 'Campsite'}" });
    }
    next();
};

app.get('/', (req, res) => {
    res.redirect('/holidays')
})

app.get("/holidays", async (req, res) => {
    let { filter, sortBy } = req.query;
    
    let baseQuery = "SELECT * FROM Holidays";
    const now = new Date().toISOString();

    if (filter === "Done") {
        baseQuery += ` WHERE holiday_end_date <= '${now}'`;
    } else if (filter === "Upcoming") {
        baseQuery += ` WHERE holiday_end_date >= '${now}'`;
    }

    if (sortBy) {
        let option;
        switch (sortBy) {
            case "Destination":
                option = "holiday_destination";
                break;
            case "Name":
                option = "holiday_name";
                break;
            case "Transport":
                option = "holiday_transport";
                break;
            case "End Date":
                option = "holiday_end_date";
                break;
            default:
                option = "holiday_start_date";
        }
        baseQuery += ` ORDER BY "${option}" ASC`;
    }

    try {
        const result = await pool.query(baseQuery);

        const formattedHolidays = result.rows.map(holiday => {
            const formatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
            return {
                ...holiday,
                startdate: new Date(holiday.startdate).toLocaleDateString('en-US', formatOptions),
                enddate: new Date(holiday.enddate).toLocaleDateString('en-US', formatOptions)
            };
        });

        res.json(formattedHolidays);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/holidays/:id", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Holidays WHERE holiday_id = $1", [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Holiday not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// Add a new holiday
app.post("/holidays", validateRequest, async (req, res) => {
    const { holiday_name, holiday_destination, holiday_start_date, holiday_end_date, holiday_transport, holiday_transport_price, holiday_accommodation, holiday_accommodation_name, holiday_accommodation_price, holiday_accommodation_location } = req.body;

    try {
        const insertQuery = `
            INSERT INTO Holidays (holiday_name, holiday_destination, "holiday_start_date", "holiday_end_date", holiday_transport, holiday_transport_price, holiday_accommodation, holiday_accommodation_name, holiday_accommodation_price, holiday_accommodation_location)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`;
        const result = await pool.query(insertQuery, [holiday_name, holiday_destination, holiday_start_date, holiday_end_date, holiday_transport, holiday_transport_price, holiday_accommodation, holiday_accommodation_name, holiday_accommodation_price, holiday_accommodation_location]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.put("/holidays/:id", validateRequest, async (req, res) => {
    const {
        holiday_name,
        holiday_destination,
        holiday_start_date,
        holiday_end_date,
        holiday_transport,
        holiday_transport_price,
        holiday_accommodation,
        holiday_accommodation_name,
        holiday_accommodation_price,
        holiday_accommodation_location
    } = req.body;

    try {
        const updateQuery = `
            UPDATE Holidays SET 
                holiday_name = $1,
                holiday_destination = $2,
                holiday_start_date = $3,
                holiday_end_date = $4,
                holiday_transport = $5,
                holiday_transport_price = $6,
                holiday_accommodation = $7,
                holiday_accommodation_name = $8,
                holiday_accommodation_price = $9,
                holiday_accommodation_location = $10
            WHERE holiday_id = $11
            RETURNING *`;

        const result = await pool.query(updateQuery, [
            holiday_name,
            holiday_destination,
            holiday_start_date,
            holiday_end_date,
            holiday_transport,
            holiday_transport_price,
            holiday_accommodation,
            holiday_accommodation_name,
            holiday_accommodation_price,
            holiday_accommodation_location,
            req.params.id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Holiday not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.delete("/holidays/:id", async (req, res) => {
    try {
        const result = await pool.query("DELETE FROM Holidays WHERE holiday_id = $1 RETURNING *", [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Holiday not found" });
        }

        res.status(200).json("Holiday deleted successfully!");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const holidayId = req.params.id;
        const folder = path.join(uploadDir, holidayId);

        // Make sure the folder exists
        fs.mkdirSync(folder, { recursive: true });

        cb(null, folder);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});


const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 1024 * 3,  // You can adjust the file size limit here (3GB in this case)
    },

    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mkv', '.avi', '.mov'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error("Only image and video files are allowed"));
        }

    },
});

app.post("/upload/:id", upload.array("files", 100), (req, res) => {
    const holidayId = parseInt(req.params.id);

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
    }

    const holiday = holidays.find((h) => h.id === holidayId);
    if (!holiday) {
        return res.status(404).json({ error: "Holiday not found" });
    }

    // Create an array of archive metadata
    const uploadedFilesInfo = req.files.map(file => ({
        filename: file.filename,
        path: `/uploads/${holidayId}/${file.filename}`,
        originalName: file.originalname,
        uploadedAt: new Date(),
    }));

    // If you want to store these in holiday archives array
    holiday.archive = uploadedFilesInfo;

    res.status(201).json({
        message: "Files uploaded successfully",
        holidayId,
        archives: uploadedFilesInfo,
    });
});


app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/uploads/:holidayId", async (req, res) => {
    const holidayId = req.params.holidayId;
    const uploadDir = path.join("uploads", holidayId);

    try {
        await fs.promises.access(uploadDir, fs.constants.F_OK);
        

        const files = await fs.promises.readdir(uploadDir);
        

        const fileDetails = files.map((file) => ({
            originalName: file,
            path: `/uploads/${holidayId}/${file}`,
        }));

        return res.json({
            holidayId,
            files: fileDetails,
        });
    } catch (err) {
        return res.json({
            holidayId,
            files: [],
        });
    }
});


app.get("/uploads/:holidayId/:holidayName/download", async (req, res) => {
    const { holidayId, holidayName } = req.params;
    const uploadFolder = path.join(uploadDir, holidayId);

    try {
        // Check if the directory exists
        await fs.promises.access(uploadFolder, fs.constants.F_OK);

        // Create a zip file stream
        const zipFileName = `${holidayName}-files.zip`;
        const zip = archiver('zip', {
            zlib: { level: 9 } // Maximum compression
        });

        res.attachment(zipFileName);
        zip.pipe(res);

        // Read the directory and append files to the zip
        const files = await fs.promises.readdir(uploadFolder);
        files.forEach((file) => {
            const filePath = path.join(uploadFolder, file);
            zip.file(filePath, { name: file }); // Add file to the zip with original file name
        });

        // Finalize the archive (important step)
        zip.finalize();

    } catch (err) {
        return res.status(404).json({ error: "Holiday folder not found or no files to download" });
    }
});

app.post("/log-connection", express.raw({ type: '*/*' }), (req, res) =>{
    let type;

    try {
        const rawBody = req.body.toString();
        const parsed = JSON.parse(rawBody);
        type = parsed.type;
    } catch (err) {
        type = req.body?.type;
    }

    if (!type) {
        return res.status(400).json({ error: "Missing connection type" });
    }

    const ip = 
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress ||
        "Unknown IP.";

    const logMessage = `[${new Date().toISOString()}] ${type.toUpperCase()} from IP: ${ip}`;
    console.log(logMessage);

    res.status(200).json({ message: "Connection logged" });
})


export default app;

if(process.env.NODE_ENV !== "test")
    /* istanbul ignore next */
    app.listen(PORT, () => console.log(`Server running on ${process.env.NEXT_PUBLIC_API_BASE_URL}`));
