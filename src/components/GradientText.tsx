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
    <div
      className={`${className} flex flex-row justify-center items-center gap-2`}
    >
      <span
        className="text-gray-800 dark:text-blue-200"
        data-aos="fade-right"
        data-aos-duration="600"
      >
        {text}
      </span>{" "}
      <span
        className={`bg-gradient-to-r ${gradientColors} bg-clip-text text-transparent`}
        data-aos="zoom-out"
        data-aos-duration="1000"
      >
        {gradientText}
      </span>
    </div>
  );
}
