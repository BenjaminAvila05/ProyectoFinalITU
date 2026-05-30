// script.js — versión corregida y defensiva
// Asegurate de reemplazar el archivo actual por este y recargar la página.

document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = window.location.origin + '/api/v1';
    const base = (entity) => `${API_BASE}/${entity}`;

    /* -------------------------
       Utilidades de red y parsing
       ------------------------- */
    async function fetchList(entity) {
        try {
            const res = await fetch(base(entity));
            if (!res.ok) {
                console.warn(`fetchList ${entity} -> status ${res.status}`);
                return [];
            }
            return await res.json();
        } catch (e) {
            console.error(`fetchList ${entity} error`, e);
            return [];
        }
    }

    async function fetchEntityById(entity, id) {
        try {
            const res = await fetch(`${base(entity)}/${id}`);
            if (!res.ok) {
                console.warn(`fetchEntityById ${entity}/${id} -> status ${res.status}`);
                return null;
            }
            return await res.json();
        } catch (e) {
            console.error(`fetchEntityById ${entity}/${id} error`, e);
            return null;
        }
    }

    // getNested tolerante: acepta 'a.b.c' o propiedad directa
    function getNested(obj, path) {
        if (!obj || !path) return undefined;
        if (obj[path] !== undefined) return obj[path];
        return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
    }

    // fetchChildByParent: intenta endpoint anidado, si falla pide todos y filtra por convenciones
    async function fetchChildByParent(parentEntity, parentId, childEntity, parentFieldName) {
        try {
            // 1) Intento endpoint anidado
            const nestedUrl = `${API_BASE}/${parentEntity}/${parentId}/${childEntity}`;
            let res = await fetch(nestedUrl);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) return data;
                // si devuelve objeto único, envolver en array
                return data ? [data] : [];
            }

            // 2) Fallback: pedir todos los child y filtrar en cliente
            res = await fetch(base(childEntity));
            if (!res.ok) {
                console.warn(`Fallback fetchChildByParent ${childEntity} -> status ${res.status}`);
                return [];
            }
            const list = await res.json();
            if (!Array.isArray(list)) return [];

            // posibles nombres de campo que pueden referenciar al parent
            const candidates = [
                parentFieldName,
                parentFieldName && parentFieldName.replace('.id', ''),
                `${parentEntity}`, `${parentEntity}Id`, `${parentEntity}.id`,
                `id_${parentEntity}`, `id_${parentEntity.replace(/s$/,'')}`,
                'universidad', 'universidadId', 'universidad.id',
                'estudiante', 'estudianteId', 'estudiante.id'
            ].filter(Boolean);

            return list.filter(item => {
                for (const cand of candidates) {
                    const v = getNested(item, cand);
                    if (v === undefined || v === null) continue;
                    // si v es objeto con id
                    if (typeof v === 'object') {
                        const vid = v.id || v.id_universidad || v.id_estudiante;
                        if (vid && String(vid) === String(parentId)) return true;
                    } else {
                        if (String(v) === String(parentId)) return true;
                    }
                }
                return false;
            });
        } catch (e) {
            console.error('fetchChildByParent error', e);
            return [];
        }
    }

    /* -------------------------
       Referencias DOM (coinciden con tu HTML)
       ------------------------- */
    const universidadSelect = document.getElementById('universidad');
    const alumnoSelect = document.getElementById('alumno');
    const proyectoSelect = document.getElementById('proyecto'); // coincide con HTML
    const proyectoManual = document.getElementById('proyectoManual'); // coincide con HTML
    const resultadoTextarea = document.getElementById('resultado');

    const outUniversidad = document.getElementById('outUniversidad');
    const outAlumno = document.getElementById('outAlumno');
    const outProyecto = document.getElementById('outProyecto');
    const outResultado = document.getElementById('outResultado');
    const resumenMeta = document.getElementById('resumenMeta');

    const verDatosBtn = document.getElementById('verDatos');
    const verDocentesBtn = document.getElementById('verDocentes');
    const verProyectoBtn = document.getElementById('verProyecto');

    // Validación básica: si faltan elementos, abortar y avisar
    if (!universidadSelect || !alumnoSelect || !proyectoSelect || !resultadoTextarea) {
        console.warn('Faltan elementos DOM requeridos. Revisá los ids: universidad, alumno, proyecto, resultado.');
        return;
    }

    /* -------------------------
       Helpers UI
       ------------------------- */
    function clearSelect(sel, placeholder = '-- Seleccionar --') {
        sel.innerHTML = '';
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = placeholder;
        sel.appendChild(opt);
    }
    function setLoading(sel, text = 'Cargando...') {
        sel.innerHTML = '';
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = text;
        sel.appendChild(opt);
        sel.disabled = true;
    }
    function finishLoading(sel) { sel.disabled = false; }

    function safeText(el, text) {
        if (!el) return;
        el.textContent = text;
    }

    // refreshSummary defensiva
    function refreshSummary(){
        try {
            safeText(outUniversidad, universidadSelect?.selectedOptions?.[0]?.text || '—');
            safeText(outAlumno, alumnoSelect?.selectedOptions?.[0]?.text || '—');
            const proyectoText = (proyectoManual && proyectoManual.value && proyectoManual.value.trim())
                ? proyectoManual.value.trim()
                : (proyectoSelect?.selectedOptions?.[0]?.text || '—');
            safeText(outProyecto, proyectoText);
            safeText(outResultado, resultadoTextarea?.value || proyectoSelect?.dataset?.resultado || '—');
            if (resumenMeta) {
                resumenMeta.textContent = (universidadSelect?.value && alumnoSelect?.value) ? 'Datos listos para ver o exportar.' : 'Seleccioná universidad y alumno para ver información.';
            }
        } catch (e) {
            console.warn('refreshSummary error', e);
        }
    }

    /* -------------------------
       Carga de datos
       ------------------------- */
    async function loadUniversidades(){
        setLoading(universidadSelect);
        const list = await fetchList('universidad');
        clearSelect(universidadSelect, '-- Seleccionar --');
        list.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.id ?? u.id_universidad ?? u.idUniversidad ?? '';
            opt.textContent = u.cunaDelConocimiento || u.cuna_del_conocimiento || u.nombre || u.name || `Universidad ${opt.value}`;
            universidadSelect.appendChild(opt);
        });
        finishLoading(universidadSelect);
        refreshSummary();
    }

    async function loadAlumnosPorUniversidad(uniId){
        setLoading(alumnoSelect);
        if (!uniId) {
            clearSelect(alumnoSelect, '-- Seleccionar --');
            finishLoading(alumnoSelect);
            refreshSummary();
            return;
        }

        // probar convenciones
        let alumnos = await fetchChildByParent('universidad', uniId, 'estudiante', 'universidad.id')
            .then(arr => (arr.length ? arr : fetchChildByParent('universidad', uniId, 'estudiante', 'universidadId')));

        // fallback adicional: pedir todos y filtrar por campos comunes
        if (!alumnos || alumnos.length === 0) {
            const all = await fetchList('estudiante');
            alumnos = all.filter(a => {
                const candidates = [
                    getNested(a, 'universidad'),
                    getNested(a, 'universidad.id'),
                    getNested(a, 'universidadId'),
                    a.id_universidad,
                    a.idUniversidad,
                    a.universidad
                ];
                return candidates.some(v => v !== undefined && v !== null && String(v) === String(uniId));
            });
        }

        clearSelect(alumnoSelect, '-- Seleccionar --');
        alumnos.forEach(a => {
            const opt = document.createElement('option');
            opt.value = a.id ?? a.id_estudiante ?? a.idEstudiante ?? '';
            const name = a.nombreUniversitario || a.nombre || a.name || `${a.apellido ? a.apellido + ', ' : ''}${a.nombre || a.name || opt.value}`;
            opt.textContent = name;
            alumnoSelect.appendChild(opt);
        });
        finishLoading(alumnoSelect);
        refreshSummary();
    }

    async function loadProyectosPorAlumno(alumnoId){
        setLoading(proyectoSelect);
        proyectoSelect.dataset.resultado = '';
        proyectoSelect.dataset.proyectoId = '';
        proyectoSelect.dataset.docentesList = '[]';
        if (proyectoManual) proyectoManual.value = '';
        if (resultadoTextarea) resultadoTextarea.value = '';

        if (!alumnoId) {
            clearSelect(proyectoSelect, '-- Seleccionar --');
            finishLoading(proyectoSelect);
            refreshSummary();
            return;
        }

        // intentar rutas anidadas y fallback
        let proyectos = await fetchChildByParent('estudiante', alumnoId, 'proyectoDeGrado', 'estudiante.id')
            .then(arr => (arr.length ? arr : fetchChildByParent('estudiante', alumnoId, 'proyectoDeGrado', 'estudianteId')));

        if (!proyectos || proyectos.length === 0) {
            // pedir todos y filtrar por convenciones
            const all = await fetchList('proyectoDeGrado');
            proyectos = all.filter(p => {
                const candidates = [
                    getNested(p, 'estudiantes') || getNested(p, 'estudiante'),
                    getNested(p, 'estudiante.id'),
                    getNested(p, 'estudianteId'),
                    p.id_estudiante, p.idEstudiante, p.autorId, p.autor
                ];
                // si p.estudiantes es array de ids u objetos
                if (Array.isArray(getNested(p, 'estudiantes'))) {
                    const arr = getNested(p, 'estudiantes');
                    return arr.some(x => {
                        if (typeof x === 'object') return String(x.id || x.id_estudiante || x.idEstudiante) === String(alumnoId);
                        return String(x) === String(alumnoId);
                    });
                }
                return candidates.some(v => v !== undefined && v !== null && String(v) === String(alumnoId));
            });
        }

        clearSelect(proyectoSelect, '-- Seleccionar --');
        if (proyectos.length > 0) {
            proyectos.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id ?? p.id_proyecto ?? p.idProyecto ?? '';
                opt.textContent = p.titulo || p.title || p.nombre || `Proyecto ${opt.value}`;
                // almacenar resultado en dataset para uso posterior
                opt.dataset.resultado = (p.resultado && (typeof p.resultado === 'string' ? p.resultado : (p.resultado.descripcion || p.resultado.resumen || ''))) || '';
                proyectoSelect.appendChild(opt);
            });
            // seleccionar el primer proyecto real (índice 1 porque 0 es placeholder)
            if (proyectoSelect.options.length > 1) proyectoSelect.selectedIndex = 1;
            const sel = proyectoSelect.selectedOptions[0];
            proyectoSelect.dataset.proyectoId = sel?.value || '';
            proyectoSelect.dataset.resultado = sel?.dataset?.resultado || '';
            resultadoTextarea.value = proyectoSelect.dataset.resultado || '';
        } else {
            clearSelect(proyectoSelect, '-- No hay proyectos --');
            proyectoSelect.removeAttribute('disabled');
        }
        finishLoading(proyectoSelect);
        refreshSummary();
    }

    async function loadDetalleProyecto(proyectoId){
        if (!proyectoId) return;
        const data = await fetchEntityById('proyectoDeGrado', proyectoId);
        if (!data) return;
        proyectoSelect.dataset.proyectoId = data.id ?? data.id_proyecto ?? proyectoId;
        proyectoSelect.dataset.resultado = (data.resultado && (typeof data.resultado === 'string' ? data.resultado : (data.resultado.descripcion || data.resultado.resumen || ''))) || '';
        resultadoTextarea.value = proyectoSelect.dataset.resultado || '';
        proyectoSelect.dataset.docentesList = JSON.stringify(data.docentes || []);
        if (proyectoManual) proyectoManual.value = '';
        refreshSummary();
    }

    /* -------------------------
       Eventos UI (defensivos)
       ------------------------- */
    universidadSelect.addEventListener('change', async () => {
        const uniId = universidadSelect.value;
        await loadAlumnosPorUniversidad(uniId);
        // limpiar proyecto/resultado
        clearSelect(proyectoSelect, '-- Seleccionar o escribir --');
        proyectoSelect.dataset.proyectoId = '';
        proyectoSelect.dataset.resultado = '';
        proyectoSelect.dataset.docentesList = '[]';
        if (proyectoManual) proyectoManual.value = '';
        if (resultadoTextarea) resultadoTextarea.value = '';
        refreshSummary();
    });

    alumnoSelect.addEventListener('change', async () => {
        const alumnoId = alumnoSelect.value;
        await loadProyectosPorAlumno(alumnoId);
        refreshSummary();
    });

    proyectoSelect.addEventListener('change', async () => {
        const sel = proyectoSelect.selectedOptions?.[0];
        if (sel && sel.value) {
            proyectoSelect.dataset.proyectoId = sel.value;
            proyectoSelect.dataset.resultado = sel.dataset.resultado || '';
            resultadoTextarea.value = proyectoSelect.dataset.resultado || '';
            await loadDetalleProyecto(sel.value);
        } else {
            proyectoSelect.dataset.proyectoId = '';
            proyectoSelect.dataset.resultado = '';
            proyectoSelect.dataset.docentesList = '[]';
            resultadoTextarea.value = '';
        }
        refreshSummary();
    });

    if (proyectoManual) {
        proyectoManual.addEventListener('input', () => {
            if (proyectoManual.value.trim()) {
                proyectoSelect.selectedIndex = 0;
                proyectoSelect.dataset.proyectoId = '';
                proyectoSelect.dataset.docentesList = '[]';
                proyectoSelect.dataset.resultado = resultadoTextarea.value || '';
            }
            refreshSummary();
        });
    }

    function openDocentesModalFromDataset() {
        const docentes = JSON.parse(proyectoSelect.dataset.docentesList || '[]');
        if (!docentes || docentes.length === 0) {
            alert('No se encontraron docentes para este proyecto.');
            return;
        }
        const lista = docentes.map(d => `• ${d.nombre || d.name || (d.apellido ? d.apellido + ', ' : '') + (d.nombre || d.name || '')}`).join('\n');
        alert('Docentes a cargo:\n\n' + lista);
    }

    if (verProyectoBtn) {
        verProyectoBtn.addEventListener('click', async () => {
            const proyectoId = proyectoSelect.dataset.proyectoId;
            if (proyectoId) {
                await loadDetalleProyecto(proyectoId);
                alert('Detalle del proyecto cargado en el panel derecho.');
            } else if (proyectoManual && proyectoManual.value.trim()) {
                alert('Proyecto ingresado manualmente: ' + proyectoManual.value.trim());
            } else {
                alert('No hay proyecto seleccionado ni ingresado.');
            }
        });
    }

    if (verDocentesBtn) {
        verDocentesBtn.addEventListener('click', async () => {
            const proyectoId = proyectoSelect.dataset.proyectoId;
            if (proyectoId) {
                if (!proyectoSelect.dataset.docentesList || proyectoSelect.dataset.docentesList === '[]') {
                    await loadDetalleProyecto(proyectoId);
                }
                openDocentesModalFromDataset();
            } else {
                alert('No hay proyecto seleccionado para mostrar docentes.');
            }
        });
    }

    if (verDatosBtn) {
        verDatosBtn.addEventListener('click', () => {
            refreshSummary();
            alert('Panel actualizado. Implementá llamadas adicionales según tu API.');
        });
    }

    /* -------------------------
       Inicialización
       ------------------------- */
    (async function init(){
        try {
            setLoading(universidadSelect);
            setLoading(alumnoSelect);
            setLoading(proyectoSelect);
            await loadUniversidades();
        } catch (e) {
            console.error('init error', e);
        } finally {
            finishLoading(alumnoSelect);
            finishLoading(proyectoSelect);
            refreshSummary();
        }
    })();

}); // DOMContentLoaded
