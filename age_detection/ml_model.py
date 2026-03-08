import cv2
import numpy as np
import os

AGE_BUCKETS = [
    '(0-2)', '(4-6)', '(8-12)', '(15-20)',
    '(25-32)', '(38-43)', '(48-53)', '(60-100)'
]

CATEGORY_MAP = {
    '(0-2)':    ('Enfant',     '🧒', '#4CAF50'),
    '(4-6)':    ('Enfant',     '🧒', '#4CAF50'),
    '(8-12)':   ('Enfant',     '🧒', '#4CAF50'),
    '(15-20)':  ('Adolescent', '🧑', '#2196F3'),
    '(25-32)':  ('Adulte',     '👨', '#FF9800'),
    '(38-43)':  ('Adulte',     '👨', '#FF9800'),
    '(48-53)':  ('Adulte',     '👨', '#FF9800'),
    '(60-100)': ('Senior',     '👴', '#9C27B0'),
}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_models():
    face_proto = os.path.join(BASE_DIR, 'models', 'face_deploy.prototxt')
    face_model = os.path.join(BASE_DIR, 'models', 'face_net.caffemodel')
    age_proto  = os.path.join(BASE_DIR, 'models', 'age_deploy.prototxt')
    age_model  = os.path.join(BASE_DIR, 'models', 'age_net.caffemodel')
    face_net = cv2.dnn.readNetFromCaffe(face_proto, face_model)
    age_net  = cv2.dnn.readNetFromCaffe(age_proto,  age_model)
    return face_net, age_net

def detect_age(image_path, output_path):
    face_net, age_net = load_models()
    image = cv2.imread(image_path)
    h, w  = image.shape[:2]
    results = []

    blob = cv2.dnn.blobFromImage(image, 1.0, (300, 300), (104.0, 177.0, 123.0))
    face_net.setInput(blob)
    detections = face_net.forward()

    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence < 0.6:
            continue
        box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
        (x1, y1, x2, y2) = box.astype("int")
        x1, y1 = max(0, x1), max(0, y1)
        x2, y2 = min(w, x2), min(h, y2)
        face = image[y1:y2, x1:x2]
        if face.size == 0:
            continue
        face_blob = cv2.dnn.blobFromImage(
            face, 1.0, (227, 227),
            (78.4263377603, 87.7689143744, 114.895847746),
            swapRB=False
        )
        age_net.setInput(face_blob)
        age_preds  = age_net.forward()
        age_label  = AGE_BUCKETS[age_preds[0].argmax()]
        category, emoji, _ = CATEGORY_MAP[age_label]
        confidence_pct = round(float(age_preds[0].max()) * 100, 1)
        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 200, 100), 2)
        label = f"{category} {age_label} ({confidence_pct}%)"
        cv2.putText(image, label, (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 200, 100), 2)
        results.append({
            'category':   category,
            'emoji':      emoji,
            'age_range':  age_label,
            'confidence': confidence_pct,
            'face_num':   i + 1,
        })

    cv2.imwrite(output_path, image)
    return results
