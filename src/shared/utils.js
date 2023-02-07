const _get = require('lodash/get');

const errorCatch = (error, res) => {
  if (error && error.message) {
    console.error(error.response ? error.response : error);
    return res.status(error.response ? error.response.status : 500)
      .json({
        message:
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : error.message,
        tips: {
          url: _get(error, 'config.url', ''),
          method: _get(error, 'config.method', ''),
        },
      });
  }
  console.error(error);
  return res.status(500).json({
    message: 'Server Error',
  });
};

module.exports = {
  errorCatch,
};
