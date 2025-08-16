class TizenScreenshotManager extends ScreenshotManager {
  /**
   * Override: Tizen only supports full screen captures
   */
  async _captureRectangle(x, y, width, height) {
    return new Promise((resolve, reject) => {
      try {
        b2bapis.b2bcontrol.captureScreen(
          (fullPath) => {
            console.log("📸 Tizen screenshot saved at:", fullPath);

            // Tizen returns fullPath (string). You decide how to handle:
            // Option A: Just return fullPath (simplest, native Tizen style)
            resolve(fullPath);

            // Option B: Convert to Blob (to stay API-consistent with base)
            /*
            fetch("file://" + fullPath)
              .then(res => res.blob())
              .then(blob => resolve(blob))
              .catch(() => resolve(new Blob([fullPath], { type: "text/plain" })));
            */
          },
          (error) => {
            console.error("❌ Tizen capture failed:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Override: Ignore section type — only full screen is supported
   */
  async _captureByType(screenshotId, config) {
    if (config.type !== "full") {
      throw new Error("Tizen only supports full screen screenshots");
    }
    return super._captureByType(screenshotId, { ...config });
  }
}

// Example usage
const tizenManager = new TizenScreenshotManager({
  onSuccess: (result, id, config) => {
    console.log("✅ Screenshot success:", id, result, config);
  },
  onError: (err, id, config) => {
    console.error("❌ Screenshot error:", id, err, config);
  }
});

// One-time manual capture
tizenManager.captureOnce({ type: "full" });
