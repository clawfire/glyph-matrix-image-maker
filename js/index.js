const canvas = document.getElementById("glyph-matrix");
const ctx = canvas.getContext("2d");

// camera variables
let stream = null;
let intervalId = null;

let cameraCanvas = document.createElement("canvas");
let cameraVideo = document.createElement("video");
cameraCanvas.style.display = "none";
cameraVideo.style.display = "none";

const usableGlyphMatrixPixels = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// see https://github.com/Nothing-Developer-Programme/GlyphMatrix-Developer-Kit#glyphmatrixframe
class GlyphMatrix {
  #defaultBrightnessPixels = [];
  #pixels = [];
  static glyphMatrixSize = 25; // 25x25 pixels
  static contrastDisabled = true;

  constructor() {
    this.contrast = 0; // default contrast value

    for (let y = 0; y < GlyphMatrix.glyphMatrixSize; y++) {
      let pixelsRow = [];

      for (let x = 0; x < GlyphMatrix.glyphMatrixSize; x++) {
        pixelsRow.push(usableGlyphMatrixPixels[y][x] === 1 ? 55 : null); // 55 is the default brightness for a pixel otherwise you can't see it on a black background
      }

      this.#pixels.push(pixelsRow);
    }

    this.#copyToDefaultBrightnessPixels();
    this.updateContrast(this.contrast);
    this.render();
  }

  #brightnessToColor(brightness) {
    const clamped = Math.max(0, Math.min(255, brightness));
    return `rgb(${clamped}, ${clamped}, ${clamped})`;
  }

  #copyToDefaultBrightnessPixels() {
    this.#defaultBrightnessPixels = this.#pixels.map((row) => row.slice());
  }

  render() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < this.#pixels.length; y++) {
      for (let x = 0; x < this.#pixels[y].length; x++) {
        const pixel = this.#pixels[y][x];
        if (pixel !== null) {
          ctx.fillStyle = this.#brightnessToColor(pixel);
          ctx.fillRect(x * 13.32, y * 13.32, 10, 10);
        }
      }
    }

    // contrast
    document.querySelector(".controls-range").disabled =
      GlyphMatrix.contrastDisabled;
  }

  updateBrightness(x, y, brightness) {
    if (
      x < 0 ||
      x >= GlyphMatrix.glyphMatrixSize ||
      y < 0 ||
      y >= GlyphMatrix.glyphMatrixSize
    ) {
      throw new Error("Coordinates out of bounds");
    }
    if (this.#pixels[y][x] != null) {
      this.#pixels[y][x] = brightness;
    } else {
      throw new Error("Coordinates out of bounds");
    }
  }

  // constrast value: 0-100
  updateContrast(contrast) {
    if (contrast < 0 || contrast > 100) {
      throw new Error("Contrast must be between 0 and 100");
    }

    // gets converted to a value between 0 and 1
    let contrastFactor = contrast / 100;

    this.contrast = contrast;

    for (let y = 0; y < GlyphMatrix.glyphMatrixSize; y++) {
      for (let x = 0; x < GlyphMatrix.glyphMatrixSize; x++) {
        if (this.#defaultBrightnessPixels[y][x] != null) {
          let brightness = this.#defaultBrightnessPixels[y][x];

          if (brightness > 128) {
            brightness += 128 * contrastFactor;
          } else {
            brightness -= 128 * contrastFactor;
          }

          if (brightness < 0) {
            brightness = 0;
          } else if (brightness > 255) {
            brightness = 255;
          }

          this.#pixels[y][x] = brightness;
        }
      }
    }

    this.render();
  }

  setPixelArray(pixels) {
    for (let y = 0; y < GlyphMatrix.glyphMatrixSize; y++) {
      for (let x = 0; x < GlyphMatrix.glyphMatrixSize; x++) {
        try {
          this.updateBrightness(x, y, pixels[y][x]);
        } catch (error) {}
      }
    }

    this.#copyToDefaultBrightnessPixels();
    this.updateContrast(this.contrast);
    GlyphMatrix.contrastDisabled = false;
    this.render();
  }
}

async function getMonochromeArrayFromImageURL(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = GlyphMatrix.glyphMatrixSize;
      canvas.height = GlyphMatrix.glyphMatrixSize;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        img,
        0,
        0,
        GlyphMatrix.glyphMatrixSize,
        GlyphMatrix.glyphMatrixSize
      );

      const imageData = ctx.getImageData(
        0,
        0,
        GlyphMatrix.glyphMatrixSize,
        GlyphMatrix.glyphMatrixSize
      ).data;
      const result = [];

      for (let y = 0; y < GlyphMatrix.glyphMatrixSize; y++) {
        const row = [];
        for (let x = 0; x < GlyphMatrix.glyphMatrixSize; x++) {
          const i = (y * GlyphMatrix.glyphMatrixSize + x) * 4; // 4: RGBA
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];

          const gray = Math.round((r + g + b) / 3); // Average to grayscale
          row.push(gray);
        }
        result.push(row);
      }

      resolve(result);
    };

    img.onerror = () => reject(new Error("Failed to load image from URL"));
  });
}

let matrix = new GlyphMatrix();

function handleContrastChange(event) {
  const contrastValue = event.target.value;
  document.getElementById("contrast-value").textContent = `${contrastValue}%`;

  // Update the canvas rendering based on the contrast value
  matrix.updateContrast(Number(contrastValue));
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      getMonochromeArrayFromImageURL(e.target.result)
        .then((pixels) => {
          matrix.setPixelArray(pixels);
        })
        .catch((error) => {
          console.error("Error processing uploaded image:", error);
        });
    };
    reader.readAsDataURL(file);
  }

  event.target.value = ""; // Reset the input value to allow re-uploading the same file
}

function downloadImage() {
  const link = document.createElement("a");
  link.download = "glyph_matrix_image_maker.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

async function handleCamera() {
  document.body.appendChild(cameraCanvas);
  document.body.appendChild(cameraVideo);

  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    cameraVideo.srcObject = stream;

    // Trigger autoplay
    await cameraVideo.play();

    // Lower the resolution by scaling down the canvas
    const scale = 0.1; // 10% of original size
    cameraCanvas.width = cameraVideo.videoWidth * scale;
    cameraCanvas.height = cameraVideo.videoHeight * scale;

    intervalId = setInterval(() => {
      const context = cameraCanvas.getContext("2d");
      context.drawImage(
        cameraVideo,
        0,
        0,
        cameraCanvas.width,
        cameraCanvas.height
      );

      const imageDataURL = cameraCanvas.toDataURL("image/jpeg");

      getMonochromeArrayFromImageURL(imageDataURL)
        .then((pixels) => {
          matrix.setPixelArray(pixels);
        })
        .catch((error) => {
          console.error("Error processing camera image:", error);
        });
    }, 1); // set to 1ms so the browser can decide how fast it can handle the updates
  } catch (err) {
    console.error("Error when opening camera", err);
  }
}

async function init() {
  // Set up the contrast input event listener
  const contrastInput = document.querySelector(".controls-range");
  contrastInput.addEventListener("input", handleContrastChange);

  // buttons
  const resetButton = document.getElementById("reset");
  resetButton.addEventListener("click", () => {
    matrix = new GlyphMatrix();
    document.querySelector(".controls-range").value = 0;
    document.getElementById("contrast-value").textContent = "0%";
  });

  const uploadButton = document.getElementById("upload");
  uploadButton.addEventListener("click", () => {
    const imageInput = document.getElementById("imageInput");
    imageInput.click();

    imageInput.addEventListener("change", handleImageUpload);
  });

  const cameraButton = document.getElementById("camera");
  cameraButton.addEventListener("click", async () => {
    handleCamera();
    toggleCameraMode(false);
  });

  const downloadButton = document.getElementById("download");
  downloadButton.addEventListener("click", () => {
    downloadImage();
  });

  const takePictureButton = document.getElementById("take-picture");
  takePictureButton.addEventListener("click", () => {
    toggleCameraMode(true);
  });

  const privacyButton = document.getElementById("privacy");
  privacyButton.addEventListener("click", () => {
    document.getElementById("privacy-overlay").classList.remove("hidden");
  });

  const privacyCloseButton = document.getElementById("privacy-close");
  privacyCloseButton.addEventListener("click", () => {
    document.getElementById("privacy-overlay").classList.add("hidden");
  });

  const toggleCameraMode = function (pictureTaken) {
    const redSquare = document.getElementById("red-square");

    if (pictureTaken) {
      stream = null;
      clearInterval(intervalId);
      cameraVideo.srcObject = null;
      document.body.removeChild(cameraCanvas);
      document.body.removeChild(cameraVideo);

      resetButton.classList.remove("hidden");
      uploadButton.classList.remove("hidden");
      cameraButton.classList.remove("hidden");
      takePictureButton.classList.add("hidden");
      downloadButton.classList.remove("hidden");
      redSquare.classList.add("hidden");
    } else {
      console.log(resetButton);

      resetButton.classList.add("hidden");
      uploadButton.classList.add("hidden");
      cameraButton.classList.add("hidden");
      takePictureButton.classList.remove("hidden");
      downloadButton.classList.add("hidden");
      redSquare.classList.remove("hidden");
    }
  };

  // create the pixel grid as background on the webpage
  const pixels = document.getElementById("pixels");
  for (let i = 0; i <= 100; i++) {
    const pixel = document.createElement("div");
    pixel.className = "pixel";
    pixels.appendChild(pixel);
  }
}

window.onload = init;
