from flask import Blueprint

from controllers.cameraController import (start_camera, stop_camera, video,
                                          video_detect)

cameraRoute = Blueprint('cameraRoute', __name__)

cameraRoute.route('play', methods=['GET'])(start_camera)
cameraRoute.route('stop', methods=['GET'])(stop_camera)
cameraRoute.route('video', methods=['GET'])(video)
cameraRoute.route('detect', methods=['GET'])(video_detect)
