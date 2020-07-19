exports.validateImage = (req, res, next) => {
  const format = ["jpg", "jpeg", "png"];

  if (!req.files || !req.files.image) {
    res.status(402).send({
      status: "failed",
      message: "No file uploaded",
    });
  } else {
    const image = req.files.image;
    const extension = image.name.split(".")[image.name.split(".").length - 1];
    if (!format.includes(extension)) {
      res.status(402).send({
        status: "failed",
        message: "unsuported format file. Upload png, jpg, or jpeg format",
      });
    } else {
      next();
    }
  }
};
