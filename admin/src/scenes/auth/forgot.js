import React, { useState } from "react";
import validator from "validator";
import toast from "react-hot-toast";

import LoadingButton from "../../components/loadingButton";
import api from "../../services/api";

export default () => {
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");

  const send = async () => {
    try {
      if (!validator.isEmail(email)) toast.error("Invalid email address");

      await api.post("/admin/forgot_password", { email });
      toast.success("Sent");
      setDone(true);
    } catch (e) {
      console.log(e);
      toast.error("Error", e.code);
    }
  };

  return (
    <div className="bg-primary-off-white relative">
      <div className="mb-10 max-w-7xl mx-auto p-4"></div>

      <div className="max-w-lg mx-auto w-full">
        {done ? (
          <div className="">
            <div className="text-center text-3xl font-semibold text-black mb-12">Réinitialiser le mot de passe</div>
            <div className="text-[#555]">
              Le lien de récupération du mot de passe a été envoyé à votre adresse e-mail, veuillez vérifier votre boîte de réception et suivez le
              lien pour réinitialiser votre mot de passe.
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-center text-3xl font-semibold text-black mb-12">Réinitialiser le mot de passe</h1>
            <div className="mb-8 text-[#555]">Entrez votre adresse e-mail ci-dessous pour définir un nouveau mot de passe.</div>
            <div>
              <div className="flex flex-col gap-y-2 w-full">
                <label for="email">Adresse e-mail</label>
                <input name="email" type="email" id="email" className="w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <LoadingButton className="py-3.5 w-full text-center bg-primary text-white rounded-lg mt-5" type="submit" onClick={send}>
                Envoyer un lien{" "}
              </LoadingButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
