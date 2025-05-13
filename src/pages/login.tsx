import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import GradientText from "../components/GradientText";
import { setTheme } from "../store/redux/themeSlice";

import AOS from "aos";
import { Moon, Sun } from "lucide-react";

import AnimationLogin from "../components/AnimationLogin";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";

export default function Login() {
  const dispatch = useDispatch();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return savedTheme === "dark" || (!savedTheme && prefersDark);
  });
  const [loginOrRegister, setLoginOrRegister] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    dispatch(setTheme(!isDarkMode));
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [loginOrRegister]);

  return (
    <div className="w-full h-dvh flex font-inter">
      <div
        className={`w-full h-full flex transition-all duration-300 ease-linear transform relative overflow-auto ${
          loginOrRegister ? "flex-row-reverse" : "flex-row"
        } bg-white dark:bg-gray-900 p-4`}
      >
        <AnimationLogin loginOrRegister={loginOrRegister} />

        <div
          className="w-full lg:w-1/2 h-full  text-black dark:text-white flex justify-center px-4 md:px-0"
          key={loginOrRegister ? "login" : "register"}
          data-aos={!loginOrRegister ? "fade-right" : "fade-left"}
          data-aos-duration="400"
        >
          <button
            onClick={toggleTheme}
            className={`absolute ${
              !loginOrRegister ? "right-2 md:right-3" : "right-2 md:right-8"
            }  top-3 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer`}
          >
            {isDarkMode ? (
              <Sun size={18} className="text-yellow-500" />
            ) : (
              <Moon size={18} className="text-gray-700" />
            )}
          </button>
          <div className="w-full my-auto h-fit md:max-w-lg lg:max-w-md xl:max-w-xl  flex flex-col items-center md:px-10 min-h-[550px] relative">
            <div className="font-mono font-medium text-base sm:text-xl text-gray-400 dark:text-blue-200">
              <span
                className={`text-gray-400 dark:text-blue-200 cursor-pointer ${
                  loginOrRegister ? "underline underline-offset-4" : ""
                }`}
                onClick={() => setLoginOrRegister(true)}
              >
                LOGIN
              </span>{" "}
              |{" "}
              <span
                className={`text-gray-400 dark:text-blue-200 cursor-pointer ${
                  !loginOrRegister ? "underline underline-offset-4" : ""
                }`}
                onClick={() => setLoginOrRegister(false)}
              >
                REGISTRA-SE
              </span>
            </div>
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
            {loginOrRegister ? <LoginForm /> : <RegisterForm />}
            <div className="w-full flex justify-center items-center gap-2 text-xs sm:text-base my-6">
              {loginOrRegister ? (
                <span className="text-gray-500">
                  Não tem uma conta?{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-gray-600"
                    onClick={() => setLoginOrRegister(false)}
                  >
                    Registre-se
                  </a>
                </span>
              ) : (
                <span className="text-gray-500">
                  Já tem uma conta?{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-gray-600"
                    onClick={() => setLoginOrRegister(true)}
                  >
                    Faça login
                  </a>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
