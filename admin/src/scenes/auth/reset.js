import React, { useState } from "react";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";

import api from "../../services/api";
import LoadingButton from "../../components/loadingButton";

export default ({ location }) => {
  const [values, setValues] = useState({ password: "", password1: "" });

  const history = useHistory();

  const send = async () => {
    try {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      const res = await api.post("/admin/forgot_password_reset", {
        ...values,
        token,
      });
      if (!res.ok) throw res;
      toast.success("Success!");
      history.push("/");
    } catch (e) {
      toast.error(`Error\n${e && e.code}`);
    }
  };

  return (
    <div className="bg-primary-off-white relative">
      <div className="mb-10 max-w-7xl mx-auto p-4"></div>

      <div className="max-w-lg mx-auto w-full">
        <div className="font-[Helvetica] text-center text-[32px] font-semibold	mb-[15px]">Créer un nouveau mot de passe</div>
        <div>
          <div>
            <div className="border-[1px] border-gray-200 bg-gray-50 text-gray-500 p-2 rounded-md italic">
              Format : minimum 6 caractères, au moins une lettre
            </div>
            <div className="mb-[25px] mt-4">
              <label htmlFor="password">Nouveau mot de passe</label>
              <input
                className="w-full mt-1"
                name="password"
                type="password"
                id="password"
                value={values.password}
                onChange={(e) => setValues({ ...values, password: e.target.value })}
              />
            </div>
            <LoadingButton className="py-3.5 w-full text-center bg-primary text-white rounded-lg mt-5" onClick={send}>
              Créer
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
};
