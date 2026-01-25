type TruncateTextProps = {
  text?: string;
  lines?: number;
  className?: string;
};

const TruncateText: React.FC<TruncateTextProps> = ({
  text = "",
  lines = 2,
  className = "",
}) => {
  return (
    <p
      className={className}
      style={{
        display: "-webkit-box",
        WebkitLineClamp: lines,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}
      title={text}
    >
      {text}
    </p>
  );
};

export default TruncateText;
