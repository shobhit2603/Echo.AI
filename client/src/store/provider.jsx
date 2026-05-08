"use client";

import { Provider } from "react-redux";
import { makeStore } from "./app.store";
import { useState } from "react";

export function ReduxProvider({ children }) {
  const [store] = useState(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
