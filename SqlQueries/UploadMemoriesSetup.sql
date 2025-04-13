CREATE TABLE uploaded_memories (
    file_id SERIAL PRIMARY KEY,
    holiday_id INTEGER REFERENCES Holidays(holiday_id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

drop table UploadedMemories