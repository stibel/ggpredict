import { ReactNode } from "react";

interface PageProps {
  children?: ReactNode | Array<ReactNode>;
}

export const Page = ({ children }: PageProps) => {
  return (
    <div
      style={{
        padding: 0,
        margin: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#483D8B",
      }}
    >
      {children}
    </div>
  );
};
