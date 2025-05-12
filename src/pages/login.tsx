import { Player } from "@lottiefiles/react-lottie-player";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import GradientText from "../components/GradientText";
import { useAppSelector } from "../store";
import { setTheme } from "../store/redux/themeSlice";

import AOS from "aos";
import { Moon, Sun } from "lucide-react";
import Typewriter from "typewriter-effect";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";

export default function Login() {
  const dispatch = useDispatch();

  const themeSelected = useAppSelector((state) => state.themeSlice.theme);

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

  const phrases = [
    "Assistente especializado em consultas SQL com suporte a múltiplos bancos de dados",
    "Análise avançada de dados com insights personalizados para seu negócio",
    "Exportação flexível para Excel, CSV e outros formatos com um clique",
    "Respostas contextuais e precisas baseadas na estrutura do seu banco de dados",
    "Geração dinâmica de tabelas e visualizações interativas dos resultados",
    "Otimização automática de consultas SQL para melhor performance",
    "Integração simples com seu banco de dados existente",
    "Treinamento personalizado através de arquivos de conhecimento",
    "Visualização gráfica dos dados com múltiplos tipos de gráficos",
    "Sugestões inteligentes para melhorar suas consultas SQL",
  ];

  return (
    <div className="w-full h-dvh flex font-inter ">
      <div
        className={`w-full h-full flex transition-all duration-300 ease-linear transform relative ${
          loginOrRegister ? "flex-row-reverse" : "flex-row"
        } bg-white dark:bg-gray-900 p-4`}
      >
        <div className="hidden lg:flex relative lg:w-1/2 h-full justify-center items-center rounded-4xl bg-animated-gradient dark:bg-gray-900">
          <div
            key={loginOrRegister ? "login" : "register"}
            className=" flex items-center justify-center z-10 absolute"
            data-aos={loginOrRegister ? " fade-left" : "fade-right"}
            data-aos-duration="700"
            data-aos-delay="250"
          >
            <Player
              src={
                themeSelected
                  ? "/image/lottie/IA-animation2.json"
                  : "/image/lottie/IA-animation-light.json"
              }
              loop
              autoplay
              className="w-[520px] h-[520px] m-auto"
            />
          </div>
          <div className="w-full h-full flex flex-col items-center justify-center z-20 bg-[#d8d8d81e] dark:bg-[#1313243d] rounded-4xl p-10">
            <div className="w-full h-full flex flex-col items-center justify-between">
              <img
                src="/image/svg/biofy-logo.svg"
                alt="Biofy"
                className="w-52 invert dark:invert-0"
              />
              <div className="text-sm py-10 text-gray-500 dark:text-gray-300 font-inter max-w-xl mt-auto rounded-lg ">
                <Typewriter
                  options={{
                    strings: phrases,
                    autoStart: true,
                    loop: true,
                    deleteSpeed: 50,
                    delay: 50,
                    cursor: "|",
                    wrapperClassName: "typewriter-wrapper",
                  }}
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-500 dark:text-blue-200">
                Protec AI Expert
              </h2>
            </div>
          </div>
        </div>
        <div
          className="w-full lg:w-1/2 h-full  text-black dark:text-white flex justify-center px-4 md:px-0"
          key={loginOrRegister ? "login" : "register"}
          data-aos={!loginOrRegister ? "fade-left" : "fade-right"}
          data-aos-duration="700"
          data-aos-delay="250"
        >
          <button
            onClick={toggleTheme}
            className="absolute right-3 top-3 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {isDarkMode ? (
              <Sun size={18} className="text-yellow-500" />
            ) : (
              <Moon size={18} className="text-gray-700" />
            )}
          </button>
          <div className="w-full my-auto h-fit md:max-w-lg lg:max-w-md xl:max-w-xl  flex flex-col items-center px-10 min-h-[550px] relative">
            <div className="font-mono font-medium text-xl text-gray-400 dark:text-blue-200">
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
            <div className="flex flex-col items-center justify-center gap-2 my-6">
              <div className="w-full h-full flex relative items-center justify-center ">
                <span className="text-7xl font-semibold text-gray-600 dark:text-blue-200">
                  Protec
                </span>
                <GradientText
                  text=""
                  gradientText="AI Expert"
                  gradientColors="from-pink-600 to-blue-800"
                  className="text-2xl min-[390px]:text-4xl pt-24 -ms-3 -mt-2"
                />
              </div>
              <div className="font-sans font-medium text-base text-gray-400 dark:text-blue-200">
                Transforme seus dados em resultados eficientes
              </div>
            </div>
            {loginOrRegister ? <LoginForm /> : <RegisterForm />}
            <div className="w-full flex justify-center items-center gap-2 text-base mt-6">
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
