const moment = require('moment');

const generateMessage = (from, text) => {
  return {
    from,
    content: text,
    createdAt: moment().format('hh:mm a'),
  };
};

const generateLocationMessage = (from, lat, lng) => {
  return {
    from,
    lat,
    lng,
    createdAt: moment().format('hh:mm a'),
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage,
};
