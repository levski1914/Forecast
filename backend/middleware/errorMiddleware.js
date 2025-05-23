const errorHandler = (err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ message: err.message || "Server error" });
};

export default errorHandler;
