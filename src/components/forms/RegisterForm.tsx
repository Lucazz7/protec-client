import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const registerSchema = z.object({
  name: z
    .string({
      required_error: "Nome é obrigatório",
    })
    .min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: z
    .string({
      required_error: "Email é obrigatório",
    })
    .email("Email inválido"),
  phone: z
    .string({
      required_error: "Telefone é obrigatório",
    })
    .min(10, "Telefone inválido"),
  cpf: z
    .string({
      required_error: "CPF é obrigatório",
    })
    .min(11, "CPF inválido"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
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
        name="name"
        render={({ field }) => (
          <div>
            <label
              htmlFor="name"
              className="block text-sm text-gray-500 dark:text-gray-300 mb-1"
            >
              Nome
            </label>
            <Input
              {...field}
              type="text"
              id="name"
              size="large"
              placeholder="Insira seu nome"
              status={errors.name ? "error" : ""}
              className={`dark:!bg-gray-900 dark:!text-gray-200 dark:placeholder:!text-gray-300 !rounded-full !py-3 !px-5 ${
                errors.name ? "border-red-500" : "dark:!border-[#5b5b5c] "
              }`}
              classNames={{
                input:
                  "dark:!bg-gray-900 dark:!text-gray-200 dark:placeholder:!text-gray-300",
              }}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
        )}
      />

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
        name="phone"
        render={({ field }) => (
          <div>
            <label
              htmlFor="phone"
              className="block text-sm text-gray-500 dark:text-gray-300 mb-1"
            >
              Telefone
            </label>
            <Input
              {...field}
              type="tel"
              id="phone"
              size="large"
              placeholder="Insira seu telefone"
              status={errors.phone ? "error" : ""}
              className={`dark:!bg-gray-900 dark:!text-gray-200 dark:placeholder:!text-gray-300 !rounded-full !py-3 !px-5 ${
                errors.phone ? "border-red-500" : "dark:!border-[#5b5b5c] "
              }`}
              classNames={{
                input:
                  "dark:!bg-gray-900 dark:!text-gray-200 dark:placeholder:!text-gray-300",
              }}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        control={control}
        name="cpf"
        render={({ field }) => (
          <div>
            <label
              htmlFor="cpf"
              className="block text-sm text-gray-500 dark:text-gray-300 mb-1"
            >
              CPF
            </label>
            <Input
              {...field}
              type="text"
              id="cpf"
              size="large"
              placeholder="Insira seu CPF"
              status={errors.cpf ? "error" : ""}
              className={`dark:!bg-gray-900 dark:!text-gray-200 dark:placeholder:!text-gray-300 !rounded-full !py-3 !px-5 ${
                errors.cpf ? "border-red-500" : "dark:!border-[#5b5b5c] "
              }`}
              classNames={{
                input:
                  "dark:!bg-gray-900 dark:!text-gray-200 dark:placeholder:!text-gray-300",
              }}
            />
            {errors.cpf && (
              <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>
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
          Cadastrar
        </Button>
      </div>
    </form>
  );
}
