import axios from "axios";
import base64 from "base-64";

const getAuthHeaders = () => {
  return {
    Authorization: `Basic ${base64.encode(
      `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
    )}`,
    "Content-Type": "application/json",
  };
};

export const generateZoomAccessToken = async () => {
  try {
    console.log("account id: ", process.env.ZOOM_ACCOUNT_ID);
    console.log("client id: ", process.env.ZOOM_CLIENT_ID);
    console.log("client secret: ", process.env.ZOOM_CLIENT_SECRET);

    const { data } = await axios.post(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
      null,
      {
        headers: getAuthHeaders(),
      }
    );
    console.log("zoom access token: ", data.access_token);
    return data?.access_token;
  } catch (error) {
    console.error("Error generating Zoom access token:", error.message);
    throw new Error("Failed to generate Zoom access token");
  }
};

export const generateZoomMeeting = async (email, courseName) => {
  try {
    const zoomApiURL = `https://api.zoom.us/v2/users/me/meetings`;
    const accessToken = await generateZoomAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
    const meetinData = {
      topic: `Class on ${courseName}`,
      type: 2,
      start_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      duration: 60,
      timezone: "Asia/Kolkata",
      agenda: `Meeting for the course ${courseName}`,
      password: "123456",
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: true,
        mute_upon_entry: true,
        audio: "voip",
        auto_recording: "cloud",
      },
    };

    const { data } = await axios.post(zoomApiURL, meetinData, { headers });
    if (!data.join_url) {
      throw new Error("Zoom meeting creation failed: No join URL returned");
    }
    return data.join_url;
  } catch (error) {
    console.error(
      "Error creating Zoom meeting:",
      error.response?.data || error.message
    );
    throw new Error("Failed to create Zoom meeting");
  }
};
