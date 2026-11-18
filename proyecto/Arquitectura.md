# ARQUITECTURA TÉCNICA Y ESPECIFICACIONES
## [Nombre de tu sistema] - Documentación Técnica

**Fecha:** [22/10/2025]
**Versión:** 1.0
**Autor(es):** [Nicolas Rojas,Santiago Dehoyos,Danna Ortiz,Nikol Ortiz]
**Estado:** Borrador | (En revisión) | Aprobado

## Sección 1. Resumen Ejecutivo

**Objetivo:**
ServiAT (Servicios Rapidos y Confiables) es un sistema de información web diseñado para la gestión integral, instalación y reparación de equipos industriales de cocina en el sector HORECA (Hoteles, Restaurantes y Cafeterí­as) y electrodomesticos del hogar.
La plataforma esta orientada a modernizar la operativa de la empresa AR Asistencia Técnica S.A.S., administrada por el Sr. Fabio Rojas.

# Problema actual
En el sector HORECA (hoteles, restaurantes y cafeterías), la falta de comunicación efectiva entre los clientes y el personal técnico, junto con la desorganización en la gestión de solicitudes y los retrasos en la reparación de equipos, afectan directamente el funcionamiento de los establecimientos. Estas dificultades pueden ocasionar interrupciones inesperadas en las actividades, afectar la calidad del servicio y generar pérdidas económicas debido a la inactividad de los equipos.

### 📉 Pérdidas Identificadas

| Problema | Consecuencia | Costo Mensual |
| --- | --- | --- |
| **Fuga de solicitudes de servicio** | La dependencia de canales informales (WhatsApp) causa desincronización en la agenda y pérdida de citas. | $2.5M COP |
| **Ausencia de trazabilidad operativa** | Inexistencia de un registro centralizado que impide el seguimiento histórico y la medición del volumen de servicios. | $3M COP |
| **Ineficiencia en el agendamiento** | Tiempos de respuesta prolongados para concretar citas, lo que deriva en insatisfacción y abandono de clientes. | $800K COP |



## Problemas Operativos

**Costos de transporte no contemplados** 
Los desplazamientos del personal técnico no estaban incluidos en el servicio, dificultando la planificación y el control de los gastos operativos.

**Gestión desorganizada de cobros**  
Falta de un proceso estructurado para registrar, controlar y realizar seguimiento a los cobros de los servicios prestados.

**Falta de trazabilidad de los servicios**  
Los registros históricos se encontraban desactualizados, dificultando la consulta y verificación de los servicios realizados.

**Ausencia de copias de seguridad**  
No se contaba con respaldos de la información, lo que aumentaba el riesgo de pérdida de datos importantes.

**Limitaciones en los canales de atención**  
La comunicación con los clientes dependía exclusivamente de WhatsApp, dificultando la centralización y el seguimiento organizado de las solicitudes.


## Riesgos de NO implementar

## si continua con procesos mensuales 
** Gestión ineficiente de solicitudes** ($2,500,000 COP/mes): El registro manual provoca visitas técnicas fallidas por desconocimiento previo del tipo de equipo o falla, así como reprocesos al no poder coordinar la disponibilidad del técnico con el cliente.

**Falta de trazabilidad y control de equipos** ($1,800,000 COP/mes): Pérdida reiterada del historial de mantenimiento de las máquinas, desorganización operativa, tiempos muertos e incapacidad de clasificar oportunamente si la atención es industrial, HORECA o de hogar.

**Comunicación deficiente y perdida de clientes** ($1,200,000 COP/mes): Ausencia de canales oficiales para consultar el estado del servicio y falta de comprobantes/tickets digitales al finalizar la asistencia, lo que deteriora la fidelización.



 **Conceptos clave**

| Concepto | Qué significa |
|----------|---------------|
| **SPA (Single Page Application)** | La aplicación web actualiza el contenido de la interfaz sin recargar toda la página. |
| **Cliente-servidor** | El frontend desarrollado con React y Vite se comunica con el backend en Node.js para procesar solicitudes. |
| **APIs + Supabase** | Las APIs permiten la comunicación entre componentes y Supabase proporciona servicios de datos para el sistema. |
| **Cloud-Based Web Application** | ServiAT es una aplicación web desplegada en plataformas en la nube como Netlify, Render y Vercel. |
| **Escalabilidad potencial en la nube** | La infraestructura en la nube permite ampliar los recursos según las necesidades del sistema, aunque la escalabilidad automática no está confirmada.. |


✅ **Lista de chequeo**
- [✓] Alguien que no conoce el proyecto entiende qué hace.
- [✓] No prometí características que mi sistema no tiene.
- [✓] Cada principio de diseño tiene una explicación concreta.

---

## Sección 2. Stack Tecnológico

🎯 **Objetivo:** listar las tecnologías utilizadas en ServiAT, indicando sus versiones, funciones y justificación de su elección.

📚 **Conceptos clave**

### 1. Tecnologías utilizadas

| Capa | Tecnología | Versión | ¿Para qué se utiliza? |
|---|---|---|---|
| Frontend | React | 19.2.4 | Construir la interfaz de usuario mediante componentes reutilizables. |
| Herramienta de desarrollo | Vite | 8.0.10 | Ejecutar el entorno de desarrollo y generar la versión de producción. |
| Integración React | @vitejs/plugin-react | 6.0.1 | Integrar React con Vite y facilitar el desarrollo de la aplicación. |
| Navegación | React Router DOM | 7.13.2 | Gestionar las rutas y la navegación entre las páginas de ServiAT. |
| Backend | Node.js | Versión del entorno | Ejecutar JavaScript en el servidor. |
| Framework Backend | Express | 5.3.0 | Gestionar las rutas HTTP, recibir solicitudes y enviar respuestas mediante una API. |
| Base de datos y servicios | Supabase JS | 2.119.0 (Backend) | Conectar el servidor con Supabase para consultar, insertar y actualizar información. |
| Base de datos | PostgreSQL (Supabase) | Servicio administrado | Almacenar la información de usuarios, equipos, solicitudes y estados del servicio. |
| Seguridad de contraseñas | Bcryptjs | 3.0.3 | Generar y comprobar contraseñas mediante funciones de hash. |
| Autenticación y tokens | JSON Web Token (JWT) | 9.0.3 | Generar tokens para identificar las sesiones de los usuarios. |
| Envío de correos | Nodemailer | 10.4.0 | Enviar notificaciones por correo electrónico mediante Gmail. |
| Variables de entorno | Dotenv | 18.0.10 (Backend) | Cargar configuraciones y credenciales desde archivos de entorno. |
| Comunicación entre dominios | CORS | 2.8.6 | Configurar los permisos de comunicación entre el frontend y el backend. |
| Iconografía | Lucide React | 1.7.0 | Incorporar iconos en los componentes de la interfaz. |
| Calendario | React Calendar | 6.0.0 | Mostrar un calendario para seleccionar fechas de solicitudes de servicio. |
| Pagos | PayPal React | 9.2.0 | Incorporar los componentes de PayPal en la interfaz de pagos. |
| Alertas | SweetAlert2 | 11.26.24 | Mostrar mensajes, confirmaciones y alertas al usuario. |
| Control de versiones | Git | Según instalación | Registrar los cambios realizados en el código fuente. |
| Repositorio remoto | GitHub | Servicio en la nube | Alojar el código fuente y facilitar el trabajo colaborativo. |
| Hosting | Netlify, Render y Vercel | Servicios en la nube | Disponer de plataformas para publicar y ejecutar la aplicación web. |

**Nota sobre las versiones:** las versiones de React, Vite y las bibliotecas del frontend se verificaron en `frontend/package-lock.json`. Las versiones de Express, Supabase JS, JWT y Nodemailer corresponden al `backend/package-lock.json`. La versión de Node.js debe verificarse en el entorno de ejecución mediante `node -v`, ya que no está fijada en el `package.json`.

### 2. ¿Por qué React, Express y Supabase?

**¿Por qué React?**

1. **Componentes reutilizables:** permite organizar las pantallas de ServiAT en componentes independientes, facilitando su reutilización.
2. **Interactividad:** permite actualizar la interfaz según las acciones realizadas por los usuarios.
3. **Mantenimiento:** facilita organizar el frontend en componentes y páginas que se pueden modificar de manera independiente.
4. **Diseño adaptable:** permite construir interfaces que se ajustan a diferentes tamaños de pantalla, como computadores, tabletas y celulares.

**¿Por qué Express y Node.js?**

1. **Gestión de solicitudes:** Express permite crear las rutas que reciben las peticiones del frontend.
2. **Organización modular:** facilita separar las rutas, los controladores y las configuraciones del servidor.
3. **Comunicación:** permite establecer una API para intercambiar información entre React y la base de datos.
4. **Procesamiento:** permite gestionar operaciones como el registro, el inicio de sesión, las solicitudes de servicio y las notificaciones.

**¿Por qué Supabase?**

1. **Gestión de datos:** proporciona una base de datos PostgreSQL para almacenar y administrar la información del sistema.
2. **Consultas:** permite realizar operaciones de inserción, consulta y actualización de registros.
3. **Integración:** ofrece una biblioteca JavaScript que permite conectar el backend con los servicios de Supabase.
4. **Administración:** facilita mantener centralizada la información de los usuarios, equipos y solicitudes.

### 3. Comparación: Supabase vs. Firebase

| Característica | Supabase | Firebase |
|---|---|---|
| Base de datos | PostgreSQL, relacional. | Firestore, NoSQL, entre otras opciones. |
| Consultas | SQL mediante PostgreSQL y consultas desde su API. | Consultas mediante los servicios de Firebase. |
| Autenticación | Servicio disponible, aunque ServiAT utiliza autenticación propia en su backend. | Servicio de autenticación disponible. |
| Integración con ServiAT | Ya está incorporado al backend. | Requeriría una integración diferente. |
| Decisión | Se mantiene la tecnología actual. | Alternativa que no es necesario implementar actualmente. |

**Justificación:** se mantiene Supabase porque ya está integrado en el backend de ServiAT y permite administrar la información mediante PostgreSQL. Cambiar a Firebase implicaría modificar las consultas, la conexión y la integración existente.

### 4. Costos de las tecnologías

| Servicio | Costo |
|---|---|
| React, Vite, Node.js y Express | Gratuitos y de código abierto. |
| Supabase | Dispone de planes gratuitos y de pago, según el uso. |
| Git y GitHub | Disponen de opciones gratuitas y de pago. |
| Netlify, Render y Vercel | Disponen de planes con diferentes límites y costos. |
| Gmail / Nodemailer | Nodemailer es gratuito; el uso del servicio de correo depende de las condiciones de Gmail. |
| PayPal | Puede aplicar comisiones por transacción según sus condiciones comerciales. |

**Nota:** los costos reales dependen de los planes contratados, el consumo y las condiciones vigentes de cada proveedor. No se establecen valores mensuales porque no están documentados en el código del proyecto.

✅ **Lista de chequeo**

- [✓] Las versiones de las bibliotecas se verificaron en los archivos `package-lock.json`.
- [✓] Se identificaron las tecnologías del frontend y del backend.
- [✓] Se justificaron las principales decisiones tecnológicas.
- [✓] Se incluyó la comparación entre Supabase y Firebase.
- [✓] Se identificaron los costos y las condiciones de los servicios externos.

---

## Sección 3. Arquitectura de la Aplicación

### 1. Diagrama de arquitectura general

ServiAT utiliza una arquitectura cliente-servidor, organizada en tres partes principales: frontend, backend y servicios de datos.

El frontend está desarrollado con React y Vite. El backend utiliza Node.js y Express para gestionar las solicitudes mediante una API. Finalmente, Supabase proporciona la base de datos PostgreSQL donde se almacena la información del sistema.

```text
                  USUARIO
              Navegador web
                     |
                     | HTTPS
                     v
           HOSTING DEL FRONTEND
           Netlify / Vercel
                     |
                     v
             FRONTEND REACT
                + VITE
                     |
          +----------+----------+
          |                     |
          v                     v
      COMPONENTES             PAGES
      Interfaz y              Páginas y
      formularios             vistas
          |                     |
          +----------+----------+
                     |
                     v
             REACT ROUTER DOM
           Navegación y acceso
                     |
                     | HTTP / FETCH
                     v
              API DEL BACKEND
                NODE.JS
                EXPRESS
                     |
          +----------+----------+
          |          |          |
          v          v          v
        ROUTES   CONTROLLERS   CONFIG
        Rutas    Lógica del    Conexiones
        API      sistema       externas
          |          |          |
          +----------+----------+
                     |
          +----------+----------+
          |                     |
          v                     v
       SUPABASE               GMAIL
       PostgreSQL             Nodemailer
       Base de datos          Notificaciones
          |
          v
     INFORMACIÓN DE
       SERVIAT

          SERVICIOS ADICIONALES

          PAYPAL
     Integración de pagos
     desde el frontend
```

**Descripción de la arquitectura:**

1. **Usuario:** accede a ServiAT mediante un navegador web.
2. **Hosting:** permite publicar y disponibilizar la aplicación.
3. **Frontend:** React y Vite muestran las interfaces, formularios y paneles de usuario.
4. **React Router DOM:** administra la navegación entre las páginas y las condiciones de acceso por rol.
5. **Backend:** Node.js y Express reciben las solicitudes del frontend y procesan la lógica del sistema.
6. **API:** permite intercambiar información entre el frontend y el servidor mediante solicitudes HTTP.
7. **Controladores:** procesan las operaciones de registro, autenticación, solicitudes, historial y administración.
8. **Supabase:** almacena y administra los datos mediante PostgreSQL.
9. **Nodemailer:** permite enviar notificaciones por correo electrónico mediante Gmail.
10. **PayPal:** proporciona los componentes utilizados en la interfaz de pagos.

**Nota:** PayPal aparece como integración de componentes en el frontend. El código revisado no permite confirmar una integración de procesamiento de pagos mediante un backend propio.

### 2. Estructura real de carpetas

La siguiente estructura corresponde a la organización encontrada en el proyecto compartido:

```text
proyecto/
│
├── Arquitectura.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── client/
│   │   │   │   ├── infoFormulario.jsx
│   │   │   │   ├── pago.jsx
│   │   │   │   ├── servicioConfirmado.jsx
│   │   │   │   ├── solicitudFormulario.jsx
│   │   │   │   ├── steppers.jsx
│   │   │   │   └── validarServicio.jsx
│   │   │   │
│   │   │   ├── common/
│   │   │   │   ├── footer.jsx
│   │   │   │   └── navVar.jsx
│   │   │   │
│   │   │   └── dashboard/
│   │   │       ├── AdminLayout.jsx
│   │   │       ├── MenuLateral.jsx
│   │   │       ├── RegistroAdmin.jsx
│   │   │       └── SolicitudesAdmin.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── acercaNosotros.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ClienteDashboard.jsx
│   │   │   ├── Configuracion.jsx
│   │   │   ├── historialVersiones.jsx
│   │   │   ├── index.jsx
│   │   │   ├── login.jsx
│   │   │   ├── registro.jsx
│   │   │   ├── serviciosNav.jsx
│   │   │   └── TecnicoDashboard.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    │
    ├── config/
    │   ├── mailer.js
    │   └── supabase.js
    │
    ├── controllers/
    │   ├── adminController.js
    │   ├── authController.js
    │   ├── clienteController.js
    │   ├── notificacionesController.js
    │   ├── solicitudesController.js
    │   └── tecnicoController.js
    │
    ├── routes/
    │   ├── adminRoutes.js
    │   ├── authRoutes.js
    │   ├── clienteRoutes.js
    │   ├── notificacionesRoutes.js
    │   ├── solicitudRoutes.js
    │   └── tecnicoRoutes.js
    │
    ├── frontend/
    │   └── (Segunda copia del frontend)
    │
    ├── server.js
    ├── package.json
    └

Sección 4. Base de Datos
🎯 Objetivo: documentar cómo se guardan los datos. ServiAT utiliza una base de datos PostgreSQL administrada mediante Supabase, donde se almacena y organiza la información de usuarios, equipos, solicitudes, órdenes de servicio y pagos.
📚 Conceptos clave
|Concepto     |	Qué significa    |Ejemplo en ServiAT         |
|-------------|------------------|---------------------------|
Llave primaria (PK)|---	Identifica cada registro de manera única dentro de una tabla.|----id_usuario identifica a cada usuario.
Llave foránea (FK)|---Conecta una tabla con otra mediante un campo relacionado.|----	id_roles en usuario se relaciona con roles.
Relación 1:N |---	Un registro de una tabla puede estar relacionado con varios registros de otra.|----Un cliente puede realizar varias solicitudes.
ON DELETE RESTRICT / NO ACTION |---Evita eliminar un registro cuando existen datos relacionados que dependen de él.|----No permite eliminar un rol que esté asignado a usuarios.
ON DELETE CASCADE |---	Al eliminar un registro principal, también elimina los registros relacionados.|----Al eliminar una orden de servicio, se eliminan sus tickets relacionados.
Índice|---	Permite acelerar las búsquedas y consultas realizadas sobre una tabla.|----	idx_solicitud_fecha acelera las búsquedas por fecha.
Trigger| ---	Código que se ejecuta automáticamente cuando ocurre un evento en una tabla.|----	Actualizar automáticamente la fecha de modificación de un registro.
Función SQL	|--- Código almacenado en la base de datos que permite realizar operaciones reutilizables.|----	Consultar las órdenes de servicio de un cliente.
Soft  delete |---	Consiste en marcar un registro como inactivo en lugar de eliminarlo físicamente.|----Mantener un usuario inactivo sin borrar su historial.

**La base de datos de ServiAT está organizada en las siguientes tablas:**
N.º	Tabla	Descripción
1	roles	Almacena los roles disponibles para los usuarios del sistema.
2	estado	Almacena los estados utilizados en las solicitudes y órdenes de servicio.
3	categoria_equipo	Guarda las categorías a las que pertenecen los equipos.
4	usuario	Almacena la información personal y de identificación de los usuarios.
5	direccion	Guarda las direcciones asociadas a los usuarios.
6	telefono	Almacena los números telefónicos de los usuarios.
7	correo_electronico	Guarda las direcciones de correo electrónico de los usuarios.
8	equipo	Registra los equipos, sus marcas, modelos y categorías.
9	solicitud	Almacena las solicitudes de servicio realizadas por los clientes.
10	orden_servicio	Registra las órdenes de servicio y su asignación a los técnicos.
11	ticket	Almacena la información relacionada con los pagos de las órdenes de servicio.
✅ **Lista de chequeo**
- [ ] Todas las tablas tienen llave primaria.
- [ ] Cada FK tiene una regla `ON DELETE` pensada.
- [ ] Mi SQL corre sin errores en Supabase.
- [ ] Expliqué el porqué de cada índice.

---

## Sección 5. APIs y Endpoints

🎯 **Objetivo:** explicar **cómo el frontend pide y envía datos** al backend.

📚 **Conceptos clave**

| Método HTTP | Acción | Equivalente SQL |
|-------------|--------|-----------------|
| `GET` | Consultar | `SELECT` |
| `POST` | Crear | `INSERT` |
| `PATCH` | Actualizar | `UPDATE` |
| `DELETE` | Eliminar | `DELETE` |

- **REST API autogenerada:** Supabase crea un endpoint por cada tabla automáticamente.
- **Filtros:** `.eq()` igual, `.gt()` mayor que, `.ilike()` búsqueda sin importar mayúsculas, `.order()`, `.range()` para paginar.
- **Realtime:** escuchar cambios de la base de datos en vivo (WebSockets).

🔍 **Analiza el ejemplo**

El documento muestra la misma operación de dos formas:

```javascript
// Como URL REST
GET /clientes?saldo_actual=gt.0

// Como código JavaScript con el cliente de Supabase
supabase.from('clientes').select('*').gt('saldo_actual', 0)
```

### 🕵️ Actividad: encuentra el error

Los documentos técnicos también tienen errores, y aprender a detectarlos es parte del oficio. Estos dos ejemplos del documento de referencia **no funcionan tal como están escritos**. Investiga en la documentación oficial de Supabase por qué:

1. ```
   GET /productos?stock_actual=lt.stock_minimo
   ```
   *(Pista: ¿el filtro compara contra otra columna o contra el texto "stock_minimo"?)*

2. ```javascript
   saldo_actual: supabase.raw(`saldo_actual + ${invoiceData.total}`)
   ```
   *(Pista: busca si `supabase.raw` existe en `supabase-js`. ¿Qué alternativa hay? Investiga las funciones RPC.)*

3. **Reto extra:** en "Crear Factura Completa" se hacen 3 operaciones separadas. ¿Qué pasa si la segunda falla? ¿Es de verdad una *transacción*?

✍️ **Tu turno**

1. Para cada tabla principal documenta sus operaciones CRUD (formato URL **y** formato JavaScript).
2. Incluye al menos **2 consultas con JOIN**, por ejemplo una factura con los datos del cliente.
3. Escribe **1 hook de React** completo que consulte datos con paginación, con estados `loading` y `error`.
4. Prueba cada ejemplo antes de documentarlo.

✅ **Lista de chequeo**
- [ ] Cada ejemplo de código fue probado y funciona.
- [ ] Documenté cómo se manejan los errores.
- [ ] Respondí la actividad "encuentra el error".

---

## Sección 6. Seguridad

🎯 **Objetivo:** demostrar que los datos están protegidos **en cada capa**.

📚 **Conceptos clave**

| Concepto | Qué protege |
|----------|-------------|
| **Autenticación** | Verifica *quién eres* (usuario y contraseña) |
| **Autorización / Roles** | Define *qué puedes hacer* (admin, vendedor, bodeguero) |
| **RLS** (Row Level Security) | Reglas en la base de datos que filtran qué filas ve o modifica cada usuario |
| **Variables de entorno** | Mantienen las claves fuera del código fuente |
| **XSS** | Evita que alguien inyecte código malicioso en la página |
| **Inyección SQL** | Evita que un texto del usuario se ejecute como SQL |
| **Headers de seguridad** | Instrucciones al navegador para bloquear ataques comunes |

🔍 **Analiza el ejemplo**

La idea más importante del documento EBS es: **la seguridad real está en la base de datos (RLS), no en el frontend.** Ocultar un botón en React no impide que alguien llame a la API directamente.

```sql
-- Nadie puede eliminar físicamente productos: se usa soft delete
CREATE POLICY "Nadie puede eliminar productos"
  ON productos FOR DELETE
  USING (false);
```

> ⚠️ **Regla de oro:** la `anon key` de Supabase puede ir en el frontend porque RLS la protege. La `service_role key` **jamás** va en el frontend ni en GitHub.

> **Pregunta para pensar:** el documento usa `auth.jwt() ->> 'role' = 'admin'` en las políticas, pero guarda el rol en `user_metadata`. Investiga: ¿en qué parte del JWT queda realmente `user_metadata`? ¿Funcionaría esa política tal cual? *(Pista: busca "custom claims" en Supabase.)*

✍️ **Tu turno**

1. Define los roles de tu sistema y haz una tabla de **qué puede hacer cada rol** en cada tabla (leer, crear, editar, borrar).
2. Escribe las políticas RLS de al menos **2 tablas** y pruébalas con dos usuarios de distinto rol.
3. Documenta tus variables de entorno con valores **de ejemplo**, nunca los reales.
4. Escribe una función de validación de un formulario de tu sistema.
5. Verifica que tu archivo `.env` está en `.gitignore`.

✅ **Lista de chequeo**
- [ ] RLS está activado en todas mis tablas.
- [ ] Probé que un usuario sin permiso **no puede** hacer la acción.
- [ ] No hay ninguna clave real en el documento ni en GitHub.

---

## Sección 7. Rendimiento y Optimización

🎯 **Objetivo:** explicar qué se hizo para que la app **cargue rápido** y no haga trabajo innecesario.

📚 **Conceptos clave**

| Técnica | Problema que resuelve |
|---------|-----------------------|
| **Code splitting / Lazy loading** | No descargar el código de todas las páginas al inicio |
| **Optimización de imágenes** | Imágenes pesadas que tardan en cargar |
| **Paginación** | Traer 10.000 registros de una vez |
| **Debounce** | Hacer una consulta por cada letra que el usuario escribe |
| **Caché** | Pedir los mismos datos una y otra vez |
| **Core Web Vitals** (LCP, CLS...) | Medir qué tan rápida se siente la página |

🔍 **Analiza el ejemplo**

El **debounce** del documento espera 300 ms después de la última tecla antes de buscar. Si el usuario escribe "acetaminofén" (12 letras), en vez de 12 consultas se hace **1**.

> **Actividad:** abre tu app en Chrome → DevTools → pestaña **Lighthouse** → "Analyze page load". Anota tu puntaje de Performance y los valores de LCP y CLS. Ese será tu punto de partida real.

✍️ **Tu turno**

1. Implementa y documenta al menos **2 técnicas** de la tabla en tu proyecto.
2. Incluye tu reporte de Lighthouse **antes y después** de optimizar.
3. Ejecuta `npm run build` y anota el tamaño de los archivos generados.

✅ **Lista de chequeo**
- [ ] Las métricas son medidas reales, no copiadas.
- [ ] Expliqué qué problema resuelve cada técnica en **mi** sistema.

---

## Sección 8. Integraciones Externas

🎯 **Objetivo:** documentar **los servicios de terceros** con los que se conecta el sistema.

📚 **Conceptos clave**

- **Integración actual vs futura:** separa lo que ya funciona de lo que está planeado (*roadmap*).
- **Upload preset sin firma (unsigned):** permite subir imágenes desde el frontend sin exponer la clave secreta.
- **Por qué algunas acciones necesitan backend:** borrar una imagen en Cloudinary requiere la clave secreta, que nunca debe estar en el navegador.

🔍 **Analiza el ejemplo**

El documento EBS marca claramente qué es **(Futuro)**: email, WhatsApp Business API, PDF. Eso es honesto con el lector. Mezclar lo implementado con lo planeado es un error común en la documentación.

✍️ **Tu turno**

1. Lista cada servicio externo que usas: para qué, cómo te conectas y qué clave necesitas.
2. Documenta **una** integración con su código completo.
3. Agrega una sección "Roadmap" con 2 o 3 integraciones futuras, marcadas como tales.

✅ **Lista de chequeo**
- [ ] Separé lo implementado de lo futuro.
- [ ] Ninguna clave secreta queda expuesta en el frontend.

---

## Sección 9. Configuración y Despliegue

🎯 **Objetivo:** que **otra persona pueda instalar y publicar** tu sistema solo leyendo esta sección.

📚 **Conceptos clave**

- **Entorno de desarrollo vs producción:** variables distintas para cada uno.
- **Build:** convertir tu código React en archivos optimizados (`dist/`).
- **Deploy:** publicar esos archivos en un servidor (Vercel).
- **CI/CD:** automatizar pruebas y despliegue con cada `git push`.
- **Rewrites en una SPA:** todas las rutas deben devolver `index.html` para que React Router funcione al recargar.

🔍 **Analiza el ejemplo**

```json
"rewrites": [
  { "source": "/(.*)", "destination": "/index.html" }
]
```

> **Pregunta para pensar:** si quitas esta regla, abres `tusitio.vercel.app/productos` y recargas la página, ¿qué pasa y por qué?

### 🧪 Prueba de fuego

Entrega tu documento a un compañero o compañera. Debe clonar tu repositorio e instalar el proyecto **siguiendo solo tus instrucciones**. Anota cada paso donde se haya trabado y corrige el documento.

✍️ **Tu turno**

1. Escribe los pasos de instalación desde cero: clonar, `npm install`, crear `.env`, `npm run dev`.
2. Documenta tus scripts de `package.json`.
3. Publica tu app en Vercel y documenta los pasos, incluyendo dónde se configuran las variables de entorno.
4. (Opcional) Crea un workflow de GitHub Actions que ejecute el linter y el build.

✅ **Lista de chequeo**
- [ ] Un compañero instaló el proyecto solo con mis instrucciones.
- [ ] Mi app está publicada y anoté la URL.

---

## Sección 10. Monitoreo y Logs

🎯 **Objetivo:** explicar **cómo te enteras** de que algo falló en producción.

📚 **Conceptos clave**

| Herramienta | Para qué |
|-------------|----------|
| **Logger** | Mensajes ordenados por nivel (info, warn, error) que se apagan en producción |
| **Error Boundary** | Evita que un error en un componente deje toda la pantalla en blanco |
| **Logs de Supabase** | Ver consultas y errores de la base de datos |
| **Vercel Analytics** | Ver visitas y velocidad real |
| **Sentry** | Recibir alertas con el detalle de cada error de los usuarios |

✍️ **Tu turno**

1. Implementa un `ErrorBoundary` en tu app y documenta cómo lo probaste (provoca un error a propósito).
2. Explica dónde revisas los logs de tu base de datos y de tu hosting.
3. Describe qué harías si un usuario reporta "la app no carga".

✅ **Lista de chequeo**
- [ ] Mi app no queda en blanco si un componente falla.
- [ ] Sé dónde buscar los errores de cada servicio.

---

## Sección 11. Anexos y cierre

Incluye al final de tu documento:

1. **Dependencias:** copia la sección `dependencies` de tu `package.json`.
2. **Comandos útiles:** desarrollo, Git, despliegue.
3. **Glosario:** mínimo 15 términos técnicos usados en tu documento, explicados con tus palabras.
4. **Tabla de aprobación:** con quién elaboró, quién revisó y la fecha.

```markdown
| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Autor | [tu nombre] | ________ | __/__/____ |
| Revisor (compañero) | [nombre] | ________ | __/__/____ |
| Docente | Ing. Edwin Marín | ________ | __/__/____ |
```

---

## 4. Cronograma sugerido (3 semanas)

| Sesión | Tema | Entregable |
|--------|------|------------|
| 1 | Introducción + lectura del documento de referencia | Encabezado + Sección 1 |
| 2 | Stack tecnológico | Sección 2 |
| 3 | Arquitectura y flujo de datos | Sección 3 |
| 4 | Base de datos I: tablas y relaciones | Sección 4.1 y 4.2 |
| 5 | Base de datos II: índices, triggers y funciones | Sección 4 completa |
| 6 | APIs + actividad "encuentra el error" | Sección 5 |
| 7 | Seguridad y RLS | Sección 6 |
| 8 | Rendimiento + integraciones | Secciones 7 y 8 |
| 9 | Despliegue + prueba de fuego con un compañero | Secciones 9 y 10 |
| 10 | Anexos, revisión final y sustentación | Documento completo |

---

## 5. Rúbrica de evaluación

| Criterio | Peso | Excelente (5) | Aceptable (3) | Insuficiente (1) |
|----------|------|---------------|---------------|------------------|
| **Base de datos** | 20% | SQL ejecutado, relaciones correctas, índices y triggers justificados | Tablas correctas sin índices ni triggers | Tablas sin relaciones o SQL con errores |
| **Arquitectura y flujo** | 15% | Diagrama completo y flujo paso a paso con código real | Diagrama sin flujo de datos | Sin diagrama o copiado del ejemplo |
| **Justificación técnica** | 15% | Cada decisión tiene un "por qué" y una comparación | Algunas decisiones justificadas | Solo lista tecnologías |
| **Seguridad** | 15% | RLS probado con dos roles, sin claves expuestas | RLS escrito pero no probado | Sin RLS o con claves reales expuestas |
| **APIs y código** | 10% | Ejemplos probados, con manejo de errores | Ejemplos sin manejo de errores | Código que no funciona |
| **Despliegue** | 10% | App publicada e instalada por un compañero | App publicada sin prueba de instalación | No publicada |
| **Pensamiento crítico** | 10% | Resolvió las preguntas y la actividad "encuentra el error" | Resolvió algunas | No las resolvió |
| **Presentación** | 5% | Ortografía, formato Markdown y glosario completos | Formato correcto con errores menores | Desordenado |

**Importante:** copiar secciones del documento de referencia sin adaptarlas a tu proyecto se califica con 1 en ese criterio. El documento debe describir **tu** sistema.

---

## 6. Consejos finales

- **Documenta lo que existe, no lo que te gustaría tener.** Si algo es futuro, márcalo como "(Futuro)".
- **Prueba cada bloque de código antes de pegarlo.** Un ejemplo que no funciona confunde más que ayudar.
- **Escribe para alguien que llega nuevo al proyecto.** Si tú no estuvieras, ¿podría entenderlo y continuar?
- **Un diagrama vale más que tres párrafos.** Úsalos en arquitectura, base de datos y flujos.
- **Versiona tu documento en Git** igual que tu código: haz commits cada vez que completes una sección.

### Recursos

- React: https://react.dev/learn
- Vite: https://vitejs.dev/guide/
- Supabase (base de datos, Auth, RLS): https://supabase.com/docs
- Vercel: https://vercel.com/docs
- Markdown: https://www.markdownguide.org/basic-syntax/
