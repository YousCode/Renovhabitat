import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const ExplorerView = () => {
  const { t } = useTranslation();
  return (
    <>
      <section className="lg:h-[calc(100vh-82px)] h-[calc(100vh-68px)] absolute lg:top-20 top-[68px] left-0 w-full z-20 flex items-center justify-center">
        <div className="sm:max-w-xl mx-5 lg:mx-auto w-full space-y-5">
          <h1 className="text-white text-4xl font-bold">
            Sans aucun doute, <br />
            <span className="text-gradient">
            le meilleur de
              <br /> la rénovation
            </span>{" "}
            est ici.
          </h1>
          <Link
            to="/ventes"
            className="text-white py-2 text-center w-full bg-green-500 font-semibold rounded-lg cursor-pointer block"
          >
            Chercher un client
          </Link>
        </div>
      </section>
      <div className="lg:h-[calc(100vh-82px)] h-[calc(100vh-68px)] absolute lg:top-20 top-[68px] left-0 w-full">
        <div className="w-full h-[100%] bg-explore-gradient absolute bottom-0" />
        <img
          src={require("src/assets/explore-bg.png")}
          className="w-full h-full object-cover"
        />
      </div>
    </>
  );
};