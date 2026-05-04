import axios from "axios";
import { MOCK_LEADERS } from "../data/mockData";

const BASE_URL = import.meta.env.VITE_APPS_SCRIPT_URL || "";

export const api = {
  getLeaders: (status = "live") =>
    BASE_URL
      ? axios.get(`${BASE_URL}?api=entries&status=${status}`).then((r) => r.data || [])
      : Promise.resolve(status === "live" ? MOCK_LEADERS : []),

  submitProfile: (data) =>
    axios.post(BASE_URL, data),

  getProfileByToken: (token) =>
    axios.get(`${BASE_URL}?api=profile&token=${token}`).then((r) => r.data),

  requestManage: (data) =>
    axios.post(BASE_URL, { action: "sendProfileLink", ...data }),

  getRequests: () =>
    BASE_URL
      ? axios.get(`${BASE_URL}?api=requests`).then((r) => r.data || [])
      : Promise.resolve([]),

  approveRequest: (id) =>
    axios.post(BASE_URL, { action: "approve", id }),

  rejectRequest: (id) =>
    axios.post(BASE_URL, { action: "reject", id }),
};
