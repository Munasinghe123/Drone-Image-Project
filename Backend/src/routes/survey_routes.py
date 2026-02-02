from controllers.upload_line_images import upload_line_images
from controllers.upload_pole_images import upload_pole_images

ROUTES = {
    ("POST", "/survey/upload_line_images"): upload_line_images,
    ("POST", "/survey/upload_pole_images"): upload_pole_images,
}