import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const _targetRot = new THREE.Vector2();
const _dummy = new THREE.Object3D();

export function HeroNeuralScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [fallbackMode, setFallbackMode] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setFallbackMode(true);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setFallbackMode(true);
      return;
    }

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 460;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 7.6);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmrem.dispose();

    // Studio 3-point emerald/crimson/warm lighting
    const hemiLight = new THREE.HemisphereLight(0x34d399, 0x092a20, 1.0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x10b981, 1.9);
    rimLight.position.set(-5, -3, -4);
    scene.add(rimLight);

    const accentLight = new THREE.PointLight(0xd92b2b, 1.4, 14);
    accentLight.position.set(0, 2.8, 2.5);
    scene.add(accentLight);

    // Composite 3D AI Neural Core (multi-part THREE.Group)
    const aiCoreGroup = new THREE.Group();
    scene.add(aiCoreGroup);

    // 1. Inner glowing synaptic core (Bangladesh green)
    const innerGeo = new THREE.IcosahedronGeometry(1.12, 1);
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0x006a4e,
      emissive: 0x064e3b,
      emissiveIntensity: 0.85,
      metalness: 0.32,
      roughness: 0.22,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    aiCoreGroup.add(innerCore);

    // 2. Wireframe neural lattice shell (Mint emerald)
    const latticeGeo = new THREE.IcosahedronGeometry(1.48, 2);
    const latticeMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      wireframe: true,
      transparent: true,
      opacity: 0.34,
    });
    const latticeShell = new THREE.Mesh(latticeGeo, latticeMat);
    aiCoreGroup.add(latticeShell);

    // 3. Outer optical faceted glass prism shell
    const glassGeo = new THREE.OctahedronGeometry(1.95, 0);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xd1fae5,
      metalness: 0.05,
      roughness: 0.08,
      transmission: isSoftwareGl ? 0 : 0.88,
      transparent: true,
      opacity: isSoftwareGl ? 0.24 : 1,
      ior: 1.52,
      thickness: 0.8,
      clearcoat: 1.0,
      depthWrite: false,
    });
    const glassShell = new THREE.Mesh(glassGeo, glassMat);
    glassShell.renderOrder = 2;
    aiCoreGroup.add(glassShell);

    // 4. Three tilted metallic orbital rings (Emerald + Crimson center ring matching logo)
    const ringGeo = new THREE.TorusGeometry(2.35, 0.032, 16, 96);
    const ringMatA = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.85,
      roughness: 0.18,
      emissive: 0x065f46,
      emissiveIntensity: 0.38,
    });
    const ringMatB = new THREE.MeshStandardMaterial({
      color: 0xd92b2b,
      metalness: 0.78,
      roughness: 0.22,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.35,
    });

    const ring1 = new THREE.Mesh(ringGeo, ringMatA);
    ring1.rotation.set(Math.PI / 3, 0.3, 0);
    aiCoreGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMatB);
    ring2.scale.setScalar(1.12);
    ring2.rotation.set(-Math.PI / 3.4, -0.4, 0.2);
    aiCoreGroup.add(ring2);

    const ring3 = new THREE.Mesh(ringGeo, ringMatA);
    ring3.scale.setScalar(0.82);
    ring3.rotation.set(Math.PI / 2, 0.65, 0);
    aiCoreGroup.add(ring3);

    // 5. InstancedMesh synaptic nodes orbiting in a spherical shell
    const nodeCount = 42;
    const nodeGeo = new THREE.SphereGeometry(0.068, 12, 12);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x10b981,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.4,
    });
    const instancedNodes = new THREE.InstancedMesh(nodeGeo, nodeMat, nodeCount);
    instancedNodes.frustumCulled = false;
    const nodePositions: THREE.Vector3[] = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < nodeCount; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / nodeCount);
      const radius = 2.05 + (i % 3) * 0.28;
      const pos = new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
      );
      nodePositions.push(pos);
      _dummy.position.copy(pos);
      const s = 0.75 + (i % 4) * 0.2;
      _dummy.scale.setScalar(s);
      _dummy.updateMatrix();
      instancedNodes.setMatrixAt(i, _dummy.matrix);
    }
    instancedNodes.instanceMatrix.needsUpdate = true;
    instancedNodes.computeBoundingSphere();
    aiCoreGroup.add(instancedNodes);

    // 6. Neural connection lines between nearby nodes
    const linePositions: number[] = [];
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 1.65) {
          linePositions.push(
            nodePositions[i].x,
            nodePositions[i].y,
            nodePositions[i].z,
            nodePositions[j].x,
            nodePositions[j].y,
            nodePositions[j].z,
          );
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x6ee7b7,
      transparent: true,
      opacity: 0.28,
    });
    const neuralLinks = new THREE.LineSegments(lineGeo, lineMat);
    aiCoreGroup.add(neuralLinks);

    // 7. Background ambient particles
    const particleCount = 120;
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 9.5;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 7.5;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1.5;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointerRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerRef.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 520;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      _targetRot.set(pointerRef.current.y * 0.25, pointerRef.current.x * 0.35);

      aiCoreGroup.rotation.x = THREE.MathUtils.damp(aiCoreGroup.rotation.x, _targetRot.x, 4, dt);
      aiCoreGroup.rotation.y = THREE.MathUtils.damp(
        aiCoreGroup.rotation.y,
        _targetRot.y + elapsed * 0.16,
        3.5,
        dt,
      );
      aiCoreGroup.position.y = Math.sin(elapsed * 1.1) * 0.12;

      innerCore.rotation.y -= dt * 0.35;
      latticeShell.rotation.x += dt * 0.18;
      glassShell.rotation.z -= dt * 0.14;

      ring1.rotation.z += dt * 0.22;
      ring2.rotation.x -= dt * 0.18;
      ring3.rotation.y += dt * 0.28;

      particles.rotation.y = elapsed * 0.04;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = window.requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      innerGeo.dispose();
      innerMat.dispose();
      latticeGeo.dispose();
      latticeMat.dispose();
      glassGeo.dispose();
      glassMat.dispose();
      ringGeo.dispose();
      ringMatA.dispose();
      ringMatB.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      envTexture.dispose();
      renderer.dispose();
    };
  }, []);

  if (fallbackMode) {
    return (
      <div className="relative w-full h-[360px] md:h-[440px] flex items-center justify-center rounded-3xl bg-gradient-to-br from-[#051F17] via-[#092A20] to-[#0E4A38] overflow-hidden border border-white/10 shadow-2xl">
        <div className="w-56 h-56 rounded-full border border-emerald-300/30 flex items-center justify-center">
          <div className="w-40 h-40 rounded-full border border-[#D92B2B]/50 flex items-center justify-center">
            <div className="w-24 h-24 rounded-2xl rotate-45 bg-gradient-to-tr from-[#006A4E] to-[#34D399] shadow-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      aria-label="Interactive 3D AI Neural Network Visualization"
      className="w-full h-[360px] sm:h-[420px] lg:h-[470px] cursor-grab active:cursor-grabbing"
    />
  );
}
