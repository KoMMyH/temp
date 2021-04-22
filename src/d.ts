declare module "*.jpeg" {
  const value: string;
  export default value;
}

interface Window {
  m4: {
    perspective: (
      fieldOfViewRadians: number,
      aspect: number,
      zNear: number,
      zFar: number
    ) => Float32Array;
    translate: (
      matrix: Float32Array,
      first: number,
      second: number,
      third: number
    ) => Float32Array;
    xRotate: (matrix: Float32Array, first: number) => Float32Array;
    yRotate: (matrix: Float32Array, first: number) => Float32Array;
    zRotate: (matrix: Float32Array, first: number) => Float32Array;
    scale: (
      matrix: Float32Array,
      first: number,
      second: number,
      third: number
    ) => Float32Array;
  };
}
