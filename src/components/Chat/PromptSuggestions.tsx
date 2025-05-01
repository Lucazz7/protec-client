interface PromptSuggestionsProps {
  setMessage: (message: string) => void;
}

export default function PromptSuggestions({
  setMessage,
}: PromptSuggestionsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 p-2 my-auto">
      <div
        className="bg-white p-4 rounded-lg shadow-sm  flex flex-col items-center text-center hover:bg-gray-100 hover:scale-105 transition-all duration-300 cursor-pointer"
        onClick={() =>
          setMessage("Como otimizar uma consulta SQL que está muito lenta?")
        }
      >
        <div className="mb-2">📊</div>
        <p className="text-xs text-gray-700">
          Como otimizar uma consulta SQL que está muito lenta?
        </p>
      </div>
      <div
        className="bg-white p-4 rounded-lg shadow-sm  flex flex-col items-center text-center hover:bg-gray-100 hover:scale-105 transition-all duration-300 cursor-pointer"
        onClick={() =>
          setMessage("Ajude-me a criar uma query com JOIN entre várias tabelas")
        }
      >
        <div className="mb-2">🔍</div>
        <p className="text-xs text-gray-700">
          Ajude-me a criar uma query com JOIN entre várias tabelas
        </p>
      </div>
      <div
        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center hover:bg-gray-100 hover:scale-105 transition-all duration-300 cursor-pointer"
        onClick={() =>
          setMessage(
            "Como criar uma consulta para análise de dados com GROUP BY"
          )
        }
      >
        <div className="mb-2">📈</div>
        <p className="text-xs text-gray-700">
          Como criar uma consulta para análise de dados com GROUP BY
        </p>
      </div>
      <div
        className="bg-white p-4 rounded-lg shadow-sm  flex flex-col items-center text-center hover:bg-gray-100 hover:scale-105 transition-all duration-300 cursor-pointer"
        onClick={() =>
          setMessage(
            "Preciso converter uma subquery em uma CTE, pode me ajudar?"
          )
        }
      >
        <div className="mb-2">🔄</div>
        <p className="text-xs text-gray-700">
          Preciso converter uma subquery em uma CTE, pode me ajudar?
        </p>
      </div>
    </div>
  );
}
