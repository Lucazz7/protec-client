import { zodResolver } from "@hookform/resolvers/zod";
import { Player } from "@lottiefiles/react-lottie-player";
import { Button, Input } from "antd";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { z } from "zod";
import GradientText from "../components/GradientText";
import { useAppSelector } from "../store";
import { setTheme } from "../store/redux/themeSlice";

// Schema de validação
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const dispatch = useDispatch();

  const themeSelected = useAppSelector((state) => state.themeSlice.theme);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
    // Implementar lógica de login aqui
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return savedTheme === "dark" || (!savedTheme && prefersDark);
  });

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

  return (
    <div className="w-full h-dvh flex font-inter p-2 lg:p-4">
      <div className="w-full h-full flex bg-[#ffffff75] dark:bg-[#131324b4] shadow-md rounded-2xl">
        <div className="w-full lg:w-1/2 h-full text-black dark:text-white flex justify-center px-4 md:px-0 ">
          <div className="from-black-500 w-full h-fit my-auto md:max-w-lg lg:max-w-md xl:max-w-lg scale-[1.03] animate-rotate-border cursor-pointer rounded-2xl bg-conic/[from_var(--border-angle)] from-80% via-pink-600 via-90% to-blue-800 to-100% p-px transition-all duration-500 ease-out transform-3d">
            <div className=" bg-white dark:bg-gray-900 flex flex-col items-center justify-center rounded-2xl shadow-xl p-10 py-6">
              <div className="flex flex-col justify-between items-center pb-8">
                <div className="w-full h-full flex relative ">
                  <span className="text-5xl font-semibold text-gray-600 dark:text-blue-200">
                    Protec
                  </span>
                  <GradientText
                    text=""
                    gradientText="AI Expert"
                    gradientColors="from-pink-600 to-blue-800"
                    className="text-2xl min-[390px]:text-3xl pt-14 -ms-3 -mt-2"
                  />
                </div>
              </div>
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

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full space-y-4 "
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-gray-500 dark:text-gray-300 mb-1"
                  >
                    Email
                  </label>
                  <Input
                    {...register("email")}
                    type="email"
                    id="email"
                    size="large"
                    placeholder="Insira seu e-mail"
                    status={errors.email ? "error" : ""}
                    className="dark:!bg-gray-900 dark:!text-gray-200 dark:placeholder:!text-gray-300 dark:!border-[#5b5b5c]"
                    classNames={{
                      input:
                        "dark:!bg-gray-900 dark:!text-gray-200 dark:placeholder:!text-gray-300",
                    }}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm text-gray-500 dark:text-gray-300 mb-1"
                  >
                    Senha
                  </label>
                  <Input.Password
                    {...register("password")}
                    id="password"
                    placeholder="Insira seu senha"
                    size="large"
                    status={errors.password ? "error" : ""}
                    className="dark:!bg-gray-900 dark:!text-gray-200 dark:placeholder:!text-gray-300 dark:!border-[#5b5b5c] "
                    classNames={{
                      input:
                        "dark:!bg-gray-900 dark:!text-gray-200 dark:placeholder:!text-gray-300",
                    }}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end">
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="!px-20 !bg-blue-600 hover:!bg-blue-700 uppercase !font-semibold rounded-xl"
                  >
                    Entrar
                  </Button>
                </div>
                <div className="w-full flex justify-center items-center gap-2 text-sm mt-3">
                  <span className="text-gray-500">
                    Não tem uma conta?{" "}
                    <a href="#" className="text-blue-600">
                      Registre-se
                    </a>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex relative lg:w-1/2 h-full  justify-center items-center">
          <div className="w-96 h-96  rounded-full flex items-center justify-center z-10 absolute">
            <Player
              src={
                themeSelected
                  ? "/image/lottie/IA-animation-light.json"
                  : "/image/lottie/IA-animation.json"
              }
              loop
              autoplay
              className="w-96 h-96 m-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
