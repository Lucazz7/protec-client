import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ConfigProvider, Modal, Popconfirm, Table } from "antd";
import { Cpu, Loader2, Plus, Trash, View } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";

import { z } from "zod";
import { useAppSelector } from "../store";
import { useGetTrainingFilesQuery } from "../store/services/trainingFiles";

// Schema de validação com zod
const schema = z.object({
  tipoDado: z.enum(["DDL", "Documentação", "SQL"], {
    required_error: "Selecione um tipo de dado.",
  }),
  sql: z.string().min(1, "O campo SQL não pode ser vazio."),
});

type FormData = z.infer<typeof schema>;

export default function TrainingFiles() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewAll, setViewAll] = useState(false);

  const { data: trainingFiles, isLoading } = useGetTrainingFilesQuery();

  const theme = useAppSelector((state) => state.themeSlice.theme);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipoDado: "SQL",
      sql: "",
    },
  });

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Função para transformar os dados da API no formato da tabela
  const getTableData = useMemo(() => {
    if (!trainingFiles?.df) return [];

    const parsedData = JSON.parse(trainingFiles.df);

    return parsedData.map((item: any, index: number) => ({
      key: index,
      acao: <div className="min-w-[140px]"></div>,
      questao: (
        <div className="min-w-[140px] max-w-[300px]">
          {item?.question || "Não há questão"}
        </div>
      ),
      conteudo: (
        <div className="flex flex-col gap-2 max-h-72 overflow-hidden max-w-[600px]">
          <pre className="bg-gray-100 dark:bg-[#161515c5] p-2 shadow-sm rounded text-xs overflow-x-auto w-fit px-5 flex flex-col ">
            <ReactMarkdown>{item.content}</ReactMarkdown>
          </pre>
        </div>
      ),
      tipo: (
        <div className="flex items-center gap-2 justify-center min-w-[140px]">
          {item.training_data_type.toUpperCase()}
        </div>
      ),
    }));
  }, [trainingFiles]);

  // Função para adicionar novo item
  const onSubmit = (data: FormData) => {
    setIsModalOpen(false);
    reset();
  };

  // Atualize as colunas para usar a função de remover
  const columns = [
    {
      title: (
        <div className="min-w-20 md:min-w-[140px] flex items-center gap-2 justify-center">
          Tipo de Dado
        </div>
      ),
      dataIndex: "tipo",
      key: "tipo",
    },
    {
      title: (
        <div className="max-w-[300px]  flex items-center gap-2 justify-center">
          Questão
        </div>
      ),
      dataIndex: "questao",
      key: "questao",
    },
    {
      title: (
        <div className="w-full flex items-center gap-2 justify-center">
          Conteúdo
        </div>
      ),
      dataIndex: "conteudo",
      key: "conteudo",
    },
    {
      title: (
        <div className="min-w-[140px] flex items-center gap-2 justify-center">
          Ação
        </div>
      ),
      dataIndex: "key",
      key: "acao",
      render: (key: number) => (
        <Popconfirm
          title="Remover"
          description="Tem certeza que deseja remover este dado de treinamento?"
          onConfirm={() => {}}
          okText="Sim"
          cancelText="Não"
        >
          <Button className="w-auto !rounded-full !border-red-500 !text-red-500 hover:!bg-red-500 hover:!text-white">
            <Trash size={16} />
            Remover
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="w-full h-full mx-auto flex flex-col overflow-hidden">
      <div className="w-full p-4 flex flex-col md:flex-row justify-between items-center gap-4 rounded-t-2xl relative shadow-sm">
        <span className="w-full md:w-auto text-base text-gray-500 dark:text-gray-300 flex items-center gap-2">
          <Cpu size={22} /> Arquivos de Treinamento
        </span>
        <div className="w-full md:w-auto flex justify-end items-center gap-2">
          <Button
            className=" !text-gray-500 w-auto dark:!bg-transparent dark:!border-gray-500 dark:!text-gray-300 !rounded-full dark:hover:!bg-gray-900 dark:hover:!brightness-125 hover:!border-gray-500"
            onClick={() => setViewAll(!viewAll)}
            disabled={getTableData.length <= 10}
          >
            <View size={16} />
            {viewAll && getTableData.length > 10 ? "Ver menos" : "Ver todos"}
          </Button>
          <Button
            className=" !text-gray-500 w-auto dark:!bg-transparent dark:!border-gray-500 dark:!text-gray-300 !rounded-full dark:hover:!bg-gray-900 dark:hover:!brightness-125 hover:!border-gray-500"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={16} />
            Adicionar
          </Button>
        </div>
      </div>
      <div className="w-full h-full p-4">
        <div className="w-full bg-white dark:bg-[#101828] rounded-lg h-full dark:text-gray-200 dark:border-gray-700">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={24} className="animate-spin" />
            </div>
          ) : (
            <ConfigProvider
              theme={
                theme
                  ? {
                      token: {
                        colorPrimary: "#e5e7eb",
                        colorText: "#e5e7eb",
                        colorBorder: "#364153",
                        colorBgContainer: "#101828",
                      },
                      components: {
                        Table: {
                          headerBg: "#101828",
                          headerColor: "#e5e7eb",
                          stickyScrollBarBg: "#031842c5",
                          stickyScrollBarBorderRadius: 4,
                          borderColor: "#364153",
                          headerSplitColor: "#364153",
                        },
                        Pagination: {
                          colorBgContainer: "#101828a2",
                        },
                      },
                    }
                  : undefined
              }
            >
              <Table
                className="!bg-transparent rounded-lg h-full dark:!bg-transparent"
                bordered={false}
                dataSource={getTableData}
                columns={columns}
                scroll={{
                  x: true,
                  y:
                    !viewAll && getTableData.length < 10
                      ? "calc(100vh - 220px)"
                      : "calc(100vh - 260px)",
                }}
                pagination={
                  !viewAll && getTableData.length > 10
                    ? {
                        pageSize: 10,
                        position: ["bottomCenter"],
                      }
                    : false
                }
              />
            </ConfigProvider>
          )}
        </div>
      </div>
      <ConfigProvider
        theme={
          theme
            ? {
                token: {
                  colorBgElevated: "#101828",
                  colorIcon: "#e5e7eb",
                },
              }
            : undefined
        }
      >
        <Modal
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          rootClassName="!p-0"
          classNames={{
            footer: "!bg-red-500 p-0",
          }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 dark:!bg-gray-900"
          >
            <h2 className="text-lg font-bold mb-2 dark:text-gray-200">
              Adicionar Dado de Treinamento
            </h2>
            <div>
              <label className="font-semibold dark:text-gray-200">
                Tipo de Dado de Treinamento
              </label>
              <div className="flex flex-col gap-1 mt-1 dark:text-gray-200">
                <label>
                  <input type="radio" value="DDL" {...register("tipoDado")} />
                  <span className="ml-2 font-medium">DDL</span>
                  <span className="ml-2 text-gray-500 text-xs">
                    Estas são as instruções CREATE TABLE que definem a estrutura
                    do seu banco de dados.
                  </span>
                </label>
                <label>
                  <input
                    type="radio"
                    value="Documentação"
                    {...register("tipoDado")}
                  />
                  <span className="ml-2 font-medium">Documentação</span>
                  <span className="ml-2 text-gray-500 text-xs">
                    Pode ser qualquer documentação baseada em texto. Mantenha os
                    trechos pequenos e focados em um único tópico.
                  </span>
                </label>
                <label>
                  <input type="radio" value="SQL" {...register("tipoDado")} />
                  <span className="ml-2 font-medium">SQL</span>
                  <span className="ml-2 text-gray-500 text-xs">
                    Pode ser qualquer instrução SQL que funcione. Quanto mais,
                    melhor.
                  </span>
                </label>
              </div>
              {errors.tipoDado && (
                <span className="text-red-500 text-xs">
                  {errors.tipoDado.message}
                </span>
              )}
            </div>
            <div>
              <label className="font-semibold dark:text-gray-200" htmlFor="sql">
                Seu SQL
              </label>
              <textarea
                id="sql"
                className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-900 dark:text-gray-200"
                rows={3}
                placeholder="Ex: SELECT coluna_1, coluna_2 FROM nome_tabela;"
                {...register("sql")}
              />
              {errors.sql && (
                <span className="text-red-500 text-xs">
                  {errors.sql.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="!bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition dark:!bg-blue-500 dark:hover:!bg-blue-600"
            >
              Salvar
            </button>
          </form>
        </Modal>
      </ConfigProvider>
    </div>
  );
}
