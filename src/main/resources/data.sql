-- 3) Datos (INSERT) — ordenados y limpiados
SET FOREIGN_KEY_CHECKS = 0;

INSERT IGNORE INTO universidad (id_universidad, cuna_del_conocimiento, diferentes_carreras, privada, publica)
VALUES
  (1, 'Universidad Nacional de Colombia', 'Ingeniería, Medicina, Derecho, Artes, Ciencias', 0, 1),
  (2, 'Universidad de los Andes', 'Ingeniería, Administración, Arquitectura, Medicina', 1, 0),
  (3, 'Universidad del Valle', 'Ingeniería, Salud, Humanidades, Ciencias Sociales', 0, 1);

INSERT IGNORE INTO interfaz_ingreso_informacion (id_interfaz, comentarios_abiertos_en_linea, formulario_en_linea, plataforma_de_software)
VALUES
  (1, 1, 1, 'Moodle'),
  (2, 2, 2, 'Google Forms'),
  (3, 3, 3, 'Plataforma local');

INSERT IGNORE INTO recopilacion (id_recopilacion, datos_mayor_favorabilidad, datos_mayor_urgencia, id_interfaz)
VALUES
  (1, '10', '5', 1),
  (2, '7', '8', 2),
  (3, '5', '6', 3);

INSERT IGNORE INTO necesidad (id_necesidad, definir)
VALUES
  (1, 'Mejorar métodos de enseñanza interactivos'),
  (2, 'Implementar plataformas de educación en línea'),
  (3, 'Capacitar docentes en herramientas digitales');

INSERT IGNORE INTO problema (id_problema, definir)
VALUES
  (1, 'Baja participación estudiantil'),
  (2, 'Falta de acceso a internet'),
  (3, 'Carencia de formación docente');

INSERT IGNORE INTO solucion (id_solucion, alternativa, escoger)
VALUES
  (1, 'Implementación de plataforma LMS institucional', 1),
  (2, 'Sistema de monitoreo y reportes académicos', 0),
  (3, 'Programa de capacitación docente en TIC', 1),
  (4, 'Implementación de plataforma LMS institucional', 1),
  (5, 'Sistema de monitoreo y reportes académicos', 0),
  (6, 'Programa de capacitación docente en TIC', 1);

INSERT IGNORE INTO resultado (id_resultado, efectos_positivos_y_negativos, implementacion_finalizada, medidas_de_satisfaccion_de_diferentes_aspectos)
VALUES
  (1, 4, 0, 3),
  (2, 2, 1, 4),
  (3, 3, 0, 2);

INSERT IGNORE INTO region (id_region, aspectos_sociocultural, nivel_grupal, nivel_personal, parte_especifica_del_pais)
VALUES
  (1, 'Región Andina Central', 'Comunidades urbanas', 'Profesionales y estudiantes', 'Bogotá y Cundinamarca'),
  (2, 'Región Pacífica', 'Comunidades rurales', 'Estudiantes y docentes', 'Valle del Cauca'),
  (3, 'Región Caribe', 'Comunidades mixtas', 'Líderes comunitarios', 'Cartagena y Bolívar');

INSERT IGNORE INTO proyecto_de_grado (id_proyecto, alcance, costo, objetivo, plan_de_proyecto, tiempo_de_realizacion, titulo, viabilidad, id_solucion)
VALUES
  (1, 'Institucional', 12000, 'Mejorar acceso a contenidos', 'Plan A', 6, 'Plataforma de aprendizaje', 5, 1),
  (2, 'Regional', 8000, 'Sistema de seguimiento', 'Plan B', 4, 'Monitoreo académico', 3, 2),
  (3, 'Local', 5000, 'Formación en TIC', 'Plan C', 3, 'Capacitación docente', 8, 3);

INSERT IGNORE INTO ejecucion_del_proyecto (id_ejecucion, comenzar_desarrollo, finalizar_desarrollo, proyecto_de_grado_terminado, recursos_diponibles, id_proyecto, id_resultado)
VALUES
  (1, '2025-09-01 00:00:00', '2026-02-28 00:00:00', 0, 0, 1, 1),
  (2, '2025-06-01 00:00:00', '2025-10-30 00:00:00', 1, 0, 2, 2),
  (3, '2025-11-01 00:00:00', '2026-01-15 00:00:00', 0, 0, 3, 3);

INSERT IGNORE INTO estudiante (id_estudiante, aspirante_a_grado, formato, nombre_universitario, url_universidad, id_ejecucion, id_proyecto, id_universidad)
VALUES
  (1, 1, 'PDF', 'María González', 'https://unal.edu.co/maria', 1, 1, 1),
  (2, 0, 'DOCX', 'Juan Pérez', 'https://uniandes.edu.co/juan', 2, 2, 2),
  (3, 1, 'PDF', 'Ana Rodríguez', 'https://univalle.edu.co/ana', 3, 3, 3);

INSERT IGNORE INTO personal_docente (id_docente, conocimiento, evaluar, experiencia, funcion_de_seguimiento, gestion, orientacion, trayectoria, id_ejecucion, id_recopilacion, id_universidad)
VALUES
  (1, 'Pedagogía digital', 1, '10 años', 'Coordinador', 'Gestión curricular', 'Orientación metodológica', 5, 1, 1, 1),
  (2, 'Evaluación educativa', 1, '8 años', 'Tutor', 'Gestión de proyectos', 'Orientación práctica', 7, 2, 2, 2),
  (3, 'Tecnologías educativas', 0, '5 años', 'Asesor', 'Gestión local', 'Orientación técnica', 2, 3, 3, 3);

INSERT IGNORE INTO recoleccion_de_informacion (datos_de_los_afectados, datos_de_los_directamente_interezados, id_interfaz)
VALUES
  ('Encuestas a estudiantes','Padres y docentes',1),
  ('Registros administrativos','Directores',2),
  ('Entrevistas','Comunidad local',3);

INSERT IGNORE INTO recopilacion (id_recopilacion, datos_mayor_favorabilidad, datos_mayor_urgencia, id_interfaz)
VALUES
  (1, '10', '5', 1),
  (2, '7', '8', 2),
  (3, '5', '6', 3);

INSERT IGNORE INTO discute (id_problema, id_necesidad)
VALUES (1,1),(2,2),(3,3);

INSERT IGNORE INTO necesidad_interfaz (id_necesidad, id_interfaz)
VALUES (1,1),(2,2),(3,3);

INSERT IGNORE INTO problema_interfaz (id_problema, id_interfaz)
VALUES (1,1),(2,2),(3,3);

INSERT IGNORE INTO estudiante_docente (id_estudiante, id_docente)
VALUES (1,1),(2,2),(3,3);

INSERT IGNORE INTO estudiante_solucion (id_estudiante, id_solucion)
VALUES (1,1),(2,2),(3,3);

INSERT IGNORE INTO proyecto_estudiante (proyecto_id, estudiante_id)
VALUES (1,1),(2,2),(3,3);

INSERT IGNORE INTO ejecucion_estudiante (ejecucion_id, estudiante_id)
VALUES (1,1),(2,2),(3,3);

INSERT IGNORE INTO ejecucion_docente (ejecucion_id, docente_id)
VALUES (1,1),(2,2),(3,3);

INSERT IGNORE INTO universidad_recoleccion (id_universidad, id_recoleccion)
VALUES (1,1),(2,2),(3,3);

INSERT IGNORE INTO universidad_region (id_universidad, id_region)
VALUES (1,1),(2,2),(3,3);

INSERT IGNORE INTO revision_seg (next_val)
VALUES (1);

SET FOREIGN_KEY_CHECKS = 1;

DELETE r1 FROM recoleccion_de_informacion r1
INNER JOIN recoleccion_de_informacion r2
  ON r1.datos_de_los_afectados = r2.datos_de_los_afectados
  AND r1.datos_de_los_directamente_interezados = r2.datos_de_los_directamente_interezados
  AND r1.id_interfaz = r2.id_interfaz
  AND r1.id_recoleccion > r2.id_recoleccion;
