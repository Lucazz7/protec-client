import { useEffect } from "react";
import GradientText from "../components/GradientText";

import AOS from "aos";

import { useParams } from "react-router-dom";
import AnimationLogin from "../components/AnimationLogin";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";
import ResetPasswordForm from "../components/forms/ResetPasswordForm";
import SwitchLoginOrRegister from "../components/SwitchLoginOrRegister";
import SwitchTheme from "../components/SwitchTheme";

export default function Login() {
  const { resetPasswordOrRegister } = useParams();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="w-full h-dvh flex font-inter ">
      <div
        className={`w-full h-full flex transition-all duration-300 ease-linear transform relative overflow-y-auto ${
          resetPasswordOrRegister === "register"
            ? "flex-row-reverse"
            : "flex-row"
        } bg-white dark:bg-gray-900 p-4`}
      >
        <AnimationLogin />

        <div
          className="w-full lg:w-1/2 h-full  text-black dark:text-white flex justify-center px-4 md:px-0"
          key={resetPasswordOrRegister}
          data-aos={
            resetPasswordOrRegister === "register" ? "fade-right" : "fade-left"
          }
          data-aos-duration="400"
        >
          <div
            className={`absolute ${
              resetPasswordOrRegister !== "register"
                ? "right-2 md:right-3"
                : "right-2 md:right-8"
            }  top-3`}
          >
            <SwitchTheme />
          </div>

          <div className="w-full my-auto h-fit md:max-w-lg lg:max-w-md xl:max-w-xl  flex flex-col items-center md:px-10 min-h-[550px] relative">
            {resetPasswordOrRegister !== "resetPassword" && (
              <SwitchLoginOrRegister />
            )}
            <div className="flex flex-col items-center justify-center gap-2 my-3 md:my-6">
              <div className="w-full h-full flex relative items-center justify-center ">
                <span className="text-4xl sm:text-7xl font-semibold text-gray-600 dark:text-blue-200">
                  Protec
                </span>
                <GradientText
                  text=""
                  gradientText="AI Expert"
                  gradientColors="from-pink-600 to-blue-800"
                  className="text-2xl min-[390px]:text-4xl pt-24 -ms-3 -mt-2"
                />
              </div>
              <div className="font-sans font-medium text-xs sm:text-base text-gray-400 dark:text-blue-200">
                Transforme seus dados em resultados eficientes
              </div>
            </div>
            {resetPasswordOrRegister === "resetPassword" ? (
              <ResetPasswordForm />
            ) : resetPasswordOrRegister === "register" ? (
              <RegisterForm />
            ) : (
              <LoginForm />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
