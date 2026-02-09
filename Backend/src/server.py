from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import cgi
from urllib.parse import urlparse, parse_qs
from routes.survey_routes import ROUTES
import threading
from publish.publish_engine import run_publish_engine


class RequestHandler(BaseHTTPRequestHandler):

    # CORS
    def _set_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    # ---------------- GET ----------------
    def do_GET(self):
        parsed = urlparse(self.path)
        route_key = ("GET", parsed.path)

        controller = ROUTES.get(route_key)
        if not controller:
            self.send_response(404)
            self._set_cors_headers()
            self.end_headers()
            return

        query_params = parse_qs(parsed.query)

        request = {
            "query": {k: v[0] for k, v in query_params.items()},
            "headers": dict(self.headers)
        }

        response = controller(request)

        self.send_response(response["status"])
        self._set_cors_headers()
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(response["body"]).encode())

    # ---------------- POST ----------------
    def do_POST(self):
        route_key = ("POST", self.path)

        controller = ROUTES.get(route_key)
        if not controller:
            self.send_response(404)
            self._set_cors_headers()
            self.end_headers()
            return

        content_type = self.headers.get("Content-Type", "")

        request = {
            "headers": dict(self.headers),
            "form": {},
            "files": []
        }

        if "multipart/form-data" in content_type:
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={
                    "REQUEST_METHOD": "POST",
                    "CONTENT_TYPE": content_type,
                }
            )

            for key in form.keys():
                field = form[key]
                if isinstance(field, list):
                    for item in field:
                        if item.filename:
                            request["files"].append({
                                "filename": item.filename,
                                "file": item.file.read()
                            })
                else:
                    if field.filename:
                        request["files"].append({
                            "filename": field.filename,
                            "file": field.file.read()
                        })
                    else:
                        request["form"][key] = field.value

        response = controller(request)

        self.send_response(response["status"])
        self._set_cors_headers()
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(response["body"]).encode())


def run_server():
    publish_thread = threading.Thread(
        target=run_publish_engine,
        daemon=True
    )
    publish_thread.start()

    print("Publish engine started in background")

    server = HTTPServer(("localhost", 8000), RequestHandler)
    print("Server running on http://localhost:8000")
    server.serve_forever()