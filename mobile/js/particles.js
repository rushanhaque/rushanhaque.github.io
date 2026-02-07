/* Particles? No. Fluid Ambient Fog (Three.js Shader) */

window.initParticles = () => {
    console.log("Initializing Ambient Background...");
    const container = document.getElementById('canvas-container');
    if (!container) return;

    /* 
     * We want a subtle, shifting "Fog" or "Aurora" effect.
     * Classical, calm, not chaotic.
     */

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); // 2D Fullscreen quad
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // FORCE Styling to prevent canvas from taking up flow layout space
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = '-1'; // Hardcode Z-index here too

    container.appendChild(renderer.domElement);

    // Shader Uniforms
    const uniforms = {
        u_time: { value: 0.0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_color: { value: new THREE.Color('#00ff41') }, // Default Green
        u_starIntensity: { value: 0.0 } // Start at 0 on first page
    };

    // Vertex Shader (Standard Quad)
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `;

    // Fragment Shader (Soft Noise/Gradient)
    const fragmentShader = `
        uniform float u_time;
        uniform float u_starIntensity;
        uniform vec2 u_resolution;
        uniform vec3 u_color;
        varying vec2 vUv;

        // Simplex Noise Function (Simplified)
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        void main() {
            vec2 st = gl_FragCoord.xy/u_resolution.xy;
            float time = u_time * 0.05;
            
            vec2 wavySt = st;
            wavySt.x += sin(st.y * 2.0 + time) * 0.015;
            wavySt.y += cos(st.x * 2.5 + time * 0.6) * 0.015;

            float noise1 = snoise(vec2(wavySt.x * 1.2 + time, wavySt.y * 1.2 - time));
            float noise2 = snoise(vec2(wavySt.x * 1.8 - time, wavySt.y * 1.8 + time));
            
            vec3 color1 = vec3(0.01, 0.01, 0.02); 
            vec3 color2 = vec3(0.02, 0.02, 0.06); 
            
            float mixVal = smoothstep(-1.0, 1.0, noise1 + noise2);
            vec3 finalColor = mix(color1, color2, mixVal);
            
            // --- Stars ---
            float stars = snoise(wavySt * 45.0); 
            stars = pow(max(0.0, stars), 22.0);
            
            float twinkle = sin(u_time * 1.2 + st.x * 40.0 + st.y * 30.0) * 0.5 + 0.5;
            stars *= (0.6 + 0.4 * twinkle);
            
            finalColor += stars * 0.7 * u_starIntensity; // Multiply by intensity uniform

            // --- Dynamic Tinting ---
            vec3 accentColor = u_color;
            float glow = snoise(vec2(st.x * 0.5 + time * 0.5, st.y * 0.5));
            glow = smoothstep(0.0, 1.0, glow);
            finalColor = mix(finalColor, accentColor, 0.15 * glow); 

            float grain = fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453);
            finalColor += grain * 0.012;

            gl_FragColor = vec4(finalColor, 1.0); 
        }
    `;

    const planeGeometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: false,
        depthWrite: false
    });

    const mesh = new THREE.Mesh(planeGeometry, material);
    scene.add(mesh);

    // Expose update functions
    window.updateParticlesColor = (colorString) => {
        const newColor = new THREE.Color(colorString);
        uniforms.u_color.value.lerp(newColor, 0.05);
    };

    window.updateStarIntensity = (val) => {
        uniforms.u_starIntensity.value = val;
    };

    // Animation
    const clock = new THREE.Clock();
    const animate = () => {
        uniforms.u_time.value = clock.getElapsedTime();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    // Resize
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    });
};
