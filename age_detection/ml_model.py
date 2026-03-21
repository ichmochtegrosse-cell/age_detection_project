import cv2
import numpy as np
import os

AGE_BUCKETS = ['(0-2)','(4-6)','(8-12)','(15-20)','(25-32)','(38-43)','(48-53)','(60-100)']
AGE_MIDPOINTS = [1, 5, 10, 17, 28, 40, 50, 70]

CATEGORY_MAP = {
    '(0-2)':    ('Enfant',       '🧒', '#4CAF50'),
    '(4-6)':    ('Enfant',       '🧒', '#4CAF50'),
    '(8-12)':   ('Enfant',       '🧒', '#4CAF50'),
    '(15-20)':  ('Adolescent',   '🧑', '#2196F3'),
    '(25-32)':  ('Adulte',       '👨', '#FF9800'),
    '(38-43)':  ('Adulte',       '👨', '#FF9800'),
    '(48-53)':  ('Adulte Mature','👩', '#FF5722'),
    '(60-100)': ('Senior',       '👴', '#9C27B0'),
}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_models():
    face_net = cv2.dnn.readNetFromCaffe(
        os.path.join(BASE_DIR,'models','face_deploy.prototxt'),
        os.path.join(BASE_DIR,'models','face_net.caffemodel')
    )
    age_net = cv2.dnn.readNetFromCaffe(
        os.path.join(BASE_DIR,'models','age_deploy.prototxt'),
        os.path.join(BASE_DIR,'models','age_net.caffemodel')
    )
    return face_net, age_net

def weighted_age_estimate(probs):
    return sum(p * m for p, m in zip(probs, AGE_MIDPOINTS))

def age_to_bucket(age):
    if age > 45:
        age *= 1.15
    elif age > 30:
        age *= 1.08
    if age < 3:    return '(0-2)'
    elif age < 7:  return '(4-6)'
    elif age < 14: return '(8-12)'
    elif age < 22: return '(15-20)'
    elif age < 35: return '(25-32)'
    elif age < 46: return '(38-43)'
    elif age < 57: return '(48-53)'
    else:          return '(60-100)'

def analyze_skin_wrinkles(face_gray):
    laplacian = cv2.Laplacian(face_gray, cv2.CV_64F)
    return min(np.var(laplacian) / 800.0, 1.0)

def detect_age(image_path, output_path):
    face_net, age_net = load_models()
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Impossible de lire l'image : {image_path}")
    h, w = image.shape[:2]
    results = []

    blob = cv2.dnn.blobFromImage(image, 1.0, (300,300), (104.0,177.0,123.0))
    face_net.setInput(blob)
    detections = face_net.forward()

    for i in range(detections.shape[2]):
        if detections[0,0,i,2] < 0.5:
            continue
        box = detections[0,0,i,3:7] * np.array([w,h,w,h])
        (x1,y1,x2,y2) = box.astype("int")
        x1,y1 = max(0,x1), max(0,y1)
        x2,y2 = min(w,x2), min(h,y2)
        face = image[y1:y2, x1:x2]
        if face.size == 0:
            continue

        face_blob = cv2.dnn.blobFromImage(face, 1.0, (227,227),
            (78.4263377603, 87.7689143744, 114.895847746), swapRB=False)
        age_net.setInput(face_blob)
        age_preds = age_net.forward()[0]

        estimated_age = weighted_age_estimate(age_preds)
        face_gray = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
        wrinkle_score = analyze_skin_wrinkles(face_gray)

        if wrinkle_score > 0.55 and estimated_age < 45:
            estimated_age *= 1.25
        elif wrinkle_score > 0.75 and estimated_age < 60:
            estimated_age = max(estimated_age * 1.35, 58)

        age_label = age_to_bucket(estimated_age)
        category, emoji, _ = CATEGORY_MAP[age_label]
        confidence = min(round(float(sorted(age_preds,reverse=True)[0] +
                                     sorted(age_preds,reverse=True)[1]) * 100, 1), 95.0)

        cv2.rectangle(image, (x1,y1), (x2,y2), (0,200,100), 2)
        cv2.rectangle(image, (x1,y1-45), (x2,y1), (0,0,0), -1)
        cv2.putText(image, f"{category} ~{round(estimated_age)} ans",
                    (x1+5,y1-25), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,255,150), 2)
        cv2.putText(image, f"Tranche: {age_label} | Score: {confidence}%",
                    (x1+5,y1-8), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (200,200,200), 1)

        results.append({
            'category': category, 'emoji': emoji,
            'age_range': age_label,
            'estimated_age': round(estimated_age),
            'confidence': confidence,
            'wrinkle_score': round(wrinkle_score * 100, 1),
            'face_num': len(results) + 1,
        })

    cv2.imwrite(output_path, image)
    return results
