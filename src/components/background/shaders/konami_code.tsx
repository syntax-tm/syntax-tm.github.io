export const konamiCodeShaderSource = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;

#define PI 3.14159265359

// ------------------------------------------------------------
// Hash / Noise
// ------------------------------------------------------------

float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float hash31(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.yzx + 33.33);
    return fract((p.x + p.y) * p.z);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    f = f * f * (3.0 - 2.0 * f);

    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));

    return mix(
        mix(a, b, f.x),
        mix(c, d, f.x),
        f.y
    );
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 6; i++) {
        value += noise(p) * amplitude;
        p *= 2.0;
        amplitude *= 0.5;
    }

    return value;
}

// ------------------------------------------------------------
// Rotation
// ------------------------------------------------------------

mat2 rotate(float a) {
    float c = cos(a);
    float s = sin(a);

    return mat2(
        c, -s,
        s,  c
    );
}

// ------------------------------------------------------------
// Lightning
// ------------------------------------------------------------

float lightning(vec2 uv, float seed) {

    float x = uv.x;

    float wave =
        sin(x * 18.0 + seed) * 0.035 +
        sin(x * 43.0 - seed * 1.7) * 0.018 +
        sin(x * 91.0 + seed * 2.3) * 0.008;

    float distanceFromBolt =
        abs(uv.y - wave);

    return smoothstep(
        0.025,
        0.0,
        distanceFromBolt
    );
}

// ------------------------------------------------------------
// Embers
// ------------------------------------------------------------

float embers(vec2 uv) {

    vec2 grid = vec2(28.0, 45.0);

    vec2 id = floor(uv * grid);
    vec2 local = fract(uv * grid) - 0.5;

    float rnd = hash21(id);

    float active = step(0.78, rnd);

    float speed =
        0.15 +
        hash21(id + 17.3) * 0.45;

    local.y +=
        sin(uTime * speed + rnd * 20.0) * 0.18;

    float d = length(local);

    float particle =
        smoothstep(
            0.13,
            0.0,
            d
        );

    // Vertical drift
    particle *=
        0.5 +
        0.5 * sin(
            uTime * speed +
            rnd * 30.0
        );

    return particle * active;
}

// ------------------------------------------------------------
// Energy ring
// ------------------------------------------------------------

float energyRing(vec2 uv) {

    float radius = length(uv);

    float wave =
        sin(
            radius * 32.0 -
            uTime * 3.0 +
            sin(uv.x * 8.0) * 2.0
        );

    float ring =
        smoothstep(
            0.12,
            0.0,
            abs(
                radius -
                (0.38 + wave * 0.008)
            )
        );

    return ring;
}

// ------------------------------------------------------------
// Main
// ------------------------------------------------------------

void main() {

    vec2 uv =
        (gl_FragCoord.xy - 0.5 * uResolution.xy)
        / uResolution.y;

    vec2 originalUV = uv;

    // Slight cinematic perspective distortion
    uv.x *= 1.05;

    // --------------------------------------------------------
    // Background
    // --------------------------------------------------------

    float t = uTime * 0.18;

    vec2 cloudUV =
        uv * 2.2;

    cloudUV *= rotate(
        sin(t * 0.3) * 0.15
    );

    cloudUV += vec2(
        t * 0.25,
        -t * 0.12
    );

    float cloud =
        fbm(cloudUV);

    float cloud2 =
        fbm(
            cloudUV * 1.8 +
            vec2(-t * 0.5, t * 0.3)
        );

    cloud =
        cloud * 0.65 +
        cloud2 * 0.35;

    // --------------------------------------------------------
    // Red atmospheric glow
    // --------------------------------------------------------

    float centerGlow =
        1.0 -
        smoothstep(
            0.0,
            0.85,
            length(uv)
        );

    float redEnergy =
        cloud *
        centerGlow;

    // --------------------------------------------------------
    // Radial pulse
    // --------------------------------------------------------

    float radius =
        length(uv);

    float pulse =
        0.5 +
        0.5 * sin(
            radius * 18.0 -
            uTime * 2.2
        );

    pulse *=
        smoothstep(
            1.1,
            0.1,
            radius
        );

    // --------------------------------------------------------
    // Energy ring
    // --------------------------------------------------------

    float ring =
        energyRing(uv);

    // --------------------------------------------------------
    // Lightning
    // --------------------------------------------------------

    vec2 lightningUV =
        originalUV;

    lightningUV.x +=
        sin(originalUV.y * 4.0 + uTime) * 0.08;

    float bolt =
        lightning(
            lightningUV,
            uTime * 4.0
        );

    bolt *=
        smoothstep(
            1.0,
            0.15,
            abs(lightningUV.x)
        );

    // Intermittent flash
    float flashNoise =
        step(
            0.985,
            hash21(
                vec2(
                    floor(uTime * 6.0),
                    4.2
                )
            )
        );

    bolt *=
        0.25 +
        flashNoise * 2.0;

    // --------------------------------------------------------
    // Embers
    // --------------------------------------------------------

    float ember =
        embers(
            originalUV +
            vec2(
                0.0,
                uTime * 0.05
            )
        );

    // --------------------------------------------------------
    // Color composition
    // --------------------------------------------------------

    vec3 black =
        vec3(
            0.005,
            0.003,
            0.004
        );

    vec3 darkRed =
        vec3(
            0.16,
            0.005,
            0.008
        );

    vec3 crimson =
        vec3(
            0.55,
            0.015,
            0.018
        );

    vec3 bloodRed =
        vec3(
            0.95,
            0.025,
            0.018
        );

    vec3 gold =
        vec3(
            1.0,
            0.45,
            0.08
        );

    vec3 energyWhite =
        vec3(
            1.0,
            0.75,
            0.45
        );

    vec3 color =
        black;

    color +=
        darkRed *
        redEnergy *
        1.8;

    color +=
        crimson *
        pow(redEnergy, 2.0) *
        2.0;

    color +=
        bloodRed *
        pulse *
        redEnergy *
        0.5;

    // Ring
    color +=
        gold *
        ring *
        0.75;

    // Lightning
    color +=
        energyWhite *
        bolt *
        2.0;

    // Embers
    color +=
        gold *
        ember *
        1.5;

    // --------------------------------------------------------
    // Center impact glow
    // --------------------------------------------------------

    float impact =
        exp(
            -length(uv) * 5.0
        );

    impact *=
        0.5 +
        0.5 * sin(
            uTime * 2.0
        );

    color +=
        vec3(
            0.35,
            0.005,
            0.005
        ) *
        impact;

    // --------------------------------------------------------
    // Film grain
    // --------------------------------------------------------

    float grain =
        hash31(
            vec3(
                gl_FragCoord.xy,
                floor(uTime * 60.0)
            )
        );

    color +=
        (grain - 0.5) *
        0.025;

    // --------------------------------------------------------
    // Vignette
    // --------------------------------------------------------

    float vignette =
        smoothstep(
            1.15,
            0.25,
            length(originalUV)
        );

    color *= vignette;

    // --------------------------------------------------------
    // Contrast
    // --------------------------------------------------------

    color =
        pow(
            max(color, 0.0),
            vec3(0.82)
        );

    gl_FragColor =
        vec4(
            color,
            1.0
        );
}
`;