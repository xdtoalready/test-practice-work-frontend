import React, {useState, useContext, useEffect} from "react";
import styles from "../styles.module.sass";
import cn from "classnames";
import { useAuthStore } from "../../state/signin.store";
import { Button } from "../../../../shared/ui/button";
import { Input } from "../../../../shared/ui/input";
import {useNavigate, useSearchParams} from "react-router-dom";
import {handleError} from "../../../../core/lib/snackbar";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginByEmail: login } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

    useEffect(() => {
        // Проверяем, что переход произошёл с доверенных доменов
        const trustedDomains = [
            "https://stage.crm.lead-bro.ru",
            "https://crm.lead-bro.ru",
            "http://localhost:3000",
        ];
        debugger
        const referrer = document.referrer;

        if (searchParams.has("e") && searchParams.has("p")) {
            const isTrustedReferrer = trustedDomains.some((domain) =>
                referrer?.startsWith(domain)
            );

            if (isTrustedReferrer) {
                const decodedEmail = (searchParams.get("e") || "");
                const decodedPassword = (searchParams.get("p") || "");

                setEmail(decodedEmail);
                setPassword(decodedPassword);

            } else {
                console.warn("Ошибка при декодировании:", referrer);
                handleError("Ошибка при декодировании:", referrer);
            }
            window.history.replaceState({}, "", window.location.pathname);

        }
    }, [searchParams]);

  const handleSubmit = (event) => {
    event?.preventDefault();
    login(email, password).then((res) => {
        debugger
        if(res){
            window.location.reload();
            window.location.href = '/statistics'
        }
    });
  };



  return (
    <form className={styles.loginForm}>
      <Input
        type={"input"}
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        edited={true}
        className={styles.input}
        label={"Электронная Почта"}
      />
      <Input
        type={"password"}
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        edited={true}
        className={styles.input}
        label={"Пароль"}
      />
      <div className={styles.buttonContainer}>
        <Button
          onClick={(e) => handleSubmit(e)}
          className={styles.submitButton}
        >
          <span>Войти</span>
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
