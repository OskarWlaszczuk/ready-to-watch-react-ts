import axios from "axios";

export const fetchApi = async <ResponseType>(endpointPath: string) => {

    const response = await axios.get<ResponseType>(endpointPath);
    return response.data;
};