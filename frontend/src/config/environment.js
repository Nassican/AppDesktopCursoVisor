const environments = {
  development: {
    API_URL: process.env.REACT_APP_API_URL,
    TIMEOUT: 10000,
  },
  staging: {
    API_URL: process.env.REACT_APP_API_URL,
    TIMEOUT: 10000,
  },
  production: {
    API_URL: process.env.REACT_APP_API_URL,
    TIMEOUT: 10000,
  },
};

const currentEnvironment = process.env.REACT_APP_ENV || "development";

export const config = environments[currentEnvironment];
