- 1) Crear base y usarla
CREATE DATABASE IF NOT EXISTS bd_universidad CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bd_universidad;

-- 2) Tablas padres / esquema (simplificado, ajustá según tu modelo real)

CREATE TABLE IF NOT EXISTS universidad (
                                           id_universidad INT PRIMARY KEY AUTO_INCREMENT,
                                           cuna_del_conocimiento VARCHAR(255),
    diferentes_carreras VARCHAR(500),
    privada TINYINT(1) DEFAULT 0,
    publica TINYINT(1) DEFAULT 0
    );

CREATE TABLE IF NOT EXISTS interfaz_ingreso_informacion (
                                                            id_interfaz INT PRIMARY KEY AUTO_INCREMENT,
                                                            comentarios_abiertos_en_linea TINYINT(1),
    formulario_en_linea TINYINT(1),
    plataforma_de_software VARCHAR(255)
    );

CREATE TABLE IF NOT EXISTS recopilacion (
                                            id_recopilacion INT PRIMARY KEY AUTO_INCREMENT,
                                            datos_mayor_favorabilidad VARCHAR(255),
    datos_mayor_urgencia VARCHAR(255),
    id_interfaz INT,
    FOREIGN KEY (id_interfaz) REFERENCES interfaz_ingreso_informacion(id_interfaz)
    );

CREATE TABLE IF NOT EXISTS necesidad (
                                         id_necesidad INT PRIMARY KEY AUTO_INCREMENT,
                                         definir TEXT
);

CREATE TABLE IF NOT EXISTS problema (
                                        id_problema INT PRIMARY KEY AUTO_INCREMENT,
                                        definir TEXT
);

CREATE TABLE IF NOT EXISTS solucion (
                                        id_solucion INT PRIMARY KEY AUTO_INCREMENT,
                                        alternativa VARCHAR(500),
    escoger TINYINT(1) DEFAULT 0
    );

CREATE TABLE IF NOT EXISTS resultado (
                                         id_resultado INT PRIMARY KEY AUTO_INCREMENT,
                                         efectos_positivos_y_negativos INT,
                                         implementacion_finalizada TINYINT(1) DEFAULT 0,
    medidas_de_satisfaccion_de_diferentes_aspectos INT
    );

CREATE TABLE IF NOT EXISTS region (
                                      id_region INT PRIMARY KEY AUTO_INCREMENT,
                                      aspectos_sociocultural VARCHAR(255),
    nivel_grupal VARCHAR(255),
    nivel_personal VARCHAR(255),
    parte_especifica_del_pais VARCHAR(255)
    );

CREATE TABLE IF NOT EXISTS proyecto_de_grado (
                                                 id_proyecto INT PRIMARY KEY AUTO_INCREMENT,
                                                 alcance VARCHAR(255),
    costo DECIMAL(12,2),
    objetivo TEXT,
    plan_de_proyecto VARCHAR(255),
    tiempo_de_realizacion INT,
    titulo VARCHAR(500),
    viabilidad INT,
    id_solucion INT,
    FOREIGN KEY (id_solucion) REFERENCES solucion(id_solucion)
    );

CREATE TABLE IF NOT EXISTS ejecucion_del_proyecto (
                                                      id_ejecucion INT PRIMARY KEY AUTO_INCREMENT,
                                                      comenzar_desarrollo DATETIME,
                                                      finalizar_desarrollo DATETIME,
                                                      proyecto_de_grado_terminado TINYINT(1) DEFAULT 0,
    recursos_diponibles TINYINT(1) DEFAULT 0,
    id_proyecto INT,
    id_resultado INT,
    FOREIGN KEY (id_proyecto) REFERENCES proyecto_de_grado(id_proyecto),
    FOREIGN KEY (id_resultado) REFERENCES resultado(id_resultado)
    );

CREATE TABLE IF NOT EXISTS estudiante (
                                          id_estudiante INT PRIMARY KEY AUTO_INCREMENT,
                                          aspirante_a_grado TINYINT(1),
    formato VARCHAR(50),
    nombre_universitario VARCHAR(255),
    url_universidad VARCHAR(500),
    id_ejecucion INT,
    id_proyecto INT,
    id_universidad INT,
    FOREIGN KEY (id_ejecucion) REFERENCES ejecucion_del_proyecto(id_ejecucion),
    FOREIGN KEY (id_proyecto) REFERENCES proyecto_de_grado(id_proyecto),
    FOREIGN KEY (id_universidad) REFERENCES universidad(id_universidad)
    );

CREATE TABLE IF NOT EXISTS personal_docente (
                                                id_docente INT PRIMARY KEY AUTO_INCREMENT,
                                                conocimiento VARCHAR(500),
    evaluar TINYINT(1),
    experiencia VARCHAR(255),
    funcion_de_seguimiento VARCHAR(255),
    gestion VARCHAR(255),
    orientacion VARCHAR(255),
    trayectoria INT,
    id_ejecucion INT,
    id_recopilacion INT, -- columna local que referencia recopilacion.id_interfaz en tu esquema original
    id_universidad INT,
    FOREIGN KEY (id_ejecucion) REFERENCES ejecucion_del_proyecto(id_ejecucion),
    FOREIGN KEY (id_universidad) REFERENCES universidad(id_universidad)
    -- NOTA: no creamos FK directa a recopilacion.id_interfaz porque la columna referenciada se llama id_interfaz.
    );

-- Tablas de relación (join tables)
CREATE TABLE IF NOT EXISTS discute (
                                       id_problema INT,
                                       id_necesidad INT,
                                       PRIMARY KEY (id_problema, id_necesidad),
    FOREIGN KEY (id_problema) REFERENCES problema(id_problema),
    FOREIGN KEY (id_necesidad) REFERENCES necesidad(id_necesidad)
    );

CREATE TABLE IF NOT EXISTS necesidad_interfaz (
                                                  id_necesidad INT,
                                                  id_interfaz INT,
                                                  PRIMARY KEY (id_necesidad, id_interfaz),
    FOREIGN KEY (id_necesidad) REFERENCES necesidad(id_necesidad),
    FOREIGN KEY (id_interfaz) REFERENCES interfaz_ingreso_informacion(id_interfaz)
    );

CREATE TABLE IF NOT EXISTS problema_interfaz (
                                                 id_problema INT,
                                                 id_interfaz INT,
                                                 PRIMARY KEY (id_problema, id_interfaz),
    FOREIGN KEY (id_problema) REFERENCES problema(id_problema),
    FOREIGN KEY (id_interfaz) REFERENCES interfaz_ingreso_informacion(id_interfaz)
    );

CREATE TABLE IF NOT EXISTS estudiante_docente (
                                                  id_estudiante INT,
                                                  id_docente INT,
                                                  PRIMARY KEY (id_estudiante, id_docente),
    FOREIGN KEY (id_estudiante) REFERENCES estudiante(id_estudiante),
    FOREIGN KEY (id_docente) REFERENCES personal_docente(id_docente)
    );

CREATE TABLE IF NOT EXISTS estudiante_solucion (
                                                   id_estudiante INT,
                                                   id_solucion INT,
                                                   PRIMARY KEY (id_estudiante, id_solucion),
    FOREIGN KEY (id_estudiante) REFERENCES estudiante(id_estudiante),
    FOREIGN KEY (id_solucion) REFERENCES solucion(id_solucion)
    );

CREATE TABLE IF NOT EXISTS proyecto_estudiante (
                                                   proyecto_id INT,
                                                   estudiante_id INT,
                                                   PRIMARY KEY (proyecto_id, estudiante_id),
    FOREIGN KEY (proyecto_id) REFERENCES proyecto_de_grado(id_proyecto),
    FOREIGN KEY (estudiante_id) REFERENCES estudiante(id_estudiante)
    );

CREATE TABLE IF NOT EXISTS ejecucion_estudiante (
                                                    ejecucion_id INT,
                                                    estudiante_id INT,
                                                    PRIMARY KEY (ejecucion_id, estudiante_id),
    FOREIGN KEY (ejecucion_id) REFERENCES ejecucion_del_proyecto(id_ejecucion),
    FOREIGN KEY (estudiante_id) REFERENCES estudiante(id_estudiante)
    );

CREATE TABLE IF NOT EXISTS ejecucion_docente (
                                                 ejecucion_id INT,
                                                 docente_id INT,
                                                 PRIMARY KEY (ejecucion_id, docente_id),
    FOREIGN KEY (ejecucion_id) REFERENCES ejecucion_del_proyecto(id_ejecucion),
    FOREIGN KEY (docente_id) REFERENCES personal_docente(id_docente)
    );

CREATE TABLE IF NOT EXISTS universidad_recoleccion (
                                                       id_universidad INT,
                                                       id_recoleccion INT,
                                                       PRIMARY KEY (id_universidad, id_recoleccion),
    FOREIGN KEY (id_universidad) REFERENCES universidad(id_universidad)
    );

CREATE TABLE IF NOT EXISTS universidad_region (
                                                  id_universidad INT,
                                                  id_region INT,
                                                  PRIMARY KEY (id_universidad, id_region),
    FOREIGN KEY (id_universidad) REFERENCES universidad(id_universidad),
    FOREIGN KEY (id_region) REFERENCES region(id_region)
    );

CREATE TABLE IF NOT EXISTS recoleccion_de_informacion (
                                                          id_recoleccion INT PRIMARY KEY AUTO_INCREMENT,
                                                          datos_de_los_afectados VARCHAR(500),
    datos_de_los_directamente_interezados VARCHAR(500),
    id_interfaz INT,
    FOREIGN KEY (id_interfaz) REFERENCES interfaz_ingreso_informacion(id_interfaz)
    );

CREATE TABLE IF NOT EXISTS revision_seg (
                                            next_val INT
);
