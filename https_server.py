import http.server
import ssl
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
CERT_FILE = BASE_DIR / "-+1.pem"
KEY_FILE = BASE_DIR / "-+1-key.pem"
HOST = "localhost"
PORT = 8443

handler = http.server.SimpleHTTPRequestHandler
httpd = http.server.ThreadingHTTPServer((HOST, PORT), handler)
httpd.socket = ssl.wrap_socket(
    httpd.socket,
    certfile=str(CERT_FILE),
    keyfile=str(KEY_FILE),
    server_side=True,
)

print(f"Serving HTTPS on https://{HOST}:{PORT}")
httpd.serve_forever()
