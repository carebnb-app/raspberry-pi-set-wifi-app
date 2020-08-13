const genError = (code, status) => {
  const error = new Error(code)
  error.status = status
  return error
}
export const Error400 = code => genError(code, 400)
export const Error401 = code => genError(code, 401)
export const Error402 = code => genError(code, 402)
export const Error403 = code => genError(code, 403)
export const Error404 = code => genError(code, 404)
