from flask import Flask, request, send_file
from flask_cors import CORS
import yt_dlp
import os
import uuid

app = Flask(__name__)
CORS(app)  # Allow requests from Vercel

@app.route('/download', methods=['POST'])
def download():
    data = request.get_json()
    url = data.get('url')
    video_id = str(uuid.uuid4())
    filename = f"{video_id}.mp4"

    ydl_opts = {
        'outtmpl': filename,
        'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4',
        'merge_output_format': 'mp4',
        'quiet': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        return send_file(filename, as_attachment=True)
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        if os.path.exists(filename):
            os.remove(filename)

app.run(host='0.0.0.0', port=81)
