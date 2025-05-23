import { Player } from "@lottiefiles/react-lottie-player";
import { useParams } from "react-router-dom";
import Typewriter from "typewriter-effect";
import { useAppSelector } from "../store";

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

export default function AnimationLogin() {
  const { resetPasswordOrRegister } = useParams();
  const themeSelected = useAppSelector((state) => state.themeSlice.theme);

  return (
    <div className="hidden lg:flex relative lg:w-1/2 h-full justify-center items-center rounded-4xl bg-animated-gradient dark:bg-gray-900">
      <div
        key={resetPasswordOrRegister}
        className=" flex items-center justify-center z-10 absolute"
        data-aos={
          resetPasswordOrRegister !== "register" ? "fade-right" : "fade-left"
        }
        data-aos-duration="400"
      >
        <Player
          src={
            themeSelected
              ? "/image/lottie/IA-animation2.json"
              : "/image/lottie/IA-animation-light.json"
          }
          loop
          autoplay
          className="w-[300px] h-[300px] xl:w-[520px] xl:h-[520px] m-auto max-w-md max-h-md"
        />
      </div>
      <div className="w-full h-full flex flex-col items-center justify-center z-20 bg-[#d8d8d81e] dark:bg-[#1313243d] rounded-4xl p-10">
        <div className="w-full h-full flex flex-col items-center justify-between">
          <img
            src={
              themeSelected
                ? "/image/svg/biofy-logo.svg"
                : "/image/svg/biofy-logo-light.svg"
            }
            alt="Biofy"
            className="w-52"
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
  );
}
