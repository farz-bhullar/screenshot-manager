class ScreenshotManager {
  /**
   * @param {Object} options
   * options.screenshotConfigs: Array of screenshot configs to start immediately
   * options.onSuccess: function(blob, screenshotId, config)
   * options.onError: function(error, screenshotId, config)
   */
  constructor({ screenshotConfigs = [], onSuccess, onError }) {
    this.activeScreenshotConfigs = new Map();
    this.onSuccess = onSuccess || ((blob, id, config) => console.log(`Screenshot succeeded: ${id}`, config));
    this.onError = onError || ((error, id, config) => console.error(`Screenshot failed: ${id}`, error, config));

    // Initialize screenshots provided at startup
    screenshotConfigs.forEach(config => this.addOrUpdateScreenshotConfig(config.id, config));
  }

  /**
   * Add or update a screenshot configuration
   */
  addOrUpdateScreenshotConfig(screenshotId, config) {
    const existing = this.activeScreenshotConfigs.get(screenshotId);
    if (existing) clearInterval(existing.timerId);

    const timerId = setInterval(async () => {
      try {
        await this._captureByType(screenshotId, config);
      } catch (error) {
        this.onError(error, screenshotId, config);
      }
    }, config.interval);

    this.activeScreenshotConfigs.set(screenshotId, { ...config, timerId });
  }

  /**
   * Remove a screenshot configuration
   */
  removeScreenshotConfig(screenshotId) {
    const config = this.activeScreenshotConfigs.get(screenshotId);
    if (config) {
      clearInterval(config.timerId);
      this.activeScreenshotConfigs.delete(screenshotId);
    }
  }

  /**
   * Stop all screenshot tasks
   */
  stopAllScreenshots() {
    this.activeScreenshotConfigs.forEach(config => clearInterval(config.timerId));
    this.activeScreenshotConfigs.clear();
  }

  /**
   * Capture manually, one-time
   * config: { type: 'full' | 'section', x?, y?, width?, height? }
   * optional screenshotId for callback tracking
   */
  async captureOnce(config, screenshotId = 'manual') {
    try {
      await this._captureByType(screenshotId, config);
    } catch (error) {
      this.onError(error, screenshotId, config);
    }
  }

  // Internal helper to capture based on type
  async _captureByType(screenshotId, config) {
    let blob;
    if (config.type === 'full') {
      blob = await this._captureRectangle(0, 0, window.innerWidth, window.innerHeight);
    } else if (config.type === 'section') {
      blob = await this._captureRectangle(config.x, config.y, config.width, config.height);
    } else {
      throw new Error(`Unknown screenshot type: ${config.type}`);
    }

    if (!blob) throw new Error('Capture returned null');
    this.onSuccess(blob, screenshotId, config);
  }

  /**
   * Core capture logic (platform can override)
   */
  async _captureRectangle(x, y, width, height) {
    if (window.html2canvas) {
      const canvas = await html2canvas(document.body, { 
        x, y, width, height,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight
      });
      return new Promise(resolve => canvas.toBlob(resolve));
    }
    throw new Error("No capture method defined for this platform");
  }

}