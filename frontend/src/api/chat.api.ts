import client from '../lib/axios';
import { catchAsync } from '../utils/catch-async.util';
import type {
    GetUserFriendsResponse,
    GetAllUsersResponse,
    GetUserChatsResponse,
    GetChatMessagesResponse,
    GetUserFriendsRequestsToResponse,
    GetUserFriendsRequestsByResponse,
    CreateFriendRequestResponse,
    CreateNewMessageResponse,
    AcceptFriendRequestResponse,
    MarkMessageAsReadResponse,
    GetSignUploadSignutureResponse,
    PutUpdateProfileResponse
} from 'super-chat-shared/api';
import type { NewMessageBody } from 'super-chat-shared/chat';
import type { UpdateProfileBody } from 'super-chat-shared/user';
import { compressImage } from '../utils/compress-image.util';

export const getUserFriends = async () => {
    const [error, data] = await catchAsync(client.get<GetUserFriendsResponse>('/chat/friends'));
    if (error) throw error;
    return data;
}

export const getAllUsers = async () => {
    const [error, data] = await catchAsync(client.get<GetAllUsersResponse>('/chat/users'));
    if (error) throw error;
    return data;
}

export const getUserChats = async () => {
    const [error, data] = await catchAsync(client.get<GetUserChatsResponse>('/chat/chats'));
    if (error) throw error;
    return data;
}

export const getChatMessages = async (chatId: string, cursor: string | null) => {
    const [error, data] = await catchAsync(client.get<GetChatMessagesResponse>(`/chat/chat/${chatId}/messages`, {
        params: { cursor }
    }));
    if (error) throw error;
    return data;
}

export const getUserFriendsRequestsTo = async () => {
    const [error, data] = await catchAsync(client.get<GetUserFriendsRequestsToResponse>('/chat/requests/to'));
    if (error) throw error;
    return data;
}

export const getUserFriendsRequestsBy = async () => {
    const [error, data] = await catchAsync(client.get<GetUserFriendsRequestsByResponse>('/chat/requests/by'));
    if (error) throw error;
    return data;
}

export const createFriendRequest = async (receiverId: string) => {
    const [error, data] = await catchAsync(client.post<CreateFriendRequestResponse>(`/chat/request/${receiverId}`));
    if (error) throw error;
    return data;
}

export const createNewMessage = async (chatId: string, messageData: NewMessageBody) => {
    const [error, data] = await catchAsync(client.post<CreateNewMessageResponse>(`/chat/message/${chatId}`, messageData));
    if (error) throw error;
    return data;
}

export const acceptFriendRequest = async (requestId: string) => {
    const [error, data] = await catchAsync(client.put<AcceptFriendRequestResponse>(`/chat/request/${requestId}`));
    if (error) throw error;
    return data;
}

export const markMessageAsRead = async (messageId: string) => {
    const [error, data] = await catchAsync(client.put<MarkMessageAsReadResponse>(`/chat/message/${messageId}/read`));
    if (error) throw error;
    return data;
}

export async function GETSignUpload() {
    const [error, data] = await catchAsync(client.get<GetSignUploadSignutureResponse>('/signupload'));
    if (error) throw error;
    return data;
}

export function createCloudinaryFormData(signData: GetSignUploadSignutureResponse, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signData.apikey);
    formData.append("timestamp", signData.timestamp.toString());
    formData.append("signature", signData.signature);
    formData.append("folder", "signed_upload_demo");
    return formData;
}

export async function POSTCloudinary(signData: GetSignUploadSignutureResponse, formData: FormData): Promise<string> {
    const url = "https://api.cloudinary.com/v1_1/" + signData.cloudname + "/image/upload";
    const [error, data] = await catchAsync(client.post(url, formData, { withCredentials: false }));
    if (error) throw error;
    return data.secure_url as string;
}

export async function SignAndUploadCloudinary(data: File) {
    const signData = await GETSignUpload();
    const formData = createCloudinaryFormData(signData, data);
    const secureURL = await POSTCloudinary(signData, formData);
    return secureURL;
}

export async function PUTUserProfile(formData: UpdateProfileBody) {
    const [error, data] = await catchAsync(client.put<PutUpdateProfileResponse>('/user', formData));
    if (error) throw error;
    return data;
}

export type UpdateProfileBodyClient = {
    name?: string;
    image?: File;
};

export async function orchesterateProfileUpadate(formData: UpdateProfileBodyClient) {
    let newFormData: UpdateProfileBody;
    let secureURL: string | undefined;
    if (formData.image) {
        const compressedImage = await compressImage(formData.image);
        secureURL = await SignAndUploadCloudinary(compressedImage as File);
    }

    newFormData = { name: formData.name, avatar: secureURL };
    if (!formData.name) delete newFormData.name;
    if (!secureURL) delete newFormData.avatar;

    return await PUTUserProfile(newFormData);
}