import wcagContrast from "wcag-contrast";
import { calcAPCA } from "apca-w3";
import Color from "color";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("govuk-frontend-*");

  eleventyConfig.addNunjucksGlobal(
    "makeWCAGContrastSafe",
    function (c1, c2, target = 4.5) {
      function iterateColor(c1, c2, target = 4.5, i = 1) {
        const contrastRatio = wcagContrast.hex(c2, c1);
        console.log(i, { c1, c2, target, contrastRatio });

        if (contrastRatio >= target) {
          return c1;
        }

        c1 = Color(c1);
        c1 = c1.lightness(c1.lightness() - 1);
        return iterateColor(c1.hex(), c2, target, i + 1);
      }

      const newColour = iterateColor(c1, c2, target);
      const contrastRatio = wcagContrast.hex(newColour, c2);
      return {
        colour: newColour,
        contrastRatio,
        score: wcagContrast.score(contrastRatio),
        original: {
          c1,
          c2,
        },
      };
    }
  );

  eleventyConfig.addNunjucksGlobal(
    "makeAPCAContrastSafe",
    function (c1, c2, target = 75) {
      function iterateColor(c1, c2, target = 75, i = 1) {
        const apcaScore = calcAPCA(c1, c2);
        console.log({ apcaScore });
        console.log(i, { c1, c2, target, apcaScore });

        if (Math.abs(apcaScore) >= Math.abs(target)) {
          return c1;
        }

        c1 = Color(c1);
        c1 = c1.lightness(c1.lightness() - 1);
        return iterateColor(c1.hex(), c2, target, i + 1);
      }

      const newColour = iterateColor(c1, c2, target);
      const contrastRatio = wcagContrast.hex(newColour, c2);
      return {
        colour: newColour,
        contrastRatio,
        score: calcAPCA(newColour, c2).toFixed(1),
        original: {
          c1,
          c2,
        },
      };
    }
  );

  eleventyConfig.addNunjucksGlobal("blackOrWhite", function (c1) {
    return Color(c1).isLight() ? "#000000" : "#ffffff";
  });

  return {
    pathPrefix: "/hmg-department-colours/",
  };
}
