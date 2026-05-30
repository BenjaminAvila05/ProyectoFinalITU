
const API_BASE = window.location.origin + '/api/v1';

// Helper: ruta base para una entidad (ej: 'universidad', 'estudiante', 'proyecto')
const base = (entity) => `${API_BASE}/${entity}`;

// Intenta endpoint anidado: /api/v1/{parent}/{parentId}/{child}
// Si falla, hace fallback a /api/v1/{child} y filtra localmente por parentId
async function fetchChildByParent(parentEntity, parentId, childEntity, parentFieldName) {
    // parentFieldName: nombre del campo en el child que referencia al parent (ej: 'universidadId' o 'universidad.id')
    try {
        // 1) Intento endpoint anidado (convención posible)
        const nestedUrl = `${API_BASE}/${parentEntity}/${parentId}/${childEntity}`;
        let res = await fetch(nestedUrl);
        if (res.ok) return await res.json();

        // 2) Fallback: pedir todos los child y filtrar en cliente
        const allUrl = `${base(childEntity)}`;
        res = await fetch(allUrl);
        if (!res.ok) throw new Error(`Error al obtener ${childEntity}`);
        const list = await res.json();

        // Filtrado flexible: soporta child[parentFieldName] o child[parentFieldName].id
        return list.filter(item => {
            if (!parentFieldName) return false;
            const v = getNested(item, parentFieldName);
            if (v === undefined || v === null) return false;
            // comparar como string para mayor tolerancia
            return String(v) === String(parentId);
        });
    } catch (e) {
        console.error(e);
        return [];
    }
}

// Obtener entidad por id
async function fetchEntityById(entity, id) {
    try {
        const res = await fetch(`${base(entity)}/${id}`);
        if (!res.ok) throw new Error(`Error al obtener ${entity} ${id}`);
        return await res.json();
    } catch (e) {
        console.error(e);
        return null;
    }
}

// Obtener lista simple
async function fetchList(entity) {
    try {
        const res = await fetch(base(entity));
        if (!res.ok) throw new Error(`Error al obtener ${entity}`);
        return await res.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

// Util: obtener valor anidado por path 'a.b.c'
function getNested(obj, path) {
    if (!obj || !path) return undefined;
    return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}

// IDs de elementos en el HTML (asegurate que coincidan)
const universidadSelect = document.getElementById('universidad');
const alumnoSelect = document.getElementById('alumno');
const proyectoSelect = document.getElementById('proyectoDeGrado'); // ahora select
const proyectoManual = document.getElementById('proyectoDeGradoManual'); // input libre
const resultadoTextarea = document.getElementById('resultado');

const outUniversidad = document.getElementById('outUniversidad');
const outAlumno = document.getElementById('outAlumno');
const outProyecto = document.getElementById('outProyectoDeGrado');
const outResultado = document.getElementById('outResultado');
const resumenMeta = document.getElementById('resumenMeta');

const verDatosBtn = document.getElementById('verDatos');
const verDocentesBtn = document.getElementById('verDocentes');
const verProyectoBtn = document.getElementById('verProyecto');

// Inicializa selects
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

// Actualiza panel derecho
function refreshSummary(){
    outUniversidad.textContent = universidadSelect.selectedOptions[0]?.text || '—';
    outAlumno.textContent = alumnoSelect.selectedOptions[0]?.text || '—';
    outProyecto.textContent = proyectoManual.value.trim() || proyectoSelect.selectedOptions[0]?.text || '—';
    outResultado.textContent = resultadoTextarea.value || proyectoSelect.dataset.resultado || '—';
    resumenMeta.textContent = (universidadSelect.value && alumnoSelect.value) ? 'Datos listos para ver o exportar.' : 'Seleccioná universidad y alumno para ver información.';
}

// Cargar universidades
async function loadUniversidades(){
    setLoading(universidadSelect);
    const list = await fetchList('universidad');
    clearSelect(universidadSelect, '-- Seleccionar --');
    list.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.id;
        opt.textContent = u.nombre || u.name || u.descripcion || `Universidad ${u.id}`;
        universidadSelect.appendChild(opt);
    });
    finishLoading(universidadSelect);
    refreshSummary();
}

// Cargar alumnos por universidad (intenta /api/v1/universidad/{id}/estudiante, si no, pide /api/v1/estudiante y filtra por universidad)
async function loadAlumnosPorUniversidad(uniId){
    setLoading(alumnoSelect);
    // parentFieldName: probamos 'universidad.id' y 'universidadId' como convenciones comunes
    const alumnos = await fetchChildByParent('universidad', uniId, 'estudiante', 'universidad.id')
        .then(arr => (arr.length ? arr : fetchChildByParent('universidad', uniId, 'estudiante', 'universidadId')));
    clearSelect(alumnoSelect, '-- Seleccionar --');
    alumnos.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a.id;
        opt.textContent = a.nombre || a.name || `${a.apellido ? a.apellido + ', ' : ''}${a.nombre || a.name || a.id}`;
        alumnoSelect.appendChild(opt);
    });
    finishLoading(alumnoSelect);
    refreshSummary();
}

// Cargar proyectos por alumno (intenta /api/v1/estudiante/{id}/proyecto o /api/v1/proyecto?filtrado)
async function loadProyectosPorAlumno(alumnoId){
    setLoading(proyectoSelect);
    proyectoSelect.dataset.resultado = '';
    proyectoSelect.dataset.proyectoId = '';
    proyectoManual.value = '';
    resultadoTextarea.value = '';
    // probamos rutas anidadas y fallback
    let proyectos = await fetchChildByParent('estudiante', alumnoId, 'proyectoDeGrado', 'estudiante.id')
        .then(arr => (arr.length ? arr : fetchChildByParent('estudiante', alumnoId, 'proyectoDeGrado', 'estudianteId')));
    // Si no hay resultados, intentamos /api/v1/proyecto y filtramos por autor/alumno
    if (!proyectos || proyectos.length === 0) {
        proyectos = await fetchList('proyectoDeGrado');
        // intento filtrar por campos comunes
        proyectos = proyectos.filter(p => {
            const v1 = getNested(p, 'estudiante.id') || getNested(p, 'estudianteId') || getNested(p, 'alumno.id') || getNested(p, 'alumnoId');
            return v1 && String(v1) === String(alumnoId);
        });
    }

    clearSelect(proyectoSelect, '-- Seleccionar --');
    if (proyectos.length > 0) {
        proyectos.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = p.titulo || p.title || p.nombre || `ProyectoDeGrado ${p.id}`;
            opt.dataset.resultado = p.resultado || '';
            proyectoSelect.appendChild(opt);
        });
        // seleccionar primero por defecto
        proyectoSelect.selectedIndex = 1;
        const sel = proyectoSelect.selectedOptions[0];
        proyectoSelect.dataset.proyectoId = sel.value;
        proyectoSelect.dataset.resultado = sel.dataset.resultado || '';
        resultadoTextarea.value = proyectoSelect.dataset.resultado || '';
    } else {
        clearSelect(proyectoSelect, '-- No hay proyectos --');
        proyectoSelect.removeAttribute('disabled');
    }
    finishLoading(proyectoSelect);
    refreshSummary();
}

// Cargar detalle de proyecto (docentes y resultado)
async function loadDetalleProyecto(proyectoId){
    if (!proyectoId) return;
    const data = await fetchEntityById('proyectoDeGrado', proyectoId);
    if (!data) return;
    proyectoSelect.dataset.proyectoId = data.id || proyectoId;
    proyectoSelect.dataset.resultado = data.resultado || '';
    resultadoTextarea.value = data.resultado || '';
    proyectoSelect.dataset.docentesList = JSON.stringify(data.docentes || []);
    proyectoManual.value = '';
    refreshSummary();
}

/* Eventos UI */
universidadSelect.addEventListener('change', async () => {
    const uniId = universidadSelect.value;
    await loadAlumnosPorUniversidad(uniId);
    // limpiar proyecto/resultado
    clearSelect(proyectoSelect, '-- Seleccionar o escribir --');
    proyectoSelect.dataset.proyectoId = '';
    proyectoSelect.dataset.resultado = '';
    proyectoSelect.dataset.docentesList = '[]';
    proyectoManual.value = '';
    resultadoTextarea.value = '';
    refreshSummary();
});

alumnoSelect.addEventListener('change', async () => {
    const alumnoId = alumnoSelect.value;
    await loadProyectosPorAlumno(alumnoId);
    refreshSummary();
});

proyectoSelect.addEventListener('change', async () => {
    const sel = proyectoSelect.selectedOptions[0];
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

proyectoManual.addEventListener('input', () => {
    if (proyectoManual.value.trim()) {
        proyectoSelect.selectedIndex = 0;
        proyectoSelect.dataset.proyectoId = '';
        proyectoSelect.dataset.docentesList = '[]';
        proyectoSelect.dataset.resultado = resultadoTextarea.value || '';
    }
    refreshSummary();
});

// Modal de docentes (si lo implementaste en HTML)
function openDocentesModalFromDataset() {
    const docentes = JSON.parse(proyectoSelect.dataset.docentesList || '[]');
    // Implementá la apertura del modal según tu HTML (ya lo tenías en el template anterior)
    if (!docentes || docentes.length === 0) {
        alert('No se encontraron docentes para este proyecto.');
        return;
    }
    const lista = docentes.map(d => `• ${d.nombre || d.name || (d.apellido ? d.apellido + ', ' : '') + (d.nombre || d.name)}`).join('\n');
    alert('Docentes a cargo:\n\n' + lista);
}

document.getElementById('verProyecto').addEventListener('click', async () => {
    const proyectoId = proyectoSelect.dataset.proyectoId;
    if (proyectoId) {
        await loadDetalleProyecto(proyectoId);
        alert('Detalle del proyecto cargado en el panel derecho.');
    } else if (proyectoManual.value.trim()) {
        alert('Proyecto ingresado manualmente: ' + proyectoManual.value.trim());
    } else {
        alert('No hay proyecto seleccionado ni ingresado.');
    }
});

document.getElementById('verDocentes').addEventListener('click', async () => {
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

document.getElementById('verDatos').addEventListener('click', () => {
    refreshSummary();
    alert('Panel actualizado. Implementá llamadas adicionales según tu API.');
});

// Inicialización
(async function init(){
    setLoading(universidadSelect);
    setLoading(alumnoSelect);
    setLoading(proyectoSelect);
    await loadUniversidades();
    finishLoading(alumnoSelect);
    finishLoading(proyectoSelect);
    refreshSummary();
})();
