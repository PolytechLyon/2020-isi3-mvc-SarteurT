import { drawGame } from "./view";

export const controller = model => {
  //model.run();
  document.getElementById("start").onclick = () => model.run();
  document.getElementById("stop").onclick = () => model.stop();
  document.getElementById("reset").onclick = () => model.reset();
};
