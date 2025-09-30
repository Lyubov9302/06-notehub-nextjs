"use client";

import { fetchNoteById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const NoteDetails = () => {
  const { id } = useParams<{ id: string }>();

  const response = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return <div>NoteDetails: {response.data?.title}</div>;
};

export default NoteDetails;
