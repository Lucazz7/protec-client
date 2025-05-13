import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ConfigProvider, Modal, Popconfirm, Switch, Table } from "antd";
import { Cpu, Loader2, Plus, Trash, View } from "lucide-react";
import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { z } from "zod";
import {
  IDataRelevantQuestions,
  IDataTrainingFiles as IDataTrainingFilesInterface,
} from "../interface/ITreiningFiles";
import { useAppSelector } from "../store";
import {
  useGetAllDLLFilesQuery,
  useGetAllRelevantQuestionsQuery,
} from "../store/services/trainingFilesApi";

// Schema de validação com zod
const schema = z.object({
  tipoDado: z.enum(["DDL", "Documentação", "SQL"], {
    required_error: "Selecione um tipo de dado.",
  }),
  sql: z.string().min(1, "O campo SQL não pode ser vazio."),
});

type FormData = z.infer<typeof schema>;

type TableItem = DLLTableItem | QuestionTableItem;

interface DLLTableItem {
  key: number;
  nome: string;
  conteudo: React.ReactNode;
  acao: ReactElement;
}

interface QuestionTableItem {
  key: number;
  questao: React.ReactNode;
  conteudo: React.ReactNode;
  acao: ReactElement;
}

export default function TrainingFiles() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [showDLLFiles, setShowDLLFiles] = useState(true);

  const { data: allFilesDLL, isLoading: isLoadingDLL } =
    useGetAllDLLFilesQuery();
  const { data: allRelevantQuestions, isLoading: isLoadingQuestions } =
    useGetAllRelevantQuestionsQuery();

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

  // Função para transformar os dados da DLL no formato da tabela
  const getDLLTableData = useMemo<DLLTableItem[]>(() => {
    if (!allFilesDLL) return [];

    return allFilesDLL.map(
      (item: IDataTrainingFilesInterface, index: number) => ({
        key: index,
        nome: item.table_name || "Sem nome",
        conteudo: (
          <div className="flex flex-col gap-2  items-center justify-cente max-h-72 overflow-hidden">
            <pre className="bg-gray-100 dark:bg-[#161515c5] p-2 shadow-sm rounded text-xs overflow-x-auto w-fit px-5 flex flex-col ">
              <ReactMarkdown>
                {(item?.commented_ddl || "").toString()}
              </ReactMarkdown>
            </pre>
          </div>
        ),
        tipoDado: (
          <div className="w-full flex justify-center items-center flex-col gap-2  overflow-hidden">
            <p className="text-center text-sm ">DDL</p>
          </div>
        ),
        acao: (
          <Popconfirm
            title="Remover"
            description="Tem certeza que deseja remover este arquivo DLL?"
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
      })
    );
  }, [allFilesDLL]);

  const getQuestionsTableData = useMemo<QuestionTableItem[]>(() => {
    if (!allRelevantQuestions) return [];

    return allRelevantQuestions.map(
      (item: IDataRelevantQuestions, index: number) => ({
        key: index,
        questao: (
          <div className="w-full flex justify-center items-center flex-col gap-2  overflow-hidden">
            <p className=" text-sm ">{(item?.question || "").toString()}</p>
          </div>
        ),
        conteudo: (
          <div className="w-full flex items-center justify-center flex-col gap-2 max-h-72 overflow-hidden">
            <pre className="bg-gray-100 dark:bg-[#161515c5] p-2 shadow-sm rounded text-xs overflow-x-auto w-fit px-5 flex flex-col ">
              <ReactMarkdown>
                {(item?.generated_sql || "").toString()}
              </ReactMarkdown>
            </pre>
          </div>
        ),
        tipoDado: (
          <div className="w-full flex justify-center items-center flex-col gap-2  overflow-hidden">
            <p className="text-center text-sm ">SQL/Documentação</p>
          </div>
        ),
        acao: (
          <div className="w-full flex justify-center items-center">
            <Popconfirm
              title="Remover"
              description="Tem certeza que deseja remover esta questão?"
              onConfirm={() => {}}
              okText="Sim"
              cancelText="Não"
            >
              <Button className=" w-fit !rounded-full !border-red-500 !text-red-500 hover:!bg-red-500 hover:!text-white">
                <Trash size={16} />
                Remover
              </Button>
            </Popconfirm>
          </div>
        ),
      })
    );
  }, [allRelevantQuestions]);

  const dllColumns = [
    {
      title: <div className="text-center text-sm  ">Nome do Arquivo</div>,
      dataIndex: "nome",
      key: "nome",
      width: "20%",
    },

    {
      title: <div className="text-center text-sm  ">Conteúdo</div>,
      dataIndex: "conteudo",
      width: "40%",
      key: "conteudo",
    },
    {
      title: <div className="text-center text-sm  ">Tipo de Dado</div>,
      dataIndex: "tipoDado",
      key: "tipoDado",
      width: "20%",
    },
    {
      title: <div className="text-center text-sm  ">Ação</div>,
      dataIndex: "acao",
      align: "center",
      key: "acao",
      width: "20%",
    },
  ];

  const questionsColumns = [
    {
      title: <div className="text-center text-sm  ">Questão</div>,
      dataIndex: "questao",
      key: "questao",
      width: "20%",
    },
    {
      title: <div className="text-center text-sm  ">Conteúdo</div>,
      dataIndex: "conteudo",
      key: "conteudo",
      width: "40%",
    },
    {
      title: <div className="text-center text-sm  ">Tipo de Dado</div>,
      dataIndex: "tipoDado",
      key: "tipoDado",
      width: "20%",
    },
    {
      title: <div className="text-center text-sm  ">Ação</div>,
      dataIndex: "acao",
      key: "acao",
      width: "20%",
    },
  ];

  // Função para adicionar novo item
  const onSubmit = (data: FormData) => {
    setIsModalOpen(false);
    reset();
  };

  return (
    <div className="w-full h-full mx-auto flex flex-col overflow-hidden">
      <div className="w-full p-4 flex flex-col md:flex-row justify-between items-center gap-4 rounded-t-2xl relative shadow-sm">
        <span className="w-full md:w-auto text-base text-gray-500 dark:text-gray-300 flex items-center gap-2">
          <Cpu size={22} /> Arquivos de Treinamento
        </span>
        <div className="w-full md:w-auto flex justify-end items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-300">
              Arquivos DLL
            </span>
            <Switch
              checked={!showDLLFiles}
              onChange={(checked) => setShowDLLFiles(!checked)}
            />
            <span className="text-gray-500 dark:text-gray-300">
              SQL/Documentação
            </span>
          </div>
          <Button
            className="!text-gray-500 w-auto dark:!bg-transparent dark:!border-gray-500 dark:!text-gray-300 !rounded-full dark:hover:!bg-gray-900 dark:hover:!brightness-125 hover:!border-gray-500"
            onClick={() => setViewAll(!viewAll)}
          >
            <View size={16} />
            {viewAll ? "Ver menos" : "Ver todos"}
          </Button>
          <Button
            className="!text-gray-500 w-auto dark:!bg-transparent dark:!border-gray-500 dark:!text-gray-300 !rounded-full dark:hover:!bg-gray-900 dark:hover:!brightness-125 hover:!border-gray-500"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={16} />
            Adicionar
          </Button>
        </div>
      </div>
      <div className="w-full h-full ">
        <div className="w-full rounded-lg h-full dark:text-gray-200 dark:border-gray-700">
          {isLoadingDLL || isLoadingQuestions ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={24} className="animate-spin" />
            </div>
          ) : (
            <div className="w-full h-full bg-white dark:bg-[#101828] rounded-lg">
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
                <Table<TableItem>
                  className="!bg-transparent rounded-lg h-full dark:!bg-transparent"
                  bordered={false}
                  dataSource={
                    showDLLFiles ? getDLLTableData : getQuestionsTableData
                  }
                  columns={showDLLFiles ? dllColumns : questionsColumns}
                  scroll={{
                    x: true,
                    y: "calc(100vh - 260px)",
                  }}
                  pagination={
                    !viewAll
                      ? {
                          pageSize: 10,
                          position: ["bottomCenter"],
                        }
                      : false
                  }
                />
              </ConfigProvider>
            </div>
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
