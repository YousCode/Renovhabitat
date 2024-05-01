import { Switch, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { SignIn } from "./signIn";
import { SignUp } from "./signUp";


export const Auth = () => {
  const { t } = useTranslation();
  return (
    <main className="grid grid-cols-2 h-screen">
      <section className="relative overflow-hidden">
        {/* <img src={require("../../assets/auth-image.png")} className="w-full h-full object-cover " alt="Doutez de tout, sauf de vous." /> */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full">
          <h1 className="text-white z-10 text-4xl font-bold text-center">
            {t("auth.primary")}
            <br />
            <span className="text-center text-transparent bg-gradient-to-l from-[#7537c7] to-[#c957db] bg-clip-text"> {t("auth.secondary")} </span> 
          </h1>
          <p className="text-xl text-white font-semibold text-center">
            {t("auth.tertiary")}
          </p>
        </div>
      </section>
      <section className="overflow-y-auto">
        <Switch>
          <Route path="/auth/signin" component={SignIn} />
          <Route path="/auth/signup/:workspaceId" component={SignUp} />
          <Route path="/auth/signup" component={SignUp} />
          <Route path="/auth" component={SignIn} />
        </Switch>
      </section>
    </main>
  )
}
