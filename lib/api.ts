import axios from "axios";
import { CreateNoteRequest, Note } from "../types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface Options {
  params?: {
    search: string;
    page: number;
    perPage: number;
  };
  headers: {
    Authorization: string;
  };
}

const API_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const authConfig = {
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
};

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

export const FetchNotes = async (
  searchWord: string,
  page: number
): Promise<FetchNotesResponse> => {
  const options: Options = {
    ...authConfig,
    params: {
      search: searchWord,
      page: page,
      perPage: 12,
    },
  };
  const response = await axios.get<FetchNotesResponse>("/notes", options);
  return response.data;
};

export const CreateNote = async (data: CreateNoteRequest): Promise<Note> => {
  const response = await axios.post<Note>("/notes", data, authConfig);
  return response.data;
};

export const DeleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`/notes/${id}`, authConfig);
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get<Note>(`/notes/${id}`, authConfig);
  return response.data;
};
