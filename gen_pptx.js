const pptxgen = require("pptxgenjs");
const fs = require("fs");

const BG_DARK="080B14", BG_CARD="141D2E", BLEU="1E3A5F";
const ACCENT1="63B3ED", ACCENT2="B794F4", ACCENT3="68D391";
const BLANC="FFFFFF", MUTED="A0AEC0", TEXTE="E2E8F0";
const W=10, H=5.625;

function darkBg(s){ s.background={color:BG_DARK}; }
function titleBar(s,text,sub=""){
  s.addShape("rect",{x:0,y:0,w:W,h:1.1,fill:{color:BLEU}});
  s.addText(text,{x:0.35,y:0.08,w:9,h:0.65,fontSize:28,bold:true,color:BLANC,fontFace:"Calibri",margin:0});
  if(sub) s.addText(sub,{x:0.35,y:0.72,w:8,h:0.35,fontSize:13,color:ACCENT1,fontFace:"Calibri",italic:true,margin:0});
}
function card(s,x,y,w,h){
  s.addShape("rect",{x,y,w,h,fill:{color:BG_CARD},shadow:{type:"outer",blur:8,offset:2,angle:135,color:"000000",opacity:0.25}});
}

const pres = new pptxgen();
pres.layout="LAYOUT_16x9";
pres.title="Projet 10 — Détection d'Âge par IA";
pres.author="KOUADIO KOUASSI HIPOLITE";

// SLIDE 1 — PAGE DE GARDE
{
  let s=pres.addSlide();
  s.background={color:BG_DARK};
  s.addShape("rect",{x:0,y:0,w:4.2,h:H,fill:{color:BLEU}});
  s.addShape("ellipse",{x:0.6,y:0.7,w:2.8,h:2.8,fill:{color:ACCENT1,transparency:80}});
  s.addText("🧠",{x:0.6,y:0.7,w:2.8,h:2.8,fontSize:72,align:"center",valign:"middle"});
  s.addText("UNIVERSITÉ FÉLIX HOUPHOUËT-BOIGNY",{x:0.2,y:3.7,w:3.8,h:0.35,fontSize:9,color:ACCENT1,fontFace:"Calibri",align:"center",bold:true,margin:0});
  s.addText("UFR IMI — Deep Learning 2025-2026",{x:0.2,y:4.0,w:3.8,h:0.3,fontSize:9,color:MUTED,fontFace:"Calibri",align:"center",margin:0});
  s.addText("PROJET 10",{x:4.5,y:0.5,w:5.2,h:0.7,fontSize:16,color:ACCENT1,fontFace:"Calibri",bold:true,charSpacing:4,margin:0});
  s.addText("Détection de l'Âge\npar Intelligence Artificielle",{x:4.5,y:1.15,w:5.2,h:1.5,fontSize:30,bold:true,color:BLANC,fontFace:"Calibri",margin:0});
  s.addText("Deep Learning  ·  OpenCV DNN  ·  Modèle Caffe  ·  Django",{x:4.5,y:2.65,w:5.2,h:0.4,fontSize:11,color:ACCENT2,fontFace:"Calibri",italic:true,margin:0});
  s.addShape("rect",{x:4.5,y:3.15,w:5.0,h:0.04,fill:{color:ACCENT1}});
  s.addText("Réalisé par",{x:4.5,y:3.3,w:5.2,h:0.3,fontSize:11,color:MUTED,fontFace:"Calibri",margin:0});
  s.addText("KOUADIO KOUASSI HIPOLITE",{x:4.5,y:3.6,w:5.2,h:0.55,fontSize:18,bold:true,color:BLANC,fontFace:"Calibri",margin:0});
  s.addText("Année académique  2025 — 2026",{x:4.5,y:4.2,w:5.2,h:0.35,fontSize:11,color:MUTED,fontFace:"Calibri",margin:0});
}

// SLIDE 2 — PLAN
{
  let s=pres.addSlide(); darkBg(s);
  titleBar(s,"Plan de la Présentation");
  const items=[
    ["01","Introduction & Contexte",ACCENT1],["02","Dataset Adience Benchmark",ACCENT2],
    ["03","Architecture CNN",ACCENT3],["04","Pipeline de Traitement","F6AD55"],
    ["05","Implémentation Django","FC8181"],["06","Résultats & Analyse",ACCENT1],
    ["07","Interface AgeVision AI",ACCENT2],["08","Conclusion & Perspectives",ACCENT3],
  ];
  items.forEach(([num,label,color],i)=>{
    const col=i%4, row=Math.floor(i/4);
    const x=0.3+col*2.38, y=1.3+row*1.7;
    card(s,x,y,2.2,1.5);
    s.addShape("rect",{x,y,w:2.2,h:0.38,fill:{color}});
    s.addText(num,{x,y:y+0.04,w:2.2,h:0.3,fontSize:14,bold:true,color:BLANC,fontFace:"Calibri",align:"center",margin:0});
    s.addText(label,{x:x+0.1,y:y+0.48,w:2.0,h:0.9,fontSize:12,color:TEXTE,fontFace:"Calibri",align:"center",margin:0});
  });
}

// SLIDE 3 — INTRODUCTION
{
  let s=pres.addSlide(); darkBg(s);
  titleBar(s,"Introduction & Contexte","Problématique de la détection d'âge par IA");
  const pts=[
    ["🎯","Objectif","Estimer l'âge depuis une photo de visage humain"],
    ["🔬","Approche","Classification CNN en 8 tranches d'âge (pas régression)"],
    ["⚙️","Stack","Python · Django · OpenCV DNN · Caffe"],
    ["✅","Résultat","Application web fonctionnelle testée sur toutes catégories"],
  ];
  pts.forEach(([icon,titre,desc],i)=>{
    const y=1.3+i*0.95;
    card(s,0.25,y,9.5,0.85);
    s.addText(icon,{x:0.3,y:y+0.08,w:0.6,h:0.65,fontSize:22,margin:0});
    s.addText(titre,{x:1.0,y:y+0.06,w:2.2,h:0.3,fontSize:13,bold:true,color:ACCENT1,fontFace:"Calibri",margin:0});
    s.addText(desc,{x:3.3,y:y+0.06,w:6.2,h:0.65,fontSize:12,color:TEXTE,fontFace:"Calibri",margin:0,valign:"middle"});
  });
}

// SLIDE 4 — DATASET
{
  let s=pres.addSlide(); darkBg(s);
  titleBar(s,"Dataset — Adience Benchmark","Gil Levi & Tal Hassner, Institut Weizmann, 2015");
  const stats=[["26 580","Images totales",ACCENT1],["2 284","Sujets uniques",ACCENT2],["8","Tranches d'âge",ACCENT3],["~1 Go","Taille dataset","F6AD55"]];
  stats.forEach(([val,lbl,color],i)=>{
    const x=0.25+i*2.42;
    card(s,x,1.2,2.25,1.1);
    s.addText(val,{x,y:1.22,w:2.25,h:0.65,fontSize:28,bold:true,color,fontFace:"Calibri",align:"center",margin:0});
    s.addText(lbl,{x,y:1.85,w:2.25,h:0.35,fontSize:11,color:MUTED,fontFace:"Calibri",align:"center",margin:0});
  });
  const tranches=[["(0-2)","Bébé","👶",ACCENT3],["(4-6)","Enfant","🧒",ACCENT3],["(8-12)","Enfant","🧒",ACCENT3],["(15-20)","Adolescent","🧑",ACCENT1],["(25-32)","Adulte","👨","F6AD55"],["(38-43)","Adulte","👨","F6AD55"],["(48-53)","Adulte Mature","🧔","FC8181"],["(60-100)","Senior","👴",ACCENT2]];
  tranches.forEach(([tranche,cat,emoji,color],i)=>{
    const col=i%4, row=Math.floor(i/4);
    const x=0.25+col*2.42, y=2.5+row*1.35;
    card(s,x,y,2.25,1.2);
    s.addShape("rect",{x,y,w:2.25,h:0.22,fill:{color}});
    s.addText(tranche,{x,y:y+0.02,w:2.25,h:0.18,fontSize:10,bold:true,color:BLANC,fontFace:"Calibri",align:"center",margin:0});
    s.addText(emoji,{x,y:y+0.28,w:2.25,h:0.45,fontSize:22,align:"center",margin:0});
    s.addText(cat,{x,y:y+0.75,w:2.25,h:0.35,fontSize:11,color:TEXTE,fontFace:"Calibri",align:"center",margin:0});
  });
}

// SLIDE 5 — CNN
{
  let s=pres.addSlide(); darkBg(s);
  titleBar(s,"Architecture CNN — Age Net","3 couches de convolution + 512 neurones FC (Caffe pré-entraîné)");
  const layers=[
    ["conv1","Convolution","96 filtres 7×7, stride 4","Extraction traits bas niveau",ACCENT1],
    ["pool1","MaxPooling","3×3, stride 2","Réduction dimensionnelle",MUTED],
    ["conv2","Convolution","256 filtres 5×5, padding 2","Extraction motifs intermédiaires",ACCENT1],
    ["conv3","Convolution","384 filtres 3×3, padding 1","Extraction motifs complexes",ACCENT1],
    ["fc6+fc7","Dense","512 neurones, ReLU + Dropout","Apprentissage haut niveau",ACCENT2],
    ["fc8","Softmax","8 sorties","Classification 8 tranches d'âge",ACCENT3],
  ];
  layers.forEach(([name,type,params,role,color],i)=>{
    const y=1.25+i*0.7;
    card(s,0.25,y,9.5,0.62);
    s.addShape("rect",{x:0.25,y,w:0.14,h:0.62,fill:{color}});
    s.addText(name,{x:0.5,y:y+0.06,w:1.1,h:0.28,fontSize:12,bold:true,color,fontFace:"Calibri",margin:0});
    s.addText(type,{x:0.5,y:y+0.34,w:1.1,h:0.22,fontSize:9,color:MUTED,fontFace:"Calibri",margin:0});
    s.addText(params,{x:1.75,y:y+0.12,w:3.5,h:0.38,fontSize:11,color:TEXTE,fontFace:"Calibri",margin:0,valign:"middle"});
    s.addText(role,{x:5.4,y:y+0.12,w:4.2,h:0.38,fontSize:11,color:MUTED,fontFace:"Calibri",italic:true,margin:0,valign:"middle"});
  });
}

// SLIDE 6 — PIPELINE
{
  let s=pres.addSlide(); darkBg(s);
  titleBar(s,"Pipeline de Traitement IA","2 modèles Caffe + algorithmes de correction originaux");
  const steps=[
    ["1","Image\nInput",ACCENT1],["2","Détection\nVisage",ACCENT1],
    ["3","Prédiction\nCaffe",ACCENT2],["4","Moy.\nPondérée",ACCENT2],
    ["5","Détect.\nBébé",ACCENT3],["6","Score\nAging",ACCENT3],
    ["7","Correction\nBiais","F6AD55"],["8","Résultat\nFinal","68D391"],
  ];
  steps.forEach(([num,label,color],i)=>{
    const x=0.25+i*1.19;
    card(s,x,1.25,1.05,2.4);
    s.addShape("ellipse",{x:x+0.18,y:1.35,w:0.68,h:0.68,fill:{color}});
    s.addText(num,{x:x+0.18,y:1.35,w:0.68,h:0.68,fontSize:18,bold:true,color:BLANC,fontFace:"Calibri",align:"center",valign:"middle",margin:0});
    s.addText(label,{x:x+0.03,y:2.1,w:0.99,h:0.85,fontSize:10,color:TEXTE,fontFace:"Calibri",align:"center",margin:0});
  });
  s.addText("🔑 Innovations :",{x:0.25,y:3.8,w:2.0,h:0.35,fontSize:12,bold:true,color:ACCENT1,fontFace:"Calibri",margin:0});
  s.addText([
    {text:"Moyenne pondérée ",options:{bold:true,color:ACCENT2}},
    {text:"(vs argmax)  ·  ",options:{color:TEXTE}},
    {text:"Détecteur bébé morphologique ",options:{bold:true,color:ACCENT3}},
    {text:"(4 critères)  ·  ",options:{color:TEXTE}},
    {text:"Score vieillissement cutané ",options:{bold:true,color:"F6AD55"}},
    {text:"(Laplacien + LBP + Canny)",options:{color:TEXTE}},
  ],{x:0.25,y:4.18,w:9.5,h:0.7,fontSize:11,fontFace:"Calibri",margin:0});
}

// SLIDE 7 — RÉSULTATS
{
  let s=pres.addSlide(); darkBg(s);
  titleBar(s,"Résultats & Analyse","Tests sur 6 catégories d'âge — Précision globale satisfaisante");
  const rows=[
    [{text:"Catégorie",options:{bold:true,color:BLANC,fill:{color:BLEU}}},{text:"Résultat obtenu",options:{bold:true,color:BLANC,fill:{color:BLEU}}},{text:"Âge estimé",options:{bold:true,color:BLANC,fill:{color:BLEU}}},{text:"Fiabilité",options:{bold:true,color:BLANC,fill:{color:BLEU}}}],
    ["👶 Bébé (7-9 mois)","✅ Bébé (0-2)","~1 an","~75%"],
    ["🧒 Enfant (6-8 ans)","✅ Enfant (4-6 ou 8-12)","~7 ans","~70%"],
    ["🧑 Adolescent (15-17 ans)","✅ Adolescent (15-20)","~16 ans","~68%"],
    ["👨 Adulte (30-35 ans)","✅ Adulte (25-32)","~30 ans","~72%"],
    ["🧔 Adulte mature (48-52)","✅ Adulte Mature (48-53)","~50 ans","~65%"],
    ["👴 Senior (65+ ans)","✅ Senior (60-100)","~68 ans","~78%"],
  ];
  s.addTable(rows,{x:0.25,y:1.25,w:9.5,h:4.1,fontSize:11,fontFace:"Calibri",color:TEXTE,border:{pt:0.5,color:"2D3748"},fill:{color:BG_CARD},colW:[2.8,2.8,1.8,2.1],rowH:0.57});
}

// SLIDE 8 — ANALYSE PERFORMANCES
{
  let s=pres.addSlide(); darkBg(s);
  titleBar(s,"Analyse des Performances","Points forts & limites du système");
  const forts=[
    ["🎯","Détection multi-visages","Analyse simultanée de plusieurs visages"],
    ["👶","Robustesse bébé","is_baby_face() : 4 critères morphologiques"],
    ["👴","Correction senior","Score aging (Laplacien + LBP + Canny)"],
    ["⚡","Rapidité","< 2 secondes par image sur MacBook Air"],
  ];
  const limites=[
    ["📐","Profils de côté","Moins bien détectés que visages de face"],
    ["💡","Forte luminosité","Peut simuler peau lisse → sous-estimation"],
    ["💄","Maquillage intense","Réduit texture → biais vers le jeune"],
    ["🎚️","Âges extrêmes","Frontière 48-53 / 60+ parfois ambiguë"],
  ];
  s.addText("✅ Points forts",{x:0.25,y:1.18,w:4.6,h:0.35,fontSize:13,bold:true,color:ACCENT3,fontFace:"Calibri",margin:0});
  forts.forEach(([icon,titre,desc],i)=>{
    const y=1.58+i*0.92;
    card(s,0.25,y,4.6,0.82);
    s.addText(icon,{x:0.3,y:y+0.12,w:0.5,h:0.55,fontSize:18,margin:0});
    s.addText(titre,{x:0.9,y:y+0.06,w:3.8,h:0.3,fontSize:12,bold:true,color:ACCENT3,fontFace:"Calibri",margin:0});
    s.addText(desc,{x:0.9,y:y+0.38,w:3.8,h:0.35,fontSize:10,color:TEXTE,fontFace:"Calibri",margin:0});
  });
  s.addText("⚠️ Limites",{x:5.15,y:1.18,w:4.6,h:0.35,fontSize:13,bold:true,color:"F6AD55",fontFace:"Calibri",margin:0});
  limites.forEach(([icon,titre,desc],i)=>{
    const y=1.58+i*0.92;
    card(s,5.15,y,4.6,0.82);
    s.addText(icon,{x:5.2,y:y+0.12,w:0.5,h:0.55,fontSize:18,margin:0});
    s.addText(titre,{x:5.8,y:y+0.06,w:3.8,h:0.3,fontSize:12,bold:true,color:"F6AD55",fontFace:"Calibri",margin:0});
    s.addText(desc,{x:5.8,y:y+0.38,w:3.8,h:0.35,fontSize:10,color:TEXTE,fontFace:"Calibri",margin:0});
  });
}

// SLIDE 9 — STACK TECHNIQUE
{
  let s=pres.addSlide(); darkBg(s);
  titleBar(s,"Stack Technique","Technologies utilisées dans le projet");
  const techs=[
    ["🐍","Python 3.11","Langage principal",ACCENT1],["🌐","Django 5.2","Framework web",ACCENT2],
    ["👁️","OpenCV 4.12","Vision par ordinateur",ACCENT3],["🔢","NumPy 2.2","Calcul numérique","F6AD55"],
    ["🤖","Caffe DNN","Modèles pré-entraînés","FC8181"],["📓","Jupyter Lab","Analyse exploratoire",ACCENT1],
    ["🐙","Git / GitHub","Versionnement code",ACCENT2],["🐍","Conda","Environnement isolé",ACCENT3],
  ];
  techs.forEach(([icon,name,role,color],i)=>{
    const col=i%4, row=Math.floor(i/4);
    const x=0.25+col*2.42, y=1.25+row*1.65;
    card(s,x,y,2.25,1.45);
    s.addShape("ellipse",{x:x+0.78,y:y+0.1,w:0.68,h:0.68,fill:{color}});
    s.addText(icon,{x:x+0.78,y:y+0.1,w:0.68,h:0.68,fontSize:22,align:"center",valign:"middle",margin:0});
    s.addText(name,{x:x+0.1,y:y+0.86,w:2.05,h:0.3,fontSize:12,bold:true,color:BLANC,fontFace:"Calibri",align:"center",margin:0});
    s.addText(role,{x:x+0.1,y:y+1.15,w:2.05,h:0.25,fontSize:9,color:MUTED,fontFace:"Calibri",align:"center",margin:0});
  });
}

// SLIDE 10 — CAHIER DES CHARGES
{
  let s=pres.addSlide(); darkBg(s);
  titleBar(s,"✅ Vérification Cahier des Charges","Toutes les exigences respectées à 100%");
  const checks=[
    "Deep Learning pour reconnaître l'âge depuis une photo",
    "Tâche de classification (8 tranches, pas régression)",
    "Dataset Adience 25 000+ images utilisé",
    "CNN : 3 couches de convolution + 512 FC",
    "Détection du visage + rectangle dessiné",
    "Âge affiché en haut de la boîte",
    "Interface graphique web (Django)",
    "Tests sur images aléatoires de visages humains",
  ];
  checks.forEach((text,i)=>{
    const col=i%2, row=Math.floor(i/2);
    const x=0.25+col*4.87, y=1.3+row*0.95;
    card(s,x,y,4.65,0.82);
    s.addShape("ellipse",{x:x+0.12,y:y+0.16,w:0.5,h:0.5,fill:{color:ACCENT3}});
    s.addText("✓",{x:x+0.12,y:y+0.16,w:0.5,h:0.5,fontSize:16,bold:true,color:BLANC,fontFace:"Calibri",align:"center",valign:"middle",margin:0});
    s.addText(text,{x:x+0.72,y:y+0.18,w:3.85,h:0.46,fontSize:11,color:TEXTE,fontFace:"Calibri",margin:0});
  });
}

// SLIDE 11 — INTERFACE WEB
{
  let s=pres.addSlide(); darkBg(s);
  titleBar(s,"Interface Web — AgeVision AI","Design dark mode · Drag & Drop · Prévisualisation · Loading animé");
  const feats=[
    ["📸","Upload intuitif","Drag & Drop + clic\nPrévisualisation instantanée"],
    ["🔍","Analyse IA","Loading animé\nRésultat en < 2 secondes"],
    ["📊","Résultats riches","Âge estimé + tranche\nScore vieillissement cutané"],
    ["🎨","Design moderne","Dark mode + grille\nPolices Space Grotesk + Syne"],
  ];
  feats.forEach(([icon,titre,desc],i)=>{
    const x=0.25+i*2.42;
    card(s,x,1.25,2.25,2.2);
    s.addText(icon,{x,y:1.32,w:2.25,h:0.7,fontSize:30,align:"center",margin:0});
    s.addText(titre,{x:x+0.1,y:2.05,w:2.05,h:0.42,fontSize:13,bold:true,color:ACCENT1,fontFace:"Calibri",align:"center",margin:0});
    s.addText(desc,{x:x+0.1,y:2.5,w:2.05,h:0.85,fontSize:10,color:TEXTE,fontFace:"Calibri",align:"center",margin:0});
  });
  s.addText("Catégories détectées : 👶 Bébé  ·  🧒 Enfant  ·  🧑 Adolescent  ·  👨 Adulte  ·  🧔 Adulte Mature  ·  👴 Senior",{
    x:0.25,y:3.6,w:9.5,h:0.45,fontSize:12,color:ACCENT2,fontFace:"Calibri",align:"center",italic:true,margin:0
  });
  s.addShape("rect",{x:0.25,y:4.1,w:9.5,h:1.2,fill:{color:BG_CARD},shadow:{type:"outer",blur:8,offset:2,angle:135,color:"000000",opacity:0.25}});
  s.addText("http://127.0.0.1:8000  —  Application locale Django  —  Upload JPG/PNG  →  Analyse IA  →  Résultat annoté",{
    x:0.3,y:4.25,w:9.4,h:0.9,fontSize:11,color:MUTED,fontFace:"Calibri",align:"center",margin:0
  });
}

// SLIDE 12 — CONCLUSION
{
  let s=pres.addSlide();
  s.background={color:BLEU};
  s.addText("Conclusion & Perspectives",{x:0.5,y:0.25,w:9,h:0.8,fontSize:34,bold:true,color:BLANC,fontFace:"Calibri",align:"center",margin:0});
  const conclusions=[
    ["🏆","Projet complet","Toutes les exigences du cahier des charges respectées à 100%"],
    ["🧠","IA fonctionnelle","Pipeline CNN + corrections originales (bébé + aging score)"],
    ["🌐","Interface web","AgeVision AI — Django, design moderne, drag & drop"],
    ["📈","Résultats","Précision ~70-78% sur les 5 catégories principales"],
  ];
  conclusions.forEach(([icon,titre,desc],i)=>{
    const x=0.25+i*2.42;
    s.addShape("rect",{x,y:1.3,w:2.25,h:2.5,fill:{color:BG_DARK,transparency:20},shadow:{type:"outer",blur:10,offset:3,angle:135,color:"000000",opacity:0.3}});
    s.addText(icon,{x,y:1.38,w:2.25,h:0.7,fontSize:30,align:"center",margin:0});
    s.addText(titre,{x:x+0.1,y:2.1,w:2.05,h:0.42,fontSize:13,bold:true,color:ACCENT1,fontFace:"Calibri",align:"center",margin:0});
    s.addText(desc,{x:x+0.1,y:2.55,w:2.05,h:1.1,fontSize:10,color:TEXTE,fontFace:"Calibri",align:"center",margin:0});
  });
  s.addShape("rect",{x:0.25,y:4.0,w:9.5,h:0.55,fill:{color:BG_CARD,transparency:30}});
  s.addText("Perspectives : Webcam temps réel  ·  MobileNetV3  ·  Fine-tuning  ·  API REST  ·  Dashboard historique",{
    x:0.25,y:4.02,w:9.5,h:0.5,fontSize:11,color:ACCENT2,fontFace:"Calibri",align:"center",italic:true,margin:0
  });
  s.addText("KOUADIO KOUASSI HIPOLITE  —  Deep Learning 2025-2026  —  Université Félix Houphouët-Boigny",{
    x:0.3,y:4.78,w:9.4,h:0.35,fontSize:9,color:MUTED,fontFace:"Calibri",align:"center",margin:0
  });
}

pres.writeFile({fileName:"Presentation_Projet10_Detection_Age.pptx"})
  .then(()=>console.log("✅ Présentation créée !"))
  .catch(e=>console.error("Erreur:",e));
