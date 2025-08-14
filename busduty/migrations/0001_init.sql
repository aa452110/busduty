-- buses configured once per school
CREATE TABLE IF NOT EXISTS buses (
  school_code TEXT NOT NULL,
  bus_no      TEXT NOT NULL,
  display_name TEXT,
  active       INTEGER DEFAULT 1,
  PRIMARY KEY (school_code, bus_no)
);

-- arrivals: one row per bus per day
CREATE TABLE IF NOT EXISTS arrivals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_code TEXT NOT NULL,
  bus_no      TEXT NOT NULL,
  date_ymd    TEXT NOT NULL,
  ts_utc      INTEGER NOT NULL,
  entrance    TEXT,
  UNIQUE (school_code, bus_no, date_ymd)
);

CREATE INDEX IF NOT EXISTS idx_arrivals_school_day ON arrivals(school_code, date_ymd);