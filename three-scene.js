/* ═══════════════════════════════════════════════════════
   MOLINO DE RAMIRO — Three.js Interactive 3D Hero
   Interactive golden dust / olive oil drop particles &
   geometric mill wheel representation in 3D space
   ═══════════════════════════════════════════════════════ */

(function () {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0C0B09, 0.0018);

    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 120;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Group for all rotating elements
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // ─── 1. PARTICLES (GOLDEN DUST & OLIVE AMBER) ─────────
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    const colorGold = new THREE.Color(0xC8A96E);
    const colorGoldLight = new THREE.Color(0xEADBB6);
    const colorAmber = new THREE.Color(0x9E7835);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Torus / galaxy-like distribution around mill center
        const radius = 25 + Math.random() * 110;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI * 0.7;

        positions[i3] = radius * Math.cos(theta) * Math.cos(phi);
        positions[i3 + 1] = radius * Math.sin(phi) * 0.7 + (Math.random() - 0.5) * 15;
        positions[i3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

        scales[i] = Math.random() * 2.2 + 0.5;

        // Color mix
        const mix = Math.random();
        const c = mix < 0.6 ? colorGold : (mix < 0.85 ? colorGoldLight : colorAmber);
        colors[i3] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom Particle Shader / Texture
    const particleTexture = createParticleTexture();
    const particleMaterial = new THREE.PointsMaterial({
        size: 3.2,
        map: particleTexture,
        transparent: true,
        opacity: 0.75,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    worldGroup.add(particles);

    // ─── 2. GEOMETRIC MILL WHEEL (1874 HERITAGE) ───────────
    const wheelGroup = new THREE.Group();

    // Outer stone rings
    const outerRingGeo = new THREE.TorusGeometry(38, 0.35, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0xC8A96E,
        transparent: true,
        opacity: 0.28,
        wireframe: true
    });
    const outerRing = new THREE.Mesh(outerRingGeo, ringMat);
    wheelGroup.add(outerRing);

    const innerRingGeo = new THREE.TorusGeometry(26, 0.25, 16, 80);
    const innerRing = new THREE.Mesh(innerRingGeo, ringMat);
    wheelGroup.add(innerRing);

    const hubRingGeo = new THREE.TorusGeometry(8, 0.4, 16, 60);
    const hubRing = new THREE.Mesh(hubRingGeo, ringMat);
    wheelGroup.add(hubRing);

    // Spokes of the mill
    const spokeCount = 12;
    for (let s = 0; s < spokeCount; s++) {
        const spokeGeo = new THREE.BufferGeometry();
        const angle = (s / spokeCount) * Math.PI * 2;
        const x1 = Math.cos(angle) * 8;
        const y1 = Math.sin(angle) * 8;
        const x2 = Math.cos(angle) * 38;
        const y2 = Math.sin(angle) * 38;

        const spokePoints = new Float32Array([
            x1, y1, 0,
            x2, y2, 0
        ]);
        spokeGeo.setAttribute('position', new THREE.BufferAttribute(spokePoints, 3));
        const spokeLine = new THREE.Line(
            spokeGeo,
            new THREE.LineBasicMaterial({
                color: 0xC8A96E,
                transparent: true,
                opacity: 0.25
            })
        );
        wheelGroup.add(spokeLine);
    }

    // Outer subtle orbiting ring
    const orbitGeo = new THREE.RingGeometry(52, 52.3, 90);
    const orbitMat = new THREE.MeshBasicMaterial({
        color: 0xC8A96E,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.12
    });
    const orbit = new THREE.Mesh(orbitGeo, orbitMat);
    wheelGroup.add(orbit);

    wheelGroup.rotation.x = 0.45;
    worldGroup.add(wheelGroup);

    // ─── TEXTURE GENERATOR HELPER ─────────────────────────
    function createParticleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.25, 'rgba(230, 200, 140, 0.85)');
        grad.addColorStop(0.6, 'rgba(200, 169, 110, 0.25)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);

        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    // ─── MOUSE INTERACTION & PARALLAX ─────────────────────
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - windowHalfX) * 0.0006;
        mouseY = (e.clientY - windowHalfY) * 0.0006;
    });

    // Touch support for mobile devices
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouseX = (e.touches[0].clientX - windowHalfX) * 0.0006;
            mouseY = (e.touches[0].clientY - windowHalfY) * 0.0006;
        }
    }, { passive: true });

    // ─── SCROLL INFLUENCE ─────────────────────────────────
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    }, { passive: true });

    // ─── ANIMATION LOOP ───────────────────────────────────
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Smooth mouse lerp
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        // Base continuous rotation
        worldGroup.rotation.y = elapsedTime * 0.08 + targetX * 1.5;
        worldGroup.rotation.x = THREE.MathUtils.lerp(worldGroup.rotation.x, targetY * 1.2, 0.05);

        // Independent wheel rotation (like an olive mill turning)
        wheelGroup.rotation.z = -elapsedTime * 0.12;

        // Camera position adapts to scroll
        const scrollFactor = Math.min(scrollY / window.innerHeight, 1.5);
        camera.position.z = 120 + scrollFactor * 40;
        camera.position.y = -scrollFactor * 25;

        // Floating particle oscillation
        const posAttr = particles.geometry.attributes.position;
        const arr = posAttr.array;
        for (let i = 0; i < particleCount; i++) {
            const idx = i * 3 + 1;
            arr[idx] += Math.sin(elapsedTime * 0.9 + i) * 0.02;
        }
        posAttr.needsUpdate = true;

        renderer.render(scene, camera);
    }
    animate();

    // ─── RESIZE HANDLER ───────────────────────────────────
    window.addEventListener('resize', onWindowResize);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
})();
