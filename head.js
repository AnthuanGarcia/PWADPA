//import * as THREE from './three/three.min';
//import * as THREE from 'three/build/three';

const fragment = `uniform vec2 u_resolution;
uniform float u_time;

#define PI  3.14159265
#define D2R 0.0174532925

#define PAL6 vec3(0.530, 0.787, 0.485), vec3(0.420, 0.089, 0.758), vec3(0.133, 0.924, 0.008), vec3(4.820, 4.553, 2.869)

#define range(a, l, s) for(float i = a; i < l; i += s)

mat2 rot2D(float angle) {

	float c = cos(angle);
	float s = sin(angle);

	return mat2(
		c, -s,
		s, c
	);

}

vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {

    return a + b*cos( 2.0*PI*(c*t + d) );

}

void main() {

	vec2 uv = (gl_FragCoord.xy / u_resolution) - 0.5;
	uv.x *= u_resolution.x / u_resolution.y;

	uv *= 0.5;
	uv *= rot2D(u_time*0.05);
	
	uv.x -= 1.5;

	vec2 circle = vec2(cos(u_time), sin(u_time));

	range(1.0, 6.0, 1.0) {

		uv.x += 0.4/i * sin(10.0*i*uv.y + u_time + circle.x);
        uv.y += 0.1/i * cos(7.0*i*uv.x  + u_time+ circle.y);

		uv *= rot2D(u_time*0.005);

	}

    vec3 col = palette(cos(uv.x + sin(uv.y) + 0.5*u_time) * 0.5 + 0.5, PAL6);

	gl_FragColor = vec4(col, 1);

}

`;


function init() {

    const canva = document.getElementById("canvas");
    const renderer = new THREE.WebGLRenderer({canvas: canva});
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

    const scene = new THREE.Scene();

    //scene0.background = new THREE.Color(0xFF00FF);

    const uniformsShader = {
        u_time: { value:0 },
        u_resolution: { value: new THREE.Vector2() },
    };

    const matShader = new THREE.ShaderMaterial({
        uniforms: uniformsShader,
        fragmentShader: fragment,
    });

    const plane0 = new THREE.PlaneGeometry(2, 2);
    const meshPlane0 = new THREE.Mesh(plane0, matShader);

    scene.add(meshPlane0);

    resizeRendererToDisplaySize = (renderer) => {

        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;

        if (needResize) {
          renderer.setSize(width, height, false);
        }

        return needResize;

    }

    /*setSize(canva, camera, renderer);

    window.addEventListener('resize', () => {
        setSize(canva, camera, renderer);
    });*/

    let t = 0.0;

    renderer.setAnimationLoop(() => {

        t += 0.01;

        const canvas = renderer.domElement;

        if (resizeRendererToDisplaySize(renderer)) {

            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            
        }

        uniformsShader["u_resolution"]["value"].set(canvas.width, canvas.height);
        uniformsShader["u_time"]["value"] = t;

        renderer.render(scene, camera);

    });

}

window.onload = init;