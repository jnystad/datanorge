const https = require("https");

module.exports = {
  get,
  post,
};

/**
 * Make a GET request.
 *
 * @param {*} url Destination URL
 * @returns
 */
function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const body = [];
        res.on("data", (chunk) => body.push(chunk));
        res.on("end", () => {
          const resString = Buffer.concat(body).toString();

          if (res.statusCode < 200 || res.statusCode > 299) {
            console.log(resString);
            return reject(new Error(`HTTP status code ${res.statusCode}`));
          }
          resolve(resString);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

/**
 * Make a POST request.
 *
 * @param {*} url Destination URL
 * @param {*} dataString Data string
 * @param {*} contentType Content type of data
 * @param {*} timeout Timeout in ms
 * @returns
 */
function post(url, dataString, contentType, timeout = 60000) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": contentType,
      "Content-Length": dataString.length,
    },
    timeout,
  };

  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      const body = [];
      res.on("data", (chunk) => body.push(chunk));
      res.on("end", () => {
        const resString = Buffer.concat(body).toString();

        if (res.statusCode < 200 || res.statusCode > 299) {
          console.log(resString);
          return reject(new Error(`HTTP status code ${res.statusCode}`));
        }
        resolve(resString);
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    req.write(dataString);
    req.end();
  });
}
