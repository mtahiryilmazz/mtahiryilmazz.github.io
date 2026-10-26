/**
 * Three.js Ambient System Constellation Scene
 * High performance, zero bloat, battery-friendly background.
 */
(function() {
  const container = document.getElementById('canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  let scene, camera, renderer;
  let particles, lineMesh;
  const particleCount = 75;
  const maxDistance = 140;
  let positions, velocities;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let isTabActive = true;

  function init() {
    scene = new THREE.Scene();
    
    // Perspective camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 320;

    // Renderer with low battery footprint
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Particle Data
    positions = new Float32Array(particleCount * 3);
    velocities = [];

    const pGeometry = new THREE.BufferGeometry();
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 550;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 350;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

      velocities.push({
        x: (Math.random() - 0.5) * 0.4,
        y: (Math.random() - 0.5) * 0.4,
        z: (Math.random() - 0.5) * 0.2
      });
    }

    pGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle Nodes Material (Cyan glow)
    const pMaterial = new THREE.PointsMaterial({
      color: 0x06B6D4,
      size: 4,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(pGeometry, pMaterial);
    scene.add(particles);

    // Dynamic Connections Buffer
    const maxLines = (particleCount * (particleCount - 1)) / 2;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

    const lineMaterial = new THREE.LineSegmentsMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.25
    });

    lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineMesh);

    // Listeners
    window.addEventListener('resize', onWindowResize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    document.addEventListener('visibilitychange', () => {
      isTabActive = !document.hidden;
    });

    animate();
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.05;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.05;
  }

  function animate() {
    requestAnimationFrame(animate);
    if (!isTabActive) return;

    // Smooth camera inertia
    targetX += (mouseX - targetX) * 0.05;
    targetY += (-mouseY - targetY) * 0.05;
    camera.position.x = targetX;
    camera.position.y = targetY;
    camera.lookAt(scene.position);

    // Update particles position
    const pos = particles.geometry.attributes.position.array;
    let lineIndex = 0;
    const linePos = lineMesh.geometry.attributes.position.array;
    const lineCol = lineMesh.geometry.attributes.color.array;

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;

      // Bounce limits
      if (pos[i * 3] < -300 || pos[i * 3] > 300) velocities[i].x *= -1;
      if (pos[i * 3 + 1] < -200 || pos[i * 3 + 1] > 200) velocities[i].y *= -1;
      if (pos[i * 3 + 2] < -150 || pos[i * 3 + 2] > 150) velocities[i].z *= -1;

      // Connect nodes nearby
      for (let j = i + 1; j < particleCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDistance) {
          const alpha = 1.0 - dist / maxDistance;

          linePos[lineIndex * 6] = pos[i * 3];
          linePos[lineIndex * 6 + 1] = pos[i * 3 + 1];
          linePos[lineIndex * 6 + 2] = pos[i * 3 + 2];

          linePos[lineIndex * 6 + 3] = pos[j * 3];
          linePos[lineIndex * 6 + 4] = pos[j * 3 + 1];
          linePos[lineIndex * 6 + 5] = pos[j * 3 + 2];

          // System cyan to deep rust gradient lines
          lineCol[lineIndex * 6] = 0.02 * alpha;
          lineCol[lineIndex * 6 + 1] = 0.7 * alpha;
          lineCol[lineIndex * 6 + 2] = 0.85 * alpha;

          lineCol[lineIndex * 6 + 3] = 0.9 * alpha;
          lineCol[lineIndex * 6 + 4] = 0.35 * alpha;
          lineCol[lineIndex * 6 + 5] = 0.1 * alpha;

          lineIndex++;
        }
      }
    }

    particles.geometry.attributes.position.needsUpdate = true;
    lineMesh.geometry.setDrawRange(0, lineIndex * 2);
    lineMesh.geometry.attributes.position.needsUpdate = true;
    lineMesh.geometry.attributes.color.needsUpdate = true;

    renderer.render(scene, camera);
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
