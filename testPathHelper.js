'use strict';

// Helps switch between src and instrument code for istanbul coverage
module.exports = (function () {
  return process.env.APP_DIR_FOR_CODE_COVERAGE || '../';
})();
