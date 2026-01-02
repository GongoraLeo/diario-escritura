-- Crear tabla de notas si no existe
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

-- Corregir tabla timelines
ALTER TABLE timelines 
MODIFY COLUMN track_name VARCHAR(255) NOT NULL;

-- Intentar renombrar track_name a name solo si existe track_name
SET @dbname = DATABASE();
SET @tablename = 'timelines';
SET @oldcolname = 'track_name';
SET @newcolname = 'name';
SET @q = IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = @dbname AND table_name = @tablename AND column_name = @oldcolname) \x3e 0, 
    CONCAT('ALTER TABLE ', @tablename, ' CHANGE ', @oldcolname, ' ', @newcolname, ' VARCHAR(255) NOT NULL'), 
    'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Añadir color si no existe
SET @column_name = 'color';
SET @q = IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = @dbname AND table_name = @tablename AND column_name = @column_name) = 0, 
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @column_name, ' VARCHAR(50) DEFAULT \"#8B5CF6\"'), 
    'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Renombrar track_order a order si existe
SET @oldcolname = 'track_order';
SET @newcolname = 'order';
SET @q = IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = @dbname AND table_name = @tablename AND column_name = @oldcolname) \x3e 0, 
    CONCAT('ALTER TABLE ', @tablename, ' CHANGE ', @oldcolname, ' `', @newcolname, '` INT DEFAULT 0'), 
    'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Corregir tabla timeline_events
SET @tablename = 'timeline_events';

-- track_id
SET @oldcolname = 'timeline_id';
SET @newcolname = 'track_id';
SET @q = IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = @dbname AND table_name = @tablename AND column_name = @oldcolname) \x3e 0, 
    CONCAT('ALTER TABLE ', @tablename, ' CHANGE ', @oldcolname, ' ', @newcolname, ' CHAR(36) NOT NULL'), 
    'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- start_position
SET @column_name = 'start_position';
SET @q = IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = @dbname AND table_name = @tablename AND column_name = @column_name) = 0, 
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @column_name, ' FLOAT DEFAULT 0'), 
    'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- duration
SET @column_name = 'duration';
SET @q = IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = @dbname AND table_name = @tablename AND column_name = @column_name) = 0, 
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @column_name, ' FLOAT DEFAULT 10'), 
    'SELECT 1');
PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Eliminar columnas antiguas si existen
ALTER TABLE timeline_events DROP COLUMN IF EXISTS position_x;
ALTER TABLE timeline_events DROP COLUMN IF EXISTS importance;
ALTER TABLE timeline_events DROP COLUMN IF EXISTS date_chapter;
ALTER TABLE timeline_events DROP COLUMN IF EXISTS characters;
