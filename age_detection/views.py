from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from .ml_model import detect_age
import os

def index(request):
    return render(request, 'age_detection/index.html')

def detect(request):
    if request.method != 'POST' or not request.FILES.get('image'):
        return render(request, 'age_detection/index.html',
                      {'error': 'Veuillez sélectionner une image.'})
    img_file = request.FILES['image']
    allowed = ['image/jpeg', 'image/png', 'image/jpg']
    if img_file.content_type not in allowed:
        return render(request, 'age_detection/index.html',
                      {'error': 'Format non supporté. Utilisez JPG ou PNG.'})
    upload_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')
    result_dir = os.path.join(settings.MEDIA_ROOT, 'results')
    os.makedirs(upload_dir, exist_ok=True)
    os.makedirs(result_dir, exist_ok=True)
    fs = FileSystemStorage(location=upload_dir)
    filename    = fs.save(img_file.name, img_file)
    image_path  = os.path.join(upload_dir, filename)
    output_path = os.path.join(result_dir, filename)
    try:
        results = detect_age(image_path, output_path)
    except Exception as e:
        return render(request, 'age_detection/index.html',
                      {'error': f'Erreur lors de la détection : {str(e)}'})
    context = {
        'original_image': f'/media/uploads/{filename}',
        'result_image':   f'/media/results/{filename}',
        'detections':     results,
        'nb_faces':       len(results),
        'filename':       filename,
    }
    return render(request, 'age_detection/result.html', context)
