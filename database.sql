CREATE DATABASE IF NOT EXISTS cinefluxy;
USE cinefluxy;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  location_label VARCHAR(255) NULL,
  latitude DECIMAL(10, 7) NULL,
  longitude DECIMAL(10, 7) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  duration VARCHAR(20) NOT NULL,
  rating VARCHAR(10) NOT NULL,
  year INT NOT NULL,
  color VARCHAR(20) DEFAULT '#c9a84c',
  poster VARCHAR(10) DEFAULT '🎬',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE showtimes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT NOT NULL,
  time VARCHAR(10) NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id VARCHAR(50) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  showtime VARCHAR(10) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  qr_code LONGTEXT,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id)
);

CREATE TABLE booking_seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  seat_id VARCHAR(10) NOT NULL,
  seat_type ENUM('vip', 'mid', 'basic') NOT NULL,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

INSERT INTO movies (title, genre, duration, rating, year, color, poster, description) VALUES
('Void Horizon', 'Sci-Fi / Thriller', '2h 18m', '8.4', 2026, '#e63946', '🌌', 'Un astronauta perdido en el borde del universo descubre que el vacio tiene memoria.'),
('La Ultima Carta', 'Drama / Romance', '1h 52m', '9.1', 2026, '#f4a261', '✉️', 'Una carta sin destinatario atraviesa decadas y continentes para llegar a quien siempre fue suya.'),
('NEON GHOST', 'Accion / Cyberpunk', '2h 05m', '7.8', 2026, '#06d6a0', '👾', 'En Neo-Tokio 2087, una detective de IA persigue a un fantasma digital que borra memorias.'),
('Tierra Roja', 'Western / Misterio', '2h 31m', '8.9', 2025, '#d62828', '🏜️', 'Un sheriff mudo y un bandido ciego buscan el mismo tesoro enterrado bajo el desierto.'),
('Deep Blue Silence', 'Terror / Submarino', '1h 48m', '7.5', 2026, '#023e8a', '🌊', 'Una tripulacion queda atrapada en el fondo del oceano con algo que no deberia existir.'),
('Animorphia', 'Animacion / Aventura', '1h 35m', '9.3', 2026, '#7b2d8b', '🦋', 'Una nina descubre que puede transformarse en cualquier animal que haya dibujado.');

INSERT INTO showtimes (movie_id, time) VALUES
(1, '14:30'), (1, '17:00'), (1, '20:15'), (1, '23:00'),
(2, '13:00'), (2, '16:30'), (2, '19:45'),
(3, '15:00'), (3, '18:30'), (3, '21:30'), (3, '00:15'),
(4, '12:30'), (4, '15:45'), (4, '19:00'), (4, '22:30'),
(5, '16:00'), (5, '20:00'), (5, '23:30'),
(6, '11:00'), (6, '13:30'), (6, '16:00'), (6, '18:30');

ALTER TABLE users ADD COLUMN IF NOT EXISTS location_label VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 7) NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS longitude DECIMAL(10, 7) NULL;
