export const NoContent = () => ({
  statusCode: 204,
  body: "",
});

export const OK = <T>(body: T) => ({
  statusCode: 200,
  body: JSON.stringify(body),
});

export const InternalServerError = () => ({
  statusCode: 500,
  body: JSON.stringify({
    code: 500,
    message: "Ops! Something goes wrong, try again later",
  }),
});
