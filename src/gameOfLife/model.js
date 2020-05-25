import {
  GAME_SIZE,
  CELL_STATES,
  DEFAULT_ALIVE_PAIRS,
  RENDER_INTERVAL
} from "./constants";

export class Model {
  constructor(callBack) {
    this.width = GAME_SIZE;
    this.height = GAME_SIZE;
    this.raf = null;
    this.callBack = callBack;
  }

  init() {
    this.state = Array.from(new Array(this.height), () =>
      Array.from(new Array(this.width), () => CELL_STATES.NONE)
    );
    DEFAULT_ALIVE_PAIRS.forEach(([x, y]) => {
      this.state[y][x] = CELL_STATES.ALIVE;
    });
    this.updated();
  }

  run(date = new Date().getTime()) {
    this.raf = requestAnimationFrame(() => {
      const currentTime = new Date().getTime();
      if (currentTime - date > RENDER_INTERVAL) {
        let tempo = Array.from(new Array(this.height), () =>
          Array.from(new Array(this.width), () => CELL_STATES.NONE)
        );
        for (let i = 0; i < this.width; i++) {
          for (let j = 0; j < this.width; j++) {
            tempo[j][i] = this.state[j][i];
          }
        }
        for (let i = 0; i < this.width; i++) {
          for (let j = 0; j < this.width; j++) {
            const nbAlive = this.aliveNeighbours(i, j);
            if (
              (nbAlive < 2 || nbAlive > 3) &&
              this.state[j][i] === CELL_STATES.ALIVE
            )
              tempo[j][i] = CELL_STATES.DEAD;
            else if (nbAlive === 3) tempo[j][i] = CELL_STATES.ALIVE;
          }
        }

        this.state = tempo;

        this.updated();
        this.run(currentTime);
      } else {
        this.run(date);
      }
    });
  }

  setAlive(x, y) {
    this.state[y][x] = CELL_STATES.ALIVE;
  }

  setDead(x, y) {
    this.state[y][x] = CELL_STATES.DEAD;
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = null;
    this.updated();
  }

  reset() {
    this.stop();
    this.init();
    this.updated();
  }

  isCellAlive(x, y) {
    return x >= 0 &&
      y >= 0 &&
      y < this.height &&
      x < this.height &&
      this.state[y][x] === CELL_STATES.ALIVE
      ? 1
      : 0;
  }

  aliveNeighbours(x, y) {
    let number = 0;
    for (let i = x - 1; i < x + 2; i++) {
      number += this.isCellAlive(i, y - 1);
    }
    for (let i = x - 1; i < x + 2; i = i + 2) {
      number += this.isCellAlive(i, y);
    }
    for (let i = x - 1; i < x + 2; i++) {
      number += this.isCellAlive(i, y + 1);
    }
    return number;
  }

  updated() {
    this.callBack(this);
  }
}
