CREATE INDEX idx_memories ON uploaded_memories(holiday_id, uploaded_at, file_path)

drop index idx_memories


CREATE INDEX idx_memories ON uploaded_memories(holiday_id, uploaded_at DESC)