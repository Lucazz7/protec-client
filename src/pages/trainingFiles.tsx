import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Modal, Popconfirm, Table } from "antd";
import { Cpu, Plus, Trash, View } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";

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

  // Troque o dataSource para um estado
  const [dataSource, setDataSource] = useState<
    {
      key: number;
      acao: React.ReactNode;
      questao: React.ReactNode;
      conteudo: React.ReactNode;
      tipo: React.ReactNode;
    }[]
  >([
    {
      key: 1,
      acao: null, // Será preenchido depois
      questao: (
        <div className="flex flex-col gap-2 min-w-[200px]">
          Quais são os pedidos que foram cancelados e quantos produtos estão
          ativos no sistema hoje?
        </div>
      ),
      conteudo: (
        <div className="w-fit flex flex-col gap-2 min-w-[250px]">
          <p className="py-1 px-2 bg-gray-100 rounded-lg">
            SELECT COUNT(*) FROM PRODUTO WHERE PRODUTO.ativo = 1;
          </p>
        </div>
      ),
      tipo: (
        <div className="flex items-center gap-2 max-w-[100px] justify-center">
          SQL
        </div>
      ),
    },
  ]);

  // Função para remover item
  const handleRemove = (key: number) => {
    setDataSource((prev) => prev.filter((item) => item.key !== key));
  };

  // Função para adicionar novo item
  const onSubmit = (data: FormData) => {
    setDataSource((prev) => [
      ...prev,
      {
        key: prev.length + 1,
        acao: null, // Será preenchido depois
        questao: "", // Você pode adicionar um campo de questão no formulário se quiser
        conteudo: (
          <div className="flex flex-col gap-2">
            <p className="py-1 px-2 bg-gray-100 rounded-lg">{data.sql}</p>
          </div>
        ),
        tipo: data.tipoDado,
      },
    ]);
    setIsModalOpen(false);
    reset();
  };

  // Atualize as colunas para usar a função de remover
  const columns = [
    {
      title: (
        <div className="min-w-[100px] flex items-center gap-2 justify-center">
          Tipo de Dado
        </div>
      ),
      dataIndex: "tipo",
      key: "tipo",
    },
    {
      title: (
        <div className="min-w-[100px] flex items-center gap-2 justify-center">
          Questão
        </div>
      ),
      dataIndex: "questao",
      key: "questao",
    },
    {
      title: (
        <div className="min-w-[100px] flex items-center gap-2 justify-center">
          Conteúdo
        </div>
      ),
      dataIndex: "conteudo",
      key: "conteudo",
    },
    {
      title: <div className="flex items-center gap-2 justify-center">Ação</div>,
      dataIndex: "key",
      key: "acao",
      render: (key: number) => (
        <Popconfirm
          title="Remover"
          description="Tem certeza que deseja remover este dado de treinamento?"
          onConfirm={() => handleRemove(key)}
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
    <div className=" w-full mx-auto flex flex-col gap-4 items-center justify-center ">
      <div className="w-full min-[400px]:h-[20%] md:h-[8%] p-4 flex flex-col md:flex-row justify-between items-center gap-4 rounded-t-2xl relative shadow-sm">
        <span className="w-full md:w-auto text-base text-gray-500 flex items-center gap-2">
          <Cpu size={22} /> Arquivos de Treinamento
        </span>
        <div className="w-full md:w-auto flex justify-end items-center gap-2">
          <Button className=" !text-gray-500 w-auto !rounded-full hover:!border-gray-500">
            <View size={16} />
            Ver todos
          </Button>
          <Button
            className=" !text-gray-500 w-auto !rounded-full hover:!border-gray-500"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={16} />
            Adicionar
          </Button>
        </div>
      </div>

      <div className="w-full px-4">
        <Table
          className="bg-transparent rounded-lg"
          bordered={false}
          dataSource={dataSource}
          expandable={{
            expandedRowClassName: () => "bg-blue-500",
          }}
          scroll={{ x: true }}
          columns={columns}
          pagination={false}
        />
      </div>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <h2 className="text-lg font-bold mb-2">
            Adicionar Dado de Treinamento
          </h2>
          <div>
            <label className="font-semibold">Tipo de Dado de Treinamento</label>
            <div className="flex flex-col gap-1 mt-1">
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
            <label className="font-semibold" htmlFor="sql">
              Seu SQL
            </label>
            <textarea
              id="sql"
              className="w-full mt-1 p-2 border rounded"
              rows={3}
              placeholder="Ex: SELECT coluna_1, coluna_2 FROM nome_tabela;"
              {...register("sql")}
            />
            {errors.sql && (
              <span className="text-red-500 text-xs">{errors.sql.message}</span>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition"
          >
            Salvar
          </button>
        </form>
      </Modal>
    </div>
  );
}
