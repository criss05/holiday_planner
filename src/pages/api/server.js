import express from "express";
import { WebSocket } from "ws";
import cors from "cors";
import initialHolidays from "../../data/Holidays.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import archiver from 'archiver';
import dotenv from "dotenv";
dotenv.config();



const app = express();
const PORT = 5000;
const uploadDir = path.join("uploads");
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const wss = new WebSocketServer({ noServer: true });

app.use(cors());
app.use(express.json());


let holidays = [...initialHolidays];
let generatingHolidays = false;

const validateRequest = (req, res, next) => {
    const { name, destination, startDate, endDate, transport, transport_price, accommodation, accommodation_name, accommodation_price, accommodation_location } = req.body;

    if (!name || !destination || !startDate || !endDate || !transport || !transport_price || !accommodation || !accommodation_name || !accommodation_price || !accommodation_location) {
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

    if (accommodation_price < 0) {
        return res.status(400).json({ error: "accommodation price cannot be negative" });
    }

    if (!["Car", "Plane", "Train", "Bus", "Ship"].includes(transport)) {
        return res.status(400).json({ error: "Transport can be only form the list: {'Car', 'Plane', 'Train', 'Bus', 'Ship'}" });
    }

    if (!["Hotel", "Motel", "Hostel", "Apartment", "Cabin", "Resort", "Villa", "Campsite"].includes(accommodation)) {
        return res.status(400).json({ error: "accommodation can be only form the list: {'Hotel', 'Motel', 'Hostel', 'Apartment', 'Cabin', 'Resort', 'Villa', 'Campsite'}" });
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
            return a[sortBy.toLowerCase()].localeCompare(b[sortBy.toLowerCase()]); 
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
    const { name, destination, startDate, endDate, transport, transport_price, accommodation, accommodation_name, accommodation_price, accommodation_location } = req.body;
    
    if (new Date(startDate) - new Date() < 0) {
        return res.status(400).json({ error: "Start date cannot be in the past" });
    }
    
    const newHoliday = {
        id: Math.max(...holidays.map((h) => h.id)) + 1,
        name,
        destination,
        startDate,
        endDate,
        transport,
        transport_price,
        accommodation,
        accommodation_name,
        accommodation_price,
        accommodation_location
    };

    holidays.push(newHoliday);
    res.status(201).json(newHoliday);
});


app.put("/holidays/:id", validateRequest, (req, res) => {
    const { name, destination, startDate, endDate, transport, transport_price, accommodation, accommodation_name, accommodation_price, accommodation_location } = req.body;

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
        accommodation, 
        accommodation_name, 
        accommodation_price, 
        accommodation_location };

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


wss.on("connection", (ws) => {
    console.log("Client connected");
  
    // Send current holidays when a client connects
    ws.send(JSON.stringify({ type: "holidays", holidays }));
  
    // Listen for messages from the client (e.g., for stopping the generation)
    ws.on("message", (message) => {
      const data = JSON.parse(message);
  
      if (data.action === "toggleGeneration") {
        if (generatingHolidays) {
          stopHolidayGeneration();
        } else {
          startHolidayGeneration(ws);
        }
      }
    });
  });

  const startHolidayGeneration = (ws) => {
    generatingHolidays = true;
    let count = 0;
  
    // Simulate holiday generation
    const interval = setInterval(() => {
      if (!generatingHolidays || count >= 100) {
        clearInterval(interval);
        return;
      }
  
      // Create a new holiday
      const newHoliday = {
        id: holidays.length + 1,
        name: `Holiday ${holidays.length + 1}`,
        destination: "Destination " + holidays.length,
        startDate: new Date(),
        endDate: new Date(),
        transport: "Plane",
        transport_price: 100 + holidays.length,
        accommodation: "Hotel",
        accommodation_name: "Hotel Name",
        accommodation_price: 150 + holidays.length,
        accommodation_location: "Location " + holidays.length,
      };
  
      holidays.push(newHoliday);
  
      // Send the updated holidays to all connected clients
      wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({ type: "holidays", holidays }));
        }
      });
  
      count++;
    }, 2000); // Generate a holiday every 2 seconds
  };
  
  // Stop generating holidays
  const stopHolidayGeneration = () => {
    generatingHolidays = false;
    console.log("Holiday generation stopped");
  };
  
  // WebSocket upgrade request handling
  app.server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
  app.server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });

export default app;

if(process.env.NODE_ENV !== "test")
    /* istanbul ignore next */
    app.listen(PORT, () => console.log(`Server running on ${process.env.NEXT_PUBLIC_API_BASE_URL}`));
