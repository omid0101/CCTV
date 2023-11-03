const crypto = require("crypto");
const dateDiffrence = require("../utils/dateDiffrence");
async function CLicenseVerify(req, res) {
  const key = req.body.key;

  if (!key) return res.status(400).json({ message: "license key missing!" });
  else {
    // Split the key into the derived key and salt
    if (key.split(":").length !== 2)
      return res.status(400).json({ message: "Your License Key is Invalid!" });

    const checkBucketConnectionRes = await fetch(
      "https://www.googleapis.com/storage/v1/b/cloudiot-bucket/o"
    );

    if (checkBucketConnectionRes.status !== 200) {
      return res
        .status(400)
        .json({ message: "Connection To License Storage Failed!" });
    }

    let [derivedKey, salt] = key.split(":");

    const computedKey = crypto
      .pbkdf2Sync(process.env.MY_HASH, salt, 100000, 64, "sha512")
      .toString("hex");

    let isExpire = true;

    if (computedKey === derivedKey) {
      // check if license json file before created in bucket or not
      const checkBucketLicenseFile = await fetch(
        `https://storage.googleapis.com/cloudiot-bucket/licenses/licenses/${key}.json`
      );

      if (checkBucketLicenseFile.status !== 200) {
        // generate file for first validation
        const filePath = `licenses/${key}.json`;
        const genrateLicenseFileRes = await fetch(
          `https://storage.googleapis.com/upload/storage/v1/b/cloudiot-bucket/o?uploadType=media&name=licenses/${encodeURIComponent(
            filePath
          )}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              expireDate: new Date().toISOString().slice(0, 10),
            }),
          }
        );

        if (genrateLicenseFileRes.status !== 200) {
          return res.status(400).json({
            message: "Somthing Went Wrong When Write key In License Storage!",
          });
        }
      }

      const LicenseFileData = await checkBucketLicenseFile.json();
      if (LicenseFileData && Object.keys(LicenseFileData).length > 0) {
        const expireDate = LicenseFileData.expireDate;
        isExpire = dateDiffrence(expireDate) >= 0 ? false : true;
        return res.status(200).json({ isEqual: true, isExpire });
      } else {
        return res
          .status(400)
          .json({ message: "Something Went Wrong when Reading License File!" });
      }
    } else {
      res.status(400).json({ message: "Your Licnese Key Is Invalid!" });
    }
  }
}

module.exports = CLicenseVerify;
