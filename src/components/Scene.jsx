import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';

const Scene = () => {
    const mountRef = useRef(null);
    const screenMeshRef = useRef(null);

    useEffect(() => {
        // Scene Setup
        const scene = new THREE.Scene();
        scene.background = null;

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 7;
        camera.position.y = 1.5;

        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);

        // V6: Ultra High Resolution ASCII
        const effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: false, alpha: true });
        effect.setSize(window.innerWidth, window.innerHeight);
        effect.domElement.style.color = '#00ff00';
        effect.domElement.style.backgroundColor = 'transparent';

        // Decrease font size to 4px for Ultra High Resolution
        effect.domElement.style.fontSize = '4px';
        effect.domElement.style.lineHeight = '4px';

        if (mountRef.current) {
            mountRef.current.appendChild(effect.domElement);
        }

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 2, 0);
        pointLight.position.set(5, 10, 5);
        scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0xffffff, 1, 0);
        pointLight2.position.set(-5, -5, 5);
        scene.add(pointLight2);

        // Computer
        const computerGroup = new THREE.Group();
        computerGroup.position.x = 3.5;
        scene.add(computerGroup);

        const materialValues = { color: 0xffffff, flatShading: true };
        const material = new THREE.MeshStandardMaterial(materialValues);
        const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, flatShading: true });

        // Monitor
        const monitorGeo = new THREE.BoxGeometry(3, 2.2, 0.5);
        const monitor = new THREE.Mesh(monitorGeo, material);
        monitor.position.y = 2;
        computerGroup.add(monitor);

        // Screen
        const screenCanvas = document.createElement('canvas');
        screenCanvas.width = 1024; // Increased canvas res more for V6
        screenCanvas.height = 1024;
        const screenCtx = screenCanvas.getContext('2d');
        const screenTexture = new THREE.CanvasTexture(screenCanvas);

        // DVD/Tux Logo State
        let dvdX = 100;
        let dvdY = 100;
        let dvdDX = 4; // Faster movement on larger canvas
        let dvdDY = 4;
        const dvdWidth = 200; // Scaled up
        const dvdHeight = 240;

        const screenGeo = new THREE.PlaneGeometry(2.6, 1.8);
        const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
        const screenMesh = new THREE.Mesh(screenGeo, screenMat);
        screenMesh.position.set(0, 0, 0.26);
        monitor.add(screenMesh);
        screenMeshRef.current = screenMesh;

        // Stand Neck
        const neckGeo = new THREE.BoxGeometry(0.4, 1, 0.4);
        const neck = new THREE.Mesh(neckGeo, darkMaterial);
        neck.position.y = 0.5;
        computerGroup.add(neck);

        // Stand Base
        const baseGeo = new THREE.BoxGeometry(2, 0.2, 1.5);
        const base = new THREE.Mesh(baseGeo, darkMaterial);
        base.position.y = 0;
        computerGroup.add(base);

        // Keyboard
        const keyboardGeo = new THREE.BoxGeometry(3, 0.2, 1.2);
        const keyboard = new THREE.Mesh(keyboardGeo, material);
        keyboard.position.set(0, 0, 2);
        keyboard.rotation.x = 0.1;
        computerGroup.add(keyboard);

        // Helper to draw detailed Tux (High Contrast for ASCII)
        const drawTux = (ctx, x, y, w, h) => {
            const cx = x + w / 2;
            const cy = y + h / 2;

            // 1. Body Outline (Bright for ASCII)
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            // Head
            ctx.arc(cx, y + h * 0.25, w * 0.35, 0, Math.PI * 2);
            // Body base
            ctx.ellipse(cx, y + h * 0.6, w * 0.4, h * 0.35, 0, 0, Math.PI * 2);
            ctx.fill();

            // Body Main (Grey)
            ctx.fillStyle = '#888888';
            ctx.beginPath();
            ctx.ellipse(cx, y + h * 0.55, w * 0.45, h * 0.4, 0, 0, Math.PI * 2);
            ctx.arc(cx, y + h * 0.25, w * 0.3, 0, Math.PI * 2);
            ctx.fill();

            // Flippers (Grey)
            ctx.beginPath();
            ctx.ellipse(cx - w * 0.45, y + h * 0.5, w * 0.15, h * 0.3, 0.5, 0, Math.PI * 2);
            ctx.ellipse(cx + w * 0.45, y + h * 0.5, w * 0.15, h * 0.3, -0.5, 0, Math.PI * 2);
            ctx.fill();

            // Belly (White -> High density)
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(cx, y + h * 0.6, w * 0.25, h * 0.3, 0, 0, Math.PI * 2);
            ctx.fill();

            // Eyes (Black -> Empty)
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(cx - w * 0.1, y + h * 0.2, w * 0.08, 0, Math.PI * 2); // Left eye bg
            ctx.arc(cx + w * 0.1, y + h * 0.2, w * 0.08, 0, Math.PI * 2); // Right eye bg
            ctx.fill();

            // Pupils (White -> Chars)
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(cx - w * 0.1, y + h * 0.2, w * 0.02, 0, Math.PI * 2);
            ctx.arc(cx + w * 0.1, y + h * 0.2, w * 0.02, 0, Math.PI * 2);
            ctx.fill();

            // Beak (Light Grey)
            ctx.fillStyle = '#cccccc';
            ctx.beginPath();
            ctx.ellipse(cx, y + h * 0.3, w * 0.15, h * 0.05, 0, 0, Math.PI * 2);
            ctx.fill();

            // Feet (Light Grey)
            ctx.fillStyle = '#cccccc';
            ctx.beginPath();
            ctx.ellipse(cx - w * 0.2, y + h * 0.9, w * 0.15, h * 0.05, 0, 0, Math.PI * 2);
            ctx.ellipse(cx + w * 0.2, y + h * 0.9, w * 0.15, h * 0.05, 0, 0, Math.PI * 2);
            ctx.fill();
        };

        // Animation Loop
        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            computerGroup.rotation.y += 0.015;

            // Update Screen
            screenCtx.fillStyle = '#000';
            screenCtx.fillRect(0, 0, screenCanvas.width, screenCanvas.height);

            // Draw Tux
            drawTux(screenCtx, dvdX, dvdY, dvdWidth, dvdHeight);

            dvdX += dvdDX;
            dvdY += dvdDY;

            if (dvdX + dvdWidth > screenCanvas.width || dvdX < 0) dvdDX = -dvdDX;
            if (dvdY + dvdHeight > screenCanvas.height || dvdY < 0) dvdDY = -dvdDY;

            screenTexture.needsUpdate = true;

            effect.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            effect.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            if (mountRef.current && effect.domElement) {
                mountRef.current.removeChild(effect.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }} />;
};

export default Scene;
