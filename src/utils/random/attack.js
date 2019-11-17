class Attack {
  constructor({
    delay,
    stopOnErrorLog,
    maxOperation,
    mouseEvents,
    includeMethod
  }) {
    this.status = "running";
    this.isUnderAttack = true;
    this.fps = [];
    this.error = [];
    this.attackNumber = 0;
    this.horde = null;
    this.seed = 0;
    Object.assign(this, {
      delay,
      stopOnErrorLog,
      maxOperation,
      mouseEvents,
      includeMethod
    });
  }

  setHorde(horde) {
    this.horde = horde;
    this.seed = horde.randomizer().seed;
  }

  getWatchers() {
    return {
      fpsWatcher: this.fpsWatcher.bind(this),
      onGremlin: this.onAttack.bind(this)
    };
  }

  onAttack() {
    this.attackNumber++;
  }

  fpsWatcher(fps) {
    this.fps.push(fps);
  }

  onError(error) {
    this.error.push(error);
    if (error.type !== "exception" && !this.stopOnErrorLog) {
      return;
    }
    this.stop();
  }

  stop() {
    if (this.horde === null) {
      return;
    }
    this.status = "stopped";
    this.horde.stop();
    this.horde = null;
  }

  onEnded() {
    this.isUnderAttack = false;
    if (this.status !== "running") {
      return;
    }
    this.status = "completed";
  }
}

export { Attack };
