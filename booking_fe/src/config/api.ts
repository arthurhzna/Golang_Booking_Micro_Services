const apiConfig = {
  field: {
    baseUrl: process.env.FIELD_API_URL,
    serviceName: process.env.FIELD_SERVICE_NAME,
    signatureKey: process.env.FIELD_SIGNATURE_KEY,
  },
  user: {
    baseUrl: process.env.USER_API_URL,
    serviceName: process.env.USER_SERVICE_NAME,
    signatureKey: process.env.USER_SIGNATURE_KEY,
  },
  order: {
    baseUrl: process.env.ORDER_API_URL,
    serviceName: process.env.ORDER_SERVICE_NAME,
    signatureKey: process.env.ORDER_SIGNATURE_KEY,
  }
};

export default apiConfig;
