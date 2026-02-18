export const successResponse = (message: string, data?: any) => {
  return {
    responseCode: "2000000",
    responseMessage: "Success",
    message,
    ...(data && { data }),
  };
};

export const successResponseWithPagination = (
  message: string,
  data: any[],
  pagination: any
) => {
  return {
    responseCode: "2000000",
    responseMessage: "Success",
    message,
    data,
    pagination,
  };
};
