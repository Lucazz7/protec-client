import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  ConfigProvider,
  Modal,
  Pagination,
  Popconfirm,
  Switch,
  Table,
} from "antd";
import { Cpu, Database, File, Plus, Trash } from "lucide-react";
import type { ReactElement } from "react";
import { useCallback, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { z } from "zod";
import {
  IDataRelevantQuestions,
  IDataTrainingFiles as IDataTrainingFilesInterface,
} from "../interface/ITreiningFiles";
import { useAppSelector } from "../store";
import {
  useCreateTrainingFileMutation,
  useDeleteTrainingFileMutation,
  useGetAllDLLFilesQuery,
  useGetAllRelevantQuestionsQuery,
} from "../store/services/trainingFilesApi";

// Schema de validação com zod
const schema = z
  .object({
    table_name: z.string().optional(),
    tipoDado: z.enum(["DDL", "Documentação", "SQL"], {
      required_error: "Selecione um tipo de dado.",
    }),
    sql: z.string().min(1, "O campo SQL não pode ser vazio."),
  })
  .refine(
    (data) => {
      if (data.tipoDado === "DDL") {
        return data.table_name && data.table_name.length > 0;
      }
      return true;
    },
    {
      message: "O campo nome da tabela não pode ser vazio.",
      path: ["table_name"],
    }
  );

type FormData = z.infer<typeof schema>;

type TableItem = DLLTableItem | QuestionTableItem;

interface DLLTableItem {
  key: number;
  nome: React.ReactNode;
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
  const [showDLLFiles, setShowDLLFiles] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteIDLoading, setDeleteIDLoading] = useState<string>("");
  const [pageSize, setPageSize] = useState(10);

  const { data: allFilesDLL, isLoading: isLoadingDLL } =
    useGetAllDLLFilesQuery();
  const { data: allRelevantQuestions, isLoading: isLoadingQuestions } =
    useGetAllRelevantQuestionsQuery();
  const [createTrainingFile, { isLoading: isLoadingCreateTrainingFile }] =
    useCreateTrainingFileMutation();
  const [deleteTrainingFile, { isLoading: isLoadingDeleteTrainingFile }] =
    useDeleteTrainingFileMutation();

  const theme = useAppSelector((state) => state.themeSlice.theme);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipoDado: "SQL",
      sql: "",
    },
  });

  const typeDataSelectWatch = useWatch({
    control,
    name: "tipoDado",
  });

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = useCallback(
    (id: string) => {
      setDeleteIDLoading(id);
      const response = deleteTrainingFile(id);

      response.then((response) => {
        if (response.error) {
          toast.error("Erro ao deletar o arquivo de treinamento.");
        } else {
          toast.success("Arquivo de treinamento deletado com sucesso.");
        }
      });
    },
    [deleteTrainingFile]
  );

  // Função para transformar os dados da DLL no formato da tabela
  const getDLLTableData = useMemo<DLLTableItem[]>(() => {
    if (!allFilesDLL) return [];

    return allFilesDLL.map(
      (item: IDataTrainingFilesInterface, index: number) => ({
        key: index,
        nome: (
          <div className="w-full flex justify-center items-center flex-col gap-2 overflow-hidden min-w-[160px]">
            <p className="text-center text-sm ">
              {item.table_name || "Sem nome"}
            </p>
          </div>
        ),
        conteudo: (
          <div className="w-full flex flex-col gap-2 max-h-72 overflow-auto max-w-[550px]">
            <pre className="bg-gray-100 dark:bg-[#161515c5] p-2 shadow-sm rounded text-xs overflow-x-auto w-fit px-5 flex flex-col ">
              <ReactMarkdown>
                {(item?.commented_ddl || "").toString()}
              </ReactMarkdown>
            </pre>
          </div>
        ),
        tipoDado: (
          <div className="w-full flex justify-center items-center flex-col gap-2 min-w-[100px] overflow-hidden">
            <p className="text-center text-sm ">DLL</p>
          </div>
        ),
        acao: (
          <div className="w-full flex justify-center items-center">
            <Popconfirm
              title="Remover"
              description="Tem certeza que deseja remover esse arquivo?"
              onConfirm={() => handleDelete(String(item.table_name))}
              okType="link"
              okText="Sim"
              okButtonProps={{
                className: "!bg-transparent !text-green-500 !border-green-500",
              }}
              cancelButtonProps={{
                className:
                  "!border-red-500 !text-red-500 hover:!bg-red-500 hover:!text-white",
              }}
              cancelText="Não"
            >
              <Button
                className=" w-fit !rounded-full !border-red-500 !text-red-500 hover:!bg-red-500 hover:!text-white"
                loading={
                  isLoadingDeleteTrainingFile &&
                  deleteIDLoading === item.table_name
                }
              >
                <Trash size={16} />
                Remover
              </Button>
            </Popconfirm>
          </div>
        ),
      })
    );
  }, [allFilesDLL, deleteIDLoading, handleDelete, isLoadingDeleteTrainingFile]);

  const getQuestionsTableData = useMemo<QuestionTableItem[]>(() => {
    if (!allRelevantQuestions) return [];

    return allRelevantQuestions.map(
      (item: IDataRelevantQuestions, index: number) => ({
        key: index,
        questao: (
          <div className="w-full flex justify-center items-center flex-col gap-2  overflow-hidden min-w-[160px]">
            <p className="text-sm ">{(item?.question || "").toString()}</p>
          </div>
        ),
        conteudo: (
          <div className="w-full flex flex-col gap-2 max-h-72 overflow-auto max-w-[550px]">
            <pre className="bg-gray-100 dark:bg-[#161515c5] p-2 shadow-sm rounded text-xs overflow-x-auto w-fit px-5 flex flex-col ">
              <ReactMarkdown>
                {(item?.generated_sql || "").toString()}
              </ReactMarkdown>
            </pre>
          </div>
        ),
        tipoDado: (
          <div className="w-full flex justify-center items-center flex-col gap-2 min-w-[100px] overflow-hidden">
            <p className="text-center text-sm ">
              {item.generated_sql ? "SQL" : "Documentação"}
            </p>
          </div>
        ),
        acao: (
          <div className="w-full flex justify-center items-center">
            <Popconfirm
              title="Remover"
              description="Tem certeza que deseja remover esse arquivo?"
              onConfirm={() => handleDelete(String(item.id))}
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
  }, [allRelevantQuestions, handleDelete]);

  const dllColumns = [
    {
      title: "Nome do Arquivo",
      dataIndex: "nome",
      key: "nome",
      classNameCustom: "w-[120px] md:w-[20%]",
      width: "20%",
    },
    {
      title: "Conteúdo",
      dataIndex: "conteudo",
      key: "conteudo",
      classNameCustom:
        " border-l border-gray-200 dark:border-gray-700 w-[80px] md:w-[39.8%] ",
      width: "40%",
    },
    {
      title: "Tipo de Dado",
      dataIndex: "tipoDado",
      key: "tipoDado",
      classNameCustom:
        "border-l border-gray-200 dark:border-gray-700 w-[120px] md:w-[20%] ",
      width: "20%",
    },
    {
      title: "Ação",
      dataIndex: "acao",
      key: "acao",
      classNameCustom: "w-[20%] border-l border-gray-200 dark:border-gray-700 ",
      width: "20%",
    },
  ];

  const questionsColumns = [
    {
      title: "Questão",
      dataIndex: "questao",
      key: "questao",
      classNameCustom:
        "w-[20%] border-l border-gray-200 dark:border-gray-700 min-w-[90px]",
      width: "20%",
    },
    {
      title: "Conteúdo",
      dataIndex: "conteudo",
      key: "conteudo",
      classNameCustom: "w-[40%] border-l border-gray-200 dark:border-gray-700",
      width: "40%",
    },
    {
      title: "Tipo de Dado",
      dataIndex: "tipoDado",
      key: "tipoDado",
      classNameCustom:
        "w-[20%] border-l border-gray-200 dark:border-gray-700 min-w-[110px]",
      width: "20%",
    },
    {
      title: "Ação",
      dataIndex: "acao",
      key: "acao",
      classNameCustom: "w-[20%] border-l border-gray-200 dark:border-gray-700",
      width: "20%",
    },
  ];

  // Função para adicionar novo item
  const onSubmit = (data: FormData) => {
    createTrainingFile({
      table_name: data?.table_name,
      origin_type: "VANNA_BACKEND",
      ddl: data.sql,
    });
    setIsModalOpen(false);
    reset();
  };

  // Adicione esta função para calcular os dados paginados
  const getPaginatedData = (data: TableItem[]) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };

  return (
    <div className="w-full h-full mx-auto flex flex-col overflow-hidden">
      <div className="w-full p-4 flex flex-col md:flex-row justify-between items-center gap-4 rounded-t-2xl relative shadow-sm">
        <div className="w-full md:w-auto text-sm min-[400px]:text-base text-gray-500 dark:text-gray-300 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <Cpu size={22} /> Arquivos de Treinamento
          </span>

          <Button
            className="!text-gray-500  md:!hidden w-auto dark:!bg-transparent dark:!border-gray-500 dark:!text-gray-300 !rounded-full dark:hover:!bg-gray-900 dark:hover:!brightness-125 hover:!border-gray-500"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={16} />
            Adicionar
          </Button>
        </div>
        <div className="w-full items-center justify-center  md:w-auto flex gap-2 !text-sm min-[400px]:text-base text-gray-500 dark:text-gray-300">
          <span className="flex items-center gap-2">
            <File size={16} /> Arquivos DLL
          </span>
          <Switch
            checked={!showDLLFiles}
            className="!bg-gray-500 dark:!bg-gray-300"
            onChange={(checked) => setShowDLLFiles(!checked)}
          />
          <span className="flex items-center gap-2">
            SQL/Documentação <Database size={16} />
          </span>
        </div>

        <Button
          className="!text-gray-500  md:!flex !hidden w-auto dark:!bg-transparent dark:!border-gray-500 dark:!text-gray-300 !rounded-full dark:hover:!bg-gray-900 dark:hover:!brightness-125 hover:!border-gray-500"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} />
          Adicionar
        </Button>
      </div>
      <div className="w-full flex-1 flex flex-col min-h-0">
        <div className="w-full h-full flex-1 flex flex-col min-h-0">
          <div className="w-full h-full bg-white dark:bg-[#101828] overflow-hidden rounded-lg min-h-0">
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
              {/* Header fixo */}
              <div className="w-full h-12 md:h-16 bg-[#f5f5f5] dark:bg-[#0e0e18] border-b border-gray-200 dark:border-gray-700 flex !rounded-t-lg text-sm md:text-base ">
                {showDLLFiles
                  ? dllColumns.map((col, index) => (
                      <span
                        key={index}
                        className={`flex justify-center items-center text-gray-500 font-semibold dark:text-gray-200 py-4 ${col.classNameCustom} px-2 text-center text-xs md:text-base`}
                      >
                        {col.title}
                      </span>
                    ))
                  : questionsColumns.map((col, index) => (
                      <div
                        key={index}
                        className={`flex justify-center items-center  text-gray-500 font-semibold dark:text-gray-200 py-4 ${col.classNameCustom} text-center`}
                      >
                        {col.title}
                      </div>
                    ))}
              </div>

              {/* Tabela com dados paginados */}
              <Table<TableItem>
                className="w-full h-[calc(100%-120px)] md:h-[calc(100%-128px)] overflow-auto !bg-transparent rounded-lg"
                bordered={true}
                dataSource={getPaginatedData(
                  showDLLFiles ? getDLLTableData : getQuestionsTableData
                )}
                columns={showDLLFiles ? dllColumns : questionsColumns}
                scroll={{ x: "100%" }}
                pagination={false}
                showHeader={false}
                loading={showDLLFiles ? isLoadingDLL : isLoadingQuestions}
              />

              {/* Paginação fixa */}
              <div className="w-full h-12 md:h-16 bg-white dark:bg-[#101828] border-t border-gray-200 dark:border-gray-700 p-4 shadow-sm rounded-b-2xl">
                <div className="w-full h-full flex justify-center">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={
                      showDLLFiles
                        ? getDLLTableData.length
                        : getQuestionsTableData.length
                    }
                    onChange={(page, size) => {
                      setCurrentPage(page);
                      setPageSize(size);
                    }}
                    showSizeChanger
                    showTotal={(total) => (
                      <div className="w-full h-full hidden md:flex justify-center items-center">
                        <span className="text-gray-500 dark:text-gray-300">
                          Total {total} itens
                        </span>
                      </div>
                    )}
                  />
                </div>
              </div>
            </ConfigProvider>
          </div>
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
            {typeDataSelectWatch === "DDL" && (
              <div>
                <label
                  className="font-semibold dark:text-gray-200"
                  htmlFor="sql"
                >
                  Nome da tabela
                </label>
                <input
                  id="table_name"
                  className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-900 dark:text-gray-200"
                  placeholder="Ex: nome_tabela"
                  {...register("table_name")}
                />
                {errors.table_name && (
                  <span className="text-red-500 text-xs">
                    {errors.table_name.message}
                  </span>
                )}
              </div>
            )}
            <div>
              <label className="font-semibold dark:text-gray-200">
                Tipo de Dado de Treinamento
              </label>
              <div className="flex flex-col gap-1 mt-2 dark:text-gray-200">
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
