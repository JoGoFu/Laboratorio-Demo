# PACDesk - Consultas Técnicas de Ingeniería PAC
### Protecciones, Automatización, Control y Comunicaciones

Plataforma web local para demostraciones de gestión de tickets de solicitud de consultas técnicas de ingeniería (RFI - *Request For Information*), especializada en el ámbito de **Subestaciones Eléctricas, Centrales de Generación, Sistemas de Almacenamiento (BESS) y Redes de Transmisión**.

---

## ⚡ Especialidades PAC Cubiertas

1. **Protecciones Eléctricas:**
   - Coordinación de protecciones (50/51, 87T, 87B, 87L, 21 distancia).
   - Verificación de saturación de TCs/TTs ante cortocircuitos.
   - Ajustes de relés (SEL, Siemens SIPROTEC, ABB/Hitachi, GE).
   - Esquemas de teleprotección y disparo transferido.

2. **Control & Automatización:**
   - Lógicas de bahía (BCU) y esquemas de enclavamiento de seguridad (52/89).
   - Transferencia automática de barras (ATS) y esquemas de alivio de carga (EDAC).
   - Control de conmutación de taps bajo carga (OLTC).

3. **Comunicaciones OT & Subestaciones Digitales:**
   - Norma **IEC 61850** (datasets GOOSE, Sampled Values 9-2LE, MMS, archivos SCD/CID).
   - Topologías de alta disponibilidad con redundancia sin fisuras (**PRP y HSR**).
   - Sincronización horaria de precisión (**PTP IEEE 1588 / IRIG-B**).
   - Ciberseguridad de redes industriales OT.

4. **SCADA & Telecontrol (CEN):**
   - Protocolos **DNP3** y **IEC 60870-5-104**.
   - Integración y protocolos de pruebas con el Coordinador Eléctrico Nacional.
   - Comandos SBO (Select Before Operate) y matriz de alarmas/señales.

5. **Alambrado & Servicios Auxiliares:**
   - Diagramas funcionales de disparo (Trip Matrix).
   - Dimensionamiento y caída de tensión en bobinas de disparo (125 Vcc).
   - Supervisión de circuitos de disparo (TCS) y esquemáticos de gabinetes.

---

## 🚀 Cómo Iniciar la Demo

### Opción 1: Lanzador Windows (Doble Clic)
Haz doble clic sobre el archivo:
👉 **`iniciar_demo.bat`**

Este archivo:
1. Detecta automáticamente si tienes Python instalado.
2. Inicia el servidor local `server.py`.
3. Abre tu navegador web automáticamente en `http://localhost:8000`.
4. Si no tienes Python en el sistema, abre `index.html` de forma inmediata y directa en tu navegador.

### Opción 2: Desde Terminal
```powershell
py server.py
```

### Opción 3: Directo en Navegador (Sin servidor)
Haz doble clic sobre **`index.html`** para abrirlo en Chrome, Edge o Firefox.

---

## 🛠️ Funcionalidades Principales

- **Dashboard de Métricas PAC:** Conteo en vivo de consultas en revisión, resueltas y críticas con impacto en fecha de energización.
- **Tablero Kanban con 5 Estados:** *Por Asignar* ➔ *En Revisión PAC* ➔ *Esperando Info / Fabricante* ➔ *Dictaminado* ➔ *Cerrado*, con soporte Drag & Drop.
- **Vista de Tabla Filtrable:** Búsqueda instantánea por código (`PAC-2026-001`), archivo de referencia (`SCD`, `DWG-FUNC`, `MEM-AJU`), asunto o solicitante.
- **Formulario de Nueva Consulta PAC:** Ingreso de RFI con nivel de prioridad, criticidad en energización y propuesta de terreno.
- **Ficha Técnica & Dictamen Oficial:** Espacio para que el especialista emita dictámenes técnicos formales de aprobación o ajuste, con trazabilidad histórica.
- **Impresión / Exportar a PDF:** Botón que genera una ficha técnica limpia y formal para presentar en reuniones de obra o auditorías.
- **Persistencia Local:** Los cambios se guardan en el navegador (`LocalStorage`). El botón **"Reiniciar Demo"** permite volver a los datos semilla en cualquier instante.