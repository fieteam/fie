'use strict';

const TOOLKIT_COMMAND_HOOK = '__toolkitCommand__';

module.exports = {
  classify(tasks) {
    let match = false;
    const before = [];
    const after = [];

    tasks.forEach((item) => {
      if (item.command && item.command === TOOLKIT_COMMAND_HOOK) {
        match = true;
      } else if (match) {
        after.push(item);
      } else {
        before.push(item);
      }
    });

    return {
      before,
      after
    };
  }
};
