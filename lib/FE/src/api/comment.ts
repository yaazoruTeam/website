import axios, { AxiosResponse } from "axios";
import { Comment } from "../model/src";
import { handleTokenRefresh } from "./token";
import { EntityType } from "../model/src/Comment";
import { CreateCommentDto } from "../model/src/Dtos";

const baseUrl = "http://localhost:3006/controller/comment";

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

export const uploadFile = async (file: File): Promise<{ fileUrl: string }> => {
  const formData = new FormData();
  formData.append("file", file); 

  const response = await axios.post(`${baseUrl}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
