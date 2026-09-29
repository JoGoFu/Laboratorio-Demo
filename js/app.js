/**
 * PACDesk - Logica de Gestion de Consultas Tecnicas PAC
 * (Protecciones, Automatizacion, Control y Comunicaciones)
 */

const STORAGE_KEY = 'pacdesk_tickets_v2';

const AppState = {
  tickets: [],
  currentView: 'kanban', // 'kanban' | 'table'
  activeTicketId: null,
  filters: {
    search: '',
    proyecto: 'todos',
    disciplina: 'todas',
    prioridad: 'todas',
    estado: 'todos'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  initFilters();
  initEventListeners();
  renderAll();
  refreshIcons();
});

function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    try {
      window.lucide.createIcons();
    } catch (e) {
      console.warn('Aviso iconos:', e);
    }
  }
}

function initStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      AppState.tickets = JSON.parse(saved);
    } catch (e) {
      console.error('Error al leer LocalStorage, cargando defaults PAC', e);
      AppState.tickets = JSON.parse(JSON.stringify(DEFAULT_TICKETS));
    }
  } else {
    AppState.tickets = JSON.parse(JSON.stringify(DEFAULT_TICKETS));
    saveToStorage();
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState.tickets));
}

function resetDemoData() {
  if (confirm('¿Deseas restablecer todos los tickets a los casos de ingenieria PAC originales?')) {
    AppState.tickets = JSON.parse(JSON.stringify(DEFAULT_TICKETS));
    saveToStorage();
    renderAll();
    showToast('Datos de demostracion PAC restablecidos', 'info');
  }
}

function initFilters() {
  const projectSelect = document.getElementById('filterProyecto');
  PROYECTOS.forEach(proj => {
    const opt = document.createElement('option');
    opt.value = proj;
    opt.textContent = proj;
    projectSelect.appendChild(opt);
  });

  const discSelect = document.getElementById('filterDisciplina');
  DISCIPLINAS.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = d.nombre;
    discSelect.appendChild(opt);
  });

  const modalProj = document.getElementById('modalProyecto');
  PROYECTOS.forEach(proj => {
    const opt = document.createElement('option');
    opt.value = proj;
    opt.textContent = proj;
    modalProj.appendChild(opt);
  });

  const modalDisc = document.getElementById('modalDisciplina');
  DISCIPLINAS.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = d.nombre;
    modalDisc.appendChild(opt);
  });
}

function initEventListeners() {
  document.getElementById('searchInput').addEventListener('input', (e) => {
    AppState.filters.search = e.target.value.toLowerCase().trim();
    renderFiltered();
  });

  document.getElementById('filterProyecto').addEventListener('change', (e) => {
    AppState.filters.proyecto = e.target.value;
    renderFiltered();
  });

  document.getElementById('filterDisciplina').addEventListener('change', (e) => {
    AppState.filters.disciplina = e.target.value;
    renderFiltered();
  });

  document.getElementById('filterPrioridad').addEventListener('change', (e) => {
    AppState.filters.prioridad = e.target.value;
    renderFiltered();
  });

  document.getElementById('filterEstado').addEventListener('change', (e) => {
    AppState.filters.estado = e.target.value;
    renderFiltered();
  });

  document.getElementById('btnClearFilters').addEventListener('click', () => {
    AppState.filters = {
      search: '',
      proyecto: 'todos',
      disciplina: 'todas',
      prioridad: 'todas',
      estado: 'todos'
    };
    document.getElementById('searchInput').value = '';
    document.getElementById('filterProyecto').value = 'todos';
    document.getElementById('filterDisciplina').value = 'todas';
    document.getElementById('filterPrioridad').value = 'todas';
    document.getElementById('filterEstado').value = 'todos';
    renderFiltered();
    showToast('Filtros reiniciados', 'info');
  });

  document.getElementById('btnViewKanban').addEventListener('click', () => switchView('kanban'));
  document.getElementById('btnViewTable').addEventListener('click', () => switchView('table'));

  document.getElementById('formNewTicket').addEventListener('submit', handleCreateTicket);
  document.getElementById('formAddComment').addEventListener('submit', handleAddComment);

  setupKanbanDropZones();
}

function switchView(view) {
  AppState.currentView = view;
  const kanbanContainer = document.getElementById('kanbanView');
  const tableContainer = document.getElementById('tableView');
  const btnKanban = document.getElementById('btnViewKanban');
  const btnTable = document.getElementById('btnViewTable');

  if (view === 'kanban') {
    kanbanContainer.classList.remove('hidden');
    tableContainer.classList.add('hidden');
    btnKanban.className = 'px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-white text-slate-800 shadow-sm border border-slate-200 flex items-center gap-1.5 transition';
    btnTable.className = 'px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1.5 transition';
  } else {
    kanbanContainer.classList.add('hidden');
    tableContainer.classList.remove('hidden');
    btnTable.className = 'px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-white text-slate-800 shadow-sm border border-slate-200 flex items-center gap-1.5 transition';
    btnKanban.className = 'px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1.5 transition';
  }
  renderFiltered();
  refreshIcons();
}

function getFilteredTickets() {
  return AppState.tickets.filter(t => {
    if (AppState.filters.search) {
      const q = AppState.filters.search;
      const matchSearch =
        t.id.toLowerCase().includes(q) ||
        t.titulo.toLowerCase().includes(q) ||
        t.descripcion.toLowerCase().includes(q) ||
        t.documentoRef.toLowerCase().includes(q) ||
        t.solicitante.toLowerCase().includes(q) ||
        t.especialista.toLowerCase().includes(q);
      if (!matchSearch) return false;
    }

    if (AppState.filters.proyecto !== 'todos' && t.proyecto !== AppState.filters.proyecto) {
      return false;
    }

    if (AppState.filters.disciplina !== 'todas' && t.disciplina !== AppState.filters.disciplina) {
      return false;
    }

    if (AppState.filters.prioridad !== 'todas' && t.prioridad !== AppState.filters.prioridad) {
      return false;
    }

    if (AppState.filters.estado !== 'todos' && t.estado !== AppState.filters.estado) {
      return false;
    }

    return true;
  });
}

function renderAll() {
  renderKpis();
  renderFiltered();
}

function renderFiltered() {
  const filtered = getFilteredTickets();
  renderKpis();
  if (AppState.currentView === 'kanban') {
    renderKanban(filtered);
  } else {
    renderTable(filtered);
  }
  refreshIcons();
}

function renderKpis() {
  const total = AppState.tickets.length;
  const enRevision = AppState.tickets.filter(t => t.estado === 'en_revision').length;
  const criticos = AppState.tickets.filter(t => t.prioridad === 'Critica' && t.estado !== 'cerrado' && t.estado !== 'resuelto').length;
  const resueltos = AppState.tickets.filter(t => t.estado === 'resuelto' || t.estado === 'cerrado').length;

  document.getElementById('kpiTotal').textContent = total;
  document.getElementById('kpiRevision').textContent = enRevision;
  document.getElementById('kpiCriticos').textContent = criticos;
  document.getElementById('kpiResueltos').textContent = resueltos;

  const alertBanner = document.getElementById('criticalAlertBanner');
  if (criticos > 0) {
    alertBanner.classList.remove('hidden');
    document.getElementById('criticalAlertCount').textContent = `${criticos} consulta(s) crítica(s) PAC con detención de pruebas o comisionamiento`;
  } else {
    alertBanner.classList.add('hidden');
  }
}

function renderKanban(tickets) {
  ESTADOS.forEach(estado => {
    const colList = document.getElementById(`kanban-list-${estado.id}`);
    const colCount = document.getElementById(`kanban-count-${estado.id}`);
    if (!colList) return;

    const columnTickets = tickets.filter(t => t.estado === estado.id);
    colCount.textContent = columnTickets.length;
    colList.innerHTML = '';

    if (columnTickets.length === 0) {
      colList.innerHTML = `
        <div class="h-28 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium select-none">
          Sin consultas en este estado
        </div>
      `;
      return;
    }

    columnTickets.forEach(ticket => {
      const card = createKanbanCard(ticket);
      colList.appendChild(card);
    });
  });
}

function getDisciplineBadge(discId) {
  const disc = DISCIPLINAS.find(d => d.id === discId) || { nombre: discId, color: "slate" };
  const colorMap = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200"
  };
  const colorClass = colorMap[disc.color] || colorMap.slate;
  return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorClass}">${disc.nombre}</span>`;
}

function getPriorityBadge(priorityKey) {
  const p = PRIORIDADES[priorityKey] || { label: priorityKey, badge: "bg-slate-100 text-slate-700 border-slate-200" };
  const pulseClass = priorityKey === 'Critica' ? 'badge-critical-pulse' : '';
  return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs border ${p.badge} ${pulseClass}">${p.label}</span>`;
}

function createKanbanCard(ticket) {
  const card = document.createElement('div');
  card.className = 'kanban-card bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all select-none space-y-3';
  card.setAttribute('draggable', 'true');
  card.setAttribute('data-id', ticket.id);

  card.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', ticket.id);
    card.classList.add('dragging');
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
  });

  card.addEventListener('click', (e) => {
    if (!e.target.closest('.btn-move-status')) {
      openTicketDetail(ticket.id);
    }
  });

  card.innerHTML = `
    <div class="flex items-center justify-between gap-2">
      <span class="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">${ticket.id}</span>
      <div class="flex items-center gap-1.5">
        ${getPriorityBadge(ticket.prioridad)}
      </div>
    </div>

    <div>
      <h4 class="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug hover:text-blue-600">${escapeHtml(ticket.titulo)}</h4>
      <p class="text-xs text-slate-500 mt-1 flex items-center gap-1">
        <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-500"></i>
        <span>${escapeHtml(ticket.proyecto)}</span>
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-1.5 pt-1">
      ${getDisciplineBadge(ticket.disciplina)}
      ${ticket.documentoRef ? `
        <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono text-slate-600 bg-slate-50 border border-slate-200">
          <i data-lucide="file-code" class="w-3 h-3 text-slate-400"></i>
          ${escapeHtml(ticket.documentoRef)}
        </span>
      ` : ''}
    </div>

    ${ticket.afectaCostoPlazo ? `
      <div class="bg-red-50 border border-red-200 rounded px-2 py-1 text-[11px] text-red-800 flex items-center gap-1 font-medium">
        <i data-lucide="alert-octagon" class="w-3.5 h-3.5 text-red-600 shrink-0"></i>
        <span class="truncate">Impacto en Comisionamiento / Obra</span>
      </div>
    ` : ''}

    <div class="border-t border-slate-100 pt-2.5 flex items-center justify-between text-xs text-slate-500">
      <div class="flex items-center gap-1.5 truncate max-w-[170px]" title="Especialista: ${escapeHtml(ticket.especialista)}">
        <i data-lucide="shield-check" class="w-3.5 h-3.5 text-sky-600 shrink-0"></i>
        <span class="truncate">${escapeHtml(ticket.especialista)}</span>
      </div>
      <div class="flex items-center gap-1">
        <button type="button" title="Ver ficha técnica" class="p-1 hover:bg-slate-100 rounded text-slate-600">
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  `;

  return card;
}

function setupKanbanDropZones() {
  ESTADOS.forEach(estado => {
    const colBody = document.getElementById(`kanban-col-${estado.id}`);
    if (!colBody) return;

    colBody.addEventListener('dragover', (e) => {
      e.preventDefault();
      colBody.classList.add('drag-over');
    });

    colBody.addEventListener('dragleave', (e) => {
      if (!colBody.contains(e.relatedTarget)) {
        colBody.classList.remove('drag-over');
      }
    });

    colBody.addEventListener('drop', (e) => {
      e.preventDefault();
      colBody.classList.remove('drag-over');
      const ticketId = e.dataTransfer.getData('text/plain');
      if (ticketId) {
        moveTicketStatus(ticketId, estado.id);
      }
    });
  });
}

function moveTicketStatus(ticketId, newStatus) {
  const ticket = AppState.tickets.find(t => t.id === ticketId);
  if (!ticket) return;

  if (ticket.estado === newStatus) return;

  const oldStatusName = ESTADOS.find(s => s.id === ticket.estado)?.nombre || ticket.estado;
  const newStatusName = ESTADOS.find(s => s.id === newStatus)?.nombre || newStatus;

  ticket.estado = newStatus;
  ticket.historial.push({
    id: 'h_' + Date.now(),
    autor: 'Coordinador de Ingeniería PAC',
    fecha: formatNow(),
    tipo: 'estado',
    texto: `Estado actualizado de "${oldStatusName}" a "${newStatusName}".`
  });

  saveToStorage();
  renderFiltered();
  showToast(`Ticket ${ticketId} movido a "${newStatusName}"`, 'success');
}

function renderTable(tickets) {
  const tbody = document.getElementById('tableBody');
  const countEl = document.getElementById('tableRowCount');
  tbody.innerHTML = '';
  countEl.textContent = `${tickets.length} consulta(s) PAC encontradas`;

  if (tickets.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-12 text-slate-400 font-medium">
          No se encontraron consultas con los filtros seleccionados.
        </td>
      </tr>
    `;
    return;
  }

  tickets.forEach(ticket => {
    const estadoObj = ESTADOS.find(e => e.id === ticket.estado) || { nombre: ticket.estado, badgeColor: 'bg-slate-100 text-slate-700' };
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition border-b border-slate-100 cursor-pointer';
    tr.addEventListener('click', (e) => {
      if (!e.target.closest('button') && !e.target.closest('select')) {
        openTicketDetail(ticket.id);
      }
    });

    tr.innerHTML = `
      <td class="py-3 px-4 font-mono font-bold text-xs text-blue-600 whitespace-nowrap">
        ${ticket.id}
      </td>
      <td class="py-3 px-4">
        <div class="font-medium text-sm text-slate-900 line-clamp-1 max-w-sm">${escapeHtml(ticket.titulo)}</div>
        <div class="text-xs text-slate-500 truncate max-w-xs">${escapeHtml(ticket.proyecto)}</div>
      </td>
      <td class="py-3 px-4 whitespace-nowrap">
        ${getDisciplineBadge(ticket.disciplina)}
      </td>
      <td class="py-3 px-4 whitespace-nowrap">
        ${getPriorityBadge(ticket.prioridad)}
      </td>
      <td class="py-3 px-4 whitespace-nowrap font-mono text-xs text-slate-600">
        ${escapeHtml(ticket.documentoRef || 'N/A')}
      </td>
      <td class="py-3 px-4 text-xs text-slate-600 max-w-[140px] truncate" title="${escapeHtml(ticket.especialista)}">
        ${escapeHtml(ticket.especialista)}
      </td>
      <td class="py-3 px-4 whitespace-nowrap">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${estadoObj.badgeColor}">
          ${estadoObj.nombre}
        </span>
      </td>
      <td class="py-3 px-4 text-right whitespace-nowrap">
        <button type="button" onclick="openTicketDetail('${ticket.id}')" class="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm inline-flex items-center gap-1">
          <i data-lucide="eye" class="w-3.5 h-3.5"></i>
          Ver Ficha
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openTicketDetail(ticketId) {
  const ticket = AppState.tickets.find(t => t.id === ticketId);
  if (!ticket) return;

  AppState.activeTicketId = ticketId;
  const modal = document.getElementById('ticketDetailModal');

  document.getElementById('modalDetailId').textContent = ticket.id;
  document.getElementById('modalDetailTitle').textContent = ticket.titulo;
  document.getElementById('modalDetailProyecto').textContent = ticket.proyecto;
  document.getElementById('modalDetailDocRef').textContent = ticket.documentoRef || 'Sin documento asociado';
  document.getElementById('modalDetailSolicitante').textContent = ticket.solicitante;
  document.getElementById('modalDetailFecha').textContent = ticket.fechaCreacion;
  document.getElementById('modalDetailFechaLimite').textContent = ticket.fechaLimite || 'No establecida';
  document.getElementById('modalDetailDescripcion').textContent = ticket.descripcion;
  document.getElementById('modalDetailPropuesta').textContent = ticket.propuestaTerreno || 'Sin propuesta previa en terreno.';

  document.getElementById('modalDetailBadgeDisc').innerHTML = getDisciplineBadge(ticket.disciplina);
  document.getElementById('modalDetailBadgePrio').innerHTML = getPriorityBadge(ticket.prioridad);

  const impactoBox = document.getElementById('modalDetailImpactoBox');
  if (ticket.afectaCostoPlazo) {
    impactoBox.classList.remove('hidden');
    document.getElementById('modalDetailImpactoText').textContent = ticket.impactoObra || 'Afecta ruta crítica de pruebas o energización.';
  } else {
    impactoBox.classList.add('hidden');
  }

  const statusSelect = document.getElementById('modalDetailEstadoSelect');
  statusSelect.value = ticket.estado;
  statusSelect.onchange = (e) => {
    moveTicketStatus(ticket.id, e.target.value);
  };

  const espInput = document.getElementById('modalDetailEspecialistaInput');
  espInput.value = ticket.especialista;
  espInput.onchange = (e) => {
    ticket.especialista = e.target.value.trim() || 'Por Asignar';
    saveToStorage();
    renderFiltered();
    showToast('Especialista asignado actualizado', 'success');
  };

  renderHistorial(ticket.historial);

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
  refreshIcons();
}

function closeTicketDetail() {
  document.getElementById('ticketDetailModal').classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
  AppState.activeTicketId = null;
}

function renderHistorial(historial) {
  const container = document.getElementById('modalDetailHistorial');
  container.innerHTML = '';

  if (!historial || historial.length === 0) {
    container.innerHTML = '<p class="text-xs text-slate-400 py-2">Sin actividad registrada aún.</p>';
    return;
  }

  historial.forEach((item, index) => {
    const isResolution = item.tipo === 'resolucion';
    const isStatus = item.tipo === 'estado';
    const isCreation = item.tipo === 'creacion';

    let icon = 'message-square';
    let iconBg = 'bg-blue-100 text-blue-700';

    if (isResolution) {
      icon = 'shield-check';
      iconBg = 'bg-emerald-100 text-emerald-700';
    } else if (isStatus) {
      icon = 'refresh-cw';
      iconBg = 'bg-amber-100 text-amber-700';
    } else if (isCreation) {
      icon = 'file-plus';
      iconBg = 'bg-slate-100 text-slate-700';
    }

    const itemEl = document.createElement('div');
    itemEl.className = 'relative flex gap-3 pb-5';

    const isLast = index === historial.length - 1;
    const lineHtml = !isLast ? '<span class="absolute top-7 left-4 -ml-px h-full w-0.5 bg-slate-200"></span>' : '';

    itemEl.innerHTML = `
      ${lineHtml}
      <div class="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconBg} ring-4 ring-white shadow-xs">
        <i data-lucide="${icon}" class="w-4 h-4"></i>
      </div>
      <div class="flex-1 bg-slate-50 border ${isResolution ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200'} rounded-xl p-3 text-xs">
        <div class="flex items-center justify-between text-slate-500 mb-1">
          <span class="font-semibold ${isResolution ? 'text-emerald-900 font-bold' : 'text-slate-900'}">${escapeHtml(item.autor)}</span>
          <span class="text-[11px]">${escapeHtml(item.fecha)}</span>
        </div>
        <div class="text-slate-700 leading-relaxed whitespace-pre-line">${escapeHtml(item.texto)}</div>
      </div>
    `;
    container.appendChild(itemEl);
  });
}

function handleAddComment(e) {
  e.preventDefault();
  if (!AppState.activeTicketId) return;

  const ticket = AppState.tickets.find(t => t.id === AppState.activeTicketId);
  if (!ticket) return;

  const autor = document.getElementById('commentAuthorInput').value.trim() || 'Ingeniero Especialista PAC';
  const texto = document.getElementById('commentTextInput').value.trim();
  const esDictamen = document.getElementById('commentIsDictamen').checked;

  if (!texto) return;

  ticket.historial.push({
    id: 'h_' + Date.now(),
    autor: autor,
    fecha: formatNow(),
    tipo: esDictamen ? 'resolucion' : 'comentario',
    texto: esDictamen ? `DICTAMEN TÉCNICO OFICIAL PAC:\n${texto}` : texto
  });

  if (esDictamen && ticket.estado !== 'resuelto') {
    ticket.estado = 'resuelto';
    document.getElementById('modalDetailEstadoSelect').value = 'resuelto';
    showToast('Dictamen técnico emitido. Ticket marcado como Resuelto.', 'success');
  } else {
    showToast('Comentario técnico registrado', 'success');
  }

  saveToStorage();
  document.getElementById('commentTextInput').value = '';
  document.getElementById('commentIsDictamen').checked = false;
  renderHistorial(ticket.historial);
  renderFiltered();
  refreshIcons();
}

function handleCreateTicket(e) {
  e.preventDefault();

  const titulo = document.getElementById('modalTitulo').value.trim();
  const proyecto = document.getElementById('modalProyecto').value;
  const disciplina = document.getElementById('modalDisciplina').value;
  const prioridad = document.getElementById('modalPrioridad').value;
  const docRef = document.getElementById('modalDocRef').value.trim();
  const solicitante = document.getElementById('modalSolicitante').value.trim();
  const impactoCostoPlazo = document.getElementById('modalImpactoCheck').checked;
  const detalleImpacto = document.getElementById('modalDetalleImpacto').value.trim();
  const descripcion = document.getElementById('modalDescripcion').value.trim();
  const propuesta = document.getElementById('modalPropuesta').value.trim();

  const nextNum = AppState.tickets.length + 1;
  const newId = `PAC-2026-${String(nextNum).padStart(3, '0')}`;

  const todayStr = new Date().toISOString().split('T')[0];
  const limitDate = new Date();
  limitDate.setDate(limitDate.getDate() + (prioridad === 'Critica' ? 2 : prioridad === 'Alta' ? 4 : 7));
  const limitStr = limitDate.toISOString().split('T')[0];

  const newTicket = {
    id: newId,
    titulo: titulo,
    proyecto: proyecto,
    disciplina: disciplina,
    prioridad: prioridad,
    estado: 'nuevo',
    documentoRef: docRef || 'Pendiente de plano/esquema',
    solicitante: solicitante || 'Ingeniero de Terreno PAC',
    especialista: 'Por Asignar',
    fechaCreacion: todayStr,
    fechaLimite: limitStr,
    impactoObra: impactoCostoPlazo ? (detalleImpacto || 'Afecta ruta crítica de pruebas o energización') : 'Sin impacto en costo ni plazo',
    afectaCostoPlazo: impactoCostoPlazo,
    descripcion: descripcion,
    propuestaTerreno: propuesta || '',
    historial: [
      {
        id: 'h_' + Date.now(),
        autor: solicitante || 'Ingeniero de Terreno PAC',
        fecha: formatNow(),
        tipo: 'creacion',
        texto: 'Consulta técnica PAC ingresada al sistema.'
      }
    ]
  };

  AppState.tickets.unshift(newTicket);
  saveToStorage();
  renderAll();

  closeNewTicketModal();
  document.getElementById('formNewTicket').reset();
  toggleImpactoField();

  showToast(`Consulta ${newId} registrada exitosamente`, 'success');
}

function openNewTicketModal() {
  document.getElementById('newTicketModal').classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
  refreshIcons();
}

function closeNewTicketModal() {
  document.getElementById('newTicketModal').classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
}

function toggleImpactoField() {
  const check = document.getElementById('modalImpactoCheck');
  const field = document.getElementById('fieldDetalleImpacto');
  if (check && field) {
    if (check.checked) {
      field.classList.remove('hidden');
    } else {
      field.classList.add('hidden');
    }
  }
}

function printTicketReport() {
  window.print();
}

function formatNow() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  const toastIcon = document.getElementById('toastIcon');

  toastMessage.textContent = message;

  if (type === 'success') {
    toastIcon.innerHTML = '<i data-lucide="check-circle" class="w-5 h-5 text-emerald-600"></i>';
  } else if (type === 'error') {
    toastIcon.innerHTML = '<i data-lucide="alert-circle" class="w-5 h-5 text-red-600"></i>';
  } else {
    toastIcon.innerHTML = '<i data-lucide="info" class="w-5 h-5 text-blue-600"></i>';
  }

  refreshIcons();
  toast.classList.remove('translate-y-20', 'opacity-0');

  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3200);
}
