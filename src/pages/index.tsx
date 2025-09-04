import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/showSchools",
      permanent: true,
    },
  };
};

export default function Home() {
  return null;
}
