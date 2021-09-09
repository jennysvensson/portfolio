import { CanvasSpace, Create } from "pts";

const space = new CanvasSpace("#pts").setup({
  bgcolor: "#1c292e",
  resize: true,
  retina: true,
});
const form = space.getForm();

let pts = [];
let ratio = {};
let fraction;

const getRatio = (area) => {
  return {
    count: Math.floor((area[0] * area[1]) / 20000),
    length: area[1] * 0.6,
    width: (area[1] * 0.4 * area[0]) / area[1],
  };
};

const getValue = (max, fraction) => {
  return max - max * fraction;
};

const getColor = (fraction) => {
  const red = getValue(252, fraction);
  const green = getValue(145, fraction);
  const blue = getValue(5, fraction);
  const opacity = getValue(1, fraction);
  return `rgba(${red}, ${green}, ${blue},${opacity})`;
};

space.add({
  start: function (time, ftime) {
    ratio = getRatio(space.innerBound.size);
    // console.log(ratio.count, ratio.length, ratio.width);
    pts = Create.distributeRandom(space.innerBound, ratio.count);
  },
  animate: function (time, ftime) {
    pts.sort(
      (a, b) =>
        a.$subtract(space.pointer).magnitudeSq() -
        b.$subtract(space.pointer).magnitudeSq()
    );
    pts.forEach((p, i) => {
      fraction = i / pts.length;
      form.fillOnly(getColor(0)).point(p, 0.5, "square");
      form.fillOnly("#fff").point(p, getValue(0.7, fraction), "square");
      form
        .strokeOnly(getColor(fraction), 1)
        .line([p, p.$add(ratio.width, -ratio.length)]);
      p.rotate2D(Math.PI / (100000 * fraction), space.innerBound.center);
    });
  },
  action: function (type, x, y, event) {
    if (type == "click") {
      pts[pts.length - 1] = space.pointer;
    }
  },
  resize: function (size, event) {
    ratio = getRatio(space.innerBound.size);
    pts = Create.distributeRandom(space.innerBound, ratio.count);
  },
});

space.bindMouse().bindTouch().play();
