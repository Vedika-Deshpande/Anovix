function SpecularButton({ children, onClick, className = "", size = "md" }) {
  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-7 py-2.5 text-sm",
    lg: "px-9 py-3 text-base",
  }

  return (
    <button
      onClick={onClick}
      className={`specular-btn relative overflow-hidden rounded-full font-medium text-ink border border-border ${sizes[size]} ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span className="specular-shine" />
    </button>
  )
}

export default SpecularButton