import { FetchNotes } from "@/lib/api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";

const Notes = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", searchValue, page],
    queryFn: () => FetchNotes(searchValue, page),
  });

  return (
    <HydrationBoundary state={dehydrate(QueryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
};

export default Notes;
