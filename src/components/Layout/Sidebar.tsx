import {
  ArrowRight,
  Database,
  History,
  Menu,
  Plus,
  User,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

// mockData

const data: QuestionHistory = {
  questions: [
    {
      id: "11ca0168-b0dd-42a6-8f35-a89b90aad6f4",
      question: "onde fica o menu para emitir NF em lote no sistema Agrotis?",
    },
    {
      id: "51c12c9b-217f-4956-aac6-0dbafe5f04b8",
      question: "me apresente um SQL de cancelamento de pedido",
    },
    {
      id: "e9d3f6d7-823d-4dbe-9136-9163b034cabf",
      question:
        "Quais são os pedidos que foram cancelados e quantos produtos estão ativos no sistema hoje?",
    },
    {
      id: "9a1f7a7d-b2b7-4af8-889f-dc4731cf4beesdfsd",
      question: "quantos produtos temos ativos no sistema?",
    },
    {
      id: "8c917233-0d58-4a35-88fd-fb018dd0102bsdf",
      question:
        "Quantos produtos ativos temos no sistema considerando apenas as informações da tabela PRODUTO?",
    },
    {
      id: "c2cd8e39-3b33-4880-8143-e999c95deb26dasf",
      question: "Quantos produtos temos inativos no sistema hoje?",
    },
    {
      id: "7be43d01-46b1-411b-b0a7-cb91d53ed266dfdf",
      question:
        "Quantos produtos temos inativos no sistema hoje e qual foi o ultimo valor de venda do produto com o código 123?",
    },
    {
      id: "15a4ad94-581e-4dee-81df-57d6d236fd0afgg",
      question:
        "Quais são os detalhes de todas as transações emitidas com tipos de transação específicos, código de transporte nulo e situação 3, que ocorreram em ou após 15 de janeiro de 2025?",
    },
    {
      id: "7818a9e5-6d5c-4386-9909-4a5c32a2a079sds",
      question: "Select all",
    },
    {
      id: "c2cd8e39-3b33-4880-8143-e999c95deb26sdsd",
      question: "Quantos produtos temos inativos no sistema hoje?",
    },
    {
      id: "7be43d01-46b1-411b-b0a7-cb91d53ed266sdsd",
      question:
        "Quantos produtos temos inativos no sistema hoje e qual foi o ultimo valor de venda do produto com o código 123?",
    },
    {
      id: "15a4ad94-581e-4dee-81df-57d6d236fd0asd",
      question:
        "Quais são os detalhes de todas as transações emitidas com tipos de transação específicos, código de transporte nulo e situação 3, que ocorreram em ou após 15 de janeiro de 2025?",
    },
    {
      id: "7818a9e5-6d5c-4386-9909-4a5c32a2a079dfs",
      question: "Select all",
    },
    {
      id: "7be43d01-46b1-411b-b0a7-cb91d53ed266ew",
      question:
        "Quantos produtos temos inativos no sistema hoje e qual foi o ultimo valor de venda do produto com o código 123?",
    },
    {
      id: "15a4ad94-581e-4dee-81df-57d6d236fd0a34",
      question:
        "Quais são os detalhes de todas as transações emitidas com tipos de transação específicos, código de transporte nulo e situação 3, que ocorreram em ou após 15 de janeiro de 2025?",
    },
    {
      id: "7818a9e5-6d5c-4386-9909-4a5c32a2a07934",
      question: "Select all",
    },
  ],
  type: "question_history",
};

// Definindo a interface para o tipo de dados
interface Question {
  id: string;
  question: string;
}

interface QuestionHistory {
  questions: Question[];
  type: string;
}

const listMenu = [
  {
    name: "Nova conversa",
    icon: <Plus size={20} />,
    path: "/chat",
  },
  {
    name: "Dados de treinamento",
    icon: <Database size={20} />,
    path: "/chat",
  },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  return (
    <div
      className={`lg:w-80 bg-[#ffffff75] lg:h-full rounded-2xl flex flex-col items-center transition-all duration-300 p-3  z-50 ${
        isOpen
          ? "w-[calc(100%-1rem)] h-[calc(100%-1rem)] bg-white absolute"
          : "h-[80px]"
      }`}
    >
      <div
        className={`${
          isOpen ? "h-[10%]" : "h-full"
        } w-full lg:h-[10%] flex flex-row-reverse lg:flex-row gap-2 items-center relative py-2 px-3`}
      >
        <img
          src="/image/svg/fav-icon-biofy.svg"
          alt="logo"
          className="h-10 lg:h-14 invert cursor-pointer "
        />
        <div className="hidden lg:flex w-full items-center">
          <span className="text-2xl font-semibold text-gray-700">Protec</span>
          <span className="text-sm text-gray-500 pt-11 -ms-4 -mt-2">
            AI Chatbot
          </span>
        </div>
        <span className="hidden lg:flex text-sm text-gray-500 absolute right-0 top-0">
          v1.0.0
        </span>
        <div
          className="flex lg:hidden items-center cursor-pointer me-auto"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </div>
      </div>
      <div
        className={`h-[calc(100%-10%)] ${
          isOpen ? "flex flex-col" : "hidden lg:flex lg:flex-col"
        }`}
      >
        <div className="w-full md:h-[15%] flex flex-col py-2 ">
          <hr className="w-full border-gray-300 pb-2" />
          <div className="w-full h-full flex flex-col gap-6  text-gray-500 ">
            {listMenu.map((item, index) =>
              item.name === "Nova conversa" ? (
                <Link
                  key={index}
                  to={item.path}
                  className={`mx-auto w-full flex justify-center items-center gap-3 font-semibold text-gray-200 bg-gray-500  hover:text-white hover:bg-gray-700 p-2  rounded-lg transition-all duration-300`}
                >
                  {item.icon}
                  <span className="text- uppercase">{item.name}</span>
                </Link>
              ) : (
                <Link
                  key={index}
                  to={item.path}
                  className={`w-full flex items-center gap-3 font-semibold  hover:text-white hover:bg-gray-600 p-2  rounded-md transition-all duration-300`}
                >
                  {item.icon}
                  <span className="text-base">{item.name}</span>
                </Link>
              )
            )}
          </div>
        </div>
        <div className="w-full h-[70%] md:h-[80%] flex flex-col">
          <hr className="w-full border-gray-300 " />
          <div className="w-full h-full  overflow-y-auto flex flex-col gap-4 my-4 text-black ">
            <span className="w-full text-sm text-gray-500 text-center flex items-center gap-2 px-2">
              <History size={20} />
              Conversas Recentes
            </span>
            <div className="w-full flex flex-col h-full md:max-h-[55lvh] overflow-y-auto font-inter p-2">
              {data.questions?.map((item) => (
                <Link
                  key={item.id}
                  to={`/chat/${item.id}`}
                  className="w-full flex items-center gap-3 font-light hover:text-white hover:bg-gray-600 p-2 rounded-md transition-all duration-300 text-gray-600"
                >
                  <span className="text-sm line-clamp-1 text">
                    {item.question.charAt(0).toUpperCase() +
                      item.question.slice(1)}
                  </span>
                </Link>
              ))}
            </div>
          </div>{" "}
        </div>
        <div className="w-full flex flex-col mt-auto ">
          <hr className="w-full border-gray-300" />
          <div className="w-full py-4 flex items-center gap-2 justify-between px-2 ">
            <div className="w-auto p-2 bg-gray-300 rounded-full">
              <User size={20} />
            </div>
            <span className="text-gray-700 font-semibold">
              Protec AI Chatbot
            </span>
            <ArrowRight size={18} className="text-gray-500 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}
