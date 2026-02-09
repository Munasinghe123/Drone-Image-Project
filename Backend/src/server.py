from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import cgi
from routes.survey_routes import ROUTES
import threading
from publish.publish_engine import run_publish_engine



class RequestHandler(BaseHTTPRequestHandler):
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        route_key = ("POST", self.path)
        controller = ROUTES.get(route_key)

        if not controller:
            self.send_response(404)
            self.end_headers()
            return

        content_type = self.headers.get("Content-Type", "")

        request = {
            "headers": dict(self.headers),
            "form": {},
            "files": []
        }

        #  Handle multipart/form-data
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

                # Multiple files with same field name
                if isinstance(field, list):
                    for item in field:
                        if item.filename:
                            request["files"].append({
                                "filename": item.filename,
                                "file": item.file.read()
                            })
                else:
                    # Single field
                    if field.filename:
                        request["files"].append({
                            "filename": field.filename,
                            "file": field.file.read()
                        })
                    else:
                        request["form"][key] = field.value

        else:
            # JSON fallback
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            request["body"] = body

        response = controller(request)

        self.send_response(response["status"])
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(response["body"]).encode())



def run_server():
    # Start publish engine in background
    publish_thread = threading.Thread(
        target=run_publish_engine,
        daemon=True
    )
    publish_thread.start()

    print(" Publish engine started in background")

    server = HTTPServer(("localhost", 8000), RequestHandler)
    print("Server running on http://localhost:8000")
    server.serve_forever()

