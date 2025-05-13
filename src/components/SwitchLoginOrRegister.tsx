import { useNavigate, useParams } from "react-router-dom";

export default function SwitchLoginOrRegister() {
  const { resetPasswordOrRegister } = useParams();
  const navigate = useNavigate();

  return (
    <div className="font-mono font-medium text-base sm:text-xl text-gray-400 dark:text-blue-200">
      <span
        className={`text-gray-400 dark:text-blue-200 cursor-pointer ${
          resetPasswordOrRegister !== "register"
            ? "underline underline-offset-4"
            : ""
        }`}
        onClick={() => navigate("/login")}
      >
        LOGIN
      </span>{" "}
      |{" "}
      <span
        className={`text-gray-400 dark:text-blue-200 cursor-pointer ${
          resetPasswordOrRegister === "register"
            ? "underline underline-offset-4"
            : ""
        }`}
        onClick={() => navigate("/register")}
      >
        REGISTRA-SE
      </span>
    </div>
  );
}
