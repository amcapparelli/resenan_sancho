# Plan de mejora — Reseñan Sancho

> Hoja de ruta priorizada para un side project en crecimiento.
> Diseño · Frontend · SEO · Redes · Automatización.

## Cómo usar este documento

Este plan está pensado para un escenario concreto: lo ejecutas tú (te defiendes bien programando), con ayuda de IA, dedicándole pocas horas al mes, y con el objetivo de hacer crecer un side project. Por eso no es una lista de buenas intenciones, sino una secuencia de fases pequeñas, cada una con un resultado publicable, ordenadas para que nunca dejes la web a medias ni rota.

La prioridad que marcaste es el diseño. El plan respeta esa prioridad, pero la combina con la modernización del frontend en un solo esfuerzo, porque rediseñar sobre Next.js 9 sería tirar trabajo. SEO, redes y automatización vienen después, cuando ya tengas un escaparate del que merezca la pena traer visitas.

> **Sobre el contexto entre sesiones (Claude Code):** mantén actualizada la sección "Estado actual" del bloque A. Claude Code lee el `CLAUDE.md` al inicio de cada sesión, y desde ahí se referencia este plan. Marca las casillas según avances para retomar sin reexplicar nada.

---

## 1. Diagnóstico rápido

Punto de partida tal como está hoy:

- **Stack:** Next.js 9.3.1, React 16, TypeScript, Node 14 en frontend; Express 4 + MongoDB (Mongoose) + Nodemailer + Stripe en backend; alojado en Heroku con auto-deploy desde GitHub.
- **Estado del código:** frontend de ~2020 sin actualizar. Node 14 está fuera de soporte. La IA actual ayuda mucho mejor con stacks modernos, lo que hoy te penaliza.
- **Tracción:** ~10 visitas/día, 800 usuarios (475 reseñadores), 350 libros. En Mailchimp: 450 reseñadores y 91 escritores. Las bases de Mailchimp son un activo real y de los más valiosos que tienes.
- **Modelo de negocio:** ejemplares gratuitos (2 por libro), pack de 5 por 10 €, y servicio premium de 25 ejemplares + emailing segmentado por 69 €. El premium funciona pero te cuesta mucho trabajo manual.
- **Diseño:** home funcional pero genérica; no transmite la "frescura, dinamismo y cercanía" que pide tu propia identidad corporativa para un público de 16-25 años, mayoritariamente femenino.

> ⚠️ **Hallazgo inmediato (arréglalo ya, cuesta minutos):** en la home pública hay erratas visibles: "encotrar" y "liteararios". En un producto cuyo valor es la calidad de las reseñas literarias, una errata en portada resta credibilidad más que en otros sectores. Es lo más barato de corregir y conviene hacerlo antes que nada.

---

## 2. El orden importa: por qué este y no otro

Tienes cinco frentes. Hacerlos en paralelo es la forma más segura de no terminar ninguno con pocas horas al mes. El orden recomendado:

1. **Diseño + modernización del frontend** (a la vez, por páginas). Es tu prioridad y arregla la deuda técnica de paso.
2. **SEO técnico y de contenido.** Tiene sentido cuando el sitio ya convierte; traer visitas a una web fea es desperdiciarlas.
3. **Redes sociales.** Amplifican lo anterior; necesitan un escaparate decente al que enviar a la gente.
4. **Automatización.** Te quita trabajo manual, pero no hace crecer el proyecto por sí sola. Es alivio, no motor. Se aborda en piezas pequeñas, no como gran proyecto.

Una nota honesta sobre tu elección de "rehacer el frontend entero" con "pocas horas al mes": un rewrite completo (Next 9 → 15) son del orden de 40-80 horas reales. A pocas horas al mes, eso es más de un año con la web congelada o duplicada. Por eso este plan **no** propone un big bang, sino una migración incremental página por página, manteniendo la web viva en todo momento. Es exactamente lo que recomienda la propia documentación de Next.js.

---

## 3. Bloque A — Diseño + modernización del frontend

La clave técnica que hace esto viable: Next.js 15 mantiene compatibilidad con el sistema de rutas antiguo (Pages Router) y permite que el router nuevo (App Router) y el viejo convivan. Puedes estabilizar primero y luego migrar página a página. Además hay codemods oficiales (`@next/codemod`) que automatizan buena parte de los cambios mecánicos.

### Antes de tocar nada: define el sistema de diseño

Rediseñar sin un sistema de diseño es repintar habitación por habitación sin decidir la paleta. Dedica la primera sesión a esto, no a código:

- **Paleta:** ya la tienes en tu identidad corporativa. Azul de marca, amarillo de acento, negros y grises. Fíjala como variables/tokens (p. ej. CSS variables o config de Tailwind) para no improvisar colores luego.
- **Tipografía:** una tipografía con personalidad para titulares (acorde al tono fresco y joven) y una muy legible para cuerpo. Google Fonts basta. Evita la fuente por defecto: es la principal causa del "aspecto no profesional".
- **Componentes base:** botón, tarjeta de libro, tarjeta de reseñador, campos de formulario, modal de contacto. Defínelos una vez y reutilízalos.
- **Referencias:** reúne 3-4 webs cuyo diseño te guste (no necesariamente del sector) y tenlas a mano. Cuando trabajes el rediseño con IA, dáselas como referencia explícita; los resultados mejoran mucho.

> **Recomendación de stack de UI:** para ir rápido y con buen acabado con ayuda de IA, Tailwind CSS + una librería de componentes como shadcn/ui. La IA genera muy bien sobre esa combinación, y te da un salto de calidad visual inmediato sin diseñar desde cero. Encaja perfectamente con Next moderno.

### Las fases, en orden

| Fase | Qué incluye | Esfuerzo aprox. |
|------|-------------|-----------------|
| **A0** | Corregir erratas de la home y revisar textos públicos. Crear rama de trabajo y verificar que el deploy desde GitHub sigue funcionando. | 1 sesión |
| **A1** | Definir sistema de diseño (paleta, tipografía, componentes base, referencias). Sin tocar el sitio aún. | 1 sesión |
| **A2** | Estabilizar en Next 15 manteniendo el router actual. Correr `@next/codemod`, subir React a 18, Node a versión soportada (20 LTS). Verificar que TODO el flujo (login, alta de libro, modal de contacto, pago Stripe, emails) sigue funcionando. | 2-3 sesiones |
| **A3** | Rediseñar la home con el nuevo sistema de diseño. Es tu escaparate y tu prioridad. Publicar. | 2-3 sesiones |
| **A4** | Rediseñar el buscador de libros y el de reseñadores (tarjetas, filtros por género y formato). Es el corazón del producto. | 3-4 sesiones |
| **A5** | Rediseñar el alta de usuario y el espacio personal del escritor. Cuidar el formulario y el modal de contacto. | 2-3 sesiones |
| **A6** | Páginas secundarias (about, legal) y pulido responsive. Revisar que se ve bien en móvil (tu público es muy móvil). | 1-2 sesiones |

> ⚠️ **Regla de oro para no romper la web:** trabaja siempre en una rama aparte, nunca directo en `master`. Despliega una fase solo cuando funcione de principio a fin. Antes de cada deploy, prueba a mano el flujo crítico: registro, alta de libro, modal de contacto (que el email llegue), y un pago de prueba en Stripe (modo test). Heroku despliega automáticamente al hacer merge a `master`, así que `master` debe estar siempre sano.

### Cómo trabajar cada fase con IA (tu caso concreto)

Como te defiendes bien, puedes ir más rápido que el usuario medio, pero la disciplina importa más que la velocidad cuando hay pocas horas al mes:

- Dale a la IA el `package.json`, el `next.config.js` y una descripción breve de la arquitectura antes de pedir cambios. Pídele primero un plan de la fase, luego ejecútalo paso a paso.
- Migra y rediseña una página por sesión como máximo. Cerrar una página antes de abrir otra evita el frente abierto eterno.
- Aprovecha los codemods oficiales para los cambios mecánicos (APIs asíncronas de cookies/headers, etc.) y reserva tu tiempo para lo que requiere criterio: el diseño.
- Haz commits pequeños y descriptivos. Si una fase sale mal, vuelves atrás sin drama.

### Estado actual

- [ ] **A0:** corregir erratas de la home ("encotrar", "liteararios")
- [ ] **A1:** definir sistema de diseño
- [ ] **A2:** estabilizar en Next 15 + React 18 + Node LTS (router actual)
- [ ] **A3:** rediseñar home
- [ ] **A4:** rediseñar buscadores de libros y reseñadores
- [ ] **A5:** rediseñar alta de usuario y espacio del escritor
- [ ] **A6:** páginas secundarias y pulido responsive

---

## 4. Bloque B — SEO

Con 10 visitas/día, el problema no es de ajuste fino: es que el sitio aún no es una fuente de tráfico orgánico. La buena noticia es que tu producto genera contenido indexable de forma natural (libros, géneros, reseñadores). Tras el rediseño:

### SEO técnico (rápido y de alto impacto)

- **Renderizado:** asegúrate de que las páginas de libros y de reseñadores se sirven con contenido en el HTML (SSR o estático), no solo tras cargar JavaScript. Next moderno te lo pone fácil y es donde más se nota frente a la versión vieja.
- **Metadatos por página:** `title` y meta description únicos para cada libro, cada reseñador y cada página de género. Hoy compartes un único meta genérico.
- **Datos estructurados:** marca los libros con schema.org (`Book`) y, si procede, `Review`. Ayuda a aparecer con formato enriquecido en Google.
- **Sitemap y robots:** genera un `sitemap.xml` dinámico con todas las fichas y dalo de alta en Google Search Console. Es gratis y es tu mejor termómetro de SEO.
- **Rendimiento:** imágenes optimizadas (ya usas webp en el logo, extiéndelo a portadas) y buenas métricas de carga. Google lo premia y tu público móvil lo agradece.

### SEO de contenido (el motor a medio plazo)

- **Páginas de género como aterrizaje:** "Reseñadores de novela negra", "Reseñadores de fantasía", etc. Son búsquedas reales de escritores y tú ya tienes los datos para llenarlas.
- **Blog / recursos:** ya prometes "consejos para promocionar novelas" por email. Reutiliza ese contenido como artículos públicos: "Cómo conseguir reseñas para tu primera novela", "Qué es un ARC", etc. Captan justo a tu público objetivo desde Google.
- **Aprovecha la marca:** el ángulo "Ladran, Sancho" y el nicho literario en español son diferenciales. Hay poca competencia hispanohablante específica en esto.

> **Expectativa realista:** el SEO no da resultados en semanas; da resultados en meses. Por eso va después del diseño y no antes: primero un sitio que convierta y retenga, luego el grifo de tráfico. Configurar Search Console desde ya (aunque no rediseñes aún) es gratis y te da datos para más adelante.

---

## 5. Bloque C — Redes sociales

Ya tienes Instagram, Twitter/X y Facebook. Para un público de 16-25 años mayoritariamente femenino interesado en libros, el orden de prioridad es claro: Instagram y TikTok primero, luego el resto. El mundo "bookstagram" y "booktok" es justo tu audiencia.

### Idea central: que el contenido salga del propio producto

No inventes contenido desde cero cada semana; conviértelo en un subproducto de lo que ya pasa en la plataforma:

- **"Libro de la semana":** destaca un libro recién dado de alta, con su portada y sinopsis. Sirve al autor (promoción) y te da contenido constante.
- **Reseñador destacado:** presenta a un reseñador de tu base, enlaza su blog/canal. Le das visibilidad (que es justo lo que vienen a buscar) y generas comunidad.
- **Antes/después de reseñas:** "este libro consiguió X reseñas en Reseñan Sancho". Prueba social que atrae a más escritores.
- **Consejos en formato corto:** reusa tus "consejos para promocionar novelas" como reels/carruseles. Mismo contenido, tres canales (Instagram, TikTok, blog).

### Tácticas de crecimiento de bajo coste

- Colabora con los propios reseñadores de tu base: son creadores de contenido por definición. Una mención cruzada vale más que mil anuncios.
- Concursos de reseñas (que ya mencionas en la home): son un imán de participación y contenido generado por usuarios.
- Hashtags de nicho en español (#bookstagramespañol, #booktokespaña, #escritoresindependientes) para llegar a tu público sin pagar.

> **Sostenibilidad con pocas horas:** no prometas un calendario diario que no podrás mantener. Mejor 2-3 publicaciones semanales constantes durante meses que 10 una semana y cero el mes siguiente. Dedica una sesión al mes a producir contenido en lote (batch) y prográmalo. La constancia vence a la intensidad.

---

## 6. Bloque D — Automatización

Va al final a propósito: te alivia, pero no hace crecer el proyecto. Hazlo en piezas pequeñas y solo donde el dolor sea real y repetitivo. Ordenadas de mayor a menor retorno:

### 6.1 Respuesta y triaje de emails

Recibes consultas en tu correo de Hostinger. Antes de automatizar respuestas, distingue dos cosas: respuestas a preguntas frecuentes (automatizables) y conversaciones reales (no las automatices, perderías el trato cercano que es parte de tu marca).

- **Primer paso barato:** una buena sección de FAQ pública y plantillas de respuesta guardadas. Resuelve la mayoría sin automatizar nada.
- **Borradores con IA:** para correos que sí requieren respuesta, un asistente que te proponga un borrador que tú revisas y envías. Mantienes el control y el tono.

> ⚠️ **Cautela importante con la automatización de email:** no conectes un sistema que envíe respuestas automáticas sin tu revisión, sobre todo a partir del contenido de los emails entrantes. Un correo puede contener instrucciones engañosas, y un autoresponder que actúa solo puede mandar mensajes que no querías. Deja siempre una persona (tú) en el último paso de "enviar". El borrador asistido sí; el envío 100% automático, no.

### 6.2 Verificación de altas de usuarios y libros

Hoy revisas manualmente. Opciones por nivel de esfuerzo:

- **Validaciones automáticas en el alta:** formato de email, campos obligatorios, longitud mínima de sinopsis, que la portada sea una imagen válida. Esto reduce el trabajo manual sin riesgo.
- **Cola de revisión:** en lugar de revisar a ciegas, un panel de administración que te liste las altas nuevas pendientes con todo a la vista. No lo automatiza del todo, pero hace tu revisión cuestión de minutos.
- **Filtros heurísticos:** marcar automáticamente como sospechosas las altas con patrones típicos de spam (enlaces raros, texto repetido) para que las mires primero.

### 6.3 El servicio premium (tu mayor carga manual)

Describes el premium de 69 € como "mucho trabajo manual": recibir el libro, leerlo/filtrarlo, y preparar a mano el email de Mailchimp. Aquí hay margen real:

- **Plantilla de email premium semi-automática:** que el sistema pre-rellene la plantilla de Mailchimp con los datos del libro (sinopsis, portada, formatos, enlace a la ficha). Tú solo añades el toque personal y envías. Ahorra la parte tediosa sin perder tu criterio editorial.
- Automatiza el aviso inicial y el seguimiento (recordatorio de enviar el ejemplar) que hoy son correos manuales predecibles.
- El filtro de calidad (leer el libro) mantenlo manual: es tu valor diferencial y lo que justifica el precio.

> **Principio general de automatización:** automatiza lo repetitivo y predecible (validaciones, plantillas, recordatorios). Mantén manual lo que requiere criterio o trato humano (decisiones editoriales, conversaciones con clientes). Y nunca pongas en piloto automático acciones irreversibles (enviar, publicar, cobrar, borrar) sin que tú confirmes.

---

## 7. Hoja de ruta resumida

Si solo lees una sección, que sea esta. Orden recomendado con pocas horas al mes:

1. **Ya mismo (minutos):** corregir las erratas de la home. Crear cuenta en Google Search Console.
2. **Mes 1:** definir el sistema de diseño (paleta, tipografía, componentes) y estabilizar en Next 15 + React 18 + Node LTS manteniendo el router actual.
3. **Meses 2-3:** rediseñar y migrar la home, luego los buscadores de libros y reseñadores. Publicar fase a fase.
4. **Meses 3-4:** alta de usuario, espacio del escritor, páginas secundarias y pulido móvil.
5. **En paralelo desde el mes 2:** SEO técnico (metadatos por página, sitemap, datos estructurados) según vas tocando cada página.
6. **Mes 4 en adelante:** contenido SEO (páginas de género, blog) y redes sociales con producción en lote.
7. **Cuando el resto esté estable:** automatizaciones puntuales, empezando por la cola de revisión de altas y la plantilla semi-automática del premium.

> **Lo más importante que te llevas:**
> 1. No hagas un rewrite de golpe: migra y rediseña página a página, con la web siempre viva.
> 2. El diseño es tu prioridad y tu mejor inversión ahora; el SEO y las redes rinden después, no antes.
> 3. Tus bases de Mailchimp (450 reseñadores, 91 escritores) son un activo enorme: cuídalas y úsalas.
> 4. Automatiza lo tedioso, nunca el criterio ni el botón de "enviar".
> 5. Con pocas horas al mes, la constancia vale más que la intensidad. Una fase cerrada al mes te lleva muy lejos en un año.