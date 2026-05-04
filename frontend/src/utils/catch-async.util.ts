import { AxiosError, type AxiosResponse } from "axios";


export const catchAsync = async <T>(promise: Promise<AxiosResponse<T>>) => {
    try {
        const response = await promise;
        return [null, response.data] as const
    } catch (error) {
        return [error, null] as [AxiosError, null]
    }
};