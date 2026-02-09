from controllers.check_existing_poles import check_existing_poles
from controllers.upload_line_images import upload_line_images
from controllers.upload_pole_images import upload_pole_images
from controllers.check_existing_lines import check_existing_lines

ROUTES = {
    ("POST", "/survey/upload_line_images"): upload_line_images,
    ("POST", "/survey/upload_pole_images"): upload_pole_images,
    ("GET","/survey/check_existing_poles"): check_existing_poles,
    ("GET","/survey/check_existing_lines"): check_existing_lines
}