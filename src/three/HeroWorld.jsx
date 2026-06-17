import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroWorld() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.8, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.6, 5),
      new THREE.MeshStandardMaterial({ color: 0x2dd4ff, roughness: 0.25, metalness: 0.35, emissive: 0x0b5fff, emissiveIntensity: 0.28 }),
    );
    group.add(core);

    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xff4fd8, transparent: true, opacity: 0.55, side: THREE.DoubleSide });
    for (let i = 0; i < 3; i += 1) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.15 + i * 0.32, 0.012, 12, 180), ringMaterial.clone());
      ring.rotation.x = Math.PI / 2.6 + i * 0.34;
      ring.rotation.y = i * 0.45;
      group.add(ring);
    }

    const stars = new THREE.BufferGeometry();
    const positions = new Float32Array(1200 * 3);
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }
    stars.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    scene.add(new THREE.Points(stars, new THREE.PointsMaterial({ color: 0xffffff, size: 0.018, transparent: true, opacity: 0.75 })));

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const blue = new THREE.PointLight(0x41d7ff, 6, 10);
    blue.position.set(-3, 2, 5);
    scene.add(blue);
    const pink = new THREE.PointLight(0xff4fd8, 5, 10);
    pink.position.set(3, -1, 4);
    scene.add(pink);

    let frame;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      group.rotation.y += 0.006;
      group.rotation.x = Math.sin(Date.now() * 0.0005) * 0.12;
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
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
