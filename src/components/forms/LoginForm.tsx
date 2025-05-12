import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "antd";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email é obrigatório",
    })
    .email("Email inválido"),
  password: z
    .string({
      required_error: "Senha é obrigatória",
    })
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    if (data) {
      navigate("/");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-6 my-auto"
    >
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <div>
            <label
              htmlFor="email"
              className="block text-sm text-gray-500 dark:text-gray-300 mb-1"
            >
              Email
            </label>
            <Input
              {...field}
              type="email"
              id="email"
              size="large"
              placeholder="Insira seu e-mail"
              status={errors.email ? "error" : ""}
              className={`dark:!bg-gray-900 dark:!text-gray-200 dark:placeholder:!text-gray-300 !rounded-full !py-3 !px-5 ${
                errors.email ? "border-red-500" : "dark:!border-[#5b5b5c] "
              }`}
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
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <div>
            <label
              htmlFor="password"
              className="block text-sm text-gray-500 dark:text-gray-300 mb-1"
            >
              Senha
            </label>
            <Input.Password
              {...field}
              id="password"
              placeholder="Insira seu senha"
              size="large"
              iconRender={(visible) =>
                visible ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />
              }
              status={errors.password ? "error" : ""}
              className={`dark:!bg-gray-900 dark:!text-gray-200 dark:placeholder:!text-gray-300 !rounded-full !py-3 !px-5 ${
                errors.password ? "border-red-500" : "dark:!border-[#5b5b5c] "
              }`}
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
        )}
      />

      <div className="flex items-center justify-end">
        <a
          href="#"
          className="text-base text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
        >
          Esqueceu sua senha?
        </a>
      </div>
      <div className="flex items-center justify-center mt-8">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          className="!px-20 !bg-blue-600 hover:!bg-blue-700 uppercase !font-semibold !rounded-full"
        >
          Entrar
        </Button>
      </div>
    </form>
  );
}
