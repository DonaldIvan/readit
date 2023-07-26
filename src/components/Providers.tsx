"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC } from "react";

interface Props extends AppWithChildrenProps {}

const Providers: FC<Props> = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Providers;
