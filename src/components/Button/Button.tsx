interface Props {
  disabled?: boolean;
  onClick?: () => void;
  icon: string;
  ariaLabel: string;
  alt: string;
  className?: string;
}

export const Button = (
  {
    disabled = false,
    onClick,
    icon,
    ariaLabel,
    alt,
    className,
  }: Props
) => {
  return (
    <button disabled={disabled} className={className} onClick={onClick} aria-label={ariaLabel}>
      <img src={icon} alt={alt} aria-label={ariaLabel}/>
    </button>
  );
};
