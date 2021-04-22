import {loadTexture} from "../utils";
import BoxTexture from '../assets/box.jpeg';

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
    console.error("ERROR::CONTEXT_NOT_CREATED");
    return;
  }
  gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

  const vertices: Array<number> = [
    -0.5, -0.5, 0, 0, 0,
    0, 0.5, 0, 0, 1,
    0.5, -0.5, 0, 1, 1
  ];

  const vertexShaderStr = `
  attribute vec3 pos;
  attribute vec2 m_texCoords;
  
  varying vec2 texCoords;
  
  void main() {
    gl_Position = vec4(pos, 1.0);
    texCoords = m_texCoords;
  }
  `;
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  if (!vertexShader) return;
  gl.shaderSource(vertexShader, vertexShaderStr);
  gl.compileShader(vertexShader);
  console.log(gl.getShaderInfoLog(vertexShader));

  const fragmentShaderStr = `
  precision mediump float;
  
  uniform sampler2D textureSample;
  
  varying vec2 texCoords;
  
  void main() {
    gl_FragColor = texture2D(textureSample, texCoords);
  }
  `;
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  if (!fragmentShader) {
    console.log('error');
    return;
  }
  gl.shaderSource(fragmentShader, fragmentShaderStr);
  gl.compileShader(fragmentShader);
  console.log(gl.getShaderInfoLog(fragmentShader));

  const program = gl.createProgram();
  if (!program) {
    console.log('error program');
    return;
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  gl.useProgram(program);
  const result = gl.getProgramInfoLog(program);
  console.log('result: ', result)

  const texture = loadTexture(gl, BoxTexture);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  const posLoc = gl.getAttribLocation(program, 'pos');
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 5 * 4, 0);
  gl.enableVertexAttribArray(posLoc);
  const texCoordsLoc = gl.getAttribLocation(program, 'm_texCoords');
  gl.vertexAttribPointer(texCoordsLoc, 2, gl.FLOAT, false, 5 * 4, 3 * 4);
  gl.enableVertexAttribArray(texCoordsLoc);

  let time = new Date().getTime() / 1000;

  const drawScene = () => {
    const texUniform = gl.getUniformLocation(program, 'textureSample');
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(texUniform, 0);

    gl.clearColor(0.8, 0.8, 0.8, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    time = new Date().getTime() / 1000;

    requestAnimationFrame(drawScene);
  }

  drawScene();
}

// export const mainProcess1 = (canvasSelector: string): void => {
//   const canvas = document.querySelector(canvasSelector) as HTMLCanvasElement;
//   if (!canvas) {
//     console.error("ERROR::CANVAS_NOT_FOUND");
//     return;
//   }
//   canvas.width = canvas.clientWidth;
//   canvas.height = canvas.clientHeight;
//   const gl = canvas.getContext("webgl");
//   if (!gl) {
//     console.error("ERROR::CONTEXT_NOT_CREATED");
//     return;
//   }
//   gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
//
//   const vertices: Array<number> = [
//     -0.5, -0.5, 0, 1, 0, 0,
//     0, 0.5, 0, 0, 1, 0,
//     0.5, -0.5, 0, 0, 0, 1
//   ];
//
//   const vertexShaderStr = `
//   attribute vec3 pos;
//   attribute vec3 col;
//
//   varying vec3 outCol;
//
//   void main() {
//     gl_Position = vec4(pos, 1.0);
//     outCol = col;
//   }
//   `;
//   const vertexShader = gl.createShader(gl.VERTEX_SHADER);
//   if (!vertexShader) return;
//   gl.shaderSource(vertexShader, vertexShaderStr);
//   gl.compileShader(vertexShader);
//   console.log(gl.getShaderInfoLog(vertexShader));
//
//   const fragmentShaderStr = `
//   precision mediump float;
//
//   varying vec3 outCol;
//
//   uniform float green;
//
//   void main() {
//     gl_FragColor = vec4(outCol.r, green, outCol.b, 1);
//   }
//   `;
//   const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
//   if (!fragmentShader) {
//     console.log('error');
//     return;
//   }
//   gl.shaderSource(fragmentShader, fragmentShaderStr);
//   gl.compileShader(fragmentShader);
//   console.log(gl.getShaderInfoLog(fragmentShader));
//
//   const program = gl.createProgram();
//   if (!program) {
//     console.log('error program');
//     return;
//   }
//   gl.attachShader(program, vertexShader);
//   gl.attachShader(program, fragmentShader);
//   gl.linkProgram(program);
//   gl.deleteShader(vertexShader);
//   gl.deleteShader(fragmentShader);
//   gl.useProgram(program);
//   const result = gl.getProgramInfoLog(program);
//
//   const vertexBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
//
//   const posLoc = gl.getAttribLocation(program, 'pos');
//   gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 6 * 4, 0);
//   gl.enableVertexAttribArray(posLoc);
//   const colLoc = gl.getAttribLocation(program, 'col');
//   gl.vertexAttribPointer(colLoc, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
//   gl.enableVertexAttribArray(colLoc);
//
//   let time = new Date().getTime() / 1000;
//
//   const drawScene = () => {
//     const greenVal = Math.sin(time);
//     const greenUniform = gl.getUniformLocation(program, 'green');
//     gl.uniform1f(greenUniform, greenVal);
//
//     gl.clearColor(0.8, 0.8, 0.8, 1);
//     gl.clear(gl.COLOR_BUFFER_BIT);
//
//     gl.drawArrays(gl.TRIANGLES, 0, 3);
//
//     time = new Date().getTime() / 1000;
//
//     requestAnimationFrame(drawScene);
//   }
//
//   drawScene();
// }