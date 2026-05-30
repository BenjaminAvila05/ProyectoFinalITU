document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = window.location.origin + '/api/v1';
    const base = (entity) => `${API_BASE}/${entity}`;

    async function fetchList(entity) {
        try {
            const res = await fetch(base(entity));
            if (!res.ok) return [];
            return await res.json();
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    async function fetchEntityById(entity, id) {
        try {
            const res = await fetch(`${base(entity)}/${id}`);
            if (!res.ok) return null;
            return await res.json();
        } catch (e) {
            console.error(e);
            return null;
        }
    }

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
        list.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.id || u.id_universidad || '';
            opt.textContent = u.cunaDelConocimiento || u.nombre || `Universidad ${opt.value}`;
            universidadSelect.appendChild(opt);
        });
        finishLoading(universidadSelect);
        refreshSummary();
    }

    async function loadAlumnosPorUniversidad(uniId){
        setLoading(alumnoSelect);
        const all = await fetchList('estudiante');
        const alumnos = all.filter(a => {
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
        finishLoading(alumnoSelect);
        refreshSummary();
    }

    async function loadProyectosPorAlumno(alumnoId){
        setLoading(proyectoSelect);
        proyectoSelect.dataset.resultado = '';
        proyectoSelect.dataset.proyectoId = '';
        resultadoDiv.innerHTML = '';

        const proyectos = await fetchList('proyectoDeGrado');
        const proyectosDelAlumno = proyectos.filter(p => {
            return p.ejecuciones?.some(ej =>
                ej.estudiantes?.some(est => String(est.id) === String(alumnoId) || String(est.id_estudiante) === String(alumnoId))
            );
        });

        clearSelect(proyectoSelect, '-- Seleccionar --');
        if (proyectosDelAlumno.length > 0) {
            proyectosDelAlumno.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id || p.id_proyecto || '';
                opt.textContent = p.titulo || `Proyecto ${opt.value}`;
                opt.dataset.resultado = p.objetivo || (p.titulo ? `Proyecto: ${p.titulo}` : '');
                proyectoSelect.appendChild(opt);
            });
            proyectoSelect.selectedIndex = 1;
            const sel = proyectoSelect.selectedOptions[0];
            proyectoSelect.dataset.proyectoId = sel.value;
            proyectoSelect.dataset.resultado = sel.dataset.resultado || '';
        } else {
            clearSelect(proyectoSelect, '-- No hay proyectos --');
            proyectoSelect.removeAttribute('disabled');
        }
        finishLoading(proyectoSelect);
        refreshSummary();
    }

    async function findProjectForStudent(alumnoId) {
        const selectedId = proyectoSelect.dataset.proyectoId || proyectoSelect.value;
        if (selectedId) {
            const p = await fetchEntityById('proyectoDeGrado', selectedId);
            if (p) return p;
        }
        const proyectos = await fetchList('proyectoDeGrado');
        for (const p of proyectos) {
            if (p.ejecuciones?.some(ej => ej.estudiantes?.some(est => String(est.id) === String(alumnoId) || String(est.id_estudiante) === String(alumnoId)))) {
                return p;
            }
        }
        return null;
    }

    function collectDocentes(project, alumnoId) {
        const docentes = [];
        if (!project) return docentes;

        if (Array.isArray(project.ejecuciones)) {
            project.ejecuciones.forEach(ej => {
                if (Array.isArray(ej.docentes)) {
                    ej.docentes.forEach(d => {
                        const key = (d.nombre || d.name || d.conocimiento || '') + '|' + (d.experiencia || '');
                        if (!docentes.some(x => x._key === key)) {
                            docentes.push(Object.assign({_key: key}, d));
                        }
                    });
                }
            });
        }

        if (Array.isArray(project.ejecuciones)) {
            project.ejecuciones.forEach(ej => {
                if (Array.isArray(ej.estudiantes)) {
                    ej.estudiantes.forEach(est => {
                        if (String(est.id) === String(alumnoId) || String(est.id_estudiante) === String(alumnoId)) {
                            if (Array.isArray(est.docentes)) {
                                est.docentes.forEach(d => {
                                    const key = (d.nombre || d.name || d.conocimiento || '') + '|' + (d.experiencia || '');
                                    if (!docentes.some(x => x._key === key)) {
                                        docentes.push(Object.assign({_key: key}, d));
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }

        return docentes.map(d => {
            const copy = Object.assign({}, d);
            delete copy._key;
            return copy;
        });
    }

    function safeText(value) {
        if (value === null || value === undefined) return '—';
        if (typeof value === 'boolean') return value ? 'Sí' : 'No';
        return String(value);
    }

    // escape HTML to avoid injection when inserting innerHTML
    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // helpers that return HTML fragments
    function sectionTitle(title) {
        return `<div class="section-title">${escapeHtml(title)}</div>`;
    }
    function sectionSubtitle(title) {
        return `<div class="section-subtitle">${escapeHtml(title)}</div>`;
    }
    function kvHtml(k, v) {
        return `<div class="kv"><span class="k">${escapeHtml(k)}</span><span class="v">${escapeHtml(safeText(v))}</span></div>`;
    }
    function docenteHtml(doc, index) {
        let html = `<div class="docente">`;
        html += `<div class="section-subtitle">Docente ${index}</div>`;
        if (doc.nombre) html += kvHtml('Nombre', doc.nombre);
        if (doc.conocimiento) html += kvHtml('Conocimientos', doc.conocimiento);
        if (doc.experiencia) html += kvHtml('Experiencia', doc.experiencia);
        if (doc.trayectoria != null) html += kvHtml('Trayectoria', `${safeText(doc.trayectoria)} años`);
        if (doc.orientacion) html += kvHtml('Orientación', doc.orientacion);
        if (doc.gestion) html += kvHtml('Gestión', doc.gestion);
        html += `</div>`;
        return html;
    }

    verDatosBtn.addEventListener('click', async () => {
        const uniId = universidadSelect.value;
        const alumnoId = alumnoSelect.value;
        const proyectoId = proyectoSelect.value || proyectoSelect.dataset.proyectoId;

        let htmlParts = [];

        // header
        htmlParts.push(sectionTitle('INFORMACIÓN COMPLETA'));
        htmlParts.push(kvHtml('Generado', new Date().toLocaleString()));

        // Universidad
        if (uniId) {
            const uni = await fetchEntityById('universidad', uniId);
            if (uni) {
                htmlParts.push(sectionTitle('UNIVERSIDAD'));
                htmlParts.push(kvHtml('Nombre', uni.cunaDelConocimiento || uni.nombre));
                if (uni.diferentesCarreras) htmlParts.push(kvHtml('Carreras (resumen)', uni.diferentesCarreras));
                const tipos = [];
                if (uni.publica) tipos.push('Pública');
                if (uni.privada) tipos.push('Privada');
                if (tipos.length) htmlParts.push(kvHtml('Tipo', tipos.join(' / ')));
                if (uni.urlUniversidad) htmlParts.push(kvHtml('URL', uni.urlUniversidad));
            }
        }

        // Estudiante
        let est = null;
        if (alumnoId) {
            est = await fetchEntityById('estudiante', alumnoId);
            if (est) {
                htmlParts.push(sectionTitle('ESTUDIANTE'));
                htmlParts.push(kvHtml('Nombre', est.nombreUniversitario || est.nombre));
                htmlParts.push(kvHtml('Aspirante a grado', est.aspiranteAGrado == 1 ? 'Sí' : 'No'));
                if (est.formato) htmlParts.push(kvHtml('Formato', est.formato));
                if (est.urlUniversidad) htmlParts.push(kvHtml('URL Universidad', est.urlUniversidad));
                if (est.piensa != null) htmlParts.push(kvHtml('Piensa', est.piensa));
            }
        }

        // Proyecto
        let proyecto = null;
        if (proyectoId) {
            proyecto = await fetchEntityById('proyectoDeGrado', proyectoId);
        } else if (alumnoId) {
            proyecto = await findProjectForStudent(alumnoId);
        }

        if (proyecto) {
            htmlParts.push(sectionTitle('PROYECTO DE GRADO'));
            htmlParts.push(kvHtml('Título', proyecto.titulo));
            if (proyecto.objetivo) htmlParts.push(kvHtml('Objetivo', proyecto.objetivo));
            if (proyecto.alcance) htmlParts.push(kvHtml('Alcance', proyecto.alcance));
            if (proyecto.planDeProyecto) htmlParts.push(kvHtml('Plan de Proyecto', proyecto.planDeProyecto));
            if (proyecto.costo != null) htmlParts.push(kvHtml('Costo estimado', `$ ${safeText(proyecto.costo)}`));
            if (proyecto.tiempoDeRealizacion != null) htmlParts.push(kvHtml('Tiempo de realización', `${safeText(proyecto.tiempoDeRealizacion)} meses`));
            if (proyecto.viabilidad != null) htmlParts.push(kvHtml('Viabilidad', `${safeText(proyecto.viabilidad)}`));
            if (proyecto.defineUna && (proyecto.defineUna.alternativa || proyecto.defineUna.escoger)) {
                htmlParts.push(sectionSubtitle('Solución propuesta'));
                if (proyecto.defineUna.alternativa) htmlParts.push(kvHtml('Alternativa', proyecto.defineUna.alternativa));
                if (proyecto.defineUna.escoger != null) htmlParts.push(kvHtml('Elección', proyecto.defineUna.escoger));
            }

            // Resultados
            const ejecuciones = Array.isArray(proyecto.ejecuciones) ? proyecto.ejecuciones : [];
            if (ejecuciones.length) {
                let ejec = ejecuciones.find(e => e.estudiantes?.some(s => String(s.id) === String(alumnoId) || String(s.id_estudiante) === String(alumnoId))) || ejecuciones[0];
                if (ejec && ejec.resultado) {
                    htmlParts.push(sectionTitle('RESULTADOS'));
                    htmlParts.push(kvHtml('Implementación finalizada', ejec.resultado.implementacionFinalizada ? 'Sí' : 'No'));
                    if (ejec.resultado.efectosPositivosYNegativos != null) htmlParts.push(kvHtml('Efectos (resumen)', ejec.resultado.efectosPositivosYNegativos));
                    if (ejec.resultado.medidasDeSatisfaccion != null) htmlParts.push(kvHtml('Medidas de satisfacción', ejec.resultado.medidasDeSatisfaccion));
                }
            }

            // Docentes
            let docentes = collectDocentes(proyecto, alumnoId);
            if ((!docentes || docentes.length === 0) && est && Array.isArray(est.docentes)) {
                docentes = est.docentes.slice();
            }
            if (docentes && docentes.length > 0) {
                htmlParts.push(sectionTitle('DOCENTES ASIGNADOS'));
                docentes.forEach((doc, i) => {
                    htmlParts.push(docenteHtml(doc, i+1));
                });
            } else {
                htmlParts.push(sectionTitle('DOCENTES ASIGNADOS'));
                htmlParts.push(`<div class="small">No se encontraron docentes asignados.</div>`);
            }

            // Datos recolectados
            const uni = (uniId ? await fetchEntityById('universidad', uniId) : null) || proyecto.universidad || null;
            if (uni && Array.isArray(uni.hace) && uni.hace.length > 0) {
                htmlParts.push(sectionTitle('DATOS RECOLECTADOS'));
                uni.hace.forEach((rec, idx) => {
                    htmlParts.push(sectionSubtitle(`Recolección ${idx + 1}`));
                    if (rec.datosDeLosAfectados) htmlParts.push(kvHtml('Datos de afectados', rec.datosDeLosAfectados));
                    if (rec.datosDeLosDirectamenteInterezados) htmlParts.push(kvHtml('Datos de interesados', rec.datosDeLosDirectamenteInterezados));
                    if (rec.comentariosAbiertosEnLinea != null) htmlParts.push(kvHtml('Comentarios en línea', rec.comentariosAbiertosEnLinea));
                    if (rec.formularioEnLinea != null) htmlParts.push(kvHtml('Formulario en línea', rec.formularioEnLinea));
                    if (rec.plataformaDeSoftware) htmlParts.push(kvHtml('Plataforma', rec.plataformaDeSoftware));
                });
            }
        } else {
            htmlParts.push(`<div class="small">No se encontró un proyecto asociado al estudiante seleccionado.</div>`);
        }

        // render HTML into resultadoDiv (preserve styling)
        resultadoDiv.classList.add('resultado-card');
        resultadoDiv.innerHTML = htmlParts.join('\n');

        // keep right-hand details unchanged
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
