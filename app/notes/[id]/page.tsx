import { fetchNoteById } from "@/lib/api";
import NoteDetails from "./NoteDetails.client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface DetailsProps {
  params: Promise<{ id: string }>;
}

const Details = async ({ params }: DetailsProps) => {
  const { id } = await params;
  // const note = await fetchNoteById();

  const queryClient = new QueryClient();
  queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetails />
    </HydrationBoundary>
  );
};

export default Details;
