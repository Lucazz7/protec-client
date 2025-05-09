import { zodResolver } from "@hookform/resolvers/zod";
import { Player } from "@lottiefiles/react-lottie-player";
import { Button, Input } from "antd";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAppSelector } from "../store";

// Schema de validação
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
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

  return (
    <div className="w-full h-dvh flex">
      <div className="w-1/2 h-full bg-white dark:bg-gray-900 text-black dark:text-white flex justify-center ">
        <div className="w-full h-fit my-auto p-7 max-w-2xl flex flex-col items-center justify-center shadow-md rounded-2xl">
          <div className="flex flex-col justify-between items-center mb-8">
            <div className="flex">
              <span className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
                Protec
              </span>
              <span className="text-base text-gray-500 dark:text-gray-200 pt-11 -ms-3 -mt-2">
                AI Chatbot
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email
              </label>
              <Input
                {...register("email")}
                type="email"
                id="email"
                status={errors.email ? "error" : ""}
                className="w-full"
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
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Senha
              </label>
              <Input.Password
                {...register("password")}
                id="password"
                status={errors.password ? "error" : ""}
                className="w-full"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                Esqueceu sua senha?
              </a>
            </div>

            <Button type="primary" htmlType="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </div>
      </div>
      <div className="w-1/2 h-full  flex relative">
        <div className="w-full h-full flex items-center justify-center z-10 absolute">
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
        <div className="w-full h-2/4 bg-gray-400/5 backdrop-blur-sm mt-auto z-20" />
      </div>
    </div>
  );
}
