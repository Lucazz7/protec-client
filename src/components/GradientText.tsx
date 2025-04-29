interface GradientTextProps {
  text: string;
  gradientText?: string;
  className?: string;
  gradientColors?: string;
}

export default function GradientText({
  text,
  gradientText,
  className = "",
  gradientColors = "from-purple-500 to-indigo-600",
}: GradientTextProps) {
  return (
    <div className={`${className}`}>
      <span className="text-gray-800">{text}</span>{" "}
      <span
        className={`bg-gradient-to-r ${gradientColors} bg-clip-text text-transparent`}
      >
        {gradientText}
      </span>
    </div>
  );
}
