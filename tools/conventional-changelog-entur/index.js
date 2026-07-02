'use strict';

const createAngularPreset = require('conventional-changelog-angular');

async function createPreset() {
  const preset = await createAngularPreset();

  const originalWhatBump = preset.recommendedBumpOpts.whatBump;

  preset.recommendedBumpOpts.whatBump = function whatBump(commits) {
    const result = originalWhatBump(commits);

    const hasBangBreaking = commits.some(commit =>
      /^.+!$/.test(commit.header?.split(':')[0]),
    );

    if (hasBangBreaking && result.level !== 0) {
      const bangCount = commits.filter(commit =>
        /^.+!$/.test(commit.header?.split(':')[0]),
      ).length;

      return {
        level: 0,
        reason: `There are ${bangCount} BREAKING CHANGES (! suffix) and ${result.reason}`,
      };
    }

    return result;
  };

  return preset;
}

module.exports = createPreset;
