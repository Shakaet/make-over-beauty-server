

export let globarError = (
  err,
  req,
  res,
  next,
) => {
  const statusCode = err.StatusCode || 500
  const message = err.message || 'Something Went Wrong'

  return res.status(statusCode).json({
    status: false,
    message,
    error: err,
  })
}