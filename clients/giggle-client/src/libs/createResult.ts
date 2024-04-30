const createErrorResult = <ErrorCodeT>(
  errorCode: ErrorCodeT
): { isError: true; errorCode: ErrorCodeT } => ({
  isError: true,
  errorCode,
})

const createSuccessResult = <DataT>(
  data: DataT
): { isError: false; data: DataT } => ({
  isError: false,
  data,
})

export { createErrorResult, createSuccessResult }
