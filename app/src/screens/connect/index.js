import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";

import api from "../../services/api";
import { setUser } from "../../redux/auth/actions";

export const Connect = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const user_id = params.get("user_id");

  useEffect(() => {
    if (token) {
      loadAsAdmin();
    }
  }, []);

  if (loading === null) {
    return <div>Erreur</div>;
  }

  if (!loading) {
    return <div>Loading ...</div>;
  }

  async function init({ token, user }) {
    if (token) {
      api.setToken(token);
    }
    if (user) {
      dispatch(setUser(user));
    }
  }

  async function loadAsAdmin() {
    try {
      api.setToken(token);
      const res = await api.get(`/admin/token_user/${user_id}`);
      await init(res);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }

  return <Redirect to="/" />;
};
