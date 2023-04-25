const wcagContrast = require("wcag-contrast");
const Color = require("color");

module.exports = function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy("govuk-frontend-*");

	function iterateColor(c1, c2, target = 4.5, i = 1) {
		const contrastRatio = wcagContrast.hex(c2, c1);
		console.log(i, {c1, c2, target, contrastRatio})
		
		if (contrastRatio >= target) {
			return c1;
		}
		
		c1 = Color(c1)
		if (c2 === "#000000") {
			c1 = c1.lightness(c1.lightness() + 1);
		} else {
			c1 = c1.lightness(c1.lightness() - 1);
		}
		return iterateColor(c1.hex(), c2, target, i+1);
	}

	eleventyConfig.addNunjucksGlobal(
		"makeContrastSafe",
		function (c1, c2, target = 4.5) {
			const newColour = iterateColor(c1, c2, target);
			const contrastRatio = wcagContrast.hex(newColour, c2);
			return {
				colour: newColour,
				contrastRatio,
				wcagScore: wcagContrast.score(contrastRatio),
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
		pathPrefix: "/hmg-department-colours/"
	};
};
