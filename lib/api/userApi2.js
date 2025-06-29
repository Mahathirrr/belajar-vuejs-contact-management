import axios from "axios";
export const userRegister = async ({ username, name, password }) => {
  return await axios.post(
    `${import.meta.env.VITE_API_PATH}/users`,
    {
      username,
      name,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );
};

export const userLogin = async ({ username, password }) => {
  return await axios.post(
    `${import.meta.env.VITE_API_PATH}/users/login`,
    {
      username,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );
};

export const userDetails = async (token) => {
  return await axios.get(`${import.meta.env.VITE_API_PATH}/users/current`, {
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
};

export const userUpdateProfile = async (token, { name }) => {
  return await axios.patch(
    `${import.meta.env.VITE_API_PATH}/users/current`,
    {
      name,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token,
      },
    },
  );
};

export const userUpdatePassword = async (token, { password }) => {
  return await axios.patch(
    `${import.meta.env.VITE_API_PATH}/users/current`,
    {
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token,
      },
    },
  );
};

export const userLogOut = async (token) => {
  return await axios.delete(`${import.meta.env.VITE_API_PATH}/users/logout`, {
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
};
