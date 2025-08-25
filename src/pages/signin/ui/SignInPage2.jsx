import React from "react";
import styles from "./styles.module.sass";
import LoginForm from "./LoginForm";
import {Link} from "react-router-dom";
import Image from "../../../shared/ui/image/Image";

export const SignInPage2 = () => {
  return (
    <div className={styles.loginPage}>
      <div className={styles.authContainer}>
        <div className={styles.formSection}>
          <div className={styles.logo}>
            <Link className={styles.logo} to="/">
              <Image
                  className={styles.pic}
                  src="/img/logo.svg"
                  srcDark="/img/logo-dark.svg"
                  alt="Core"
              />
            </Link>
          </div>
          <LoginForm />
        </div>
        <div className={styles.imageSection}>
          <img
            src="/img/login-illustration.png"
            alt="Login illustration"
            className={styles.illustration}
          />
        </div>
      </div>
    </div>
  );
};
