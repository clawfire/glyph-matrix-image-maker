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

// Crop functionality variables
let cropImageData = null;
let cropScale = 1;
let cropBaseScale = 1; // The scale needed to fit image in container
let cropOffsetX = 0;
let cropOffsetY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let originalImageWidth = 0;
let originalImageHeight = 0;

function showCropInterface(imageDataUrl) {
  cropImageData = imageDataUrl;
  const cropImage = document.getElementById('crop-image');
  
  // Load image to get dimensions and calculate proper fit
  const tempImg = new Image();
  tempImg.onload = function() {
    originalImageWidth = tempImg.width;
    originalImageHeight = tempImg.height;
    
    // Calculate the scale needed to fit the image in the container
    const containerSize = 300;
    const imageAspect = originalImageWidth / originalImageHeight;
    
    if (imageAspect > 1) {
      // Wide image - fit to container width
      cropBaseScale = containerSize / originalImageWidth;
    } else {
      // Tall or square image - fit to container height
      cropBaseScale = containerSize / originalImageHeight;
    }
    
    // Ensure the image covers at least the crop circle
    const circleSize = 280;
    const minScaleForCircle = circleSize / Math.min(originalImageWidth, originalImageHeight);
    cropBaseScale = Math.max(cropBaseScale, minScaleForCircle);
    
    // Set initial crop settings - 100% zoom should show the image fitted
    cropScale = cropBaseScale;
    cropOffsetX = 0;
    cropOffsetY = 0;
    document.getElementById('crop-zoom').value = 100;
    document.getElementById('crop-zoom-value').textContent = '100%';
    
    // Set the image source and show overlay
    cropImage.src = imageDataUrl;
    document.getElementById('crop-overlay').classList.remove('hidden');
    
    // Update image transform
    updateCropImageTransform();
  };
  
  tempImg.src = imageDataUrl;
}

function updateCropImageTransform() {
  const cropImage = document.getElementById('crop-image');
  cropImage.style.transform = `translate(calc(-50% + ${cropOffsetX}px), calc(-50% + ${cropOffsetY}px)) scale(${cropScale})`;
}

function handleCropZoom(event) {
  const zoomValue = event.target.value;
  // Zoom relative to the base fitted scale
  // 100% = fitted scale, 200% = 2x fitted scale, etc.
  cropScale = cropBaseScale * (zoomValue / 100);
  document.getElementById('crop-zoom-value').textContent = `${zoomValue}%`;
  updateCropImageTransform();
}

function handleCropMouseDown(event) {
  isDragging = true;
  dragStartX = event.clientX - cropOffsetX;
  dragStartY = event.clientY - cropOffsetY;
  event.preventDefault();
}

function handleCropMouseMove(event) {
  if (!isDragging) return;
  
  cropOffsetX = event.clientX - dragStartX;
  cropOffsetY = event.clientY - dragStartY;
  updateCropImageTransform();
  event.preventDefault();
}

function handleCropMouseUp(event) {
  isDragging = false;
}

function handleCropTouchStart(event) {
  if (event.touches.length === 1) {
    const touch = event.touches[0];
    isDragging = true;
    dragStartX = touch.clientX - cropOffsetX;
    dragStartY = touch.clientY - cropOffsetY;
    event.preventDefault();
  }
}

function handleCropTouchMove(event) {
  if (!isDragging || event.touches.length !== 1) return;
  
  const touch = event.touches[0];
  cropOffsetX = touch.clientX - dragStartX;
  cropOffsetY = touch.clientY - dragStartY;
  updateCropImageTransform();
  event.preventDefault();
}

function handleCropTouchEnd(event) {
  isDragging = false;
}

function getCroppedImageData() {
  return new Promise((resolve, reject) => {
    const cropImage = document.getElementById('crop-image');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Create a new image element to ensure it's loaded
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = cropImageData;
    
    img.onload = () => {
      try {
        // Calculate the crop area
        const containerSize = 300; // Size of crop container
        const circleSize = 280; // Size of crop circle
        
        // Calculate how the image is displayed
        const displayScale = cropScale;
        const displayWidth = originalImageWidth * displayScale;
        const displayHeight = originalImageHeight * displayScale;
        
        // Calculate the center of the crop circle in image coordinates
        const containerCenterX = containerSize / 2;
        const containerCenterY = containerSize / 2;
        
        // Account for image offset
        const imageCenterX = containerCenterX - cropOffsetX;
        const imageCenterY = containerCenterY - cropOffsetY;
        
        // Convert to original image coordinates
        const imageX = imageCenterX / displayScale;
        const imageY = imageCenterY / displayScale;
        
        // Calculate crop size in original image coordinates
        const cropSizeInImage = circleSize / displayScale;
        
        // Calculate source rectangle
        let sourceX = imageX - cropSizeInImage / 2;
        let sourceY = imageY - cropSizeInImage / 2;
        let sourceWidth = cropSizeInImage;
        let sourceHeight = cropSizeInImage;
        
        // Bounds checking - ensure we don't go outside the image
        if (sourceX < 0) {
          sourceWidth += sourceX;
          sourceX = 0;
        }
        if (sourceY < 0) {
          sourceHeight += sourceY;
          sourceY = 0;
        }
        if (sourceX + sourceWidth > originalImageWidth) {
          sourceWidth = originalImageWidth - sourceX;
        }
        if (sourceY + sourceHeight > originalImageHeight) {
          sourceHeight = originalImageHeight - sourceY;
        }
        
        // Ensure we have valid dimensions
        if (sourceWidth <= 0 || sourceHeight <= 0) {
          throw new Error('Invalid crop area - outside image bounds');
        }
        
        // Set canvas to square dimensions
        const outputSize = 400;
        canvas.width = outputSize;
        canvas.height = outputSize;
        
        // Calculate destination rectangle to maintain aspect ratio
        const cropAspect = sourceWidth / sourceHeight;
        let destX = 0, destY = 0, destWidth = outputSize, destHeight = outputSize;
        
        if (cropAspect > 1) {
          // Wide crop - letterbox vertically
          destHeight = outputSize / cropAspect;
          destY = (outputSize - destHeight) / 2;
        } else if (cropAspect < 1) {
          // Tall crop - letterbox horizontally
          destWidth = outputSize * cropAspect;
          destX = (outputSize - destWidth) / 2;
        }
        
        // Fill canvas with black background
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, outputSize, outputSize);
        
        // Draw the cropped portion
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          destX, destY, destWidth, destHeight
        );
        
        resolve(canvas.toDataURL('image/png'));
      } catch (error) {
        reject(new Error('Failed to crop image: ' + error.message));
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image for cropping'));
  });
}

function handleCropConfirm() {
  getCroppedImageData()
    .then(croppedDataUrl => {
      // Hide crop interface
      document.getElementById('crop-overlay').classList.add('hidden');
      
      // Process the cropped image using existing pipeline
      return getMonochromeArrayFromImageURL(croppedDataUrl);
    })
    .then(pixels => {
      matrix.setPixelArray(pixels);
    })
    .catch(error => {
      console.error('Error processing cropped image:', error);
      // Hide crop interface on error
      document.getElementById('crop-overlay').classList.add('hidden');
    });
}

function handleCropCancel() {
  document.getElementById('crop-overlay').classList.add('hidden');
}

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
      // Instead of directly processing, show crop interface first
      showCropInterface(e.target.result);
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

  // Crop interface event listeners
  const cropZoomSlider = document.getElementById("crop-zoom");
  cropZoomSlider.addEventListener("input", handleCropZoom);

  const cropImageContainer = document.querySelector(".crop-image-container");
  
  // Mouse events for desktop
  cropImageContainer.addEventListener("mousedown", handleCropMouseDown);
  document.addEventListener("mousemove", handleCropMouseMove);
  document.addEventListener("mouseup", handleCropMouseUp);

  // Touch events for mobile
  cropImageContainer.addEventListener("touchstart", handleCropTouchStart);
  document.addEventListener("touchmove", handleCropTouchMove, { passive: false });
  document.addEventListener("touchend", handleCropTouchEnd);

  const cropConfirmButton = document.getElementById("crop-confirm");
  cropConfirmButton.addEventListener("click", handleCropConfirm);

  const cropCancelButton = document.getElementById("crop-cancel");
  cropCancelButton.addEventListener("click", handleCropCancel);

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
