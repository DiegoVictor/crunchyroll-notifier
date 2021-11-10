import "source-map-support/register";

import * as response from "@infra/http/response";
export const get = async () => {
  try {
  } catch (err) {
    console.log(err);

    return response.InternalServerError();
  }
};
