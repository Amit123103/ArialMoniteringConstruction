# AerialPM — CV Edition
## AI-Powered Construction Progress Monitoring

### Prerequisites
  Node.js 20+ | npm 9+ | Webcam/Camera | Chrome/Firefox
### Login
  admin@aerialpm.com   / Admin@123
  manager@aerialpm.com / Manager@123

### Computer Vision Features
  ✅ Live webcam feed with real-time object detection
  ✅ COCO-SSD: detects 80 object classes
  ✅ MobileNet: scene classification
  ✅ BodyPix: worker/person detection
  ✅ Construction object mapping
  ✅ Activity scoring algorithm
  ✅ Image change detection
  ✅ GPU-accelerated (WebGL backend)
  ✅ Server-side OpenCV analysis
  ✅ Automatic capture tagging

### How CV Works
  1. TF.js loads 3 AI models in browser (WebGL GPU)
  2. Webcam stream analyzed at 6-7 fps
  3. COCO-SSD detects objects → mapped to construction
  4. Activity score calculated from detections
  5. MobileNet classifies overall scene
  6. Results overlaid on live video with HUD
  7. Capture saves image + all CV metadata to backend
