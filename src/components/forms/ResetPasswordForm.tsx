import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const resetPasswordSchema = z.object({
  email: z
    .string({
      required_error: "Email é obrigatório",
    })
    .email("Email inválido"),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (data) {
      navigate("/login");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6 ">
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <div className="py-4">
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
                className={`dark:!bg-gray-900 dark:!text-gray-200 dark:placeholder:!text-gray-300 !rounded-full sm:!py-3 !px-5 ${
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

        <div className="flex items-center justify-center mt-8">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="!px-20 !bg-blue-600 hover:!bg-blue-700 uppercase !font-semibold !rounded-full"
          >
            Recuperar Senha
          </Button>
        </div>
      </form>
      <div className="w-full flex justify-center items-center gap-2 text-xs sm:text-base my-6">
        <span className="text-gray-500">
          Não tem uma conta?{" "}
          <a
            href="#"
            className="text-blue-600 hover:text-gray-600"
            onClick={() => navigate("/register")}
          >
            Registre-se
          </a>
        </span>
      </div>
    </>
  );
}
