import { loadTexture, boxVertices as vertices, degToRad } from "../utils/index";
import BoxTexture from "../assets/box.jpeg";

export const mainProcess = (canvasSelector: string): void => {
  const canvas = document.querySelector(canvasSelector) as HTMLCanvasElement;
  if (!canvas) {
    console.error("ERROR::CANVAS_NOT_FOUND");
    return;
  }
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  const gl = canvas.getContext("webgl");
  if (!gl) {
    console.error("ERROR::CANNOT_GET_WEBGL_CONTEXT");
    return;
  }
  // Set the viewport data
  gl.viewport(0, 0, canvas?.clientWidth ?? 0, canvas?.clientHeight ?? 0);

  // Compile vertex shader
  const vertexShader = `
    attribute vec3 position;
    attribute vec2 textureCoords;
    
    uniform mat4 matrix;
    
    varying vec2 texCoords;
    
    
    void main() {
        gl_Position = matrix * vec4(position, 1.0);
        texCoords = textureCoords;
    }
    `;
  const vertShader = gl.createShader(gl.VERTEX_SHADER);
  if (!vertShader) {
    console.error("ERROR::VERTEX_SHADER_CREATION");
    return;
  }
  gl.shaderSource(vertShader, vertexShader);
  gl.compileShader(vertShader);

  // Compile fragment shader
  const fragmentShader = `
    precision mediump float;
    
    uniform sampler2D textureSample;
    
    varying vec2 texCoords;
    
    void main() {
        gl_FragColor = texture2D(textureSample, texCoords);
    }
    `;
  const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  if (!fragShader) {
    console.error("ERROR::FRAGMENT_SHADER_CREATION");
    return;
  }
  gl.shaderSource(fragShader, fragmentShader);
  gl.compileShader(fragShader);

  // Compile shader program
  const program = gl.createProgram();
  if (!program) {
    console.error("ERROR::SHADER_PROGRAM_CREATION");
    return;
  }
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  // Delete unused shaders
  gl.deleteShader(vertShader);
  gl.deleteShader(fragShader);
  // User program
  gl.useProgram(program);

  // Load the texture
  const texture = loadTexture(gl, BoxTexture);

  // Create buffer
  const vertexBuffer = gl.createBuffer();
  // Bind buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Pass the vertices data to the buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  // Set attributes in vertex program
  const posLoc = gl.getAttribLocation(program, "position");
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 5 * 4, 0);
  gl.enableVertexAttribArray(posLoc);
  const texLoc = gl.getAttribLocation(program, "textureCoords");
  gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 5 * 4, 3 * 4);
  gl.enableVertexAttribArray(texLoc);

  // Timing functions
  let oldTime = new Date().getTime();
  let deltaTiming = 0;

  // Variables for translation
  let fieldOfViewRadians = degToRad(60);
  const translation = [0, 0, -25];
  const rotation = [degToRad(190), degToRad(40), degToRad(320)];
  const scale = [10, 10, 10];
  fieldOfViewRadians = degToRad(60);
  const rotationSpeed = 1.2;

  // Enbale depth test
  gl.enable(gl.DEPTH_TEST);

  const drawScene = () => {
    // Cleaning of the buffer
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    // Calculation for the matrices
    rotation[1] += rotationSpeed / 60.0;
    const aspect = canvas ? canvas.clientWidth/canvas.clientHeight : 1;
    const zNear = 1;
    const zFar = 200;
    let matrix = window.m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
    matrix = window.m4.translate(
      matrix,
      translation[0],
      translation[1],
      translation[2]
    );
    matrix = window.m4.xRotate(matrix, rotation[0]);
    matrix = window.m4.yRotate(matrix, rotation[1]);
    matrix = window.m4.zRotate(matrix, rotation[2]);
    matrix = window.m4.scale(matrix, scale[0], scale[1], scale[2]);
    const matrixLocation = gl.getUniformLocation(program, "matrix");
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Setting the texture data
    const texUniform = gl.getUniformLocation(program, "textureSample");
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(texUniform, 0);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    // Reset timings
    const time = new Date().getTime();
    deltaTiming = time - oldTime;
    oldTime = time;

    requestAnimationFrame(drawScene);
  };

  drawScene();
};
