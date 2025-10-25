import bigger from "./assets/bigger.png";

function start(image: HTMLImageElement) {
  const auxCanvas = document.createElement("canvas");
  auxCanvas.width = image.width;
  auxCanvas.height = image.height;

  const auxContext = auxCanvas.getContext("2d");
  if (!auxContext) throw "Cannot get aux 2d context!";

  auxContext.fillStyle = "#000000";
  auxContext.fillRect(0, 0, auxCanvas.width, auxCanvas.height);

  auxContext.drawImage(image, 0, 0, auxCanvas.width, auxCanvas.height);
  const imageData = auxContext.getImageData(0, 0, auxCanvas.width, auxCanvas.height).data;

  auxContext.clearRect(0, 0, auxCanvas.width, auxCanvas.height);

  const xParticleOrigins: number[] = [];
  const yParticleOrigins: number[] = [];
  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i + 0];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    const index = i / 4;
    const x = index % auxCanvas.width;
    const y = Math.floor(index / auxCanvas.width);

    if (r + g + b > 80) {
      xParticleOrigins.push(x);
      yParticleOrigins.push(y);
    }
  }

  const particleCount = xParticleOrigins.length;

  const particleOrigins: number[] = [];
  for (let i = 0; i < particleCount; i++) {
    particleOrigins.push(xParticleOrigins[i] / image.width);
    particleOrigins.push(1 - yParticleOrigins[i] / image.height);
  }

  const output = particleOrigins.map((v) => Number(v.toFixed(4)));
  console.log("export const particleOrigins = new Float32Array(" + JSON.stringify(output) + ");");
}

export function main() {
  const image = new Image();
  image.src = bigger;
  image.onload = () => {
    start(image);
  };
}
