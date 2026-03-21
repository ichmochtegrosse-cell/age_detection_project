import cv2
import numpy as np
import os

AGE_BUCKETS   = ['(0-2)','(4-6)','(8-12)','(15-20)','(25-32)','(38-43)','(48-53)','(60-100)']
AGE_MIDPOINTS = [1, 5, 10, 17, 28, 40, 50, 70]

CATEGORY_MAP = {
    '(0-2)':    ('Bébé',         '👶', '#22c55e'),
    '(4-6)':    ('Enfant',       '🧒', '#22c55e'),
    '(8-12)':   ('Enfant',       '🧒', '#16a34a'),
    '(15-20)':  ('Adolescent',   '🧑', '#3b82f6'),
    '(25-32)':  ('Adulte',       '👨', '#f59e0b'),
    '(38-43)':  ('Adulte',       '👨', '#f59e0b'),
    '(48-53)':  ('Adulte Mature','🧔', '#ef4444'),
    '(60-100)': ('Senior',       '👴', '#a855f7'),
}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_models():
    face_net = cv2.dnn.readNetFromCaffe(
        os.path.join(BASE_DIR,'models','face_deploy.prototxt'),
        os.path.join(BASE_DIR,'models','face_net.caffemodel'))
    age_net = cv2.dnn.readNetFromCaffe(
        os.path.join(BASE_DIR,'models','age_deploy.prototxt'),
        os.path.join(BASE_DIR,'models','age_net.caffemodel'))
    return face_net, age_net

def is_baby(face, preds, img_h, img_w, x1, y1, x2, y2):
    """
    Détection bébé par 3 méthodes combinées.
    Retourne True si bébé confirmé.
    """
    fh, fw = face.shape[:2]
    gray   = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
    roi    = gray[int(fh*0.2):int(fh*0.8), int(fw*0.2):int(fw*0.8)]
    if roi.size == 0:
        roi = gray

    # Méthode 1 : Caffe dit (0-2) ou (4-6) en premier ou deuxième choix
    top2_idx   = np.argsort(preds)[::-1][:2]
    caffe_young = (0 in top2_idx) or (1 in top2_idx)
    caffe_prob_02 = float(preds[0])

    # Méthode 2 : Peau ultra-lisse (bébé = Laplacien très bas)
    lap_var    = float(np.var(cv2.Laplacian(roi, cv2.CV_64F)))
    peau_lisse = lap_var < 400

    # Méthode 3 : Très peu de contours (pas de rides, traits fins)
    edges      = cv2.Canny(roi, 15, 60)
    edge_ratio = float(np.sum(edges > 0)) / max(edges.size, 1)
    peu_contours = edge_ratio < 0.07

    # Méthode 4 : Couleur peau uniforme
    blur       = cv2.GaussianBlur(roi, (11, 11), 0)
    uniformite = float(np.mean(np.abs(roi.astype(float) - blur.astype(float))))
    peau_uniforme = uniformite < 6.0

    # Score : combien de conditions sont vraies
    score = sum([caffe_young, peau_lisse, peu_contours, peau_uniforme])

    # Bébé si 3 conditions sur 4 OU prob Caffe (0-2) > 20%
    return (score >= 3) or (caffe_prob_02 > 0.20)

def compute_aging_score(face):
    gray  = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
    h, w  = gray.shape
    roi   = gray[int(h*0.15):int(h*0.85), int(w*0.10):int(w*0.90)]
    if roi.size == 0: roi = gray
    lap   = cv2.Laplacian(roi, cv2.CV_64F)
    blur  = cv2.GaussianBlur(roi, (5,5), 0)
    diff  = cv2.absdiff(roi, blur)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    enh   = clahe.apply(roi)
    edges = cv2.Canny(roi, 50, 150)
    w_s = min(float(np.var(lap))               / 1200.0, 1.0)
    t_s = min(float(np.mean(diff))             / 12.0,   1.0)
    c_s = min(float(np.std(enh))               / 75.0,   1.0)
    e_s = min(float(np.sum(edges>0))/max(edges.size,1)/0.18, 1.0)
    return round(0.40*w_s + 0.25*t_s + 0.20*c_s + 0.15*e_s, 3)

def correct_age(raw_age, aging_score):
    age = raw_age
    if   aging_score >= 0.72: age = age * 1.55 + 12
    elif aging_score >= 0.58: age = age * 1.35 + 8
    elif aging_score >= 0.44: age = age * 1.18 + 4
    elif aging_score >= 0.30: age = age * 1.08
    return float(age)

def age_to_bucket(age):
    if   age < 4:  return '(0-2)'
    elif age < 8:  return '(4-6)'
    elif age < 15: return '(8-12)'
    elif age < 23: return '(15-20)'
    elif age < 37: return '(25-32)'
    elif age < 48: return '(38-43)'
    elif age < 60: return '(48-53)'
    else:          return '(60-100)'

def detect_age(image_path, output_path):
    face_net, age_net = load_models()
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Impossible de lire : {image_path}")
    h, w = image.shape[:2]
    results = []

    blob = cv2.dnn.blobFromImage(image,1.0,(300,300),(104.0,177.0,123.0))
    face_net.setInput(blob)
    dets = face_net.forward()

    for i in range(dets.shape[2]):
        if dets[0,0,i,2] < 0.35: continue
        box = dets[0,0,i,3:7] * np.array([w,h,w,h])
        x1,y1,x2,y2 = box.astype("int")
        x1,y1 = max(0,x1), max(0,y1)
        x2,y2 = min(w,x2), min(h,y2)
        face = image[y1:y2, x1:x2]
        if face.size == 0: continue

        # Prédiction Caffe
        fblob = cv2.dnn.blobFromImage(face,1.0,(227,227),
            (78.4263377603,87.7689143744,114.895847746),swapRB=False)
        age_net.setInput(fblob)
        preds = age_net.forward()[0]

        # Décision bébé
        baby = is_baby(face, preds, h, w, x1, y1, x2, y2)

        if baby:
            age_label = '(0-2)'
            final_age = 1.0
            aging_s   = 0.0
        else:
            raw_age   = sum(p*m for p,m in zip(preds, AGE_MIDPOINTS))
            aging_s   = compute_aging_score(face)
            final_age = correct_age(raw_age, aging_s)
            age_label = age_to_bucket(final_age)

        category, emoji, _ = CATEGORY_MAP[age_label]
        confidence = min(round(float(
            sorted(preds,reverse=True)[0]+
            sorted(preds,reverse=True)[1])*100,1), 95.0)

        cv2.rectangle(image,(x1,y1),(x2,y2),(0,220,120),2)
        cv2.rectangle(image,(x1,y1-52),(x2,y1),(15,15,15),-1)
        cv2.putText(image, f"{category}  ~{round(final_age)} ans",
            (x1+6,y1-30),cv2.FONT_HERSHEY_DUPLEX,0.62,(0,255,160),1)
        cv2.putText(image, f"Tranche: {age_label}  |  Fiabilite: {confidence}%",
            (x1+6,y1-10),cv2.FONT_HERSHEY_SIMPLEX,0.38,(180,180,180),1)

        results.append({
            'category':category,'emoji':emoji,'age_range':age_label,
            'estimated_age':round(final_age),'confidence':confidence,
            'aging_score':round(aging_s*100,1),'face_num':len(results)+1,
        })

    cv2.imwrite(output_path, image)
    return results
