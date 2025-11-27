import React from "react";

export type AsyncStatus = "idle" | "pending" | "success" | "error";

export type AsyncState<T> = {
  status: AsyncStatus;
  value: T | null;
  error: Error | null;
};

export type UseAsyncReturn<T> = {
  refetch: () => Promise<void>;
  status: AsyncStatus;
  value: T | null;
  error: Error | null;
};

export const useAsync = <T>(
  asyncFn: () => Promise<T>,
  immediate: boolean = false
): UseAsyncReturn<T> => {
  const [state, setState] = React.useState<AsyncState<T>>({
    value: null,
    error: null,
    status: "idle",
  });

  const refetch = React.useCallback(async () => {
    setState({
      status: "pending",
      value: null,
      error: null,
    });

    try {
      const response = await asyncFn();
      setState({
        status: "success",
        value: response,
        error: null,
      });
    } catch (error) {
      setState({
        status: "error",
        value: null,
        error:
          error instanceof Error
            ? error
            : new Error("An unknown error occurred"),
      });
    }
  }, [asyncFn]);

  React.useEffect(() => {
    if (immediate) {
      refetch();
    }
  }, [refetch, immediate]);

  const { status, value, error } = state;

  return { refetch, status, value, error };
};
