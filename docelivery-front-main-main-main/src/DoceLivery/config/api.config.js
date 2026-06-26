/**
 * ─────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH — Backend URL configuration
 * ─────────────────────────────────────────────────────────────
 *
 *  To change the backend host when switching networks:
 *    1. Edit (or create) the .env file at the project root.
 *    2. Set:  VITE_API_URL=http://<your-machine-ip>:8080
 *    3. Restart the Vite dev server.
 *
 *  No other file in this project should ever contain a
 *  hardcoded "localhost:8080" or IP address.
 *
 *  Exports:
 *    API_BASE_URL   — e.g.  http://192.168.1.10:8080
 *    API_UPLOADS_URL — e.g.  http://192.168.1.10:8080/uploads
 *    API_WS_URL      — e.g.  http://192.168.1.10:8080/ws-docelivery
 * ─────────────────────────────────────────────────────────────
 */

/** Base URL — no trailing slash */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/** URL prefix for uploaded images served by Spring Boot */
export const API_UPLOADS_URL = `${API_BASE_URL}/uploads`;

/** SockJS / STOMP WebSocket endpoint */
export const API_WS_URL = `${API_BASE_URL}/ws-docelivery`;
