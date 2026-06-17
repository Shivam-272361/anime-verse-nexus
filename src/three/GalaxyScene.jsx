import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getAnimeColor } from '../api/anilistApi.js';

export default function GalaxyScene({ animeList = [], onSelect }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || animeList.length === 0) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050816, 0.02);
    const camera = new THREE.PerspectiveCamera(62, mount.clientWidth / mount.clientHeight, 0.1, 200);
    camera.position.set(0, 10, 24);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const galaxy = new THREE.Group();
    scene.add(galaxy);

    // Shared geometries for performance
    const sphereGeo = new THREE.SphereGeometry(1, 32, 32);

    const maxPop = Math.max(...animeList.map((a) => a.popularity || 1), 1);

    const planetMeshes = animeList.map((anime, index) => {
      const total = animeList.length;
      const angle = (index / total) * Math.PI * 2;
      const layer = Math.floor(index / 12);
      const radius = 5 + layer * 2.5 + (index % 3) * 0.8;
      const colorHex = getAnimeColor(anime);
      const color = new THREE.Color(colorHex);
      const popRatio = (anime.popularity || 0) / maxPop;
      const size = 0.3 + popRatio * 0.7;

      const mesh = new THREE.Mesh(
        sphereGeo,
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.42,
          metalness: 0.18,
          emissive: color,
          emissiveIntensity: 0.18,
        }),
      );
      mesh.scale.setScalar(size);
      mesh.position.set(
        Math.cos(angle) * radius,
        Math.sin(index * 0.7) * 1.2,
        Math.sin(angle) * radius,
      );
      mesh.userData = anime;
      galaxy.add(mesh);
      return mesh;
    });

    // Orbit rings
    const orbitGeo = new THREE.TorusGeometry(1, 0.006, 8, 180);
    const orbitMat = new THREE.MeshBasicMaterial({ color: 0x41d7ff, transparent: true, opacity: 0.1 });
    const ringRadii = new Set();
    animeList.forEach((_, index) => {
      const layer = Math.floor(index / 12);
      const r = 5 + layer * 2.5;
      if (!ringRadii.has(r)) {
        ringRadii.add(r);
        const orbit = new THREE.Mesh(orbitGeo, orbitMat);
        orbit.scale.setScalar(r);
        orbit.rotation.x = Math.PI / 2;
        galaxy.add(orbit);
      }
    });

    // Particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 3000;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < positions.length; i += 3) {
      const r = 2 + Math.random() * 45;
      const a = Math.random() * Math.PI * 2;
      positions[i] = Math.cos(a) * r;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = Math.sin(a) * r;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    scene.add(
      new THREE.Points(
        particleGeometry,
        new THREE.PointsMaterial({ color: 0x9b5cff, size: 0.035, transparent: true, opacity: 0.72 }),
      ),
    );

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const light = new THREE.PointLight(0x41d7ff, 12, 50);
    light.position.set(0, 12, 12);
    scene.add(light);
    const pinkLight = new THREE.PointLight(0xff4fd8, 6, 40);
    pinkLight.position.set(-10, -5, -10);
    scene.add(pinkLight);

    let targetZoom = camera.position.z;
    const onWheel = (event) => {
      targetZoom = THREE.MathUtils.clamp(targetZoom + event.deltaY * 0.012, 7, 45);
    };
    const onPointerMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    const onClick = () => {
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(planetMeshes)[0];
      if (hit) onSelect(hit.object.userData);
    };

    renderer.domElement.addEventListener('wheel', onWheel);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onClick);

    let frame;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      galaxy.rotation.y += 0.0012;
      planetMeshes.forEach((planet, index) => {
        planet.rotation.y += 0.008 + index * 0.0002;
        planet.position.y += Math.sin(Date.now() * 0.0008 + index) * 0.0012;
      });
      camera.position.z += (targetZoom - camera.position.z) * 0.06;
      camera.position.x = Math.sin(Date.now() * 0.00015) * 3;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    const resize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('click', onClick);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      sphereGeo.dispose();
      orbitGeo.dispose();
      orbitMat.dispose();
    };
  }, [animeList, onSelect]);

  return <div ref={mountRef} className="absolute inset-0" />;
}
