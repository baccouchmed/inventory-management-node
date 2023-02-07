const jwt = require('jsonwebtoken');

const warpedJwtSign = async (user) => new Promise((resolve, reject) => {
  const expiresIn = 3600 * 5;

  const {
    id,
    email,
    type,
    companyId,
    siteId,
    groupsId,
    thirdPartyId,
    defaultLink,
  } = user;
  return jwt.sign(
    {
      id,
      email,
      type,
      companyId,
      siteId,
      groupsId,
      thirdPartyId,
      defaultLink,
    },
    `${process.env.PRIVATE_KEY}`, {
      expiresIn,
    },
    (error, token) => {
      if (error) {
        return reject(error);
      }

      return resolve(token);
    },
  );
});
module.exports = { warpedJwtSign };
