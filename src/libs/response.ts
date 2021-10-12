export const NoContent = () => {
  return {
    statusCode: 204,
    body: "",
  };
};

export const InternalServerError = (response: Record<string, unknown>) => {
  return {
    statusCode: 500,
    body: JSON.stringify(response),
  };
};
