import axios from "axios";

export const DeleteApartment = async (id) => {
  let publicURL = "https://serverapp-xu995arr.b4a.run";
  const accessToken = localStorage.getItem("access-token");
  try {
    const response = await axios.delete(publicURL + `/apartment/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
