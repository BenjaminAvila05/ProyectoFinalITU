document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = window.location.origin + '/api/v1';
    const base = (entity) => `${API_BASE}/${entity}`;

    async function fetchList(entity) {
        try {
            const res = await fetch(base(entity));
            if (!res.ok) {
                console.info(`fetchList ${entity} -> status ${res.status}`);
                return [];
            }
            return await res.json();
        } catch (e) {
            console.info(`fetchList ${entity} -> error`, e);
            return [];
        }
    }

    async function fetchEntityById(entity, id) {
        try {
            const res = await fetch(`${base(entity)}/${id}`);
            if (!res.ok) {
                console.info(`fetchEntityById ${entity}/${id} -> status ${res.status}`);
                return null;
            }
            return await res.json();
        } catch (e) {
            console.info(`fetchEntityById ${entity}/${id} -> error`, e);
            return null;
        }
    }

    // Intenta múltiples nombres de endpoint para una entidad (por si tu API usa nombres distintos)
    async function fetchEntityCandidates(names = [], id) {
        for (const n of names) {
            const r = await fetchEntityById(n, id);
            if (r) return r;
        }
        return null;
    }

    // Cache para docentes y otras entidades para evitar múltiples requests
    const cache = new Map();
    function cacheSet(key, value) { if (key != null) cache.set(String(key), value); }
    function cacheGet(key) { return key == null ? null : cache.get(String(key)); }

    // Intentar obtener docente por id desde endpoints comunes; si no existe, devolver null
    async function fetchDocenteById(id) {
        if (!id) return null;
        const key = `docente:${id}`;
        const cached = cacheGet(key);
        if (cached) return cached;

        // candidatos de endpoint que podrías tener; ajusta si tu API usa otro nombre
        const candidates = ['docente', 'personalDocente', 'personal_docente'];
        const doc = await fetchEntityCandidates(candidates, id);
        if (doc) {
            cacheSet(key, doc);
            return doc;
        }
        // no encontrado en endpoints
        cacheSet(key, null);
        return null;
    }

    // Busca recursivamente dentro de un objeto JSON un objeto que tenga la propiedad id igual a idToFind
    function deepFindById(obj, idToFind) {
        if (obj == null) return null;
        try {
            if (typeof obj === 'object') {
                if (obj.id && String(obj.id) === String(idToFind)) return obj;
                // también comprobar otras claves posibles
                if (obj.id_docente && String(obj.id_docente) === String(idToFind)) return obj;
                if (obj.id_estudiante && String(obj.id_estudiante) === String(idToFind)) return obj;
                for (const k of Object.keys(obj)) {
                    const v = obj[k];
                    if (typeof v === 'object') {
                        const found = deepFindById(v, idToFind);
                        if (found) return found;
                    }
                }
            } else if (Array.isArray(obj)) {
                for (const item of obj) {
                    const found = deepFindById(item, idToFind);
                    if (found) return found;
                }
            }
        } catch (e) {
            // ignore
        }
        return null;
    }

    // Dado un proyecto (posiblemente con estructuras anidadas), intenta resolver un docente por id
    function findDocenteInProject(project, docenteId) {
        if (!project) return null;
        // buscar en project directamente
        const found = deepFindById(project, docenteId);
        if (found && (found.nombre || found.conocimiento || found.experiencia || found.trayectoria)) {
            return found;
        }
        return null;
    }

    // Resolver referencias a docentes (ids u objetos) devolviendo objetos completos cuando sea posible
    async function resolveDocentes(refs = [], project = null) {
        const normalized = [];
        const seen = new Set();

        // Normalizar refs (pueden ser ids o objetos)
        for (const r of (refs || [])) {
            if (r == null) continue;
            if (typeof r === 'object') {
                const id = r.id || r.id_docente || r.id_estudiante || null;
                const key = id ? `id:${id}` : JSON.stringify(r);
                if (!seen.has(key)) {
                    seen.add(key);
                    normalized.push(r);
                }
            } else {
                const key = String(r);
                if (!seen.has(key)) {
                    seen.add(key);
                    normalized.push(r);
                }
            }
        }

        const resolved = [];
        const idsToFetch = [];

        // Primero, para cada referencia, si es objeto con detalles, usarlo; si es id, intentar fetch
        for (const ref of normalized) {
            if (typeof ref === 'object') {
                // si el objeto ya tiene detalles útiles, usarlo
                const hasDetails = ref.nombre || ref.conocimiento || ref.experiencia || ref.trayectoria;
                if (hasDetails) {
                    resolved.push(ref);
                    continue;
                }
                // si tiene id, intentar fetch
                const id = ref.id || ref.id_docente || null;
                if (id) idsToFetch.push(id);
                else resolved.push(ref);
            } else {
                // primitive id
                idsToFetch.push(ref);
            }
        }

        // Intentar obtener por endpoint; si falla, intentar buscar dentro del proyecto
        for (const id of idsToFetch) {
            const docFromEndpoint = await fetchDocenteById(id);
            if (docFromEndpoint) {
                resolved.push(docFromEndpoint);
                continue;
            }
            // si no hay endpoint, intentar buscar dentro del proyecto (si se pasó)
            const foundInProject = project ? findDocenteInProject(project, id) : null;
            if (foundInProject) {
                resolved.push(foundInProject);
                continue;
            }
            // fallback: objeto mínimo (no mostramos nombre según tu pedido, pero guardamos estructura)
            resolved.push({ id, nombre: null, conocimiento: null, experiencia: null, trayectoria: null, orientacion: null, gestion: null });
        }

        // Unificar por id/nombre
        const final = [];
        const seenFinal = new Set();
        for (const r of resolved) {
            const key = typeof r === 'object' ? String(r.id || r.nombre || JSON.stringify(r)) : String(r);
            if (!seenFinal.has(key)) {
                seenFinal.add(key);
                final.push(r);
            }
        }
        return final;
    }

    // Helpers DOM y formato
    const universidadSelect = document.getElementById('universidad');
    const alumnoSelect = document.getElementById('alumno');
    const proyectoSelect = document.getElementById('proyecto');
    const resultadoDiv = document.getElementById('resultado'); // div estilizado

    const outUniversidad = document.getElementById('outUniversidad');
    const outAlumno = document.getElementById('outAlumno');
    const outProyecto = document.getElementById('outProyecto');
    const outResultado = document.getElementById('outResultado');
    const resumenMeta = document.getElementById('resumenMeta');

    const verDatosBtn = document.getElementById('verDatos');

    function clearSelect(sel, placeholder = '-- Seleccionar --') {
        sel.innerHTML = '';
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = placeholder;
        sel.appendChild(opt);
    }
    function setLoading(sel, text = 'Cargando...') {
        clearSelect(sel, text);
        sel.disabled = true;
    }
    function finishLoading(sel) { sel.disabled = false; }

    function refreshSummary(){
        outUniversidad.textContent = universidadSelect.selectedOptions[0]?.text || '—';
        outAlumno.textContent = alumnoSelect.selectedOptions[0]?.text || '—';
        outProyecto.textContent = proyectoSelect.selectedOptions[0]?.text || '—';
        outResultado.textContent = proyectoSelect.dataset.resultado || '—';
        resumenMeta.textContent = (universidadSelect.value && alumnoSelect.value) ? 'Datos listos para ver o exportar.' : 'Seleccioná universidad y alumno para ver información.';
    }

    async function loadUniversidades(){
        setLoading(universidadSelect);
        const list = await fetchList('universidad');
        clearSelect(universidadSelect, '-- Seleccionar --');
        (list || []).forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.id || u.id_universidad || '';
            opt.textContent = u.cunaDelConocimiento || u.nombre || `Universidad ${opt.value}`;
            universidadSelect.appendChild(opt);
        });
        finishLoading(universidadSelect);
        refreshSummary();
    }

    async function loadAlumnosPorUniversidad(uniId){
        try {
            setLoading(alumnoSelect);
            const all = await fetchList('estudiante');
            const alumnos = (all || []).filter(a => {
                return String(a.id_universidad) === String(uniId) ||
                    (a.universidad && String(a.universidad.id) === String(uniId));
            });
            clearSelect(alumnoSelect, '-- Seleccionar --');
            alumnos.forEach(a => {
                const opt = document.createElement('option');
                opt.value = a.id || a.id_estudiante || '';
                opt.textContent = a.nombreUniversitario || a.nombre || `Alumno ${opt.value}`;
                alumnoSelect.appendChild(opt);
            });
            if (!alumnos.length) console.info('No se encontraron alumnos para la universidad:', uniId);
        } catch (e) {
            console.info('Error en loadAlumnosPorUniversidad:', e);
            clearSelect(alumnoSelect, '-- Error cargando --');
        } finally {
            finishLoading(alumnoSelect);
            refreshSummary();
        }
    }

    // Detección robusta si un proyecto está asociado a un alumno (maneja ids y objetos)
    function projectHasStudent(project, alumnoId) {
        if (!project) return false;
        // project.estudiantes (ids)
        if (Array.isArray(project.estudiantes) && project.estudiantes.some(e => String(e) === String(alumnoId))) return true;
        // project.defineUna.estudiantes (objetos o ids)
        const defEst = project.defineUna?.estudiantes;
        if (Array.isArray(defEst) && defEst.some(s => {
            if (s == null) return false;
            if (typeof s === 'object') return String(s.id || s.id_estudiante || s) === String(alumnoId);
            return String(s) === String(alumnoId);
        })) return true;
        // ejecuciones[].estudiantes
        if (Array.isArray(project.ejecuciones)) {
            for (const ej of project.ejecuciones) {
                if (!ej) continue;
                if (Array.isArray(ej.estudiantes) && ej.estudiantes.some(s => {
                    if (s == null) return false;
                    if (typeof s === 'object') return String(s.id || s.id_estudiante || s) === String(alumnoId);
                    return String(s) === String(alumnoId);
                })) return true;
            }
        }
        // fallback: buscar id en JSON
        try {
            const json = JSON.stringify(project);
            if (json.includes(`"id":${alumnoId}`) || json.includes(`"id":"${alumnoId}"`)) return true;
        } catch (e) {}
        return false;
    }

    async function loadProyectosPorAlumno(alumnoId){
        try {
            setLoading(proyectoSelect);
            proyectoSelect.dataset.resultado = '';
            proyectoSelect.dataset.proyectoId = '';
            resultadoDiv.innerHTML = '';

            const proyectos = await fetchList('proyectoDeGrado');
            const proyectosDelAlumno = (proyectos || []).filter(p => projectHasStudent(p, alumnoId));

            clearSelect(proyectoSelect, '-- Seleccionar --');

            if (proyectosDelAlumno.length > 0) {
                proyectosDelAlumno.forEach(p => {
                    const opt = document.createElement('option');
                    opt.value = p.id || p.id_proyecto || '';
                    opt.textContent = p.titulo || `Proyecto ${opt.value}`;
                    opt.dataset.resultado = p.objetivo || (p.titulo ? `Proyecto: ${p.titulo}` : '');
                    proyectoSelect.appendChild(opt);
                });

                if (proyectoSelect.options.length > 1) {
                    proyectoSelect.selectedIndex = 1;
                    const sel = proyectoSelect.selectedOptions[0];
                    proyectoSelect.dataset.proyectoId = sel?.value || '';
                    proyectoSelect.dataset.resultado = sel?.dataset?.resultado || '';
                } else {
                    proyectoSelect.selectedIndex = 0;
                    proyectoSelect.dataset.proyectoId = '';
                    proyectoSelect.dataset.resultado = '';
                }
                proyectoSelect.disabled = false;
            } else {
                clearSelect(proyectoSelect, '-- No hay proyectos --');
                proyectoSelect.dataset.proyectoId = '';
                proyectoSelect.dataset.resultado = '';
                proyectoSelect.disabled = false;
                console.info('No hay proyectos asociados al alumno:', alumnoId);
            }
        } catch (e) {
            console.info('Error en loadProyectosPorAlumno:', e);
            clearSelect(proyectoSelect, '-- Error cargando --');
            proyectoSelect.disabled = false;
        } finally {
            finishLoading(proyectoSelect);
            refreshSummary();
        }
    }

    // Intentar obtener ejecución por id (varios nombres de endpoint posibles)
    async function fetchEjecucionById(id) {
        if (!id) return null;
        const key = `ejecucion:${id}`;
        const cached = cacheGet(key);
        if (cached !== undefined) return cached;
        const candidates = ['ejecucion', 'ejecucionDeProyecto', 'ejecucion_proyecto', 'ejecucionProyecto'];
        const res = await fetchEntityCandidates(candidates, id);
        cacheSet(key, res);
        return res;
    }

    // Intentar obtener resultado por id (varios nombres)
    async function fetchResultadoById(id) {
        if (!id) return null;
        const key = `resultado:${id}`;
        const cached = cacheGet(key);
        if (cached !== undefined) return cached;
        const candidates = ['resultado', 'resultados', 'resultadoProyecto'];
        const res = await fetchEntityCandidates(candidates, id);
        cacheSet(key, res);
        return res;
    }

    // Formateo "piensa" para evitar [object Object]
    function formatPiensa(piensa) {
        if (piensa == null) return 'No registrado';
        if (Array.isArray(piensa)) {
            const alternativas = piensa.map(item => {
                if (!item) return null;
                if (typeof item === 'object') {
                    if (item.alternativa) return String(item.alternativa);
                    const keys = Object.keys(item).filter(k => k !== 'id' && k !== 'estudiantes' && k !== 'proyectos');
                    if (keys.length) return keys.map(k => `${k}: ${String(item[k])}`).join(', ');
                    return JSON.stringify(item);
                }
                return String(item);
            }).filter(Boolean);
            return alternativas.length ? alternativas.join(' | ') : 'No registrado';
        }
        if (typeof piensa === 'object') {
            if (piensa.alternativa) return String(piensa.alternativa);
            const keys = Object.keys(piensa).filter(k => k !== 'id' && k !== 'estudiantes' && k !== 'proyectos');
            if (keys.length) return keys.map(k => `${k}: ${String(piensa[k])}`).join(', ');
            return JSON.stringify(piensa);
        }
        return String(piensa);
    }

    // Helpers HTML (omitimos URL universidad y nombre docente)
    function safeText(value) {
        if (value === null || value === undefined) return 'No registrado';
        if (typeof value === 'boolean') return value ? 'Sí' : 'No';
        const s = String(value).trim();
        return s === '' ? 'No registrado' : s;
    }
    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    function sectionTitle(title) { return `<div class="section-title">${escapeHtml(title)}</div>`; }
    function sectionSubtitle(title) { return `<div class="section-subtitle">${escapeHtml(title)}</div>`; }
    function kvHtml(k, v) { return `<div class="kv"><span class="k">${escapeHtml(k)}</span><span class="v">${escapeHtml(safeText(v))}</span></div>`; }
    function docenteHtml(doc, index) {
        // NO mostramos el nombre del docente por pedido.
        let html = `<div class="docente">`;
        html += `<div class="section-subtitle">Docente ${index}</div>`;
        html += kvHtml('Conocimientos', doc.conocimiento || doc.funcionDeSeguimiento);
        html += kvHtml('Experiencia', doc.experiencia);
        html += kvHtml('Trayectoria', doc.trayectoria != null ? `${safeText(doc.trayectoria)} años` : 'No registrado');
        html += kvHtml('Orientación', doc.orientacion);
        html += kvHtml('Gestión', doc.gestion);
        html += `</div>`;
        return html;
    }

    // Generar información bonita en el div resultado (no toca panel derecho)
    verDatosBtn.addEventListener('click', async () => {
        const uniId = universidadSelect.value;
        const alumnoId = alumnoSelect.value;
        const proyectoId = proyectoSelect.value || proyectoSelect.dataset.proyectoId;

        let htmlParts = [];
        htmlParts.push(sectionTitle('INFORMACIÓN COMPLETA'));
        htmlParts.push(kvHtml('Generado', new Date().toLocaleString()));

        // Universidad (omitimos URL)
        if (uniId) {
            const uni = await fetchEntityById('universidad', uniId);
            if (uni) {
                htmlParts.push(sectionTitle('UNIVERSIDAD'));
                htmlParts.push(kvHtml('Nombre', uni.cunaDelConocimiento || uni.nombre));
                htmlParts.push(kvHtml('Carreras (resumen)', uni.diferentesCarreras));
                const tipos = [];
                if (uni.publica) tipos.push('Pública');
                if (uni.privada) tipos.push('Privada');
                htmlParts.push(kvHtml('Tipo', tipos.length ? tipos.join(' / ') : 'No registrado'));
            } else {
                htmlParts.push(sectionTitle('UNIVERSIDAD'));
                htmlParts.push(`<div class="small">No registrado</div>`);
            }
        } else {
            htmlParts.push(sectionTitle('UNIVERSIDAD'));
            htmlParts.push(`<div class="small">No registrado</div>`);
        }

        // Estudiante (formatear "piensa")
        let est = null;
        if (alumnoId) {
            est = await fetchEntityById('estudiante', alumnoId);
            if (est) {
                htmlParts.push(sectionTitle('ESTUDIANTE'));
                htmlParts.push(kvHtml('Nombre', est.nombreUniversitario || est.nombre));
                htmlParts.push(kvHtml('Aspirante a grado', est.aspiranteAGrado == 1 ? 'Sí' : 'No'));
                htmlParts.push(kvHtml('Formato', est.formato));
                htmlParts.push(kvHtml('Piensa', formatPiensa(est.piensa)));
            } else {
                htmlParts.push(sectionTitle('ESTUDIANTE'));
                htmlParts.push(`<div class="small">No registrado</div>`);
            }
        } else {
            htmlParts.push(sectionTitle('ESTUDIANTE'));
            htmlParts.push(`<div class="small">No registrado</div>`);
        }

        // Proyecto
        let proyecto = null;
        if (proyectoId) {
            proyecto = await fetchEntityById('proyectoDeGrado', proyectoId);
        } else if (alumnoId) {
            // buscar proyecto que contenga al alumno
            const proyectos = await fetchList('proyectoDeGrado');
            proyecto = (proyectos || []).find(p => projectHasStudent(p, alumnoId)) || null;
        }

        if (proyecto) {
            htmlParts.push(sectionTitle('PROYECTO DE GRADO'));
            htmlParts.push(kvHtml('Título', proyecto.titulo));
            htmlParts.push(kvHtml('Objetivo', proyecto.objetivo));
            htmlParts.push(kvHtml('Alcance', proyecto.alcance));
            htmlParts.push(kvHtml('Plan de Proyecto', proyecto.planDeProyecto));
            htmlParts.push(kvHtml('Costo estimado', proyecto.costo != null ? `$ ${safeText(proyecto.costo)}` : 'No registrado'));
            htmlParts.push(kvHtml('Tiempo de realización', proyecto.tiempoDeRealizacion != null ? `${safeText(proyecto.tiempoDeRealizacion)} meses` : 'No registrado'));
            htmlParts.push(kvHtml('Viabilidad', proyecto.viabilidad != null ? safeText(proyecto.viabilidad) : 'No registrado'));

            if (proyecto.defineUna && (proyecto.defineUna.alternativa || proyecto.defineUna.escoger != null)) {
                htmlParts.push(sectionSubtitle('Solución propuesta'));
                htmlParts.push(kvHtml('Alternativa', proyecto.defineUna.alternativa));
                htmlParts.push(kvHtml('Elección', proyecto.defineUna.escoger));
            }

            // RESULTADOS: pueden estar en ejecuciones (objeto), en ejecuciones referenciadas por id,
            // o dentro de estructuras como estaPendiente.resultado (según tu JSON).
            let resultadoRendered = false;

            // 1) Si proyecto.ejecuciones es array de objetos y alguno tiene resultado
            if (Array.isArray(proyecto.ejecuciones) && proyecto.ejecuciones.length && typeof proyecto.ejecuciones[0] === 'object') {
                const ejecObj = proyecto.ejecuciones.find(e => e && e.resultado) || proyecto.ejecuciones[0];
                if (ejecObj && ejecObj.resultado) {
                    htmlParts.push(sectionTitle('RESULTADOS'));
                    htmlParts.push(kvHtml('Implementación finalizada', ejecObj.resultado.implementacionFinalizada ? 'Sí' : 'No'));
                    htmlParts.push(kvHtml('Efectos (resumen)', ejecObj.resultado.efectosPositivosYNegativos));
                    htmlParts.push(kvHtml('Medidas de satisfacción', ejecObj.resultado.medidasDeSatisfaccion));
                    resultadoRendered = true;
                }
            }

            // 2) Si ejecuciones son ids (números), intentar fetch de ejecucion y su resultado
            if (!resultadoRendered && Array.isArray(proyecto.ejecuciones) && proyecto.ejecuciones.length && (typeof proyecto.ejecuciones[0] === 'number' || typeof proyecto.ejecuciones[0] === 'string')) {
                for (const ejId of proyecto.ejecuciones) {
                    const ejecData = await fetchEjecucionById(ejId);
                    if (ejecData) {
                        // ejecData puede contener resultado como objeto o id
                        if (ejecData.resultado) {
                            let resObj = ejecData.resultado;
                            if (typeof resObj === 'number' || typeof resObj === 'string') {
                                resObj = await fetchResultadoById(resObj);
                            }
                            if (resObj) {
                                htmlParts.push(sectionTitle('RESULTADOS'));
                                htmlParts.push(kvHtml('Implementación finalizada', resObj.implementacionFinalizada ? 'Sí' : 'No'));
                                htmlParts.push(kvHtml('Efectos (resumen)', resObj.efectosPositivosYNegativos));
                                htmlParts.push(kvHtml('Medidas de satisfacción', resObj.medidasDeSatisfaccion));
                                resultadoRendered = true;
                                break;
                            }
                        }
                        // también puede haber resultado dentro de estaPendiente
                        if (ejecData.estaPendiente && ejecData.estaPendiente.resultado) {
                            const resObj = ejecData.estaPendiente.resultado;
                            htmlParts.push(sectionTitle('RESULTADOS'));
                            htmlParts.push(kvHtml('Implementación finalizada', resObj.implementacionFinalizada ? 'Sí' : 'No'));
                            htmlParts.push(kvHtml('Efectos (resumen)', resObj.efectosPositivosYNegativos));
                            htmlParts.push(kvHtml('Medidas de satisfacción', resObj.medidasDeSatisfaccion));
                            resultadoRendered = true;
                            break;
                        }
                    }
                }
            }

            // 3) Si aún no renderizamos, buscar resultado embebido en cualquier parte del proyecto (deep search)
            if (!resultadoRendered) {
                const foundResultado = deepFindById(proyecto, 'resultado') || (function searchForResultado(obj) {
                    if (!obj) return null;
                    if (typeof obj === 'object') {
                        if (obj.resultado && (obj.resultado.implementacionFinalizada !== undefined || obj.resultado.efectosPositivosYNegativos !== undefined)) return obj.resultado;
                        for (const k of Object.keys(obj)) {
                            const v = obj[k];
                            const r = searchForResultado(v);
                            if (r) return r;
                        }
                    } else if (Array.isArray(obj)) {
                        for (const it of obj) {
                            const r = searchForResultado(it);
                            if (r) return r;
                        }
                    }
                    return null;
                })(proyecto);

                if (foundResultado) {
                    htmlParts.push(sectionTitle('RESULTADOS'));
                    htmlParts.push(kvHtml('Implementación finalizada', foundResultado.implementacionFinalizada ? 'Sí' : 'No'));
                    htmlParts.push(kvHtml('Efectos (resumen)', foundResultado.efectosPositivosYNegativos));
                    htmlParts.push(kvHtml('Medidas de satisfacción', foundResultado.medidasDeSatisfaccion));
                    resultadoRendered = true;
                }
            }

            if (!resultadoRendered) {
                htmlParts.push(sectionTitle('RESULTADOS'));
                htmlParts.push(`<div class="small">No registrado</div>`);
            }

            // DOCENTES: recolectar referencias y resolver a objetos completos cuando sea posible
            const refs = [];
            // posibles ubicaciones de referencias a docentes
            if (Array.isArray(proyecto.docentes)) proyecto.docentes.forEach(d => refs.push(d));
            if (Array.isArray(proyecto.ejecuciones)) {
                proyecto.ejecuciones.forEach(ej => {
                    if (ej && Array.isArray(ej.docentes)) ej.docentes.forEach(d => refs.push(d));
                    if (ej && Array.isArray(ej.estudiantes)) {
                        ej.estudiantes.forEach(est => {
                            if (typeof est === 'object' && Array.isArray(est.docentes)) est.docentes.forEach(d => refs.push(d));
                        });
                    }
                });
            }
            // también buscar en defineUna.estudiantes
            if (proyecto.defineUna && Array.isArray(proyecto.defineUna.estudiantes)) {
                proyecto.defineUna.estudiantes.forEach(est => {
                    if (est && Array.isArray(est.docentes)) est.docentes.forEach(d => refs.push(d));
                });
            }
            // resolver referencias (intenta endpoint, si no busca dentro del proyecto)
            const docentes = await resolveDocentes(refs, proyecto);
            htmlParts.push(sectionTitle('DOCENTES ASIGNADOS'));
            if (docentes && docentes.length > 0) {
                docentes.forEach((doc, i) => {
                    htmlParts.push(docenteHtml(doc, i+1));
                });
            } else {
                htmlParts.push(`<div class="small">No se encontraron docentes asignados.</div>`);
            }

            // DATOS RECOLECTADOS (si existen)
            const uni = (uniId ? await fetchEntityById('universidad', uniId) : null) || proyecto.universidad || null;
            if (uni && Array.isArray(uni.hace) && uni.hace.length > 0) {
                htmlParts.push(sectionTitle('DATOS RECOLECTADOS'));
                uni.hace.forEach((rec, idx) => {
                    htmlParts.push(sectionSubtitle(`Recolección ${idx + 1}`));
                    htmlParts.push(kvHtml('Datos de afectados', rec.datosDeLosAfectados));
                    htmlParts.push(kvHtml('Datos de interesados', rec.datosDeLosDirectamenteInterezados));
                    htmlParts.push(kvHtml('Comentarios en línea', rec.comentariosAbiertosEnLinea));
                    htmlParts.push(kvHtml('Formulario en línea', rec.formularioEnLinea));
                    htmlParts.push(kvHtml('Plataforma', rec.plataformaDeSoftware));
                });
            } else {
                htmlParts.push(sectionTitle('DATOS RECOLECTADOS'));
                htmlParts.push(`<div class="small">No registrado</div>`);
            }
        } else {
            htmlParts.push(`<div class="small">No se encontró un proyecto asociado al estudiante seleccionado.</div>`);
        }

        resultadoDiv.classList.add('resultado-card');
        resultadoDiv.innerHTML = htmlParts.join('\n');

        // Mantener panel derecho sin cambios
        refreshSummary();
    });

    universidadSelect.addEventListener('change', async () => {
        await loadAlumnosPorUniversidad(universidadSelect.value);
        clearSelect(proyectoSelect, '-- Seleccionar --');
        proyectoSelect.dataset.proyectoId = '';
        proyectoSelect.dataset.resultado = '';
        resultadoDiv.innerHTML = '';
        refreshSummary();
    });

    alumnoSelect.addEventListener('change', async () => {
        await loadProyectosPorAlumno(alumnoSelect.value);
        refreshSummary();
    });

    proyectoSelect.addEventListener('change', async () => {
        const sel = proyectoSelect.selectedOptions[0];
        if (sel && sel.value) {
            proyectoSelect.dataset.proyectoId = sel.value;
            proyectoSelect.dataset.resultado = sel.dataset.resultado || '';
        } else {
            proyectoSelect.dataset.proyectoId = '';
            proyectoSelect.dataset.resultado = '';
            resultadoDiv.innerHTML = '';
        }
        refreshSummary();
    });

    (async function init(){
        setLoading(universidadSelect);
        setLoading(alumnoSelect);
        setLoading(proyectoSelect);
        await loadUniversidades();
        finishLoading(alumnoSelect);
        finishLoading(proyectoSelect);
        refreshSummary();
    })();
});
