export const NoContent = () => {
  return {
    statusCode: 204,
    body: "",
  };
};

export const OK = <T>(body: T) => {
  return {
    statusCode: 200,
    body: JSON.stringify(body),
  };
};

export const InternalServerError = (response: Error) => {
  return {
    statusCode: 500,
    body: JSON.stringify(response),
  };
};
