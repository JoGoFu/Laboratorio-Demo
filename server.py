import os
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = 8000
ROOT = os.path.dirname(os.path.abspath(__file__))


class QuietHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def log_message(self, format, *args):
        print(f"[server] {format % args}")


def main():
    url = f"http://localhost:{PORT}/"
    print("Iniciando PACDesk...")
    print(f"Abriendo: {url}")

    try:
        webbrowser.open(url)
    except Exception as exc:
        print(f"No se pudo abrir el navegador automaticamente: {exc}")

    try:
        with ThreadingHTTPServer(("127.0.0.1", PORT), QuietHandler) as httpd:
            print(f"Servidor activo en {url}")
            httpd.serve_forever()
    except OSError:
        print(f"El puerto {PORT} ya está en uso. Cerrando servidor...")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
