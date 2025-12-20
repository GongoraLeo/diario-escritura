-- Base de datos para Diario de Escritura
-- Creado: 2025-12-21

CREATE DATABASE IF NOT EXISTS diario_escritura CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE diario_escritura;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  avatar_url VARCHAR(500),
  full_name VARCHAR(100),
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username),
  INDEX idx_role (role)
) ENGINE=InnoDB;

-- Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS user_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) UNIQUE NOT NULL,
  preferred_font VARCHAR(100) DEFAULT 'Merriweather',
  theme ENUM('light', 'dark', 'auto') DEFAULT 'light',
  language VARCHAR(10) DEFAULT 'es',
  notifications_enabled BOOLEAN DEFAULT true,
  writing_goal_daily INT DEFAULT 500,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla de novelas
CREATE TABLE IF NOT EXISTS novels (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  cover_image VARCHAR(500),
  description TEXT,
  word_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- Tabla de personajes
CREATE TABLE IF NOT EXISTS characters (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  novel_id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar VARCHAR(500),
  personal_data JSON,
  physical_appearance JSON,
  psychology JSON,
  goals JSON,
  past JSON,
  present JSON,
  future JSON,
  speech_patterns JSON,
  relationships JSON,
  additional_info JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (novel_id) REFERENCES novels(id) ON DELETE CASCADE,
  INDEX idx_novel_id (novel_id)
) ENGINE=InnoDB;

-- Tabla de tramas
CREATE TABLE IF NOT EXISTS plots (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  novel_id CHAR(36) NOT NULL,
  structure_type ENUM('3_acts', '5_acts', 'hero_journey', 'save_cat', 'story_circle', 'free') NOT NULL,
  plot_points JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (novel_id) REFERENCES novels(id) ON DELETE CASCADE,
  INDEX idx_novel_id (novel_id)
) ENGINE=InnoDB;

-- Tabla de escenas
CREATE TABLE IF NOT EXISTS scenes (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  novel_id CHAR(36) NOT NULL,
  scene_number INT NOT NULL,
  location VARCHAR(255),
  time_of_day ENUM('day', 'night', 'dawn', 'dusk'),
  characters JSON,
  pov VARCHAR(255),
  objective TEXT,
  description TEXT,
  language_features JSON,
  themes JSON,
  dramatic_beats JSON,
  plot_connection TEXT,
  emotional_state VARCHAR(255),
  notes TEXT,
  status ENUM('draft', 'complete', 'revision') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (novel_id) REFERENCES novels(id) ON DELETE CASCADE,
  INDEX idx_novel_id (novel_id),
  INDEX idx_scene_number (scene_number)
) ENGINE=InnoDB;

-- Tabla de líneas de tiempo
CREATE TABLE IF NOT EXISTS timelines (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  novel_id CHAR(36) NOT NULL,
  track_name VARCHAR(255) NOT NULL,
  track_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (novel_id) REFERENCES novels(id) ON DELETE CASCADE,
  INDEX idx_novel_id (novel_id)
) ENGINE=InnoDB;

-- Tabla de eventos de línea de tiempo
CREATE TABLE IF NOT EXISTS timeline_events (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  timeline_id CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  date_chapter VARCHAR(100),
  characters JSON,
  description TEXT,
  importance INT DEFAULT 3,
  color VARCHAR(20) DEFAULT '#FFF59D',
  position_x INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (timeline_id) REFERENCES timelines(id) ON DELETE CASCADE,
  INDEX idx_timeline_id (timeline_id)
) ENGINE=InnoDB;

-- Tabla de apuntes
CREATE TABLE IF NOT EXISTS notes (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  novel_id CHAR(36) NOT NULL,
  type ENUM('style', 'plot') NOT NULL,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (novel_id) REFERENCES novels(id) ON DELETE CASCADE,
  INDEX idx_novel_id (novel_id),
  INDEX idx_type (type)
) ENGINE=InnoDB;

-- Tabla de documentos
CREATE TABLE IF NOT EXISTS documents (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  novel_id CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT,
  format_settings JSON,
  word_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (novel_id) REFERENCES novels(id) ON DELETE CASCADE,
  INDEX idx_novel_id (novel_id)
) ENGINE=InnoDB;

-- Crear usuario administrador por defecto (contraseña: admin123)
-- Hash bcrypt de 'admin123'
INSERT INTO users (id, username, email, password_hash, role, full_name, is_active, email_verified)
VALUES (
  UUID(),
  'admin',
  'admin@diario-escritura.local',
  '$2a$10$rK5YqJZqJZqJZqJZqJZqJeO7qJZqJZqJZqJZqJZqJZqJZqJZqJZqJ',
  'admin',
  'Administrador',
  true,
  true
) ON DUPLICATE KEY UPDATE id=id;
