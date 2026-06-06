CREATE DATABASE show_tracker;

\c show_tracker;

CREATE TABLE shows (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  venue VARCHAR(255),
  date_seen DATE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  status VARCHAR(10) NOT NULL DEFAULT 'wishlist' CHECK (status IN ('seen', 'wishlist')),
  created_at TIMESTAMP DEFAULT NOW()
);
