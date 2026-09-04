import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Cpu, Zap, ChevronRight, EyeOff } from 'lucide-react';

interface StartupAnimation3DProps {
  onComplete: () => void;
  startupAnimationEnabled: boolean;
  onToggleStartupAnimation: (enabled: boolean) => void;
}

export const StartupAnimation3D: React.FC<StartupAnimation3DProps> = ({
  onComplete,
  startupAnimationEnabled,
  onToggleStartupAnimation,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [phaseText, setPhaseText] = useState('Initializing DropAI Core...');
  const [phaseProgress, setPhaseProgress] = useState(15);
  const [systemVerified, setSystemVerified] = useState(false);

  useEffect(() => {
    // Check user preference or reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!startupAnimationEnabled || prefersReducedMotion) {
      onComplete();
      return;
    }

    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Three.js Scene Setup
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0b, 0.04);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Dynamic Lighting (Amber, Warm Gold, & Subtle Dark Slate accents)
    const ambientLight = new THREE.AmbientLight(0x111113, 2.5);
    scene.add(ambientLight);

    const amberPointLight = new THREE.PointLight(0xd97706, 8, 50);
    amberPointLight.position.set(-5, 4, 5);
    scene.add(amberPointLight);

    const warmPointLight = new THREE.PointLight(0xf59e0b, 7, 50);
    warmPointLight.position.set(5, -4, 4);
    scene.add(warmPointLight);

    const centerLight = new THREE.PointLight(0xd97706, 3, 20);
    centerLight.position.set(0, 0, 2);
    scene.add(centerLight);

    // Core Geometry: DropAI Central Node
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner Icosahedron (AI Core)
    const icosaGeometry = new THREE.IcosahedronGeometry(1.4, 1);
    const icosaMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
    });
    const icosaMesh = new THREE.Mesh(icosaGeometry, icosaMaterial);
    coreGroup.add(icosaMesh);

    // Outer Orbit Ring
    const torusGeometry = new THREE.TorusGeometry(2.4, 0.03, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({ color: 0xd97706, transparent: true, opacity: 0.7 });
    const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
    torusMesh.rotation.x = Math.PI / 3;
    coreGroup.add(torusMesh);

    const torus2Geometry = new THREE.TorusGeometry(2.8, 0.02, 16, 100);
    const torus2Material = new THREE.MeshBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.4 });
    const torus2Mesh = new THREE.Mesh(torus2Geometry, torus2Material);
    torus2Mesh.rotation.y = Math.PI / 4;
    coreGroup.add(torus2Mesh);

    // Subtle ambient particle starfield
    const particlesCount = 450;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 22;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.035,
      color: 0xd97706,
      transparent: true,
      opacity: 0.65,
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth rotations
      coreGroup.rotation.y = elapsedTime * 0.45;
      coreGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2;
      torusMesh.rotation.z = elapsedTime * 0.6;
      torus2Mesh.rotation.x = elapsedTime * -0.5;
      particlesMesh.rotation.y = elapsedTime * 0.05;

      // Pulse core scale
      const scale = 1 + Math.sin(elapsedTime * 2.5) * 0.06;
      icosaMesh.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Timed Startup Progression (Total ~2.8 seconds)
    const t1 = setTimeout(() => {
      setPhaseText('Activating Multi-Store Commerce Graph...');
      setPhaseProgress(45);
    }, 700);

    const t2 = setTimeout(() => {
      setPhaseText('Verifying CJ & Supplier Routing Adapters...');
      setPhaseProgress(75);
    }, 1500);

    const t3 = setTimeout(() => {
      setPhaseText('Security Verification Complete');
      setPhaseProgress(100);
      setSystemVerified(true);
    }, 2200);

    const tEnd = setTimeout(() => {
      onComplete();
    }, 2900);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tEnd);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [startupAnimationEnabled, onComplete]);

  return (
    <div id="startup-3d-container" className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#0A0A0B] text-[#E2E8F0] select-none overflow-hidden">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Top Header Controls */}
      <div className="relative z-10 w-full flex items-center justify-between px-8 pt-8">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#D97706] flex items-center justify-center shadow-lg shadow-[#D97706]/10">
            <Cpu className="w-5 h-5 text-black font-black" />
          </div>
          <span className="font-mono text-sm tracking-wider font-semibold text-[#94A3B8]">
            DROP<span className="text-[#D97706]">AI</span> OS v2.4
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="toggle-startup-btn"
            onClick={() => onToggleStartupAnimation(!startupAnimationEnabled)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#111113] border border-[#1F1F21] text-[#94A3B8] hover:text-[#E2E8F0] transition-colors cursor-pointer"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Startup 3D: {startupAnimationEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            id="skip-startup-btn"
            onClick={onComplete}
            className="flex items-center space-x-1 px-4 py-1.5 rounded-lg text-xs font-medium bg-[#151517] text-[#D97706] border border-[#2D2D30] hover:bg-[#1F1F21] transition-all cursor-pointer"
          >
            <span>Skip</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center Branding Overlay */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-4"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#111113] border border-[#2D2D30] text-[#D97706] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
            <span>AUTONOMOUS COMMERCE OPERATING SYSTEM</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-white drop-shadow-md">
            DROP<span className="text-[#D97706]">AI</span>
          </h1>

          <p className="max-w-md text-sm text-[#94A3B8] font-normal leading-relaxed">
            Enterprise orchestration for multi-channel dropshipping, supplier failover, dynamic margins, and autonomous order fulfillment.
          </p>
        </motion.div>
      </div>

      {/* Bottom Progress Bar & Telemetry */}
      <div className="relative z-10 w-full max-w-md px-6 pb-10 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2 text-[#E2E8F0]">
            {systemVerified ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <Zap className="w-4 h-4 text-[#D97706] animate-pulse" />
            )}
            <span>{phaseText}</span>
          </div>
          <span className="text-[#94A3B8]">{phaseProgress}%</span>
        </div>

        {/* Progress Track */}
        <div className="h-1.5 w-full bg-[#111113] rounded-full overflow-hidden border border-[#1F1F21]">
          <motion.div
            className="h-full bg-[#D97706]"
            initial={{ width: '10%' }}
            animate={{ width: `${phaseProgress}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] text-[#64748B] font-mono pt-1">
          <span>AES-256 SESSION PROTECTED</span>
          <span>HARDWARE ACCELERATED WEBGL</span>
        </div>
      </div>
    </div>
  );
};
