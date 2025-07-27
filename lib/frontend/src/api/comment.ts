import axios, { AxiosResponse } from "axios";
import { Comment } from "@model";
import { handleTokenRefresh } from "./token";
import { EntityType } from "@model";
import { CreateCommentDto } from "@model";

const baseUrl = `${import.meta.env.VITE_BASE_URL}/comment`

export interface PaginatedCommentsResponse {
  data: Comment.Model[];
  total: number;
  page?: number;
  totalPages: number;
}

// GET
export const getCommentsByEntityTypeAndEntityId = async (
  entity_type: EntityType,
  entity_id: string,
  page: number
): Promise<PaginatedCommentsResponse> => {
  try {
    const newToken = await handleTokenRefresh();
    if (!newToken) {
      return { data: [], total: 0, totalPages: 0 };
    }
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found!");
    }
    const response: AxiosResponse<PaginatedCommentsResponse> = await axios.get(
      `${baseUrl}/${entity_type}/${entity_id}?page=${page}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const formattedData = response.data.data.map((commentItem) => ({
      ...commentItem,
      created_at: new Date(commentItem.created_at as unknown as string),
    }));

    return { ...response.data, data: formattedData };
  } catch (error) {
    console.error("Error fetching comments", error);
    throw error;
  }
};

export const createComment = async (
  commentData: CreateCommentDto
): Promise<Comment.Model> => {
  try {
    const newToken = await handleTokenRefresh();
    if (!newToken) {
      throw new Error("Failed to refresh token");
    }
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found!");
    }
    const response: AxiosResponse<Comment.Model> = await axios.post(
      baseUrl,
      commentData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      ...response.data,
      created_at: new Date(response.data.created_at as unknown as string),
    };
  } catch (error) {
    console.error("Error creating comment", error);
    throw error;
  }
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    const newToken = await handleTokenRefresh();
    if (!newToken) {
      throw new Error("Failed to refresh token");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found!");
    }

    const formData = new FormData();
    formData.append("audio", audioBlob);

    const response = await axios.post<{ transcription: string }>(
      `${baseUrl}/transcribe`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.transcription;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw error;
  }
};
