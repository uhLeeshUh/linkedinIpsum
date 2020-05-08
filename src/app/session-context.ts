import React from "react";
export const SessionContext = React.createContext<{ sessionId: string }>({
  sessionId: "",
});
