import sys

file_path = '/home/akaun/.gemini/antigravity/brain/452f1e2d-4763-451c-aafe-0cdc12cad317/task.md'
try:
    with open(file_path, 'r') as f:
        content = f.read()

    content = content.replace('- [ ] Construir la interfície de treball del field-worker a `pwa/app/(operari)/feines/[id]/page.tsx`', '- [x] Construir la interfície de treball del field-worker a `pwa/app/(operari)/feines/[id]/page.tsx`')
    content = content.replace('- [ ] Configurar el Service Worker i IndexedDB per fer la web "Offline-First"', '- [x] Configurar el Service Worker i IndexedDB per fer la web "Offline-First"')
    content = content.replace('- [ ] Crear el component de càmera a pantalla completa `CameraOverlay.tsx` amb timestamp imprès', '- [x] Crear el component de càmera a pantalla completa `CameraOverlay.tsx` amb timestamp imprès')
    content = content.replace('- [ ] Crear el component de signatura tàctil `SignaturePad.tsx` per aprovar treballs', '- [x] Crear el component de signatura tàctil `SignaturePad.tsx` per aprovar treballs')

    with open(file_path, 'w') as f:
        f.write(content)
    print("Success")
except Exception as e:
    print(f"Error: {e}")
